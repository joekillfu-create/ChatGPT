# 🚀 LOCAL BUILD SCRIPT FOR WINDOWS

This script will build your ChatGPT Desktop app and save the .exe to your Downloads folder.

## Prerequisites

Before running, ensure you have:
- ✅ Node.js installed
- ✅ Rust installed (from https://rustup.rs/)
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Visual Studio Build Tools or MSVC (for Windows)

## Build Commands (Run in PowerShell)

```powershell
# Step 1: Navigate to project
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"

# Step 2: Install dependencies (first time only)
pnpm install

# Step 3: Build the application
pnpm tauri build

# Step 4: Copy to Downloads
Copy-Item -Path "src-tauri/target/release/bundle/nsis/*.exe" -Destination "$env:USERPROFILE/Downloads/" -Force

# Step 5: Done! Check your Downloads folder
Explorer.exe "$env:USERPROFILE/Downloads"
```

## What Happens

1. **pnpm install** – Downloads all dependencies (~5 minutes)
2. **pnpm tauri build** – Compiles frontend + backend (~10-15 minutes)
3. **Output**: `ChatGPT_2.0.0_x64.exe` (~100-120 MB)
4. **Copy**: Saved to `C:\Users\josep\Downloads\`

## Total Build Time

- **First build**: 20-25 minutes (installing deps + compiling)
- **Subsequent builds**: 10-15 minutes (just recompiling)

## If You Get Errors

### Error: "pnpm not found"
```powershell
npm install -g pnpm
```

### Error: "Rust not found"
Download from https://rustup.rs/ and install

### Error: "Missing MSVC build tools"
Install Visual Studio Build Tools from https://visualstudio.microsoft.com/downloads/
(Search for "Build Tools for Visual Studio 2022")

### Error: "Port 1420 already in use"
```powershell
# Find process using port 1420
netstat -ano | findstr :1420

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

## After Build

Your .exe will be in: `C:\Users\josep\Downloads\`

- Filename: `ChatGPT_2.0.0_x64.exe`
- Size: ~100-120 MB
- Ready to: Double-click to install

## Quick Build Script (All-in-One)

Save this as `build-and-download.ps1`:

```powershell
# Navigate to project
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"

# Build
Write-Host "🔨 Building ChatGPT Desktop v2.0.0..."
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Install failed"; exit 1 }

pnpm tauri build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed"; exit 1 }

# Copy to Downloads
Write-Host "📥 Copying to Downloads folder..."
$exePath = Get-Item "src-tauri/target/release/bundle/nsis/*.exe" | Select-Object -First 1
$downloadPath = "$env:USERPROFILE/Downloads/$($exePath.Name)"
Copy-Item $exePath.FullName -Destination $downloadPath -Force

Write-Host "✅ Build complete!"
Write-Host "📍 Saved to: $downloadPath"
Write-Host "🎉 Ready to install!"

# Open Downloads folder
Explorer.exe "$env:USERPROFILE/Downloads"
```

Run it:
```powershell
.\build-and-download.ps1
```

---

## Manual Build (If Automated Fails)

```powershell
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"

# Step 1: Clean previous build
rm -r "src-tauri/target" -Force

# Step 2: Install fresh dependencies
pnpm install --force

# Step 3: Build TypeScript/React
pnpm build

# Step 4: Build with Tauri
pnpm tauri build --debug

# Step 5: Check output
Get-Item "src-tauri/target/release/bundle/nsis/*.exe"
```

---

## What You'll See During Build

```
✅ Installing pnpm packages...
✅ Building React frontend...
✅ Compiling Rust backend...
✅ Bundling application...
✅ Creating Windows installer...
✅ Done!

📍 Find your .exe in: C:\Users\josep\Downloads\
```

---

## After You Have the .exe

1. **Install**: Double-click `ChatGPT_2.0.0_x64.exe`
2. **Launch**: App appears in Start Menu as "ChatGPT"
3. **Test**: 
   - Click 🎤 microphone
   - Click 🔊 speaker
   - Try learning system
   - Check approved apps

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build takes too long | Normal for first build (lots of dependencies) |
| Out of disk space | Need ~5GB free for build cache |
| Antivirus blocking | Temporarily disable or whitelist pnpm/cargo |
| Network timeout | Internet connection interrupted, retry build |
| Permission denied | Run PowerShell as Administrator |

---

## Need Help?

Check these files:
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) – Dev setup details
- [docs/BUILD_WINDOWS.md](./docs/BUILD_WINDOWS.md) – Advanced build options
- [QUICK_START.md](./QUICK_START.md) – Quick reference

---

**Ready to build? Start with the commands above!** 🚀
