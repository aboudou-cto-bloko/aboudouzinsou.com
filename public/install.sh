#!/bin/bash
set -euo pipefail

REPO="aboudou-cto-bloko/prospecto"
PURCHASE_URL="https://prospecto.aboudouzinsou.site/#acheter"
SITE="https://aboudouzinsou.com"
REGISTRY="ghcr.io/aboudou-cto-bloko/prospecto"

# ── Couleurs & styles ─────────────────────────────────────────────────────────
G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'
C='\033[0;36m'; B='\033[1;34m'; D='\033[2m'; NC='\033[0m'; BOLD='\033[1m'

ok()   { echo -e "  ${G}✔${NC}  $*"; }
err()  { echo -e "\n  ${R}✖  $*${NC}" >&2; exit 1; }
warn() { echo -e "  ${Y}⚠  ${NC}$*"; }
info() { echo -e "  ${D}$*${NC}"; }
step() { echo -e "\n  ${B}▸${NC} ${BOLD}$*${NC}"; }

# ── Spinner ───────────────────────────────────────────────────────────────────
SPIN_PID=""
spin_start() {
  local msg="$1"
  (
    local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local i=0
    while true; do
      printf "\r  ${C}%s${NC}  %s " "${frames[$((i % 10))]}" "$msg"
      i=$((i+1)); sleep 0.08
    done
  ) &
  SPIN_PID=$!
  disown "$SPIN_PID" 2>/dev/null || true
}

spin_stop() {
  local label="${1:-}"
  if [ -n "$SPIN_PID" ]; then
    kill "$SPIN_PID" 2>/dev/null || true
    wait "$SPIN_PID" 2>/dev/null || true
    SPIN_PID=""
  fi
  printf "\r\033[K"
  [ -n "$label" ] && ok "$label"
}

run_spin() {
  local msg="$1"; shift
  spin_start "$msg"
  if "$@" >/dev/null 2>&1; then
    spin_stop "$msg"
  else
    spin_stop
    err "Échec : $msg"
  fi
}

# ── Helpers .env ──────────────────────────────────────────────────────────────
env_set() {
  local KEY="$1" VAL="$2"
  if grep -q "^${KEY}=" .env 2>/dev/null; then
    sed -i "s|^${KEY}=.*|${KEY}=${VAL}|" .env
  else
    printf '%s=%s\n' "$KEY" "$VAL" >> .env
  fi
}
env_get() { grep "^${1}=.\+" .env 2>/dev/null | cut -d= -f2- || true; }
gen_secret() {
  local n="${1:-32}"
  if command -v openssl &>/dev/null; then openssl rand -hex "$n"
  else head -c "$n" /dev/urandom | od -An -tx1 | tr -d ' \n' | head -c $((n*2)); fi
}

# ─────────────────────────────────────────────────────────────────────────────
#  DÉBUT
# ─────────────────────────────────────────────────────────────────────────────

clear

echo ""
echo -e "  ${BOLD}◆  PROSPECTO${NC}"
echo -e "  ${D}CRM WhatsApp auto-hébergé pour les pros africains${NC}"
echo ""
echo -e "  ─────────────────────────────────────────────"

# ── Version ───────────────────────────────────────────────────────────────────
spin_start "Récupération de la dernière version…"
VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
  | grep '"tag_name"' | head -1 | cut -d'"' -f4 || true)
spin_stop
[ -z "$VERSION" ] && err "Impossible de contacter GitHub. Vérifie ta connexion."
DOCKER_VERSION="${VERSION#v}"

UPDATE_MODE=false
{ [ -f .env ] && [ -f docker-compose.yml ]; } && UPDATE_MODE=true

if $UPDATE_MODE; then
  echo -e "  ${G}Mise à jour${NC} vers ${BOLD}${VERSION}${NC}"
else
  echo -e "  Installation de ${BOLD}${VERSION}${NC}"
fi
echo -e "  ─────────────────────────────────────────────"
echo ""

# ── Prérequis ─────────────────────────────────────────────────────────────────
step "Vérification des prérequis"
command -v docker &>/dev/null          || err "Docker non installé → https://docs.docker.com/get-docker/"
docker compose version &>/dev/null 2>&1 || err "Docker Compose v2 requis → https://docs.docker.com/compose/install/"
ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1) détecté"

# ── Téléchargement ────────────────────────────────────────────────────────────
step "Téléchargement de la configuration"
run_spin "Récupération de docker-compose.yml…" curl -fsSL "${SITE}/docker-compose.yml" -o docker-compose.yml
curl -fsSL "${SITE}/.env.example" -o .env.example 2>/dev/null || true
ok "Configuration récupérée"

[ ! -f .env ] && { [ -f .env.example ] && cp .env.example .env || touch .env; }

# ── Secrets ───────────────────────────────────────────────────────────────────
[ -z "$(env_get BETTER_AUTH_SECRET)" ] && env_set "BETTER_AUTH_SECRET" "$(gen_secret 32)"
[ -z "$(env_get POSTGRES_PASSWORD)"  ] && env_set "POSTGRES_PASSWORD"  "$(gen_secret 16)"

