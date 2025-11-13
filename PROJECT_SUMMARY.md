# ChatGPT Desktop App – Project Summary

A **Tauri-based desktop shell** for ChatGPT integration with advanced AI learning capabilities, voice I/O, stylized avatar animations, and approved app automation.

## ✨ Key Features

### 1. **Chat Interface with Voice I/O**
- **Text-to-Speech (TTS)**: Speak chat responses using browser `SpeechSynthesis` API
- **Voice Input (STT)**: Capture your speech and transcribe it to text using browser `SpeechRecognition` API
- **Voice Selector**: Choose from available system voices
- **Stylized Voice Presets**: 
  - `default` – Standard voice
  - `energetic-hero` – Higher pitch + faster rate (stylized timbre)
  - `supersain` – Brighter, punchier presence (stylized timbre)
- **Auto-Speak Toggle**: Automatically speak responses after sending
- **Keyboard Shortcuts**:
  - `Alt+S` — Speak current message
  - `Alt+Shift+S` — Stop speaking
  - `Ctrl/Cmd+Enter` — Send message

### 2. **Stylized Avatar**
- **Visual Representation**: Custom SVG avatar with animations
- **Preset-Driven**: Supports `default` and `supersain` presets
- **Supersain Preset Features**:
  - Spiky hair (anime-style, no character impersonation)
  - Glowing aura (checkbox toggle in UI)
  - Animated mouth (scales based on speaking state)
- **Accessibility**: ARIA labels, semantic SVG with title/description
- **Note**: All visual elements are non-impersonating, stylized interpretations

### 3. **Approved Apps Launcher**
- **Whitelist System**: Users define a list of approved applications to run
- **Safe Execution**: Runs only approved .exe, .ps1, .bat scripts (Windows)
- **Confirmation Dialog**: Prompts user before launching each app
- **Audit Logging**: All app launches are timestamped in `audit.log`

### 4. **Learning System**
- **Submit Custom Commands**: Users can submit `(name, command)` pairs for learning
- **Pending Approval**: Submissions are stored and require user approval
- **Approve/Reject Interface**: Review pending learnings and approve to add to approved apps list
- **Rejection**: Option to reject and discard learnings
- **Audit Trail**: All approvals/rejections logged with timestamps

### 5. **YouTube URL Integration**
- **Extract Video Metadata**: Paste YouTube URLs to auto-extract video title and ID
- **Auto-Populate Learning**: Extracted title → learning name, video ID → learning command
- **Regex-Based Parsing**: Robust URL parsing without external dependencies
- **Quick Learning Flow**: Reduces manual entry for video-based learnings

### 6. **Audit Logging**
- **Central Log File**: `audit.log` in platform config directory
- **Timestamp All Actions**: Approved app launches, learning approvals/rejections
- **Format**: `timestamp | action (e.g., "2024-01-15T10:30:45Z | Approved: MyApp")`
- **User Transparency**: Full action history for security review

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Main View**: `src/view/Ask.tsx` – Chat input with all UI controls
- **Avatar Component**: `src/components/Avatar.tsx` – SVG rendering with animations
- **Web APIs Used**:
  - `SpeechSynthesis` (TTS)
  - `SpeechRecognition` (STT)
  - `localStorage` (future config caching)

### Backend (Tauri + Rust)
- **Core Commands** (`src-tauri/src/core/cmd.rs`):
  - `ask_sync` / `ask_send` – Core chat functionality
  - `set_tts_pref` – Persist TTS preferences (voice, auto-speak)
  - `set_visual_preset` – Persist visual preset choice
  - `get_approved_apps` / `add_approved_app` / `run_approved_app` – App management
  - `submit_learning` / `get_pending_learnings` / `approve_learning` / `reject_learning` – Learning workflow
  - `extract_youtube_info` – YouTube URL parsing
- **Configuration** (`src-tauri/src/core/conf.rs`):
  - `AppConf` struct with all user settings
  - Persisted to platform config dir (`config.json`)
  - Supports TTS (voice name, language, auto), visual preset, approved apps, pending learnings
- **Window Setup** (`src-tauri/src/core/setup.rs`):
  - Host window labeled `core`
  - Three webviews: `main` (chat), `titlebar` (window controls), `ask` (input area)

