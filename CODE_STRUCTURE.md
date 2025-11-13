# Code Structure Overview – ChatGPT Desktop v2.0

Quick reference for understanding the codebase organization.

---

## 🎯 Core Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   USER INTERACTION (UI)                     │
│                                                              │
│  src/view/Ask.tsx  ← Main Chat View with All Controls      │
│  - Voice input (🎤 handleVoiceInput)                       │
│  - Voice output (🔊 speak)                                 │
│  - Avatar (src/components/Avatar.tsx)                      │
│  - Approved apps launcher                                  │
│  - Learning submission & review                            │
│  - YouTube URL extraction                                  │
│  - Keyboard shortcuts (useHotkeys)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ invoke()
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   TAURI IPC BRIDGE                          │
│                  @tauri-apps/api/core                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ JSON
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              RUST BACKEND (src-tauri/src)                   │
│                                                              │
│  main.rs                                                    │
│  └─ invoke_handler: registers all commands                 │
│                                                              │
│  core/cmd.rs                                                │
│  ├─ ask_sync / ask_send (core chat)                        │
│  ├─ set_tts_pref / set_visual_preset (preferences)         │
│  ├─ get/add/remove/run_approved_app (apps)                 │
│  ├─ submit/approve/reject_learning (learning)              │
│  ├─ extract_youtube_info (YouTube)                         │
│  └─ append_audit() (logging)                               │
│                                                              │
│  core/conf.rs                                               │
│  ├─ AppConf struct (all user settings)                     │
│  ├─ load() / save() / amend()                              │
│  └─ Persisted to: ~/.config/ChatGPT/config.json (Windows)  │
│                                                              │
│  core/setup.rs                                              │
│  └─ Window & webview initialization                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Tree (Detailed)

```
ChatGPT/
│
├── 📄 Root Files
│   ├── README.md                    ← Start here!
│   ├── QUICK_START.md               ← 5-min setup
│   ├── PROJECT_SUMMARY.md           ← Full reference
│   ├── PROJECT_COMPLETE.md          ← You are here
│   ├── CHANGELOG.md                 ← Release notes
│   ├── package.json                 ← npm scripts
│   ├── vite.config.ts               ← Dev server (port 1420)
│   ├── tsconfig.json                ← TypeScript config
│   ├── tailwind.config.js           ← Tailwind CSS
│   └── pnpm-lock.yaml               ← Dependencies lock
│
├── 📂 .github/
│   ├── copilot-instructions.md      ← AI agent guidance
│   └── workflows/
│       ├── build-windows.yml        ← CI: build on push
│       └── release-windows.yml      ← Release workflow
│
├── 📂 docs/
│   ├── DEVELOPMENT.md               ← Dev setup guide
│   ├── BUILD_WINDOWS.md             ← Build & signing
│   └── static/
│       └── (images, assets)
│
├── 📂 scripts/
│   └── build-windows.ps1            ← Local build helper
│
├── 📂 public/
│   └── (assets, icons)
│
├── 📂 src/ ← FRONTEND (React/TypeScript)
│   ├── main.tsx                     ← App entry point
│   ├── App.tsx                      ← Root component
│   ├── types.d.ts                   ← Type definitions
│   ├── base.css                     ← Global styles
│   │
│   ├── 📂 view/
│   │   ├── Ask.tsx                  ⭐ MAIN: Chat UI with all controls
│   │   │   ├─ Voice input (🎤 handleVoiceInput)
│   │   │   ├─ Voice output (🔊 speak)
│   │   │   ├─ Approved apps dropdown & Run
│   │   │   ├─ Learning Name/Command & Learn button
│   │   │   ├─ Learning Review button (approve/reject)
│   │   │   ├─ YouTube URL input & Extract
│   │   │   ├─ Keyboard shortcuts (Alt+S, Alt+Shift+S, Ctrl+Enter)
│   │   │   └─ Avatar integration
│   │   ├── Settings.tsx
│   │   └── Titlebar.tsx
│   │
│   ├── 📂 components/
│   │   ├── Avatar.tsx               ⭐ Animated SVG avatar
│   │   │   ├─ Spiky hair (supersain preset)
│   │   │   ├─ Glowing aura (togglable)
│   │   │   ├─ Animated mouth (on speaking)
│   │   │   └─ Accessibility (ARIA labels)
│   │   └── WinTitlebar.tsx
│   │
│   ├── 📂 hooks/
│   │   ├── useInfo.tsx              ← Platform detection
│   │   └── useTheme.tsx             ← Theme management
│   │
│   └── 📂 icons/
│       ├── Send.tsx
│       ├── Ask.tsx
│       ├── Pin.tsx
│       ├── ThemeDark.tsx
│       ├── ThemeLight.tsx
│       ├── ThemeSystem.tsx
│       ├── [other icons]
│       └── SVGWrap.tsx
│
├── 📂 src-tauri/ ← BACKEND (Rust/Tauri)
│   ├── Cargo.toml                   ← Rust dependencies
│   ├── tauri.conf.json              ← Tauri config
│   ├── build.rs                     ← Build script
│   │
│   ├── 📂 src/
│   │   ├── main.rs                  ⭐ Tauri entry point
│   │   │   └─ invoke_handler: registers all 13 commands
│   │   │
│   │   └── 📂 core/
│   │       ├── cmd.rs               ⭐ All Tauri commands
│   │       │   ├─ ask_sync / ask_send
│   │       │   ├─ set_tts_pref / set_visual_preset
│   │       │   ├─ get/add/remove/run_approved_app
│   │       │   ├─ submit/get/approve/reject_learning
│   │       │   ├─ extract_youtube_info (regex parsing)
│   │       │   ├─ get/run_approved_script
│   │       │   └─ append_audit() [logging]
│   │       │
│   │       ├── conf.rs              ⭐ Configuration
│   │       │   ├─ AppConf struct
│   │       │   │   ├─ TTS: voice_name, voice_lang, auto
│   │       │   │   ├─ Visual: visual_preset
│   │       │   │   ├─ Apps: approved_apps vec
│   │       │   │   └─ Learning: pending_learnings vec
│   │       │   ├─ load() / save() / amend()
│   │       │   └─ Persisted: ~/.config/ChatGPT/config.json
│   │       │
│   │       ├── setup.rs             ← Window & webview init
│   │       ├── constant.rs          ← App constants
│   │       ├── template.rs          ← Script templating
│   │       ├── window.rs            ← Window utilities
│   │       └── mod.rs               ← Module exports
│   │
│   ├── 📂 scripts/
│   │   └── ask.js                   ← Injected script
│   │
│   └── 📂 icons/
│       └── (app icons)
│
├── 📂 capabilities/
│   └── desktop.json                 ← Tauri permissions
│
└── 📂 index.html                    ← App shell HTML
```

