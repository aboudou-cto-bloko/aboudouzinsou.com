#Requires -Version 5.1
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$REPO         = "aboudou-cto-bloko/prospecto"
$PURCHASE_URL = "https://prospecto.aboudouzinsou.site/#acheter"
$SITE         = "https://aboudouzinsou.com"
$REGISTRY     = "ghcr.io/aboudou-cto-bloko/prospecto"

# ── Affichage ─────────────────────────────────────────────────────────────────
function ok   { param($m) Write-Host "  [OK]  $m" -ForegroundColor Green }
function fail { param($m) Write-Host "`n  [X]   $m" -ForegroundColor Red; exit 1 }
function warn { param($m) Write-Host "  [!]   $m" -ForegroundColor Yellow }
function info { param($m) Write-Host "  $m" -ForegroundColor DarkGray }
function step { param($m) Write-Host "`n  >> $m" -ForegroundColor Cyan }

# ── Spinner ───────────────────────────────────────────────────────────────────
$script:SpinJob = $null

function Start-Spin {
  param([string]$Message)
  $script:SpinJob = Start-Job -ScriptBlock {
    param($msg)
    $frames = @('|','/','-','\')
    $i = 0
    while ($true) {
      $f = $frames[$i % 4]
      Write-Host "`r  $f  $msg   " -NoNewline
      Start-Sleep -Milliseconds 100
      $i++
    }
  } -ArgumentList $Message
}

function Stop-Spin {
  param([string]$Label = "")
  if ($script:SpinJob) {
    Stop-Job  $script:SpinJob -ErrorAction SilentlyContinue
    Remove-Job $script:SpinJob -ErrorAction SilentlyContinue
    $script:SpinJob = $null
  }
  Write-Host "`r                                                  `r" -NoNewline
  if ($Label) { ok $Label }
}

function Invoke-Spin {
  param([string]$Message, [scriptblock]$Action)
  Start-Spin $Message
  try {
    & $Action 2>&1 | Out-Null
    Stop-Spin $Message
  } catch {
    Stop-Spin
    fail "Echec : $Message - $_"
  }
}

# ── Helpers .env ──────────────────────────────────────────────────────────────
function Set-EnvVar {
  param([string]$Key, [string]$Val)
  $lines = if (Test-Path ".env") { Get-Content ".env" } else { @() }
  $found = $false
  $lines = $lines | ForEach-Object {
    if ($_ -match "^$([regex]::Escape($Key))=") { $found = $true; "$Key=$Val" } else { $_ }
  }
  if (-not $found) { $lines += "$Key=$Val" }
  $lines | Set-Content ".env" -Encoding UTF8
}

function Get-EnvVar {
  param([string]$Key)
  if (-not (Test-Path ".env")) { return $null }
  $line = Get-Content ".env" | Where-Object { $_ -match "^$([regex]::Escape($Key))=.+" } | Select-Object -First 1
  if ($line) { return ($line -split '=', 2)[1] }
  return $null
}

function New-Secret {
  param([int]$Bytes = 32)
  $buf = [byte[]]::new($Bytes)
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buf)
  return -join ($buf | ForEach-Object { $_.ToString("x2") })
}

# ─────────────────────────────────────────────────────────────────────────────
#  DEBUT
# ─────────────────────────────────────────────────────────────────────────────

Clear-Host

Write-Host ""
Write-Host "  PROSPECTO" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "  CRM WhatsApp auto-heberge pour les pros africains" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  -----------------------------------------"

# ── Version ───────────────────────────────────────────────────────────────────
Start-Spin "Recuperation de la derniere version..."
try {
  $rel = Invoke-RestMethod "https://api.github.com/repos/$REPO/releases/latest"
  $VERSION = $rel.tag_name
} catch {
  Stop-Spin
  fail "Impossible de contacter GitHub. Verifie ta connexion."
}
Stop-Spin
$DOCKER_VERSION = $VERSION -replace '^v', ''

$UPDATE_MODE = (Test-Path ".env") -and (Test-Path "docker-compose.yml")

