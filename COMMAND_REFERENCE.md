# Command Reference – ChatGPT Desktop v2.0

Complete reference for all Tauri commands, API patterns, and frontend invoke calls.

---

## 📋 All Tauri Commands

### Core Chat Commands

#### `ask_sync`
Send a message for sync processing.
```typescript
// Frontend call
await invoke('ask_sync', { message: JSON.stringify(message) });

// Rust signature
#[command]
pub fn ask_sync(app: AppHandle, message: String)
```

#### `ask_send`
Send a message to the chat.
```typescript
// Frontend call
await invoke('ask_send', { message: JSON.stringify(message) });

// Rust signature
#[command]
pub fn ask_send(app: AppHandle, message: String)
```

---

### TTS & Visual Commands

#### `set_tts_pref`
Persist Text-to-Speech preferences.
```typescript
// Frontend call
await invoke('set_tts_pref', {
  voice_name: "Google UK English Female",
  voice_lang: "en-GB",
  auto: true
});

// Rust signature
#[command]
pub fn set_tts_pref(
  app: AppHandle,
  voice_name: Option<String>,
  voice_lang: Option<String>,
  auto: bool
) -> Result<(), String>
```

**Parameters:**
- `voice_name`: TTS voice name (e.g., "Google UK English Female")
- `voice_lang`: Voice language code (e.g., "en-GB")
- `auto`: Auto-speak toggle (true/false)

#### `set_visual_preset`
Persist avatar visual preset.
```typescript
// Frontend call
await invoke('set_visual_preset', { preset: 'supersain' });

// Rust signature
#[command]
pub fn set_visual_preset(app: AppHandle, preset: Option<String>) -> Result<(), String>
```

**Preset Options:**
- `"default"` – Standard appearance
- `"energetic-hero"` – Energetic, higher pitch
- `"supersain"` – Spiky hair + aura

---

### Approved Apps Commands

#### `get_approved_apps`
Fetch list of approved applications.
```typescript
// Frontend call
const apps: string[] = await invoke('get_approved_apps');

// Rust signature
#[command]
pub fn get_approved_apps(app: AppHandle) -> Result<Vec<String>, String>
```

**Returns:** Array of app names/paths

#### `add_approved_app`
Add application to whitelist.
```typescript
// Frontend call
await invoke('add_approved_app', { action: 'MyApp' });

// Rust signature
#[command]
pub fn add_approved_app(app: AppHandle, action: String) -> Result<String, String>
```

**Parameters:**
- `action`: App name or full path to executable

**Returns:** Success message

#### `remove_approved_app`
Remove application from whitelist.
```typescript
// Frontend call
await invoke('remove_approved_app', { action: 'MyApp' });

// Rust signature
#[command]
pub fn remove_approved_app(app: AppHandle, action: String) -> Result<String, String>
```

#### `run_approved_app`
Execute an approved application (with confirmation).
```typescript
// Frontend call
const result: string = await invoke('run_approved_app', { action: 'MyApp' });
alert(result); // Success or error message

// Rust signature
#[command]
pub fn run_approved_app(app: AppHandle, action: String) -> Result<String, String>
```

**Error Handling:**
- Checks if app is in whitelist
- User confirmation required
- Logs to audit.log on success
- Returns error message if not approved

---

### Learning Commands

#### `submit_learning`
Submit a custom command for learning.
```typescript
// Frontend call
await invoke('submit_learning', {
  name: 'MyCommand',
  command: 'echo Hello World'
});

// Rust signature
#[command]
pub fn submit_learning(
  app: AppHandle,
  name: String,
  command: String
) -> Result<String, String>
```

**Parameters:**
- `name`: Human-readable name
- `command`: Command or script to execute

#### `get_pending_learnings`
Fetch pending learnings awaiting approval.
```typescript
// Frontend call
const pending: any[] = await invoke('get_pending_learnings');
// Example return:
// [
//   { name: 'MyCommand', command: 'echo Hello' },
//   { name: 'AnotherTask', command: 'python script.py' }
// ]

// Rust signature
#[command]
pub fn get_pending_learnings(app: AppHandle) -> Result<Vec<serde_json::Value>, String>
```

**Returns:** Array of pending learning objects

#### `approve_learning`
Approve a pending learning (moves to approved_apps).
```typescript
// Frontend call
await invoke('approve_learning', { name: 'MyCommand' });

// Rust signature
#[command]
pub fn approve_learning(app: AppHandle, name: String) -> Result<String, String>
```

