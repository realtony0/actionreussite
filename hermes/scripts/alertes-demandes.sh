#!/usr/bin/env bash
# Tâche planifiée Hermes (sans IA) : signale au propriétaire les nouvelles demandes,
# inscriptions et messages clients du site. N'affiche rien s'il n'y a rien de neuf,
# donc aucune notification vide.
set -euo pipefail
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
# Charge les variables (SUPABASE_*, TELEGRAM_*) si la tâche ne les hérite pas.
if [ -f "$HERMES_HOME/.env" ]; then set -a; . "$HERMES_HOME/.env"; set +a; fi
exec python3 "$HERMES_HOME/skills/actionreussite-demandes/scripts/ar.py" new --quiet "$@"
