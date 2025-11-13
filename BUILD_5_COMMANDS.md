# ⚡ 5-MINUTE BUILD SUMMARY

**Copy & paste these 5 commands to build your .exe**

---

## The 5 Commands

**Open PowerShell and paste one at a time:**

### Command 1: Install pnpm (first time only)
```powershell
npm install -g pnpm
```

### Command 2: Navigate to project
```powershell
cd "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
```

### Command 3: Install dependencies (3-5 min)
```powershell
pnpm install
```

### Command 4: Build .exe (10-15 min)
```powershell
pnpm tauri build
```

### Command 5: Copy to Downloads
```powershell
Copy-Item -Path "src-tauri/target/release/bundle/nsis/*.exe" -Destination "$env:USERPROFILE\Downloads\" -Force
```

---

## ✅ Done!

Your .exe is now in: **C:\Users\josep\Downloads\**

Look for: **ChatGPT_2.0.0_x64.exe** (~100-120 MB)

---

## 🎉 Next Steps

1. Double-click the .exe
2. Run installer
3. Launch app
4. Test features!

---

**Total time: 20-30 minutes** ⏱️

That's it! Your ChatGPT Desktop v2.0.0 is ready! 🚀
