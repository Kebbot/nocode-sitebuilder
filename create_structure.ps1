# create_structure.ps1
# Windows-only. Creates directories and empty files (using "type nul >").
# Run from project root:  powershell -ExecutionPolicy Bypass -File .\create_structure.ps1

$ErrorActionPreference = "Stop"

# ==== НАСТРОЙКИ: УКAЖИТЕ СВОИ ПАПКИ И ФАЙЛЫ ====
# Примеры на основе вашей структуры — дополняйте/меняйте по необходимости.
$dirs = @(
  "docker\nginx",
  "docker\backend",
  "docker\frontend",
  "tools\scripts",
  "backend\src\controllers",
  "backend\src\routes",
  "backend\src\services",
  "backend\src\models",
  "backend\src\middleware",
  "backend\src\utils",
  "backend\src\config",
  "backend\src\db\migrations",
  "backend\src\uploads",
  "frontend\src\app",
  "frontend\src\components",
  "frontend\src\styles",
  "frontend\src\routes"
)

$files = @(
  ".env.example",
  "docker\nginx\nginx.conf",
  "docker\nginx\Dockerfile",
  "docker\backend\Dockerfile",
  "docker\frontend\Dockerfile",
  "docker-compose.yml",
  "tools\scripts\wait-for-postgres.sh",
  "tools\scripts\seed.sh",
  "backend\package.json",
  "backend\.sequelizerc",
  "backend\src\app.js",
  "backend\src\server.js",
  "backend\src\config\env.js",
  "backend\src\config\database.js",
  "backend\src\db\index.js",
  "backend\src\db\init-models.js",
  "backend\src\routes\index.js",
  "backend\src\routes\auth.routes.js",
  "backend\src\routes\projects.routes.js",
  "backend\src\routes\pages.routes.js",
  "backend\src\routes\elements.routes.js",
  "backend\src\routes\assets.routes.js",
  "backend\src\routes\export.routes.js",
  "backend\src\controllers\auth.controller.js",
  "backend\src\controllers\projects.controller.js",
  "backend\src\controllers\pages.controller.js",
  "backend\src\controllers\elements.controller.js",
  "backend\src\controllers\assets.controller.js",
  "backend\src\controllers\export.controller.js",
  "backend\src\services\auth.service.js",
  "backend\src\services\project.service.js",
  "backend\src\services\page.service.js",
  "backend\src\services\element.service.js",
  "backend\src\services\asset.service.js",
  "backend\src\services\export.service.js",
  "backend\src\models\User.js",
  "backend\src\models\Project.js",
  "backend\src\models\Page.js",
  "backend\src\models\Element.js",
  "backend\src\models\Asset.js",
  "backend\src\middleware\auth.js",
  "backend\src\utils\jwt.js",
  "backend\src\utils\password.js",
  "backend\src\utils\validators.js",
  "backend\src\utils\file.js",
  "backend\src\utils\zip.js",
  "frontend\package.json",
  "frontend\vite.config.js",
  "frontend\index.html",
  "frontend\src\main.jsx",
  "frontend\src\App.jsx",
  "frontend\src\app\store.js",
  "frontend\src\styles\globals.css",
  "README.md"
)

# ==== ФУНКЦИИ ====

function New-DirIfMissing([string]$Path) {
  if (-not [string]::IsNullOrWhiteSpace($Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
    Write-Host "[DIR ] $Path"
  }
}

function New-EmptyFile_TypeNul([string]$Path) {
  $dir = Split-Path -Path $Path -Parent
  if ($dir -and -not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  # Создаём пустой файл через 'type nul >'
  $escaped = $Path.Replace('"', '""')
  $cmd = "type nul > `"$escaped`""

  # Запускаем внутри cmd.exe
  cmd /c $cmd | Out-Null

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Не удалось создать файл: $Path"
  }
  Write-Host "[FILE] $Path (type nul >)"
}

# ==== ОСНОВНОЙ БЛОК ====
Write-Host "== Создаю директории =="
foreach ($d in $dirs) {
  New-DirIfMissing -Path $d
}

Write-Host "== Создаю файлы =="
foreach ($f in $files) {
  New-EmptyFile_TypeNul -Path $f
}

Write-Host "Готово."
