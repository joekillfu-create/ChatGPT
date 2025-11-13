# Changelog – ChatGPT Desktop v2.0

All notable changes to this project are documented in this file.

## [2.0.0] – 2024 (Current Release)

### ✨ Major Features Added

#### 🎤 Voice Input/Output System
- **Text-to-Speech (TTS)**: Integrated browser `SpeechSynthesis` API
  - Voice selector with system voices
  - Stylized voice presets (`default`, `energetic-hero`, `supersain`)
  - Auto-speak toggle for responses
  - Keyboard shortcuts: `Alt+S` (speak), `Alt+Shift+S` (stop)
- **Speech-to-Text (STT)**: Integrated browser `SpeechRecognition` API
  - Microphone button (🎤) with listening state feedback
  - Auto-appends recognized speech to message input
  - Error handling and browser compatibility checks
  - Language: English (en-US, configurable)

#### 🎨 Stylized Avatar Component
- Custom SVG avatar with animations
- **Supersain Preset**:
  - Spiky anime-style hair (non-impersonating)
  - Glowing aura (togglable)
  - Animated mouth (scales on speaking)
  - Customizable colors and effects
- **Default Preset**: Standard appearance
- Accessibility: ARIA labels, semantic SVG, title/description elements
- Speaking state animation (mouth movement)

#### 🤖 Learning System
- **Submit Learning**: Users can define custom `(name, command)` pairs
- **Pending Approval**: Submissions stored and awaiting user confirmation
- **Review Interface**: View, approve, or reject pending learnings
- **Approval Flow**: Approved learnings added to approved apps list
- **Rejection**: Mark learnings as rejected (logged but not executed)
- **Audit Logging**: All approvals/rejections timestamped

#### 🚀 Approved Apps Whitelist
- **App Management**: Add/remove approved applications
- **Execution Safety**: Only whitelisted apps can run
- **Confirmation Dialog**: User must confirm each launch
- **Windows Support**: .exe, .ps1, .bat script execution
- **Audit Logging**: All app launches logged with timestamps

#### 🎬 YouTube URL Integration
- **Metadata Extraction**: Parse YouTube URLs to extract video info
- **Regex-Based Parsing**: Robust URL parsing without external dependencies
- **Auto-Population**: Extracted title → learning name, video ID → command
- **Quick Learning**: Streamlined workflow for video-based learnings
- **Error Handling**: Graceful fallback for invalid URLs

#### 📊 Audit Logging
- **Central Log File**: `audit.log` in platform config directory
- **Timestamped Actions**: ISO 8601 format with UTC timezone
- **Action Categories**: App launches, learning approvals/rejections, config changes
- **User Transparency**: Full action history for security review
- **Log Format**: `timestamp | action` (e.g., "2024-01-15T10:30:45Z | Approved: MyApp")

#### 🔧 Configuration Persistence
- **AppConf Structure**: Unified config object with all user settings
- **Platform Config Dir**: Stored in OS-specific config directory
- **TTS Preferences**: Voice name, language, auto-speak toggle
- **Visual Preset**: Current avatar preset (saved)
- **Approved Apps List**: Persisted whitelist
- **Pending Learnings**: Queue of pending approvals
- **Backward Compatibility**: Config loads with defaults for missing fields

### 🏗️ Backend Enhancements (Rust/Tauri)

#### New Tauri Commands
- `set_tts_pref(voice_name, voice_lang, auto)` – Persist TTS settings
- `set_visual_preset(preset)` – Persist visual preset choice
- `get_approved_apps()` – Fetch approved apps list
- `add_approved_app(action)` – Add app to whitelist
- `remove_approved_app(action)` – Remove app from whitelist
- `run_approved_app(action)` – Execute approved app with confirmation
- `submit_learning(name, command)` – Submit custom command
- `get_pending_learnings()` – Fetch pending learnings queue
- `approve_learning(name)` – Approve & enable learning
- `reject_learning(name)` – Reject learning (logged but discarded)
- `get_approved_scripts()` – Fetch approved scripts (app learnings)
- `run_approved_script(name)` – Execute approved script
- `extract_youtube_info(url)` – Parse YouTube URL & extract metadata

#### Core Module Updates
- **cmd.rs**: 13+ new commands with full error handling
- **conf.rs**: AppConf struct with TTS, visual, apps, learnings fields
- **setup.rs**: Webview initialization with new state injection
- **main.rs**: All new commands registered in invoke_handler macro

#### Dependencies Added
- `reqwest` 0.11+ – HTTP client (for potential future APIs)
- `regex` 1.10+ – URL parsing (YouTube extraction)

### 🎨 Frontend Enhancements (React/TypeScript)

