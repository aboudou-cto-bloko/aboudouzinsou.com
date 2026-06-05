#!/bin/bash
set -e

VERSION="v1.0.6"
PURCHASE_URL="https://prospecto.aboudouzinsou.site/#acheter"
SITE="https://aboudouzinsou.com"

echo ""
echo "  ◆ Prospecto ${VERSION} — Installation"
echo "  ─────────────────────────────────────────"
echo ""

# ── Prérequis ────────────────────────────────────────────────────────────────

if ! command -v docker &> /dev/null; then
  echo "  ✗ Docker n'est pas installé."
  echo "    → https://docs.docker.com/get-docker/"
  exit 1
fi

if ! docker compose version &> /dev/null 2>&1; then
  echo "  ✗ Docker Compose v2 requis."
  echo "    → https://docs.docker.com/compose/install/"
  exit 1
fi

# ── Fichiers de configuration ─────────────────────────────────────────────────

echo "  Téléchargement de la configuration…"
curl -fsSL "${SITE}/docker-compose.yml" -o docker-compose.yml
curl -fsSL "${SITE}/.env.example"       -o .env.example 2>/dev/null || true
echo "  ✓ docker-compose.yml récupéré"

# ── Fichier .env ──────────────────────────────────────────────────────────────

if [ ! -f .env ]; then
  [ -f .env.example ] && cp .env.example .env || touch .env
  echo "  ✓ .env créé"
fi

# Helper pour écrire dans .env
env_set() {
  local KEY="$1" VAL="$2"
  if grep -q "^${KEY}=" .env 2>/dev/null; then
    sed -i "s|^${KEY}=.*|${KEY}=${VAL}|" .env
  else
    echo "${KEY}=${VAL}" >> .env
  fi
}

# Secrets auto-générés
if ! grep -q "^BETTER_AUTH_SECRET=.\+" .env 2>/dev/null; then
  env_set "BETTER_AUTH_SECRET" "$(openssl rand -hex 32)"
  echo "  ✓ BETTER_AUTH_SECRET généré"
fi

if ! grep -q "^POSTGRES_PASSWORD=.\+" .env 2>/dev/null; then
  env_set "POSTGRES_PASSWORD" "$(openssl rand -hex 16)"
  echo "  ✓ POSTGRES_PASSWORD généré"
fi

# ── Configuration guidée ──────────────────────────────────────────────────────

echo ""
echo "  Configuration"
echo "  ─────────────────────────────────────────"
echo ""

# 1. Clé de license
if ! grep -q "^PROSPECTO_LICENSE=.\+" .env 2>/dev/null; then
  echo "  Clé de license Prospecto"
  echo "  → Acheter sur ${PURCHASE_URL}"
  echo "  (Laisser vide pour configurer plus tard)"
  echo ""
  printf "  License : "
  read -r LICENSE_KEY
  if [ -n "$LICENSE_KEY" ]; then
    env_set "PROSPECTO_LICENSE" "$LICENSE_KEY"
    echo "  ✓ Clé de license enregistrée"
  else
    echo "  ⚠  À renseigner dans .env avant utilisation"
    echo "     → ${PURCHASE_URL}"
  fi
  echo ""
fi

# 2. URL (locale vs production)
printf "  Utilisation en local (localhost) ? [O/n] "
read -r IS_LOCAL
IS_LOCAL="${IS_LOCAL:-O}"

if [[ "$IS_LOCAL" =~ ^[Nn] ]]; then
  echo ""
  echo "  URL publique de l'app (ex: https://crm.mondomaine.com)"
  printf "  URL : "
  read -r APP_URL
  if [ -n "$APP_URL" ]; then
    env_set "BETTER_AUTH_URL"       "$APP_URL"
    env_set "NEXT_PUBLIC_APP_URL"   "$APP_URL"
    echo "  ✓ URL configurée : ${APP_URL}"
  fi
fi

# 3. SMTP (optionnel)
echo ""
printf "  Configurer les notifications email (SMTP) ? [o/N] "
read -r SETUP_SMTP
SETUP_SMTP="${SETUP_SMTP:-N}"