### Communication
- **IPC**: Frontend uses `@tauri-apps/api/core` `invoke()` to call Rust commands
- **Payload Format**: JSON-serializable objects (e.g., `{ message: JSON.stringify(...) }`)
- **Return Values**: Commands return JSON, parsed by frontend for UI updates

## 📁 Project Structure

```
ChatGPT/
├── .github/
│   ├── copilot-instructions.md       # AI agent guidance
│   └── workflows/
│       ├── build-windows.yml         # CI: build on push
│       └── release-windows.yml       # Release workflow
├── docs/
│   ├── DEVELOPMENT.md                # Local dev setup
│   ├── BUILD_WINDOWS.md              # Windows build & signing
│   └── FEATURES.md                   # Feature descriptions
├── scripts/
│   └── build-windows.ps1             # Local build helper
├── src/                              # React frontend
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.d.ts
│   ├── view/
│   │   └── Ask.tsx                  # Main chat UI
│   ├── components/
│   │   ├── Avatar.tsx               # SVG avatar
│   │   └── WinTitlebar.tsx
│   ├── hooks/
│   │   ├── useInfo.tsx
│   │   └── useTheme.tsx
│   └── icons/                        # SVG icon components
├── src-tauri/                        # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   └── core/
│   │       ├── cmd.rs               # Tauri commands
│   │       ├── conf.rs              # Config & persistence
│   │       ├── setup.rs             # Window/webview setup
│   │       ├── constant.rs
│   │       ├── template.rs
│   │       └── window.rs
│   ├── scripts/
│   │   └── ask.js                   # Injected script
│   ├── Cargo.toml                   # Rust dependencies
│   └── tauri.conf.json              # Tauri config
├── vite.config.ts                   # Dev server (port 1420)
├── tailwind.config.js               # Tailwind CSS
├── tsconfig.json
├── package.json                     # npm scripts
├── Cargo.toml                       # Workspace root (?)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ & **pnpm** (or npm)
- **Rust** 1.77.1+ (stable)
- **Visual Studio Build Tools** or **MSVC** (Windows)
- **Tauri** 2.0.0-beta+ (automatically installed via cargo)

### Development

#### 1. Install Dependencies
```bash
pnpm install
```

#### 2. Run Tauri Dev Server
```bash
pnpm tauri
```
This starts:
- Vite dev server on `http://localhost:1420`
- Tauri app with hot-reload
- Rust backend in watch mode