**Side Effects:**
- Adds to approved_apps list
- Removes from pending_learnings
- Logs to audit.log

#### `reject_learning`
Reject a pending learning (discarded).
```typescript
// Frontend call
await invoke('reject_learning', { name: 'MyCommand' });

// Rust signature
#[command]
pub fn reject_learning(app: AppHandle, name: String) -> Result<String, String>
```

**Side Effects:**
- Removes from pending_learnings
- Logs to audit.log

---

### Script Execution Commands

#### `get_approved_scripts`
Fetch list of approved scripts (learnings).
```typescript
// Frontend call
const scripts: string[] = await invoke('get_approved_scripts');

// Rust signature
#[command]
pub fn get_approved_scripts(app: AppHandle) -> Result<Vec<String>, String>
```

#### `run_approved_script`
Execute an approved script/learning.
```typescript
// Frontend call
const output: string = await invoke('run_approved_script', { name: 'MyScript' });

// Rust signature
#[command]
pub fn run_approved_script(app: AppHandle, name: String) -> Result<String, String>
```

---

### YouTube Integration Commands

#### `extract_youtube_info`
Parse YouTube URL and extract metadata.
```typescript
// Frontend call
const info = await invoke('extract_youtube_info', {
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
});
// Returns:
// {
//   video_id: 'dQw4w9WgXcQ',
//   title: 'Rick Astley - Never Gonna Give You Up',
//   note: 'Use this video_id with learning system'
// }

// Rust signature
#[command]
pub fn extract_youtube_info(app: AppHandle, url: String) -> Result<serde_json::Value, String>
```

**Return Format:**
```json
{
  "video_id": "string",
  "title": "string",
  "note": "string"
}
```

**Error Cases:**
- Invalid URL format
- URL is not YouTube
- Regex parsing fails
- Returns appropriate error message

---

## 🎯 Frontend Invoke Patterns

### Basic Pattern
```typescript
try {
  const result = await invoke('command_name', { param: value });
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error);
  alert('Failed: ' + error);
}
```

### With Confirmation
```typescript
const ok = window.confirm('Do you want to proceed?');
if (!ok) return;

try {
  const result = await invoke('command_name', { ... });
  // Handle result
} catch (error) {
  alert('Error: ' + error);
}
```

### Async/Await with State Update
```typescript
const handleClick = async () => {
  try {
    const data = await invoke('get_data_command');
    setData(data);
    setLoading(false);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};
```

---

## 📊 Configuration (AppConf)

### Structure
```typescript
interface AppConf {
  // TTS settings
  tts_voice_name?: string;        // e.g., "Google UK English Female"
  tts_voice_lang?: string;         // e.g., "en-GB"
  tts_auto: boolean;               // Auto-speak responses

  // Visual settings
  visual_preset?: string;          // "default" | "energetic-hero" | "supersain"

  // Apps & scripts
  approved_apps: Vec<String>;      // Whitelist of approved apps
  pending_learnings: Vec<Value>;   // Queue of pending learnings

  // (+ other config fields)
}
```

### Loading & Saving
```rust
// Load from disk
let conf = AppConf::load(&app)?;

// Modify
conf.tts_auto = true;
conf.approved_apps.push("MyApp".to_string());

// Save to disk
conf.save(&app)?;

// Or use amend for atomic updates
AppConf::amend(&app, |conf| {
  conf.tts_auto = true;
})?;
```

### Storage Location
- **Windows**: `%APPDATA%/ChatGPT/config.json`
- **macOS**: `~/Library/Application Support/ChatGPT/config.json`
- **Linux**: `~/.config/ChatGPT/config.json`

---

## 📝 Audit Logging

### Pattern
```rust
append_audit(&app, "Action description")?;
```

### Log File
- **Location**: `~/.config/ChatGPT/audit.log` (Windows)
- **Format**: `ISO8601_TIMESTAMP | ACTION`
- **Example**:
  ```
  2024-01-15T10:30:45Z | Approved: MyApp
  2024-01-15T10:31:12Z | Executed: MyApp
  2024-01-15T10:32:50Z | Learned: MyCommand
  ```

### Logged Actions
- ✅ TTS preference changes
- ✅ Visual preset changes
- ✅ App approvals/rejections
- ✅ App executions
- ✅ Learning submissions/approvals/rejections

