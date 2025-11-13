## Development — setup and run (Windows PowerShell)

This project is a Tauri desktop app with a React/Vite frontend and a Rust backend. The frontend dev server must run on port 1420 (Vite strictPort). Follow the steps below to set up a Windows development environment and run the app.

Prerequisites
- Node.js (LTS, >= 18) — https://nodejs.org/
- pnpm (recommended) — via Corepack or npm
- Rust toolchain with `cargo` (install via rustup) — https://rustup.rs/
- (Optional) Tauri CLI if you need `tauri` commands locally: `pnpm add -g @tauri-apps/cli`

Install steps (PowerShell)
```powershell
# Install Node.js from https://nodejs.org/ then enable corepack (bundled with recent Node)
corepack enable
corepack prepare pnpm@latest --activate

# Verify
node -v
pnpm -v

# Install Rust (rustup)
# Recommended: visit https://rustup.rs and follow the Windows installer instructions.
# Or run the installer via PowerShell (downloads the official installer and runs it):
Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe; ./rustup-init.exe -y

# After install, open a new PowerShell or add cargo to PATH for the current session like:
$env:Path += ";$HOME\\.cargo\\bin"

# Verify cargo
cargo --version
```

Getting the repo ready
```powershell
# From project root
pnpm install
```

Frontend dev
```powershell
# Start vite dev server (port 1420 required by Tauri config)
pnpm dev
# Open http://localhost:1420 in a browser to inspect the UI
```

Run full Tauri dev (vite + rust backend)
```powershell
# This uses the `beforeDevCommand` configured in src-tauri/tauri.conf.json
pnpm tauri
# or, if you prefer to run separately:
# 1) pnpm dev (start vite)
# 2) pnpm tauri dev
```

Build for production
```powershell
# Build the frontend (tsc + vite build)
pnpm build
# Then build the native app via Tauri
pnpm tauri build
# Or build Rust only (useful for checking backend compile errors)
cd src-tauri; cargo build
```

Troubleshooting & gotchas
- Vite strictPort: `vite.config.ts` uses port 1420 and `strictPort: true`. If something else is using that port, change both `vite.config.ts` and `src-tauri/tauri.conf.json` `devUrl` before running.
- Missing CLI tools: If `pnpm` or `cargo` are not found, ensure Node's Corepack is enabled or install pnpm via `npm i -g pnpm`, and install Rust via rustup.
- Webview labels: backend expects webviews labeled `main`, `titlebar`, `ask` (`setup.rs`). Don't rename them without updating Rust code.
- Config: `src-tauri/src/core/conf.rs` persists JSON config in the platform config dir; `AppConf::new()` provides defaults — when adding fields maintain backward compatibility.

If you want, after installing the prerequisites I can (re)run the builds in this environment and triage any failures.
