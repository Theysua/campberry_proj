$ErrorActionPreference = 'Stop'

$root = 'C:\campberry_proj'
$log = Join-Path $root '.runlogs\railway-seed.log'

New-Item -ItemType Directory -Force -Path (Join-Path $root '.runlogs') | Out-Null
if (Test-Path $log) {
  Remove-Item $log -Force
}

$url = (Get-Content (Join-Path $root '.env.pg.remote') -Raw).Trim()
if ($url -notmatch '\?') {
  $url = "${url}?sslmode=require"
} elseif ($url -notmatch 'sslmode=') {
  $url = "${url}&sslmode=require"
}

$env:DATABASE_URL = $url
Set-Location (Join-Path $root 'campberry_backend')
npm.cmd run db:seed *> $log
