# Build script for Windows Tauri app
# Usage: Open PowerShell as Administrator and run from repo root:
#   .\scripts\build-windows.ps1

Write-Host "Installing pnpm dependencies..."
pnpm install

Write-Host "Building frontend (pnpm build)..."
pnpm build

Write-Host "Building Tauri bundle (native Windows)..."
pnpm tauri build

Write-Host "Done. Look for bundles under src-tauri/target/release/bundle/"
