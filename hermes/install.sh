#!/usr/bin/env bash
# Copie la configuration Action Réussite dans ~/.hermes (à lancer sur le serveur,
# depuis la racine du repo, APRÈS avoir installé Hermes Agent).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"

command -v hermes >/dev/null || { echo "Installez d'abord Hermes Agent (voir hermes/README.md)."; exit 1; }

mkdir -p "$HERMES_HOME/skills" "$HERMES_HOME/scripts"
cp -r "$HERE/skills/actionreussite-demandes" "$HERE/skills/actionreussite-reponses" "$HERMES_HOME/skills/"
cp "$HERE/scripts/alertes-demandes.sh" "$HERMES_HOME/scripts/"
chmod +x "$HERMES_HOME/scripts/alertes-demandes.sh" "$HERMES_HOME/skills/actionreussite-demandes/scripts/ar.py"

if [ -f "$HERMES_HOME/SOUL.md" ] && ! cmp -s "$HERE/SOUL.md" "$HERMES_HOME/SOUL.md"; then
  cp "$HERMES_HOME/SOUL.md" "$HERMES_HOME/SOUL.md.bak"
  echo "Ancien SOUL.md sauvegardé en SOUL.md.bak"
fi
cp "$HERE/SOUL.md" "$HERMES_HOME/SOUL.md"

touch "$HERMES_HOME/.env"
for var in SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY TELEGRAM_BOT_TOKEN AR_OWNER_TELEGRAM_ID; do
  grep -q "^$var=." "$HERMES_HOME/.env" || echo "⚠️  $var manque dans $HERMES_HOME/.env (voir hermes/env.example)"
done

echo "OK. Étapes suivantes : voir hermes/README.md (gateway, WhatsApp, alertes)."
