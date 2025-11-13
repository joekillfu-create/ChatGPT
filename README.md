<p align="center">
  <img width="180" src="./public/ChatGPT.png" alt="ChatGPT">
  <p align="center">⚡ <strong>ChatGPT Desktop App v2.0</strong> – Enhanced with Voice, Avatar & Smart Automation</p>
</p>

---

## 🎯 What's New in v2.0

### ✨ Voice I/O
- **Text-to-Speech (TTS)**: Speak responses with stylized voice presets
- **Speech-to-Text (STT)**: Voice input – just click the microphone button 🎤
- **Voice Selector**: Choose from system voices
- **Auto-Speak**: Toggle to automatically speak all responses
- **Keyboard Shortcuts**: `Alt+S` to speak, `Alt+Shift+S` to stop

### 🎨 Stylized Avatar
- **Animated SVG Avatar**: Watch a stylized character respond in real-time
- **Spiky Hair & Aura**: Supersain preset with anime-style visuals (non-impersonating)
- **Speaking Animation**: Avatar's mouth animates when speaking
- **Aura Toggle**: Enable/disable glowing effect for enhanced visuals

### 🤖 Smart Learning System
- **Learn Custom Commands**: Teach the app new actions with name + command pairs
- **Approval Workflow**: Review and approve learnings before they run
- **YouTube Integration**: Extract video metadata from YouTube URLs
- **Audit Logging**: Full transparency – all actions timestamped and logged

### 🚀 Approved Apps Automation
- **Whitelist System**: Explicitly approve which apps can run
- **Safe Execution**: All launches confirmed and logged
- **Windows Support**: Run .exe, .ps1, .bat scripts with full control

---

## 📚 Quick Links

- 🚀 **[Quick Start](./QUICK_START.md)** – Get up and running in 5 minutes
- 📖 **[Project Summary](./PROJECT_SUMMARY.md)** – Full feature documentation
- 🏗️ **[Development Guide](./docs/DEVELOPMENT.md)** – Local setup & PowerShell commands
- 🔨 **[Build Guide](./docs/BUILD_WINDOWS.md)** – Build .exe, signing, deployment
- 🤖 **[AI Agent Guide](./.github/copilot-instructions.md)** – For AI contributors

---

## 🎮 Features at a Glance

| Feature | Description |
|---------|-------------|
| **💬 Chat** | Real-time OpenAI integration with context awareness |
| **🎤 Voice Input** | Transcribe speech to text with browser Speech Recognition API |
| **🔊 Voice Output** | Speak responses with custom voice presets (energetic, supersain) |
| **🎨 Avatar** | Stylized animated character with preset-driven visuals |
| **🤖 Learning** | Submit custom commands, approve, and execute |
| **🎬 YouTube** | Auto-extract video metadata for quick learnings |
| **✅ Approved Apps** | Whitelist & safely launch trusted applications |
| **📊 Audit Log** | Complete action history for transparency |

---

## 🏗️ Tech Stack

- **Frontend**: React 18+ / TypeScript / Vite / Tailwind CSS
- **Backend**: Tauri 2.0-beta / Rust (stable)
- **APIs**: Web Speech API (TTS/STT), @tauri-apps/api (IPC)
- **Persistence**: JSON config + SQLite (optional)

---

## 📦 Installation & Usage

### For End Users
Download the latest `.exe` from [Releases](https://github.com/yourusername/ChatGPT/releases) and run the installer.

### For Developers
```bash
# Clone & install
git clone https://github.com/yourusername/ChatGPT.git
cd ChatGPT
pnpm install

# Development with hot-reload
pnpm tauri

# Build production .exe
pnpm tauri build
```

See **[Quick Start](./QUICK_START.md)** for detailed instructions.

---

## 🔒 Privacy & Security

- ✅ **Approved Apps Only**: Strict whitelist prevents unauthorized execution
- ✅ **User Approval Required**: Confirmation before every action
- ✅ **Full Audit Trail**: Timestamped logs for complete transparency
- ✅ **Local Processing**: Voice I/O runs locally on your device
- ✅ **No Telemetry**: App is fully local (except OpenAI API)

---

## 🎯 Roadmap

- [ ] Cross-platform builds (macOS, Linux)
- [ ] Plugin system for extended learning
- [ ] Advanced script scheduling
- [ ] Voice profile customization
- [ ] Theme marketplace

---

## 🤝 Contributing

We welcome contributions! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See **[Development Guide](./docs/DEVELOPMENT.md)** for setup instructions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Tauri](https://tauri.app) – Desktop framework
- [React](https://react.dev) – UI library
- [OpenAI API](https://openai.com) – Chat backend
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) – Voice I/O

---

## 📞 Support & Feedback

- 🐛 **Found a bug?** Open an [Issue](https://github.com/yourusername/ChatGPT/issues)
- 💡 **Have an idea?** Start a [Discussion](https://github.com/yourusername/ChatGPT/discussions)
- ❓ **Need help?** Check the [Documentation](./PROJECT_SUMMARY.md)

---

**Made with 🎨 and 🤖 for enhanced ChatGPT interaction** ✨