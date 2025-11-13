#!/usr/bin/env pwsh
# ChatGPT Desktop v2.0.0 - Local Build Script

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "ChatGPT Desktop v2.0.0 - Build Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$projectPath = "c:\Users\josep\OneDrive\Documents\GitHub\ChatGPT"
$downloadPath = "$env:USERPROFILE\Downloads"

Write-Host "" -ForegroundColor Cyan
Write-Host "Project: $projectPath" -ForegroundColor Yellow
Write-Host "Download: $downloadPath" -ForegroundColor Yellow

cd $projectPath
Write-Host "" -ForegroundColor Green
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Cyan
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED"; exit 1 }
Write-Host "Success" -ForegroundColor Green

Write-Host "" -ForegroundColor Green
Write-Host "Step 2: Building application (10-15 min)..." -ForegroundColor Cyan
pnpm tauri build
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED"; exit 1 }
Write-Host "Success" -ForegroundColor Green

Write-Host "" -ForegroundColor Green
Write-Host "Step 3: Locating .exe..." -ForegroundColor Cyan
$exeFile = Get-Item "src-tauri/target/release/bundle/nsis/*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $exeFile) { Write-Host "NOT FOUND"; exit 1 }
Write-Host "Found: $($exeFile.Name)" -ForegroundColor Green

Write-Host "" -ForegroundColor Green
Write-Host "Step 4: Copying to Downloads..." -ForegroundColor Cyan
$destPath = Join-Path $downloadPath $exeFile.Name
Copy-Item -Path $exeFile.FullName -Destination $destPath -Force
Write-Host "Copied to: $destPath" -ForegroundColor Green

Write-Host "" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "BUILD COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "Your .exe is ready in: Downloads folder" -ForegroundColor Yellow
Write-Host "Filename: $($exeFile.Name)" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan
Write-Host "Next: Double-click the .exe to install" -ForegroundColor Green
Write-Host "Enjoy your ChatGPT Desktop! 🚀" -ForegroundColor Green
Write-Host "" -ForegroundColor Cyan

Start-Process explorer.exe -ArgumentList $downloadPath
