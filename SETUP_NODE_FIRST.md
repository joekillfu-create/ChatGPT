# ⚠️ NODE.JS NOT FOUND - SETUP REQUIRED

## What's Missing?

Your system doesn't have Node.js installed, which is required to build the app.

**Detected on system:**
- ❌ Node.js - **NOT FOUND**
- ❌ npm - **NOT FOUND**
- ❌ pnpm - **NOT FOUND**

---

## 🔧 QUICK FIX (3 minutes)

### Step 1: Download Node.js
👉 Go to https://nodejs.org/

**Choose the green button: "LTS" (Long Term Support)**
- Current LTS: v20.x or v22.x (either works)

### Step 2: Run Installer
1. Double-click the downloaded file
2. Click "Next" → "Next" → "Install"
3. When asked "Add to PATH?" → **YES, KEEP IT CHECKED**
4. Finish

### Step 3: Restart PowerShell
- Close your current PowerShell window
- Open a new one
- Verify it worked:

```powershell
node --version
npm --version
```

Expected output:
```
v20.x.x (or v22.x.x)
8.x.x or 9.x.x or 10.x.x
```

---

## ✅ Then Build Your .exe

Once Node.js is installed, run these 5 commands:

```powershell
npm install -g pnpm
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
pnpm install
pnpm tauri build
Copy-Item -Path "src-tauri/target/release/bundle/nsis/*.exe" -Destination "$env:USERPROFILE\Downloads\" -Force
```

---

## 🎯 Next Steps

1. **Download & install Node.js** from https://nodejs.org/ (LTS version)
2. **Restart PowerShell**
3. **Come back here and run the 5 commands above**
4. **Wait 20-30 minutes**
5. **Your .exe appears in Downloads!**

---

## ❓ Need Help?

### Node.js download link
👉 https://nodejs.org/ (click green LTS button)

### If installer says "Add to PATH"
✅ **YES - Keep it checked!** (without this, npm won't work)

### After install, verify:
```powershell
node --version
npm --version
```

If you see version numbers, you're good to go!

---

**Let me know once Node.js is installed and I'll finish the build!** 🚀
