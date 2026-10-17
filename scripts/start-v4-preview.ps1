param([int]$Port = 4181)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
node scripts/package-v4-preview.mjs
if ($LASTEXITCODE -ne 0) { throw 'Review packaging failed.' }
$toolPath = Join-Path $projectRoot '.local/tools/cloudflared.exe'
if (-not (Test-Path -LiteralPath $toolPath)) {
 New-Item -ItemType Directory -Force -Path (Split-Path -Parent $toolPath) | Out-Null
 Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile $toolPath
}
$env:SITE_STATIC_PORT = [string]$Port
$env:SITE_STATIC_ROOT = Join-Path $projectRoot '.local/v4-share'
$server = Start-Process -FilePath 'node.exe' -ArgumentList 'scripts/serve.mjs' -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput '.local/v4-server.log' -RedirectStandardError '.local/v4-server-error.log' -PassThru
$ready = $false
for ($i=0; $i -lt 30; $i++) {
 try { $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/version.json"; if ($response.StatusCode -eq 200) { $ready = $true; break } } catch {}
 Start-Sleep -Milliseconds 200
}
if (-not $ready) { throw 'Review HTTP server did not become ready.' }
$tunnel = Start-Process -FilePath $toolPath -ArgumentList @('tunnel','--url',"http://127.0.0.1:$Port",'--no-autoupdate','--protocol','http2') -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput '.local/v4-tunnel-out.log' -RedirectStandardError '.local/v4-tunnel.log' -PassThru
@{ serverPid=$server.Id; tunnelPid=$tunnel.Id; port=$Port; note='Temporary preview; keep the machine and these processes running.' } | ConvertTo-Json | Set-Content -LiteralPath '.local/v4-preview-processes.json'
Get-Content -LiteralPath '.local/v4-preview-processes.json'
