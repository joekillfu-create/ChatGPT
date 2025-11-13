# 🔧 INSTALL NODE.JS - STEP BY STEP

## Node.js Is Not Installed Yet

We searched your system and couldn't find Node.js. The download/install might have not completed.

---

## ✅ INSTALL IT NOW (5 minutes)

### Step 1: Go to Website
👉 Open this link in your browser:
```
https://nodejs.org/
```

### Step 2: Click the Green Button
You'll see:
- **Green button:** "LTS" (18.x or 20.x) ← **CLICK THIS**
- Gray button: "Current" ← Don't click this

### Step 3: Run the Downloaded File
1. Look in your **Downloads** folder
2. Find: `node-v20.x.x-x64.msi` (or similar)
3. Double-click it
4. A wizard appears

### Step 4: Follow the Wizard
1. Click **"Next"** → **"Next"** → **"Next"**
2. When you see **"Tools for Native Modules"** → Click **"Next"**
3. You'll see a screen with checkboxes - keep everything checked
4. **IMPORTANT:** Look for "Add to PATH" option
   - ✅ This should be **CHECKED**
   - If it's not checked, **CHECK IT**
5. Click **"Install"**
6. Wait for completion (1-2 minutes)
7. Click **"Finish"**

### Step 5: Verify Installation

Close the VS Code editor **completely** and reopen it.

Then in the VS Code terminal, run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
9.x.x
```

---

## ⚠️ If Still Not Working

Try this:
1. **Don't use VS Code terminal** - use standalone PowerShell
2. Press **Windows Key** on your keyboard
3. Type: `powershell`
4. Press **Enter**
5. A new window opens
6. Type: `node --version`

If that works, the issue is just VS Code's terminal needs refresh.

---

## 🚀 Once Node.js Works

Tell me and I'll run:
```powershell
npm install -g pnpm
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
pnpm install
pnpm tauri build
Copy-Item -Path "src-tauri/target/release/bundle/nsis/*.exe" -Destination "$env:USERPROFILE\Downloads\" -Force
```

And your .exe will be ready in 20-30 minutes! ⏱️

---

## 📝 Summary

1. Go to https://nodejs.org/
2. Click green "LTS" button
3. Download & run installer
4. **Make sure "Add to PATH" is checked** ✅
5. Finish install
6. Close & reopen VS Code
7. Test: `node --version`
8. Come back here!

**You got this!** 💪