---

## 🔄 Error Handling

### Return Types
```rust
// Success
Result<T, String>  // Returns Ok(T) or Err(message)

// Examples
Result<String, String>             // Ok("Success") or Err("Error description")
Result<Vec<String>, String>        // Ok(vec![...]) or Err("No items")
Result<serde_json::Value, String>  // Ok(json) or Err("Parse failed")
```

### Frontend Error Handling
```typescript
try {
  const result = await invoke('command');
  // result is the Ok(T) value
} catch (error) {
  // error is the Err(message) string
  console.error('Command failed:', error);
}
```

---

## 🧪 Testing Commands

### Manual Test in Console
```typescript
// Test TTS preference
await invoke('set_tts_pref', {
  voice_name: 'Google UK English Female',
  voice_lang: 'en-GB',
  auto: false
});

// Test approved app
await invoke('add_approved_app', { action: 'calc.exe' });
await invoke('get_approved_apps');

// Test learning
await invoke('submit_learning', {
  name: 'TestCmd',
  command: 'echo test'
});
await invoke('get_pending_learnings');
```

---

## 📚 API Design Philosophy

### Principles
1. **Simple Types**: Use String, bool, Vec, Option
2. **Clear Names**: Command names describe actions
3. **Error Messages**: Always return descriptive errors
4. **Idempotent**: Safe to call multiple times
5. **Logged**: All critical actions logged to audit.log

### Anti-Patterns
❌ Returning complex nested structs
❌ Silent failures (always return errors)
❌ Side effects without logging
❌ Blocking long-running operations
❌ Unvalidated user input

---

## 🔐 Security Patterns

### Approval Required
```rust
// Check whitelist before execution
if !approved_apps.contains(&action) {
  return Err("App not approved".to_string());
}
```

### User Confirmation
```typescript
// Always ask before critical actions
const ok = window.confirm(`Execute: ${action}?`);
if (!ok) return;
```

### Audit Trail
```rust
// Log all actions
append_audit(&app, format!("Executed: {}", action))?;
```

---

## 🚀 Common Workflows

### Add & Run Approved App
```typescript
// Step 1: Add to whitelist
await invoke('add_approved_app', { action: 'notepad.exe' });

// Step 2: Get list
const apps = await invoke('get_approved_apps');

// Step 3: Run (with user confirmation)
if (window.confirm('Run notepad.exe?')) {
  const result = await invoke('run_approved_app', { action: 'notepad.exe' });
  alert(result);
}
```

### Submit & Approve Learning
```typescript
// Step 1: Submit
await invoke('submit_learning', {
  name: 'MyTask',
  command: 'python my_script.py'
});

// Step 2: Review
const pending = await invoke('get_pending_learnings');
alert(`Pending: ${pending.map(p => p.name).join(', ')}`);

// Step 3: Approve
await invoke('approve_learning', { name: 'MyTask' });

// Step 4: Run
await invoke('run_approved_script', { name: 'MyTask' });
```

### Extract & Learn from YouTube
```typescript
// Step 1: Extract metadata
const info = await invoke('extract_youtube_info', {
  url: 'https://www.youtube.com/watch?v=...'
});

// Step 2: Auto-populate learning
setLearningName(info.title);
setLearningCommand(info.video_id);

// Step 3: Submit
await invoke('submit_learning', {
  name: info.title,
  command: info.video_id
});
```

---

## 📞 Troubleshooting Commands

### Command Not Found
```
Error: invoke method not found
```
**Solution**: Check if command is registered in `main.rs` invoke_handler

### Type Mismatch
```
Error: serde_json serialization failed
```
**Solution**: Ensure parameters match Rust signature (e.g., `{ action: 'string' }`)

### Permission Denied
```
Error: app not in approved list
```
**Solution**: Add app via `add_approved_app` first, or check audit.log

### Config Not Persisting
```
Config reverts after restart
```
**Solution**: Verify `AppConf::save()` was called and config dir exists

---

## 📖 Related Docs

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** – Full feature overview
- **[CODE_STRUCTURE.md](./CODE_STRUCTURE.md)** – Code organization & data flow
- **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** – Dev setup
- **[src-tauri/src/core/cmd.rs](./src-tauri/src/core/cmd.rs)** – Source code

---

**Ready to integrate? Start with the Basic Pattern above and refer to specific command documentation as needed!** 🚀
