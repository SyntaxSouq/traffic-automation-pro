# 🐳 DOCKER DEPLOYMENT FOR LEAPCELL (RECOMMENDED)

## Why Docker?
- ✅ Playwright browsers pre-installed in the image
- ✅ All system dependencies included
- ✅ Guaranteed to work the same everywhere
- ✅ No build command issues

---

## 🚀 STEP-BY-STEP DOCKER DEPLOYMENT:

### Option 1: Use Docker Hub Image (EASIEST)

#### Step 1: Build and Push Docker Image

Run these commands on your local machine:

```bash
# Login to Docker Hub (create account at hub.docker.com if needed)
docker login

# Build the image
docker build -t yourusername/web-automation:latest .

# Push to Docker Hub
docker push yourusername/web-automation:latest
```

#### Step 2: Deploy on Leapcell

1. Go to Leapcell dashboard
2. Create new project
3. Select **"Deploy from Docker Image"**
4. Enter: `yourusername/web-automation:latest`
5. Set port: `7860`
6. Deploy!

---

### Option 2: Let Leapcell Build from Dockerfile

#### Step 1: Update Leapcell Settings

1. Go to your project on Leapcell
2. Go to **Settings**
3. Change **Runtime** from "Node.js" to **"Docker"**
4. Leapcell will automatically use your `Dockerfile`
5. Click **Redeploy**

#### Step 2: Wait for Build

The Docker build will:
- ✅ Use Playwright's official image (browsers included)
- ✅ Install all dependencies
- ✅ Build frontend
- ✅ Start server

This takes 5-10 minutes.

---

## 📋 DOCKERFILE ALREADY CONFIGURED:

Your `Dockerfile` includes:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.59.1-jammy-amd64

# Install dependencies
RUN npm install

# Install Playwright browsers (THIS IS THE KEY!)
RUN npx playwright install --with-deps chromium

# Build frontend
RUN cd frontend && npm install && npm run build

# Start server
CMD ["node", "backend/server.js"]
```

---

## 🔧 IF DOCKER OPTION NOT AVAILABLE:

If Leapcell doesn't support Docker deployment, use this **GUARANTEED BUILD COMMAND**:

```bash
npm install && npx playwright install --with-deps chromium && cd frontend && npm install && npm run build && cd ..
```

**AND add this environment variable:**
```
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
```

---

## 🎯 VERIFICATION:

After deployment, check logs for:

**✅ DOCKER (Good):**
```
✓ Using Playwright image
✓ Chromium installed
✓ Server running on port 7860
```

**✅ BUILD COMMAND (Good):**
```
✓ Downloading Chromium
✓ Installing Chromium  
✓ Installing dependencies
✓ Server running on port 7860
```

---

## 🐛 TROUBLESHOOTING:

### If still getting "Executable doesn't exist":

**Check these:**

1. **Build logs** - Did Playwright install succeed?
   ```
   Look for: "Downloading Chromium" or "Installing Chromium"
   ```

2. **Environment variable** - Is it set?
   ```
   PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright
   ```

3. **Try this in your code** - Add to `backend/server.js` at the top:
   ```javascript
   console.log('Playwright browsers path:', process.env.PLAYWRIGHT_BROWSERS_PATH);
   console.log('Node env:', process.env.NODE_ENV);
   ```

---

## 💡 RECOMMENDED APPROACH:

**Use Docker deployment** - it's the most reliable because:
1. Official Playwright image has everything pre-installed
2. No build command issues
3. Works exactly the same everywhere
4. Faster deployments (cached layers)

---

## 📞 SEND ME:

If still not working, send me:
1. **Screenshot of your Leapcell project settings** (showing runtime type)
2. **Full build logs** (from the build tab)
3. **Runtime logs** (from the logs tab, when you click automate)

This will help me see exactly what's happening!
