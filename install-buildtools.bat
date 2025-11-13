@echo off
REM Download and install Visual Studio Build Tools for Rust

setlocal enabledelayedexpansion

echo Downloading Visual Studio Build Tools...
powershell -Command "Invoke-WebRequest -Uri 'https://aka.ms/vs/17/release/vs_BuildTools.exe' -OutFile '%TEMP%\vs_buildtools.exe' -UseBasicParsing"

if exist "%TEMP%\vs_buildtools.exe" (
    echo Installing Visual Studio Build Tools...
    "%TEMP%\vs_buildtools.exe" --norestart --passive --downloadPath C:\vs_temp ^
        --installPath "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools" ^
        --add Microsoft.VisualStudio.Workload.MSBuildTools ^
        --add Microsoft.VisualStudio.Workload.VCTools ^
        --add Microsoft.Component.MSBuild
    
    echo Build tools installation started...
    echo This may take 5-10 minutes
    echo Once done, reopen PowerShell and try: pnpm tauri build
) else (
    echo Failed to download Build Tools
    echo Try manual install from: https://visualstudio.microsoft.com/downloads/
    echo Look for: "Build Tools for Visual Studio"
)