---

## 🔗 Key Connections

### Voice Input Flow
```
User clicks 🎤 (Ask.tsx)
  ↓
handleVoiceInput() starts SpeechRecognition API
  ↓
Browser captures audio
  ↓
onresult event fires with transcript
  ↓
setMessage(prev + transcript) updates state
  ↓
Textarea auto-fills with recognized text
```

### Voice Output Flow
```
User clicks 🔊 or presses Alt+S (Ask.tsx)
  ↓
speak(message) called with selected voice
  ↓
SpeechSynthesisUtterance created
  ↓
Preset adjusts pitch/rate/volume
  ↓
speechSynthesis.speak(utterance)
  ↓
Avatar mouth animates (via isSpeaking state)
```

### Learning Submission Flow
```
User fills Name + Command, clicks Learn (Ask.tsx)
  ↓
invoke('submit_learning', {name, command})
  ↓
Rust cmd.rs submit_learning() runs
  ↓
Learning added to pending_learnings in AppConf
  ↓
Config persisted to disk
  ↓
User clicks Review → approve (index) or reject (r#)
  ↓
invoke('approve_learning' or 'reject_learning')
  ↓
Approved learning added to approved_apps list
  ↓
All actions logged to audit.log
```

### YouTube Extraction Flow
```
User pastes URL, clicks Extract (Ask.tsx)
  ↓
invoke('extract_youtube_info', {url})
  ↓
Rust cmd.rs regex parsing extracts video_id
  ↓
Returns {video_id, title, note}
  ↓
Frontend alerts results & auto-populates Name/Command
  ↓
User clicks Learn to submit learning
```

### Approved App Execution Flow
```
User selects app, clicks Run (Ask.tsx)
  ↓
window.confirm() asks for confirmation
  ↓
invoke('run_approved_app', {action})
  ↓
Rust checks if app is in approved_apps whitelist
  ↓
If approved: spawn process (Windows: .exe / .ps1 / .bat)
  ↓
append_audit() logs action with timestamp
  ↓
Return result to frontend
  ↓
Frontend displays status in alert
```

---

## 🧩 Component Tree

```
App.tsx
└─ Main Window (Tauri "core")
   ├─ WinTitlebar.tsx (titlebar webview)
   │  └─ Window controls
   │
   ├─ Ask.tsx (ask webview) ⭐ MAIN
   │  ├─ Avatar.tsx
   │  │  └─ SVG (head, hair, aura, mouth, face)
   │  │
   │  ├─ Textarea (message input)
   │  │  └─ handleInput onChange
   │  │
   │  ├─ TTS Controls
   │  │  ├─ Voice selector <select>
   │  │  ├─ Preset dropdown <select>
   │  │  ├─ 🔊 Speak button
   │  │  ├─ ⏹ Stop button
   │  │  ├─ 🎤 Listen button (handleVoiceInput)
   │  │  └─ Auto checkbox
   │  │
   │  ├─ Approved Apps
   │  │  ├─ Apps dropdown <select>
   │  │  └─ Run button
   │  │
   │  ├─ Learning Submission
   │  │  ├─ Name input
   │  │  ├─ Command input
   │  │  ├─ Learn button
   │  │  ├─ Pending count badge
   │  │  └─ Review button (approve/reject)
   │  │
   │  ├─ YouTube Integration
   │  │  ├─ URL input
   │  │  └─ Extract button
   │  │
   │  ├─ Send Button
   │  │  └─ SendIcon component
   │  │
   │  └─ Aura Toggle
   │     └─ Checkbox (enable/disable aura)
   │
   └─ Main Chat View (main webview)
      └─ OpenAI Chat Display
```