# ── Configuration guidée ──────────────────────────────────────────────────────
if ! $UPDATE_MODE; then
  step "Configuration"
  echo ""

  # License
  if [ -z "$(env_get PROSPECTO_LICENSE)" ]; then
    echo -e "  ${BOLD}Clé de license${NC}"
    echo -e "  ${D}Achète sur ${PURCHASE_URL}${NC}"
    echo -e "  ${D}(Laisse vide pour configurer plus tard)${NC}"
    echo ""
    printf "  → License : "
    read -r LICENSE_KEY
    if [ -n "$LICENSE_KEY" ]; then
      env_set "PROSPECTO_LICENSE" "$LICENSE_KEY"
      ok "Clé de license enregistrée"
    else
      warn "Tu devras renseigner la license dans .env"
    fi
    echo ""
  fi

  # URL
  printf "  Utilisation en local seulement ? [O/n] "
  read -r IS_LOCAL; IS_LOCAL="${IS_LOCAL:-O}"
  if [[ "$IS_LOCAL" =~ ^[Nn] ]]; then
    echo ""
    printf "  URL de ton serveur (ex: https://crm.tondomaine.com) : "
    read -r APP_URL
    if [ -n "$APP_URL" ]; then
      env_set "BETTER_AUTH_URL"     "$APP_URL"
      env_set "NEXT_PUBLIC_APP_URL" "$APP_URL"
      ok "URL configurée"
    fi
  fi

  # SMTP
  echo ""
  printf "  Configurer les emails de notification ? [o/N] "
  read -r SETUP_SMTP; SETUP_SMTP="${SETUP_SMTP:-N}"
  if [[ "$SETUP_SMTP" =~ ^[Oo] ]]; then
    echo ""
    printf "  Serveur SMTP (ex: mail.tondomaine.com) : "; read -r V_HOST
    printf "  Port [465] : ";                             read -r V_PORT; V_PORT="${V_PORT:-465}"
    printf "  Adresse email SMTP : ";                     read -r V_USER
    printf "  Mot de passe : ";                           read -rs V_PASS; echo ""
    printf "  Nom expéditeur (ex: Prospecto <no-reply@tondomaine.com>) : "; read -r V_FROM
    env_set "SMTP_HOST"   "$V_HOST"
    env_set "SMTP_PORT"   "$V_PORT"
    env_set "SMTP_SECURE" "$([ "$V_PORT" = "465" ] && echo true || echo false)"
    env_set "SMTP_USER"   "$V_USER"
    env_set "SMTP_PASS"   "$V_PASS"
    env_set "SMTP_FROM"   "$V_FROM"
    ok "SMTP configuré"
  fi
fi

# ── Docker pull ───────────────────────────────────────────────────────────────
echo ""
step "Téléchargement de Prospecto ${VERSION}"
echo -e "  ${D}Cela peut prendre quelques minutes selon ta connexion…${NC}"
echo ""
spin_start "Téléchargement de l'image Docker…"
PROSPECTO_VERSION="${DOCKER_VERSION}" docker compose pull >/dev/null 2>&1
spin_stop "Image Docker téléchargée"

# ── VAPID ─────────────────────────────────────────────────────────────────────
if [ -z "$(env_get VAPID_PUBLIC_KEY)" ]; then
  spin_start "Génération des clés de notifications…"
  VAPID_JSON=$(docker run --rm "${REGISTRY}:${DOCKER_VERSION}" \
    node -e "const w=require('web-push');const k=w.generateVAPIDKeys();process.stdout.write(JSON.stringify(k));" \
    2>/dev/null || true)
  PUB=$(echo  "$VAPID_JSON" | grep -o '"publicKey":"[^"]*"'  | cut -d'"' -f4 || true)
  PRIV=$(echo "$VAPID_JSON" | grep -o '"privateKey":"[^"]*"' | cut -d'"' -f4 || true)
  if [ -n "$PUB" ] && [ -n "$PRIV" ]; then
    env_set "VAPID_PUBLIC_KEY"             "$PUB"
    env_set "VAPID_PRIVATE_KEY"            "$PRIV"
    env_set "NEXT_PUBLIC_VAPID_PUBLIC_KEY" "$PUB"
    spin_stop "Clés de notifications générées"
  else
    spin_stop
    warn "Notifications push désactivées (génération échouée)"
  fi
fi

# ── Démarrage ─────────────────────────────────────────────────────────────────
echo ""
step "Démarrage de Prospecto"
echo ""

spin_start "Démarrage de la base de données…"
PROSPECTO_VERSION="${DOCKER_VERSION}" docker compose up -d db >/dev/null 2>&1
spin_stop "Base de données prête"

spin_start "Migration de la base de données…"
PROSPECTO_VERSION="${DOCKER_VERSION}" docker compose run --rm migrate >/dev/null 2>&1
spin_stop "Base de données migrée"

spin_start "Démarrage de l'application…"
PROSPECTO_VERSION="${DOCKER_VERSION}" docker compose up -d app >/dev/null 2>&1
spin_stop "Application démarrée"

# ── Terminé ───────────────────────────────────────────────────────────────────
echo ""
echo -e "  ─────────────────────────────────────────────"
echo -e "  ${G}${BOLD}✔  Prospecto ${VERSION} est prêt !${NC}"
echo -e "  ─────────────────────────────────────────────"
echo ""
echo -e "  ${BOLD}→  http://localhost:${PORT:-3000}${NC}"
echo ""

if [ -z "$(env_get PROSPECTO_LICENSE)" ]; then
  warn "License manquante — l'app sera limitée"
  echo -e "  ${D}  Achète sur ${PURCHASE_URL}${NC}"
  echo ""
fi

echo -e "  ${D}Arrêter        :${NC}  docker compose down"
echo -e "  ${D}Mettre à jour  :${NC}  curl -fsSL ${SITE}/install.sh | bash"
echo -e "  ${D}Modifier .env  :${NC}  nano .env  →  docker compose restart app"
echo ""