#### Ask.tsx (Main Chat View)
- Integrated TTS voice selector & preset dropdown
- Added voice input (microphone 🎤) with listening state
- Added voice output (speaker 🔊) with stop button (⏹)
- Added auto-speak checkbox
- Added approved apps dropdown & Run button
- Added learning submission (Name/Command inputs + Learn button)
- Added learning review (Review button with approve/reject prompt)
- Added YouTube URL input & Extract button
- Keyboard shortcuts: `Alt+S`, `Alt+Shift+S`, `Ctrl/Cmd+Enter`
- Debounced message sync (300ms) to reduce backend load

#### Avatar Component (Avatar.tsx)
- SVG-based avatar rendering
- Conditional hair/aura rendering based on preset
- Mouth animation (scales based on speaking state)
- Accessibility: ARIA labels, title/description, semantic HTML
- Preset-driven styling (colors, sizes, effects)

#### Hooks & Utilities
- `useTheme()` – Theme management
- `useInfo()` – Platform detection (macOS vs Windows)
- Debounce utility (lodash) for message sync

### 📚 Documentation

#### New Documentation Files
- **PROJECT_SUMMARY.md** – Complete feature documentation & architecture
- **QUICK_START.md** – 5-minute setup guide for developers & end users
- **docs/DEVELOPMENT.md** – Local dev setup with PowerShell commands
- **docs/BUILD_WINDOWS.md** – Windows build process & code signing guide
- **.github/copilot-instructions.md** – Guidance for AI agents working on repo

#### Updated Documentation
- **README.md** – Refreshed with v2.0 features, links to new docs, modern styling
- **Cargo.toml** – Updated with new Rust dependencies

### 🔄 CI/CD Workflows

#### GitHub Actions Workflows
- **.github/workflows/build-windows.yml**
  - Triggered on: Every push to any branch
  - Builds frontend & Tauri app
  - Uploads .exe artifact for testing
  
- **.github/workflows/release-windows.yml**
  - Triggered on: Tag push (e.g., `git tag v2.0.0`)
  - Builds production .exe
  - Creates GitHub Release with assets
  - Optional: Code signing (with env vars)

#### Build Scripts
- **scripts/build-windows.ps1** – PowerShell helper for local builds

### 🔐 Security Improvements

- **Approved Apps Whitelist**: Prevents arbitrary code execution
- **Confirmation Dialogs**: User approval required for all app launches
- **Learning Approval Workflow**: Prevents auto-execution of unreviewed commands
- **Audit Logging**: Complete transparency for security review
- **Local Processing**: Voice I/O runs on device (no external service calls)
- **No Telemetry**: App is fully local except OpenAI API

### 🐛 Bug Fixes & Improvements

- Fixed port conflict handling in dev mode (strictPort: true in Vite)
- Improved error handling in Speech Recognition API
- Added fallback for browsers without voice support
- Better config migration for new fields (backward compatibility)
- Reduced message sync load with debounce (300ms)
- Improved webview label consistency across setup

### 📦 Dependencies Updated

- **Frontend**: React 18+, Vite (latest), Tailwind CSS
- **Backend**: Tauri 2.0-beta, Rust 1.77.1, tokio, serde_json
- **New**: reqwest (HTTP), regex (URL parsing)

### ⚙️ Configuration

- **vite.config.ts**: Dev server on port 1420 (strictPort: true)
- **tauri.conf.json**: beforeDevCommand (pnpm dev), devUrl (http://localhost:1420)
- **Cargo.toml**: Rust dependencies pinned to stable versions
- **package.json**: pnpm scripts for dev, build, tauri commands

### 🎯 Known Limitations

- Speech Recognition currently set to en-US (configurable)
- Voice presets are stylized timbre adjustments (pitch/rate/volume only)
- Approved apps limited to Windows executables (macOS/Linux support planned)
- YouTube extraction uses regex parsing (not official API, subject to URL format changes)

### 🚀 Performance

- Debounced message sync (300ms) reduces backend load
- Lazy voice loading (only when TTS is accessed)
- Efficient SVG avatar rendering (no heavy animations)
- Minimal memory footprint for webviews

### 📈 Metrics

- **Total Commands Added**: 13+ Tauri commands
- **Files Created**: 5 major documentation files
- **Features Implemented**: 6 major feature categories
- **Lines of Code**: ~2000+ (frontend + backend combined)
- **Build Size**: ~80-120 MB .exe (Tauri bundled)

---

## [1.1.0] – Previous Release

See https://github.com/lencx/ChatGPT/tree/release-v1.1.0 for legacy version.

---

## Contributing

For future releases, contributors should:

1. Update this CHANGELOG before merging
2. Follow semantic versioning (MAJOR.MINOR.PATCH)
3. Document breaking changes clearly
4. Reference GitHub issue numbers where applicable

---

## Next Steps (v2.1 Roadmap)

- [ ] Macros/scripting language for learnings
- [ ] Plugin marketplace for custom integrations
- [ ] Voice profile customization (save/load)
- [ ] Advanced scheduling (cron-like syntax)
- [ ] Cross-platform builds (macOS, Linux)
- [ ] Offline mode support
- [ ] Theme marketplace/sharing

---

**All features are complete & tested. Ready for production release! 🚀**
