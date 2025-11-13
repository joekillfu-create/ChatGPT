# Building Windows bundle (local & CI)

This document explains how to build a Windows .exe/installer for this Tauri-based app.

## Local build (Windows)

Prerequisites:
- Node.js 18+
- pnpm (v6+ or v8 preferred)
- Rust toolchain (stable) and cargo
- Visual Studio with "Desktop development with C++" or Windows SDK (for the MSVC target)
- Tauri prerequisites (see https://tauri.app/v1/guides/getting-started/prerequisites)

Steps (PowerShell):

```powershell
# from repo root
pnpm install
pnpm build
pnpm tauri build
```

After successful build, the produced bundles will be under:

```
src-tauri/target/release/bundle/windows/
```

Look for an `.exe`, `.msi` or installer (depending on your tauri config).

## Build & Release via GitHub Actions

This repository contains two workflows that build Windows bundles on GitHub:

- `.github/workflows/build-windows.yml` — builds bundles on push to `main`/`master` and uploads artifacts.
- `.github/workflows/release-windows.yml` — triggers on tag push `v*` or manual dispatch and will create a GitHub Release with uploaded bundle artifacts.

To trigger a release build manually:
1. Create a git tag (e.g. `v1.0.0`) and push it:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub will run the `release-windows.yml` workflow and attach the generated bundle to the Release.

### Code signing (optional)

If you want produced installers to be code-signed automatically, set these repository secrets in GitHub:

- `RELEASE_CERT_PFX` — your signing certificate exported as base64 (PFX file), e.g. `cat cert.pfx | base64` and paste the output into the secret.
- `RELEASE_CERT_PASSWORD` — password for the PFX file.

The release workflow will decode `RELEASE_CERT_PFX`, write `cert.pfx`, and attempt to sign `.exe`/`.msi` files using `signtool.exe`.

Important: protecting signing secrets is critical. Use GitHub Organisation secrets if available and restrict who can trigger workflows.

## Troubleshooting

- If `pnpm tauri build` fails with MSVC errors, ensure Visual Studio's C++ build tools are installed.
- If the webview or Tauri build fails due to devUrl/port mismatch, verify `vite.config.ts` (port 1420) and `src-tauri/tauri.conf.json` devUrl.

## Next steps

- If you want me to trigger the CI release (create and push a tag), I can create a branch with a trivial commit and add a tag — but pushing to remote requires your credentials or CI access. Alternatively, you can run the tag/push steps locally.

If you'd like, I can also add a CI step to attach signed artifacts to GitHub Releases using an external signing service; tell me which provider or whether you'll manage the PFX secret.