if [[ "$SETUP_SMTP" =~ ^[Oo] ]]; then
  echo ""
  printf "  Serveur SMTP (ex: smtp.gmail.com) : "
  read -r VAL_SMTP_HOST
  printf "  Port (465) : "
  read -r VAL_SMTP_PORT
  VAL_SMTP_PORT="${VAL_SMTP_PORT:-465}"
  printf "  Utilisateur SMTP : "
  read -r VAL_SMTP_USER
  printf "  Mot de passe SMTP : "
  read -rs VAL_SMTP_PASS
  echo ""
  printf "  Adresse expéditeur : "
  read -r VAL_SMTP_FROM

  env_set "SMTP_HOST"  "$VAL_SMTP_HOST"
  env_set "SMTP_PORT"  "$VAL_SMTP_PORT"
  env_set "SMTP_USER"  "$VAL_SMTP_USER"
  env_set "SMTP_PASS"  "$VAL_SMTP_PASS"
  env_set "SMTP_FROM"  "$VAL_SMTP_FROM"
  echo "  ✓ SMTP configuré"
fi

# ── Docker — pull de l'image ──────────────────────────────────────────────────

echo ""
echo "  ─────────────────────────────────────────"
echo ""
echo "  Téléchargement de l'image Docker (${VERSION})…"
PROSPECTO_VERSION="${VERSION}" docker compose pull

# ── Clés VAPID (générées via Node.js de l'image) ─────────────────────────────

if ! grep -q "^VAPID_PUBLIC_KEY=.\+" .env 2>/dev/null; then
  echo ""
  echo "  Génération des clés VAPID (notifications push)…"
  VAPID_JSON=$(docker run --rm \
    "ghcr.io/aboudou-cto-bloko/prospecto:${VERSION}" \
    node -e "const wp=require('web-push');const k=wp.generateVAPIDKeys();process.stdout.write(JSON.stringify(k));" \
    2>/dev/null || echo "")

  if [ -n "$VAPID_JSON" ]; then
    VAPID_PUB=$(echo  "$VAPID_JSON" | grep -o '"publicKey":"[^"]*"'  | cut -d'"' -f4)
    VAPID_PRIV=$(echo "$VAPID_JSON" | grep -o '"privateKey":"[^"]*"' | cut -d'"' -f4)

    if [ -n "$VAPID_PUB" ] && [ -n "$VAPID_PRIV" ]; then
      env_set "VAPID_PUBLIC_KEY"             "$VAPID_PUB"
      env_set "VAPID_PRIVATE_KEY"            "$VAPID_PRIV"
      env_set "NEXT_PUBLIC_VAPID_PUBLIC_KEY" "$VAPID_PUB"
      echo "  ✓ Clés VAPID générées"
    else
      echo "  ⚠  Génération VAPID échouée — notifications push désactivées"
    fi
  else
    echo "  ⚠  Génération VAPID échouée — notifications push désactivées"
  fi
fi

# ── Démarrage ─────────────────────────────────────────────────────────────────

echo ""
echo "  Démarrage de la base de données…"
PROSPECTO_VERSION="${VERSION}" docker compose up -d db

echo "  Migration de la base de données…"
PROSPECTO_VERSION="${VERSION}" docker compose run --rm migrate

echo "  Démarrage de l'application…"
PROSPECTO_VERSION="${VERSION}" docker compose up -d app

# ── Terminé ───────────────────────────────────────────────────────────────────

echo ""
echo "  ─────────────────────────────────────────"
echo "  ✓ Prospecto ${VERSION} est lancé !"
echo ""
echo "  → http://localhost:${PORT:-3000}"
echo ""
if ! grep -q "^PROSPECTO_LICENSE=.\+" .env 2>/dev/null; then
  echo "  ⚠  N'oublie pas ta license : ${PURCHASE_URL}"
  echo ""
fi
echo "  Pour arrêter   : docker compose down"
echo "  Modifier .env  : nano .env  puis  docker compose restart app"
echo ""