#### 3. Frontend-Only Dev (faster UI iteration)
```bash
pnpm dev
```
Open `http://localhost:1420` in a browser for quick testing (note: Rust IPC won't work, only frontend).

### Building

#### 1. Build Frontend
```bash
pnpm build
```
Outputs optimized assets to `dist/`.

#### 2. Build Tauri App (Windows)
```bash
pnpm tauri build
```
Or use the helper script:
```powershell
.\scripts\build-windows.ps1
```

**Output**: `.exe` installer in `src-tauri/target/release/bundle/nsis/`.

#### 3. Optional: Code Signing (Release)
Set `SIGNING_IDENTITY` and `SIGNING_PASSWORD` environment variables, then run:
```bash
pnpm tauri build --sign
```
See `docs/BUILD_WINDOWS.md` for detailed signing instructions.

## 🎯 Usage Guide

### Chat Flow
1. **Type or speak** message in the input area
2. **Press `Ctrl/Cmd+Enter`** or click **Send** button
3. **Response appears** in the main chat window
4. **Optionally speak** response with **🔊** or `Alt+S`

### Voice I/O
- **Microphone 🎤**: Click to start listening. Recognized speech auto-fills input. Button turns red while listening.
- **Speaker 🔊**: Click to speak the input text.
- **Stop ⏹**: Click to stop current speech.
- **Voice Selector**: Choose from system voices.
- **Preset Dropdown**: Select stylized voice preset (default/energetic-hero/supersain).
- **Auto Checkbox**: Check to auto-speak responses.

### Avatar
- **Visual Feedback**: Avatar mouth animates when speaking.
- **Preset Selection**: Change via TTS preset dropdown.
- **Aura Toggle 🎨**: Click "Aura" checkbox to enable glowing effect (supersain only).

### Approved Apps
1. **Select app** from dropdown (or leave empty if none configured).
2. **Click Run**.
3. **Confirm** in dialog.
4. **App launches** and action is logged.

### Learning System
1. **Fill Name & Command** fields (or extract from YouTube).
2. **Click Learn**.
3. **Review** pending learnings with the **Review** button.
4. **Approve** (enter index) or **Reject** (enter `r#`).
5. **Approved learnings** are added to approved apps list.

### YouTube Integration
1. **Paste YouTube URL** in the YouTube input field.
2. **Click Extract**.
3. **Title & video ID** auto-populate Name & Command fields.
4. **Proceed** with Learn workflow.

## 🔒 Security & Privacy

### Approved Apps Whitelist
- Only explicitly approved apps can run
- All launches require user confirmation
- All actions logged with timestamps

### Learning System
- Submissions require approval before execution
- User has full control over what commands are learned
- Rejections are logged

### Audit Logging
- Central `audit.log` for full transparency
- All actions timestamped
- Stored locally in user's config directory

### Web APIs
- **SpeechSynthesis/SpeechRecognition**: Browser standard APIs, no external service calls (runs locally on device)
- **No cloud telemetry**: App is fully local (except for OpenAI API calls made by the chat backend)

## 🛠️ Troubleshooting

### Voice Not Working
- **Check Browser Support**: SpeechSynthesis/SpeechRecognition require modern browser (Chrome/Edge/Safari support)
- **Check System Voices**: Click voice dropdown to see available voices
- **Check Microphone Permissions**: Browser may require microphone permission for STT

### Port Conflict (Vite 1420)
- **Issue**: `tauri dev` fails with port already in use
- **Solution**: Kill process on 1420 or update `vite.config.ts` and `tauri.conf.json` together

### Approved App Not Running
- **Check Path**: Verify app path is correct (full path to .exe or script)
- **Check Script Extensions**: Supports .exe, .ps1, .bat (Windows)
- **Check Audit Log**: See `audit.log` in config dir for error details

## 📚 Documentation

- **`docs/DEVELOPMENT.md`** – Local dev setup & PowerShell commands
- **`docs/BUILD_WINDOWS.md`** – Windows build process & code signing
- **`.github/copilot-instructions.md`** – For AI agents working on this repo

## 🔄 CI/CD Workflows

### Build Workflow (`.github/workflows/build-windows.yml`)
- **Trigger**: Push to any branch
- **Steps**:
  1. Checkout code
  2. Setup Node.js & Rust
  3. Install pnpm & build
  4. Run `pnpm tauri build`
  5. Upload `.exe` artifact

### Release Workflow (`.github/workflows/release-windows.yml`)
- **Trigger**: Push tag (e.g., `git tag v1.0.0 && git push --tags`)
- **Steps**:
  1. Build .exe (with optional code signing if env vars set)
  2. Create GitHub Release
  3. Upload assets to Release

## 📦 Dependencies

### Frontend
- **React** 18+
- **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS** (styling)
- **@tauri-apps/api** (IPC)
- **react-hotkeys-hook** (keyboard shortcuts)
- **lodash** (debounce utility)

### Backend
- **Tauri** 2.0.0-beta
- **tokio** (async runtime)
- **serde_json** (JSON serialization)
- **reqwest** (HTTP client, optional for future APIs)
- **regex** (URL parsing for YouTube extraction)

## 🎨 Customization

### Voice Presets
Edit `src/view/Ask.tsx` `speak()` function to adjust pitch/rate/volume for presets.

### Avatar Appearance
Edit `src/components/Avatar.tsx` to customize SVG colors, shapes, or animations.

### Approved Apps
Users configure via the UI; no code changes needed.

### Keyboard Shortcuts
Edit `src/view/Ask.tsx` `useHotkeys()` calls to rebind keys.

## 🤝 Contributing

1. **Fork & Clone** the repo
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test locally: `pnpm tauri`
4. **Build & verify**: `pnpm build && pnpm tauri build`
5. **Submit PR** with description of changes

## 📄 License

(Specify your license here, e.g., MIT, GPL-3.0, etc.)

## 🎓 Learning Resources

- **Tauri**: https://tauri.app
- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Vite**: https://vitejs.dev

## 📞 Support

For issues, questions, or feature requests:
1. Check existing GitHub Issues
2. Create new Issue with reproduction steps
3. Provide system info (OS, Node version, Rust version)
4. Attach relevant error logs (e.g., `audit.log`, console output)

---

**Happy coding! 🚀**