---

## 🔄 State Management (Ask.tsx)

```typescript
const [message, setMessage]                        // Chat input text
const [voices, setVoices]                          // Available TTS voices
const [voiceIndex, setVoiceIndex]                  // Selected voice index
const [isSpeaking, setIsSpeaking]                  // TTS playing state
const [autoSpeak, setAutoSpeak]                    // Auto-speak toggle
const [approvedApps, setApprovedApps]              // Apps list
const [selectedApp, setSelectedApp]                // Selected app
const [pendingLearnings, setPendingLearnings]      // Pending approvals queue
const [learningName, setLearningName]              // Learning name input
const [learningCommand, setLearningCommand]        // Learning command input
const [youtubeUrl, setYoutubeUrl]                  // YouTube URL input
const [isListening, setIsListening]                // Voice input state
const [ttsPreset, setTtsPreset]                    // Selected preset
const [visualEnabled, setVisualEnabled]            // Aura toggle
```

---

## 🚀 Command Registration (main.rs)

```rust
#[command] fn ask_sync(...)      ← Command definition
#[command] fn ask_send(...)
#[command] fn set_tts_pref(...)
#[command] fn set_visual_preset(...)
#[command] fn get_approved_apps(...)
#[command] fn add_approved_app(...)
#[command] fn remove_approved_app(...)
#[command] fn run_approved_app(...)
#[command] fn submit_learning(...)
#[command] fn get_pending_learnings(...)
#[command] fn approve_learning(...)
#[command] fn reject_learning(...)
#[command] fn extract_youtube_info(...)
#[command] fn get_approved_scripts(...)
#[command] fn run_approved_script(...)
        ↓
    invoke_handler! macro in main.rs
        ↓
    Registered for IPC from frontend
```

---

## 💾 Persistence Layer (conf.rs)

```
AppConf struct
├─ tts_voice_name: Option<String>
├─ tts_voice_lang: Option<String>
├─ tts_auto: bool
├─ visual_preset: Option<String>
├─ approved_apps: Vec<String>
├─ pending_learnings: Vec<serde_json::Value>
└─ (+ other config fields)
        ↓
    AppConf::load(app) reads from disk
    AppConf::amend(app, field, value) modifies
    AppConf::save(app) writes to disk
        ↓
    Platform-specific config directory:
    ~/.config/ChatGPT/config.json (Windows)
```

---

## 📊 Audit Logging (cmd.rs)

```
Every important action:

append_audit(app, action)
  ↓
Logs to audit.log:
"2024-01-15T10:30:45Z | Approved: MyApp"
"2024-01-15T10:31:12Z | Executed: MyApp"
"2024-01-15T10:32:50Z | Learned: MyCommand"
  ↓
Stored in: ~/.config/ChatGPT/audit.log (Windows)
```

---

## 🎨 Avatar Rendering (Avatar.tsx)

```
Avatar.tsx
├─ Props: speaking (bool), preset (string)
│
├─ SVG viewport (200x240)
│  ├─ Head (circle)
│  ├─ Face (eyes, nose, mouth)
│  ├─ Hair
│  │  └─ Conditional: show spiky hair if supersain preset
│  ├─ Aura (glow effect)
│  │  └─ Conditional: show glow if preset is supersain
│  ├─ Mouth
│  │  └─ Animated: scale based on speaking state
│  └─ Accessibility
│     ├─ ARIA labels
│     ├─ Title attribute
│     └─ SVG description
```

---

## 🔐 Security Architecture

```
User Input
  ├─ Approved Apps: Whitelist validation ✅
  ├─ Learning: Pending approval required ✅
  ├─ Voice: Local device processing ✅
  ├─ YouTube: Regex (no external API) ✅
  └─ Chat: OpenAI API (encrypted TLS) ✅
       ↓
Audit Logging: All actions timestamped
  └─ audit.log records everything
```

---

## 🏃 Quick Build Path

```
pnpm install        ← Install npm deps
      ↓
pnpm tauri          ← Dev server + Rust
      ↓
Frontend builds on port 1420
Rust builds in background
      ↓
Hot reload on code changes
      ↓
pnpm tauri build    ← Production build
      ↓
Output: ChatGPT_*.exe
```

---

## 📚 File Size Reference

| File | Type | Purpose | Size |
|------|------|---------|------|
| `src/view/Ask.tsx` | Frontend | Main UI | ~600 lines |
| `src/components/Avatar.tsx` | Frontend | Avatar SVG | ~150 lines |
| `src-tauri/src/core/cmd.rs` | Backend | Commands | ~400 lines |
| `src-tauri/src/core/conf.rs` | Backend | Config | ~200 lines |
| `.exe` (release) | Binary | Executable | ~100 MB |

---

**Ready to explore the code? Start with `src/view/Ask.tsx` for frontend or `src-tauri/src/core/cmd.rs` for backend!** 🚀
