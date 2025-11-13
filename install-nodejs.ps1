# Download and install Node.js automatically
$NodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.exe"
$InstallerPath = "$env:TEMP\node-installer.exe"

Write-Host "Downloading Node.js LTS..." -ForegroundColor Cyan
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $NodeUrl -OutFile $InstallerPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
    
    Write-Host "Installing Node.js (this may take 2-3 minutes)..." -ForegroundColor Cyan
    Start-Process -FilePath $InstallerPath -ArgumentList "/qn /norestart" -Wait -NoNewWindow
    
    Write-Host "Node.js installed!" -ForegroundColor Green
    Write-Host "Refreshing environment..." -ForegroundColor Cyan
    
    Start-Sleep -Seconds 3
    
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "Verifying installation..." -ForegroundColor Cyan
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "npm: $npmVersion" -ForegroundColor Green
    Write-Host "Node.js is ready!" -ForegroundColor Green
    
    Remove-Item $InstallerPath -Force -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
