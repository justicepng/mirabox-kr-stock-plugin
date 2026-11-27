$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "com.krstock.streamdock.sdPlugin"
$targetDir = Join-Path $env:APPDATA "HotSpot\StreamDock\plugins"
$dest = Join-Path $targetDir "com.krstock.streamdock.sdPlugin"
$legacyDest = Join-Path $targetDir "com.antigravity.krstock.sdPlugin"

# 1. 기존 실행 중인 로컬 릴레이 프로세스 종료
Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" | Where-Object {
    $_.CommandLine -like "*local-relay.ps1*"
} | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Milliseconds 300

# 2. 구버전 폴더 정리 및 새 플러그인 폴더 복사
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
if (Test-Path $legacyDest) {
    Remove-Item -Path $legacyDest -Recurse -Force
    Write-Host "Removed legacy folder: $legacyDest" -ForegroundColor Yellow
}
if (Test-Path $dest) {
    Remove-Item -Path $dest -Recurse -Force
}
Copy-Item -Path $source -Destination $dest -Recurse -Force
Write-Host "Installed plugin to: $dest" -ForegroundColor Green

# 3. Windows 시작프로그램에 로컬 릴레이 자동 실행 등록
$relayVbs = Join-Path $dest "relay\start-relay.vbs"
$startupDir = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startupDir "MiraboxKRStockRelay.lnk"

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$relayVbs`""
$shortcut.WorkingDirectory = Split-Path $relayVbs
$shortcut.Description = "Mirabox KR/Global Stock & Macro Local Realtime Relay"
$shortcut.Save()
Write-Host "Registered auto-start relay in Startup folder." -ForegroundColor Green

# 4. 로컬 릴레이 즉시 백그라운드 실행 및 상태 확인
Start-Process "wscript.exe" -ArgumentList "`"$relayVbs`""
Start-Sleep -Seconds 1

try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:18765/health" -TimeoutSec 3
    if ($health.ok) {
        Write-Host "Local realtime relay (v$($health.version)) is RUNNING on http://127.0.0.1:18765" -ForegroundColor Cyan
    }
} catch {
    Write-Host "[참고] 로컬 릴레이 시작 대기 중입니다. 방화벽 알림이 뜨면 허용해 주세요." -ForegroundColor Yellow
}

Write-Host "Please restart Mirabox Stream Dock to load the plugin." -ForegroundColor Cyan
