# Web Automation Platform

A professional browser automation testing platform built with Playwright and React, optimized for cloud deployment.

## 🚀 Quick Deploy to Leapcell

1. Sign up at [Leapcell.io](https://leapcell.io)
2. Click "New Project"
3. Connect this GitHub repository
4. Select Node.js runtime
5. Deploy!

## 📦 Tech Stack

- **Backend**: Node.js + Express + Playwright
- **Frontend**: React + Vite + TailwindCSS
- **Automation**: playwright-extra with stealth plugins

## ✨ Features

- 🎭 Advanced browser automation with anti-detection
- 📊 Real-time progress tracking via SSE
- 🌍 Multi-region testing capabilities
- ⚡ Optimized batch processing
- 🔍 Search engine traffic simulation

## 🛠️ Local Development

```bash
# Install dependencies
npm run install:all

# Run in development mode
npm run dev

# Build for production
npm run build:frontend

# Start production server
npm start
```

## 🌐 Deployment

### Leapcell.io (Recommended)

1. Create account at [leapcell.io](https://leapcell.io)
2. Connect GitHub repository
3. Configure:
   - Runtime: Node.js 18+
   - Build command: `npm install && cd frontend && npm install && npm run build`
   - Start command: `node backend/server.js`
   - Port: 7860
4. Deploy!

### Docker Deployment

```bash
docker build -t web-automation .
docker run -p 7860:7860 web-automation
```

## 📝 Environment Variables

- `NODE_ENV`: production/development
- `PORT`: Server port (default: 7860)
- `MAX_VISITS`: Maximum visits per request (default: 1000)

## 📊 API Endpoints

- `POST /api/automate` - Start automation (SSE streaming)
- `GET /api/health` - Health check

## 🎯 Usage Modes

1. **Standard Mode**: Balanced speed and stealth
2. **Fast Mode**: High-speed testing
3. **Search Mode**: Search engine-based traffic

## ⚙️ Configuration

Edit `backend/services/playwright.js` to customize:
- Batch sizes
- Delays between visits
- User agent rotation
- Geographic distribution

## 📄 License

MIT

## 🔧 Troubleshooting

### Memory Issues
- Reduce batch size in playwright.js
- Increase memory allocation on your hosting platform

### Network Errors
- Check target website accessibility
- Verify proxy settings if using proxies
- Review firewall rules

### Performance
- Monitor server resources
- Adjust concurrent batch size
- Optimize timeout settings

## 🤝 Support

For issues or questions, please open an issue on GitHub.
