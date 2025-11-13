#!/usr/bin/env pwsh
# ChatGPT Desktop v2.0.0 - Local Build & Download Script
# This script builds the .exe and saves it to your Downloads folder

$ErrorActionPreference = "Stop"

Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ChatGPT Desktop v2.0.0 - Build Script" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan

# Configuration
$projectPath = "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
$downloadPath = "$env:USERPROFILE\Downloads"

Write-Host "`n📁 Project Path: $projectPath" -ForegroundColor Yellow
Write-Host "📁 Download Path: $downloadPath" -ForegroundColor Yellow

# Check if project exists
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Project folder not found: $projectPath" -ForegroundColor Red
    exit 1
}

# Navigate to project
cd $projectPath
Write-Host "`n✅ Navigated to project folder" -ForegroundColor Green

# Step 1: Check if pnpm is installed
Write-Host "`n🔍 Checking pnpm installation..." -ForegroundColor Cyan
$pnpmCheck = pnpm --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ pnpm not found. Installing..." -ForegroundColor Red
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ pnpm version: $pnpmCheck" -ForegroundColor Green

# Step 2: Check if Rust is installed
Write-Host "`n🔍 Checking Rust installation..." -ForegroundColor Cyan
$rustCheck = rustc --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Rust not found. Download from https://rustup.rs/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ $rustCheck" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 4: Build the application
Write-Host "`n🔨 Building application (this may take 10-15 minutes)..." -ForegroundColor Cyan
Write-Host "⏳ Please wait..." -ForegroundColor Yellow
pnpm tauri build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Step 5: Find the .exe
Write-Host "`n🔍 Locating .exe file..." -ForegroundColor Cyan
$exePattern = "src-tauri/target/release/bundle/nsis/*.exe"
$exeFile = Get-Item $exePattern -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $exeFile) {
    Write-Host "❌ .exe file not found at: $exePattern" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found: $($exeFile.Name)" -ForegroundColor Green
Write-Host "   Size: $([math]::Round($exeFile.Length / 1MB, 2)) MB" -ForegroundColor Green

# Step 6: Copy to Downloads
Write-Host "`n📥 Copying to Downloads folder..." -ForegroundColor Cyan
$destPath = Join-Path $downloadPath $exeFile.Name
Copy-Item -Path $exeFile.FullName -Destination $destPath -Force
Write-Host "✅ Copied to: $destPath" -ForegroundColor Green

# Step 7: Verify copy
if (Test-Path $destPath) {
    Write-Host "✅ Verification: File exists in Downloads" -ForegroundColor Green
} else {
    Write-Host "❌ Verification failed: File not in Downloads" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host "`n════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n📍 Location: $destPath" -ForegroundColor Yellow
Write-Host "📦 Filename: $($exeFile.Name)" -ForegroundColor Yellow
Write-Host "💾 Size: $([math]::Round($exeFile.Length / 1MB, 2)) MB" -ForegroundColor Yellow

Write-Host "`n🎉 Next Steps:" -ForegroundColor Green
Write-Host "  1. Open your Downloads folder" -ForegroundColor White
Write-Host "  2. Double-click the .exe to install" -ForegroundColor White
Write-Host "  3. Launch the app and test features" -ForegroundColor White
Write-Host "  4. Enjoy! 🚀" -ForegroundColor White

Write-Host "`n" -ForegroundColor Cyan

# Open Downloads folder
Write-Host "📂 Opening Downloads folder..." -ForegroundColor Cyan
Start-Process explorer.exe -ArgumentList $downloadPath

Write-Host "`n✅ Done! Your .exe is ready in Downloads folder." -ForegroundColor Green
