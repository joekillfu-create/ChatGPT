# 🚀 BUILD YOUR .EXE - MANUAL STEPS

Since pnpm isn't in your system PATH, follow these steps manually:

---

## Prerequisites Check

Open PowerShell and verify you have:

```powershell
node --version
npm --version
```

If these commands don't work, download Node.js from https://nodejs.org/

---

## Step-by-Step Build Process

### 1️⃣ Install pnpm (if not already installed)

```powershell
npm install -g pnpm
```

### 2️⃣ Navigate to Project

```powershell
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
```

### 3️⃣ Install Dependencies

This step downloads all required packages (~1GB, takes 3-5 minutes):

```powershell
pnpm install
```

**What you'll see:**
```
 WARN  deprecated
 WARN  31 vulnerabilities found
  progress [====================>                    ] 75%
 ✓ Packages in lockfile are up to date
 64 packages installed
```

Wait until you see a checkmark ✓

### 4️⃣ Build the Application

This compiles React frontend + Rust backend (~10-15 minutes):

```powershell
pnpm tauri build
```

**What you'll see:**
```
$ tauri build
✓ Built frontend in 45.23s
✓ Bundled frontend files in ...
✓ Built Rust binary in 340.12s
✓ Bundled installer in ...

✨ Done in 6m 45.23s
```

Wait until you see ✓ Done

### 5️⃣ Locate Your .exe

It will be here:

```
c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT\src-tauri\target\release\bundle\nsis\ChatGPT_2.0.0_x64.exe
```

Size: ~100-120 MB

### 6️⃣ Copy to Downloads

**Option A: Using File Explorer**
1. Open: `c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT\src-tauri\target\release\bundle\nsis\`
2. Right-click `ChatGPT_2.0.0_x64.exe`
3. Copy
4. Open: `C:\Users\josep\Downloads\`
5. Right-click → Paste

**Option B: Using PowerShell**
```powershell
Copy-Item -Path "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT\src-tauri\target\release\bundle\nsis\ChatGPT_2.0.0_x64.exe" -Destination "$env:USERPROFILE\Downloads\" -Force
```

### 7️⃣ Verify It's In Downloads

```powershell
Get-Item "$env:USERPROFILE\Downloads\ChatGPT_2.0.0_x64.exe"
```

Should show: `ChatGPT_2.0.0_x64.exe` with size ~100-120 MB

---

## 🎉 You Have Your .exe!

Located at: `C:\Users\josep\Downloads\ChatGPT_2.0.0_x64.exe`

### Next Steps:

1. **Double-click** the .exe to run installer
2. **Follow** installer prompts
3. **Launch** app from Start Menu
4. **Test** all features:
   - 🎤 Click microphone to test voice input
   - 🔊 Click speaker to test voice output
   - 🎨 Try different avatar presets
   - 🤖 Test learning system
   - ✅ Test approved apps

---

## ⚠️ If You Get Errors During Build

### Error: "pnpm not found"
```powershell
npm install -g pnpm
```
Then retry `pnpm tauri build`

### Error: "Rust not found"
1. Download from https://rustup.rs/
2. Run installer
3. Restart PowerShell
4. Retry `pnpm tauri build`

### Error: "Port 1420 already in use"
```powershell
netstat -ano | findstr :1420
taskkill /PID <number> /F
```

### Error: "MSVC not found"
Install Visual Studio Build Tools:
- Go to https://visualstudio.microsoft.com/downloads/
- Search for "Build Tools for Visual Studio 2022"
- Install
- Restart computer
- Retry build

---

## 📊 Build Time Estimate

| Step | Time |
|------|------|
| pnpm install | 3-5 min |
| pnpm tauri build | 10-15 min |
| **Total** | **15-20 min** |

---

## 💡 Pro Tips

- **First build**: Takes longer (compiling Rust for first time)
- **Subsequent builds**: Faster (uses cache)
- **Network**: Need good internet for dependency downloads
- **Disk space**: Need ~5GB free for build cache
- **RAM**: 4GB+ recommended (8GB+ is better)

---

## 🎯 What You'll Have

After these steps, you'll have:

✅ ChatGPT_2.0.0_x64.exe (ready to install)  
✅ Full installation with all features  
✅ Ability to test voice, avatar, learning  
✅ Professional desktop application  

**Total time: ~20 minutes to completion!** ⏱️

---

## ❓ Need Help?

See these guides:
- **[LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md)** – Detailed build guide
- **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** – Development setup
- **[docs/BUILD_WINDOWS.md](./docs/BUILD_WINDOWS.md)** – Advanced build options

---

**You're ready! Start with Step 1 above.** 🚀
