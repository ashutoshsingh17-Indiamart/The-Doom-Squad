$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'record-sarvam.mjs')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
