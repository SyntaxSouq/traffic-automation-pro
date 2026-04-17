/**
 * ROUTE: [automation.js](file:///c:/Users/whoami/Desktop/playwrgiht%20-%20Copy%20(2)/backend/routes/automation.js)
 * RESPONSIBILITY: Handles automation API requests, validates inputs, and monitors concurrent execution.
 * 
 * ENDPOINTS:
 * 1. POST /api/automate: Main automation entry point.
 * 2. GET /api/health: Service status check.
 */

const express = require('express');
const router = express.Router();
const { automateWebsite } = require('../services/playwright');

/**
 * URL validation helper: Ensures proper format for target websites.
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

router.post('/automate', async (req, res) => {
  const { url, options = {} } = req.body;
  const safeOptions = options && typeof options === 'object' ? options : {};
  const maxVisitsFromEnv = process.env.MAX_VISITS === undefined ? 1000 : Number(process.env.MAX_VISITS);
  const MAX_VISITS = Number.isInteger(maxVisitsFromEnv) && maxVisitsFromEnv >= 1 ? maxVisitsFromEnv : 1000;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  // Auto-prepend https if missing
  let processedUrl = url.trim();
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = 'https://' + processedUrl;
  }
  
  if (!isValidUrl(processedUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid URL format' });
  }
  
  // Block localhost and private IPs for security
  const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  if (blocked.some(b => processedUrl.includes(b))) {
    return res.status(400).json({ success: false, error: 'Cannot access local addresses' });
  }

  const visitCountRaw = safeOptions.visitCount;
  const visitCount = visitCountRaw === undefined ? 1 : Number(visitCountRaw);
  if (!Number.isInteger(visitCount) || visitCount < 1 || visitCount > MAX_VISITS) {
    return res.status(400).json({
      success: false,
      error: `visitCount must be an integer between 1 and ${MAX_VISITS}`
    });
  }

  // Validate loop count
  const loopCountRaw = safeOptions.loopCount;
  const loopCount = loopCountRaw === undefined ? 1 : Number(loopCountRaw);
  if (!Number.isInteger(loopCount) || loopCount < 1 || loopCount > 100) {
    return res.status(400).json({
      success: false,
      error: `loopCount must be an integer between 1 and 100`
    });
  }

  // Validate traffic mode
  const trafficMode = safeOptions.trafficMode || 'stealth';
  const validModes = ['stealth', 'storm', 'search'];
  if (!validModes.includes(trafficMode)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid traffic mode. Must be: stealth, storm, or search'
    });
  }

  // Validate batch size based on mode
  const maxBatchRaw = safeOptions.maxBatchVisits;
  const maxBatchLimit = trafficMode === 'storm' ? 100 : 20;
  const maxBatchVisits = maxBatchRaw === undefined ? (trafficMode === 'storm' ? 20 : 5) : Number(maxBatchRaw);
  if (!Number.isInteger(maxBatchVisits) || maxBatchVisits < 1 || maxBatchVisits > maxBatchLimit) {
    return res.status(400).json({
      success: false,
      error: `maxBatchVisits must be an integer between 1 and ${maxBatchLimit} for ${trafficMode} mode`
    });
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Automating: ${processedUrl}`);
  console.log(`📦 Options:`, { ...safeOptions, visitCount, loopCount, maxBatchVisits, trafficMode, maxVisits: MAX_VISITS });
  console.log(`${'='.repeat(50)}`);
  
  // Set up SSE headers for streaming progress
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  
  const startTime = Date.now();
  
  // Progress callback function with immediate flush
  const onProgress = (progressData) => {
    const data = `data: ${JSON.stringify({ type: 'progress', ...progressData })}\n\n`;
    res.write(data);
    // Force flush if possible
    if (res.flush) {
      res.flush();
    }
  };
  
  const result = await automateWebsite(processedUrl, { ...safeOptions, visitCount, loopCount, maxBatchVisits, trafficMode, maxVisits: MAX_VISITS }, onProgress);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`${'='.repeat(50)}`);
  console.log(result.success ? `✅ Success (${duration}s)` : `❌ Failed (${duration}s)`);
  console.log(`${'='.repeat(50)}\n`);
  
  // Send final result
  res.write(`data: ${JSON.stringify({ type: 'result', data: { ...result, duration } })}\n\n`);
  res.end();
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
