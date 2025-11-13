# Quick Start Guide

## For End Users (Download & Run)

1. **Download** the latest `.exe` from [GitHub Releases](https://github.com/yourusername/ChatGPT/releases)
2. **Run** the installer and follow prompts
3. **Launch** ChatGPT desktop app
4. **Start chatting** with your AI assistant!

---

## For Developers (Build from Source)

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/ChatGPT.git
cd ChatGPT
pnpm install
```

### 2. Development Build
```bash
# Start hot-reload dev environment
pnpm tauri

# Or: Frontend-only dev (port 1420, no Rust IPC)
pnpm dev
```

### 3. Production Build
```bash
# Full build with Rust backend
pnpm tauri build

# Output: ChatGPT_*.exe in src-tauri/target/release/bundle/nsis/
```

### 4. Troubleshooting
- **Missing pnpm**: Install with `npm install -g pnpm`
- **Missing Rust**: Install from https://rustup.rs
- **Port 1420 in use**: Kill process or change port in `vite.config.ts` + `tauri.conf.json`

---

## Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **Chat** | Type or click Send (`Ctrl/Cmd+Enter`) |
| **Voice Input** | Click 🎤 microphone button |
| **Voice Output** | Click 🔊 speaker button or check "Auto" |
| **Avatar** | Watch it animate while speaking; toggle "Aura" |
| **Approved Apps** | Select app & click Run (confirm when prompted) |
| **Learn** | Submit name + command, approve in Review |
| **YouTube** | Paste URL, click Extract to auto-fill learning |

---

## Essential Files

| File | Purpose |
|------|---------|
| `src/view/Ask.tsx` | Main chat UI |
| `src/components/Avatar.tsx` | Animated avatar |
| `src-tauri/src/core/cmd.rs` | Backend commands |
| `src-tauri/src/core/conf.rs` | Config & persistence |
| `.github/workflows/` | Build & release automation |

---

## Common Tasks

### Change Voice Preset
In `Ask.tsx`, modify the `speak()` function:
```typescript
if (ttsPreset === 'energetic-hero') {
  utt.pitch = 1.5;  // Change pitch
  utt.rate = 1.15;  // Change speed
}
```

### Add Keyboard Shortcut
In `Ask.tsx`, add a new `useHotkeys()` call:
```typescript
useHotkeys('alt+m', () => handleVoiceInput(), { enableOnFormTags: true }, []);
```

### Customize Avatar
Edit `src/components/Avatar.tsx` SVG paths and colors.

### Enable Code Signing
Set environment variables and rebuild:
```powershell
$env:SIGNING_IDENTITY = "your-cert-thumbprint"
$env:SIGNING_PASSWORD = "your-password"
pnpm tauri build --sign
```

---

## Next Steps

- 📖 See `PROJECT_SUMMARY.md` for full feature documentation
- 🏗️ See `docs/DEVELOPMENT.md` for detailed dev setup
- 🔨 See `docs/BUILD_WINDOWS.md` for advanced build options
- 📋 See `.github/copilot-instructions.md` for AI agent guidance

---

**Ready to go? Run `pnpm tauri` and start developing! 🚀**
