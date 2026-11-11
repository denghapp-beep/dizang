# 本機預覽伺服器：使用 Windows 內建 PowerShell，不需安裝任何軟體。關閉視窗即停止。
$root = Split-Path -Parent $PSScriptRoot
$port = 8000
$listener = New-Object System.Net.HttpListener
while ($true) {
  try { $listener.Prefixes.Clear(); $listener.Prefixes.Add("http://localhost:$port/"); $listener.Start(); break }
  catch { $port++; if ($port -gt 8020) { Write-Host "找不到可用的連接埠"; Read-Host; exit } $listener = New-Object System.Net.HttpListener }
}
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.json'='application/json'; '.svg'='image/svg+xml'; '.webp'='image/webp'; '.png'='image/png'; '.jpg'='image/jpeg'; '.woff2'='font/woff2'; '.otf'='font/otf'; '.txt'='text/plain; charset=utf-8'; '.md'='text/plain; charset=utf-8' }
$url = "http://localhost:$port/fusion/index.html"
Write-Host "網站已開啟：$url"
Write-Host "關閉此視窗即停止預覽。"
Start-Process $url
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = [System.IO.Path]::GetFullPath((Join-Path $root $path))
    if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) { $ctx.Response.StatusCode = 404; $bytes = [Text.Encoding]::UTF8.GetBytes('Not found') }
    else { $ext = [System.IO.Path]::GetExtension($file).ToLower(); if ($types.ContainsKey($ext)) { $ctx.Response.ContentType = $types[$ext] }; $bytes = [System.IO.File]::ReadAllBytes($file) }
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {} finally { $ctx.Response.OutputStream.Close() }
}