if ($UPDATE_MODE) {
  Write-Host "  Mise a jour vers $VERSION" -ForegroundColor Green
} else {
  Write-Host "  Installation de $VERSION" -ForegroundColor Green
}
Write-Host "  -----------------------------------------"
Write-Host ""

# ── Prerequis ─────────────────────────────────────────────────────────────────
step "Verification des prerequis"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  fail "Docker Desktop non installe.`n  -> https://docs.docker.com/desktop/windows/"
}
try { docker compose version 2>&1 | Out-Null } catch { fail "Docker Compose v2 requis." }
$dv = (docker --version) -replace '.*?(\d+\.\d+\.\d+).*','$1'
ok "Docker $dv detecte"

# ── Telechargement ────────────────────────────────────────────────────────────
step "Telechargement de la configuration"
Invoke-Spin "Recuperation de docker-compose.yml..." {
  Invoke-WebRequest "$SITE/docker-compose.yml" -OutFile "docker-compose.yml" -UseBasicParsing
  try { Invoke-WebRequest "$SITE/.env.example" -OutFile ".env.example" -UseBasicParsing } catch {}
}
ok "Configuration recuperee"

if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") { Copy-Item ".env.example" ".env" }
  else { New-Item ".env" -ItemType File | Out-Null }
}

# ── Secrets ───────────────────────────────────────────────────────────────────
if (-not (Get-EnvVar "BETTER_AUTH_SECRET")) { Set-EnvVar "BETTER_AUTH_SECRET" (New-Secret 32) }
if (-not (Get-EnvVar "POSTGRES_PASSWORD"))  { Set-EnvVar "POSTGRES_PASSWORD"  (New-Secret 16) }

# ── Configuration guidee ──────────────────────────────────────────────────────
if (-not $UPDATE_MODE) {
  step "Configuration"
  Write-Host ""

  # License
  if (-not (Get-EnvVar "PROSPECTO_LICENSE")) {
    Write-Host "  Cle de license Prospecto" -ForegroundColor White
    Write-Host "  Achete sur $PURCHASE_URL" -ForegroundColor DarkGray
    Write-Host "  (Laisse vide pour configurer plus tard)" -ForegroundColor DarkGray
    Write-Host ""
    $LICENSE_KEY = Read-Host "  -> License"
    if ($LICENSE_KEY) {
      Set-EnvVar "PROSPECTO_LICENSE" $LICENSE_KEY
      ok "Cle de license enregistree"
    } else {
      warn "A renseigner dans .env avant utilisation"
    }
    Write-Host ""
  }

  # URL
  $IS_LOCAL = Read-Host "  Utilisation en local seulement ? [O/n]"
  if ($IS_LOCAL -match '^[Nn]') {
    Write-Host ""
    $APP_URL = Read-Host "  URL de ton serveur (ex: https://crm.tondomaine.com)"
    if ($APP_URL) {
      Set-EnvVar "BETTER_AUTH_URL"     $APP_URL
      Set-EnvVar "NEXT_PUBLIC_APP_URL" $APP_URL
      ok "URL configuree"
    }
  }

  # SMTP
  Write-Host ""
  $SETUP_SMTP = Read-Host "  Configurer les emails de notification ? [o/N]"
  if ($SETUP_SMTP -match '^[Oo]') {
    Write-Host ""
    $V_HOST = Read-Host "  Serveur SMTP (ex: mail.tondomaine.com)"
    $V_PORT = Read-Host "  Port [465]"
    if (-not $V_PORT) { $V_PORT = "465" }
    $V_USER    = Read-Host "  Adresse email SMTP"
    $V_PASS_S  = Read-Host "  Mot de passe" -AsSecureString
    $V_PASS    = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                   [Runtime.InteropServices.Marshal]::SecureStringToBSTR($V_PASS_S))
    $V_FROM    = Read-Host "  Expediteur (ex: Prospecto <no-reply@tondomaine.com>)"
    $SECURE    = if ($V_PORT -eq "465") { "true" } else { "false" }
    Set-EnvVar "SMTP_HOST"   $V_HOST
    Set-EnvVar "SMTP_PORT"   $V_PORT
    Set-EnvVar "SMTP_SECURE" $SECURE
    Set-EnvVar "SMTP_USER"   $V_USER
    Set-EnvVar "SMTP_PASS"   $V_PASS
    Set-EnvVar "SMTP_FROM"   $V_FROM
    ok "SMTP configure"
  }
}

