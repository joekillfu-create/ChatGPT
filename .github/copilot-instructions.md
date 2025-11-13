This repository is a Tauri-based desktop shell that embeds webviews (multiple child webviews) and a small React frontend.

Be concise and actionable. Focus on the exact files and patterns below to get productive quickly.

Key summary (big picture)
- Frontend: TypeScript + React app in `src/` (entry: `src/main.tsx`, root component `src/App.tsx`). Uses Vite (dev server port 1420). `index.html` is the app shell used by `titlebar` and `ask` webviews.
- Backend: Rust/Tauri in `src-tauri/` (entry: `src-tauri/src/main.rs`). The Rust side creates a single window labeled `core` and adds three webviews named `main`, `titlebar`, and `ask` (see `src-tauri/src/core/setup.rs`).
- Communication: UI invokes Rust commands via `@tauri-apps/api` / `invoke(...)`. Rust exposes commands (e.g. `ask_sync`, `ask_send`, `get_app_conf`, `set_view_ask`) defined in `src-tauri/src/core/cmd.rs` and registers them in `main.rs`.

What to look at first (important files)
- `src-tauri/src/core/setup.rs` — how windows and webviews are built and laid out (child webviews, sizes, scale handling). Important for UI layout and platform differences (macOS vs others).
- `src-tauri/src/core/cmd.rs` — tauri commands invoked by the frontend; payload shapes and side effects (e.g. `ask_sync` expects a JSON-stringified message).
- `src-tauri/src/core/conf.rs` — app configuration shape (AppConf) and where config is persisted (`config.json` under the platform config dir). Use `AppConf::load`/`save` semantics when modifying config-handling code.
- `src-tauri/src/core/template.rs` and `src-tauri/scripts/ask.js` — script templating and how the app bundles/updates scripts into the user config dir.
- `vite.config.ts` — dev server port (1420) and strictPort=true; do not change port unless you update `tauri.conf.json`.
- `src-tauri/tauri.conf.json` — build/dev commands that Tauri expects (`beforeDevCommand`: `pnpm dev`, `devUrl`: `http://localhost:1420`).

Patterns and conventions you should follow
- Webview labels are important: `core` (window), webviews `main`, `titlebar`, `ask`. Use these exact labels when finding/setting webview state (see `get_webview("main")`).
- Commands are Rust `# [command]` functions that take simple serializable args. Frontend passes JSON-serializable values and often stringified JSON (see `ask_sync`/`ask_send`). Check `src-tauri/src/core/cmd.rs` for exact names.
- Config is JSON persisted via `AppConf::get_conf_path(app)`. When adding config fields, keep backward compatibility: `conf::load` tolerates missing fields and merges defaults.
- Platform-specific layout: setup and command code contains `# [cfg(target_os = "macos")]` and non-mac branches — respect both when modifying sizes or titlebar logic.

Developer workflows (how to build, run, debug)
- Frontend dev (fast iteration):
  - Start the Vite dev server on port 1420: `pnpm dev` (package.json `dev` uses `vite`).
  - Open a browser at `http://localhost:1420` for quick UI checks, but prefer Tauri dev for real integration.
- Full app dev (recommended for integration with Rust):
  - Run Tauri in dev mode to start the frontend and the Rust backend together: `pnpm tauri` (package.json script `tauri`). This runs `tauri dev`, which uses `beforeDevCommand` (pnpm dev) and `devUrl` from `src-tauri/tauri.conf.json`.
  - Note: Vite must run on port 1420, strictPort is enabled in `vite.config.ts`.
- Build for release:
  - `pnpm build` to produce frontend `dist` (this runs `tsc && vite build`).
  - Then use Tauri build flow (typically `pnpm tauri build` / `tauri build`) — the project `src-tauri/Cargo.toml` pins tauri and rust versions.

Data flows and examples to reference
- Chat input flow: `src/view/Ask.tsx` (frontend) calls `invoke('ask_sync', { message: JSON.stringify(message) })` — server side `ask_sync(app, message: String)` will eval `ChatAsk.sync({})` in the `main` webview. When implementing features that affect messaging, update both sides.
- Theme & config flow: frontend calls `set_theme` / `window_pin` which mutate `AppConf` via `conf.rs::amend` and then call `app.restart()` or update window flags.
- Script injection: `setup.rs` passes `initialization_script` with `AppConf::load_script(..."ask.js")` and `INIT_SCRIPT`. To change injected JS, edit `src-tauri/scripts/ask.js` or `constant::INIT_SCRIPT`.

Testing, linting, and typechecks
- TypeScript: project uses `tsc` in build step. Run `pnpm build` locally to catch type errors (`tsc` runs before `vite build`).
- Rust: project uses Rust 1.77.1 per `src-tauri/Cargo.toml`. Run `cargo build` inside `src-tauri` for rust compile. Tauri may require nightly or pinned toolchain on CI — verify local rustup toolchain if build fails.

Common gotchas and edge cases
- Port conflict: Vite expects port 1420. If another process uses it, `tauri dev` will fail because `strictPort: true`. Update `vite.config.ts` and `tauri.conf.json` together if changing ports.
- Webview labels and focus: several commands assume child webviews exist and call `.unwrap()` — be conservative editing webview initialization order and error handling.
- Config migration: `conf::load` attempts to recover from malformed config by merging defaults. When adding new fields, ensure defaults are provided in `AppConf::new()`.

If you edit the frontend and add new tauri commands
- Add `# [command]` functions in `src-tauri/src/core/cmd.rs`, register them in `src-tauri/src/main.rs`'s `invoke_handler`, and call from the frontend via `invoke('<command_name>', {...})`.

Examples (searchable code snippets)
- Webview creation & labels: `src-tauri/src/core/setup.rs` — search for `WebviewBuilder::new("main"` and `WindowBuilder::new(&handle, "core")`.
- Command example: `src-tauri/src/core/cmd.rs` contains `# [command] pub fn ask_sync(app: AppHandle, message: String)`.
- Dev server port: `vite.config.ts` (port: 1420) and `src-tauri/tauri.conf.json` (devUrl).

When adding tests or CI changes
- Keep the dev port and `beforeDevCommand` in sync. CI that runs `tauri dev` must be able to start the frontend on port 1420.

Questions or missing info you might ask the repo owner
- Are there any platform-specific packaging scripts or CI constraints that require a specific Rust toolchain or Node version beyond what's declared?
- Is `scripts/ask.js` intentionally user-editable (template) or expected to be maintained in-tree?

If anything here is unclear or you need more specifics (examples of message payloads, startup ordering, or how config is expected to evolve), tell me which section to expand and I will iterate.