# ── Docker pull ───────────────────────────────────────────────────────────────
step "Telechargement de Prospecto $VERSION"
Write-Host "  Cela peut prendre quelques minutes selon ta connexion..." -ForegroundColor DarkGray
Write-Host ""

Write-Progress -Activity "Prospecto $VERSION" -Status "Telechargement de l'image Docker..." -PercentComplete 10
$env:PROSPECTO_VERSION = $DOCKER_VERSION
docker compose pull 2>&1 | Out-Null
Write-Progress -Activity "Prospecto $VERSION" -Status "Image telechargee" -PercentComplete 40
ok "Image Docker telechargee"

# ── VAPID ─────────────────────────────────────────────────────────────────────
if (-not (Get-EnvVar "VAPID_PUBLIC_KEY")) {
  Write-Progress -Activity "Prospecto $VERSION" -Status "Generation des cles de notifications..." -PercentComplete 50
  try {
    $VAPID_JSON = docker run --rm "${REGISTRY}:${DOCKER_VERSION}" `
      node -e "const w=require('web-push');const k=w.generateVAPIDKeys();process.stdout.write(JSON.stringify(k));" 2>$null
    $vapid = $VAPID_JSON | ConvertFrom-Json
    if ($vapid.publicKey -and $vapid.privateKey) {
      Set-EnvVar "VAPID_PUBLIC_KEY"             $vapid.publicKey
      Set-EnvVar "VAPID_PRIVATE_KEY"            $vapid.privateKey
      Set-EnvVar "NEXT_PUBLIC_VAPID_PUBLIC_KEY" $vapid.publicKey
      ok "Cles de notifications generees"
    } else { warn "Notifications push desactivees" }
  } catch { warn "Notifications push desactivees" }
}

# ── Demarrage ─────────────────────────────────────────────────────────────────
step "Demarrage de Prospecto"
Write-Host ""

Write-Progress -Activity "Prospecto $VERSION" -Status "Demarrage de la base de donnees..." -PercentComplete 60
docker compose up -d db 2>&1 | Out-Null
ok "Base de donnees prete"

Write-Progress -Activity "Prospecto $VERSION" -Status "Migration de la base de donnees..." -PercentComplete 75
docker compose run --rm migrate 2>&1 | Out-Null
ok "Base de donnees migree"

Write-Progress -Activity "Prospecto $VERSION" -Status "Demarrage de l'application..." -PercentComplete 90
docker compose up -d app 2>&1 | Out-Null
ok "Application demarree"

Write-Progress -Activity "Prospecto $VERSION" -Completed

# ── Termine ───────────────────────────────────────────────────────────────────
$PORT = if ($env:PORT) { $env:PORT } else { "3000" }

Write-Host ""
Write-Host "  -----------------------------------------"
Write-Host "  Prospecto $VERSION est pret !" -ForegroundColor Green
Write-Host "  -----------------------------------------"
Write-Host ""
Write-Host "  ->  http://localhost:$PORT" -ForegroundColor White
Write-Host ""

if (-not (Get-EnvVar "PROSPECTO_LICENSE")) {
  warn "License manquante - l'app sera limitee"
  Write-Host "      Achete sur $PURCHASE_URL" -ForegroundColor DarkGray
  Write-Host ""
}

Write-Host "  Arreter        :  docker compose down" -ForegroundColor DarkGray
Write-Host "  Mettre a jour  :  irm $SITE/install.ps1 | iex" -ForegroundColor DarkGray
Write-Host "  Modifier .env  :  notepad .env  puis  docker compose restart app" -ForegroundColor DarkGray
Write-Host ""
