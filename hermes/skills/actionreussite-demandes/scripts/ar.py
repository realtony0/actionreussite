#!/usr/bin/env python3
"""Outil en ligne de commande pour gérer les demandes du site Action Réussite.

Utilisé par le skill Hermes « actionreussite-demandes ». Aucune dépendance :
uniquement la bibliothèque standard Python.

Variables d'environnement (dans ~/.hermes/.env) :
  SUPABASE_URL               ex. https://xxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY  clé service_role (Supabase > Project Settings > API)
  TELEGRAM_BOT_TOKEN         (optionnel, pour `notify`)
  AR_OWNER_TELEGRAM_ID       (optionnel, pour `notify`) ID Telegram du proprio

Exemples :
  ar.py list --status en_attente --limit 10
  ar.py show <id-ou-début-d-id>
  ar.py status <id> en_cours
  ar.py reply <id> "Bonjour, ..."
  ar.py new            # nouvelles demandes / inscrits / messages depuis le dernier appel
  ar.py stats
  ar.py settings       # prix, session, contacts affichés sur le site
  ar.py notify "texte" # envoie un message Telegram au proprio
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

STATUSES = ("en_attente", "en_cours", "traite")
STATUS_LABEL = {"en_attente": "⏳ En attente", "en_cours": "🔄 En cours", "traite": "✅ Traité"}
STATE_FILE = Path(
    os.environ.get("AR_STATE_FILE")
    or Path(os.environ.get("HERMES_HOME", Path.home() / ".hermes")) / "actionreussite-state.json"
)


# ---------------------------------------------------------------- Supabase REST

def _env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        sys.exit(f"Erreur : la variable {name} n'est pas définie (voir ~/.hermes/.env).")
    return value


def api(method: str, table: str, params: dict | None = None, body=None, prefer: str | None = None):
    base = _env("SUPABASE_URL").rstrip("/")
    key = _env("SUPABASE_SERVICE_ROLE_KEY")
    url = f"{base}/rest/v1/{table}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        sys.exit(f"Erreur Supabase {e.code} : {e.read().decode()[:500]}")
    except urllib.error.URLError as e:
        sys.exit(f"Erreur réseau vers Supabase : {e.reason}")


def resolve_request(ref: str) -> dict:
    """Accepte un UUID complet ou ses premiers caractères (ex. 8 premiers)."""
    ref = ref.strip().lower()
    if len(ref) == 36:
        rows = api("GET", "requests", {"select": "*", "id": f"eq.{ref}"})
    else:
        # PostgREST ne filtre pas un uuid avec LIKE : on cherche dans les 500 dernières.
        rows = [
            r for r in api("GET", "requests", {"select": "*", "order": "created_at.desc", "limit": "500"})
            if r["id"].startswith(ref)
        ]
    if not rows:
        sys.exit(f"Aucune demande trouvée pour « {ref} ».")
    if len(rows) > 1:
        sys.exit(f"« {ref} » correspond à {len(rows)} demandes, donnez plus de caractères.")
    return rows[0]


# ---------------------------------------------------------------- Formatage

def fmt_date(iso: str | None) -> str:
    if not iso:
        return "?"
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%d/%m/%Y %H:%M")
    except ValueError:
        return iso


def fmt_request(r: dict, full: bool = False) -> str:
    lines = [
        f"#{r['id'][:8]} · {STATUS_LABEL.get(r.get('status'), r.get('status'))} · {fmt_date(r.get('created_at'))}",
        f"  {r.get('user_name') or '(sans nom)'} <{r.get('user_email') or '?'}>",
        f"  Type : {r.get('type')} · Destination : {r.get('destination') or '-'}",
        f"  Objet : {r.get('subject')}",
    ]
    msg = (r.get("message") or "").strip()
    if msg:
        lines.append(f"  Message : {msg if full else (msg[:160] + ('…' if len(msg) > 160 else ''))}")
    return "\n".join(lines)


# ---------------------------------------------------------------- Commandes

def cmd_list(a):
    params = {"select": "*", "order": "created_at.desc", "limit": str(a.limit)}
    if a.status:
        params["status"] = f"eq.{a.status}"
    if a.type:
        params["type"] = f"eq.{a.type}"
    if a.destination:
        params["destination"] = f"ilike.*{a.destination}*"
    if a.search:
        s = a.search.replace(",", " ")
        params["or"] = f"(user_name.ilike.*{s}*,user_email.ilike.*{s}*,subject.ilike.*{s}*)"
    rows = api("GET", "requests", params)
    if not rows:
        print("Aucune demande.")
        return
    print(f"{len(rows)} demande(s) :\n")
    print("\n\n".join(fmt_request(r) for r in rows))


def cmd_show(a):
    r = resolve_request(a.id)
    print(fmt_request(r, full=True))
    if r.get("user_id"):
        prof = api("GET", "profiles", {"select": "phone,destination,created_at", "id": f"eq.{r['user_id']}"})
        if prof:
            print(f"  Téléphone : {prof[0].get('phone') or '-'} · Inscrit le {fmt_date(prof[0].get('created_at'))}")
    msgs = api("GET", "messages", {"select": "*", "request_id": f"eq.{r['id']}", "order": "created_at.asc"})
    print(f"\nConversation ({len(msgs)} message(s)) :")
    for m in msgs:
        who = "🏢 Équipe" if m.get("is_admin") else f"👤 {m.get('from_name') or 'Client'}"
        print(f"  [{fmt_date(m.get('created_at'))}] {who} : {m.get('content')}")


def cmd_status(a):
    r = resolve_request(a.id)
    api("PATCH", "requests", {"id": f"eq.{r['id']}"}, {"status": a.status}, prefer="return=minimal")
    print(f"Demande #{r['id'][:8]} ({r.get('user_name')}) → {STATUS_LABEL[a.status]}")


def cmd_reply(a):
    r = resolve_request(a.id)
    if not r.get("user_id"):
        sys.exit("Cette demande n'est liée à aucun compte client : impossible de répondre sur le site.")
    api("POST", "messages", body={
        "request_id": r["id"],
        "from_user_id": "admin",
        "from_name": "Équipe Action Réussite",
        "to_user_id": r["user_id"],
        "to_name": r.get("user_name") or "",
        "content": a.message,
        "is_admin": True,
        "read": False,
    }, prefer="return=minimal")
    # Même comportement que le tableau de bord admin du site.
    if r.get("status") == "en_attente":
        api("PATCH", "requests", {"id": f"eq.{r['id']}"}, {"status": "en_cours"}, prefer="return=minimal")
    print(f"Réponse envoyée à {r.get('user_name')} (demande #{r['id'][:8]}). Visible dans son espace client.")


def _load_state() -> dict:
    try:
        return json.loads(STATE_FILE.read_text())
    except (OSError, ValueError):
        return {}


def cmd_new(a):
    state = _load_state()
    now = datetime.now(timezone.utc).isoformat()
    since = state.get("last_check")
    if not since:
        # Premier lancement : on mémorise l'instant sans tout renvoyer.
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(json.dumps({"last_check": now}))
        if not a.quiet:
            print("Surveillance initialisée. Les prochaines nouveautés seront signalées.")
        return

    reqs = api("GET", "requests", {"select": "*", "created_at": f"gt.{since}", "order": "created_at.asc"})
    users = api("GET", "profiles", {"select": "first_name,last_name,email,phone,destination,created_at",
                                    "created_at": f"gt.{since}", "order": "created_at.asc"})
    msgs = api("GET", "messages", {"select": "*", "created_at": f"gt.{since}", "is_admin": "eq.false",
                                   "order": "created_at.asc"})

    out = []
    for r in reqs:
        out.append("🆕 Nouvelle demande\n" + fmt_request(r))
    for u in users:
        out.append(f"👤 Nouvel inscrit : {u.get('first_name')} {u.get('last_name')} <{u.get('email')}>"
                   f" · {u.get('phone') or '-'} · {u.get('destination') or '-'}")
    for m in msgs:
        out.append(f"💬 Message de {m.get('from_name') or 'un client'} (demande #{str(m.get('request_id'))[:8]}) :\n"
                   f"  {m.get('content')}")

    if not a.dry_run:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(json.dumps({"last_check": now}))

    if out:
        text = "\n\n".join(out)
        print(text)
        if a.send:
            _telegram(text)
    elif not a.quiet:
        print("Rien de nouveau.")


def cmd_stats(a):
    rows = api("GET", "requests", {"select": "status,type,destination,created_at", "limit": "5000"})
    nb_users = len(api("GET", "profiles", {"select": "id", "limit": "5000"}))
    by_status, by_type, by_dest = {}, {}, {}
    for r in rows:
        by_status[r["status"]] = by_status.get(r["status"], 0) + 1
        by_type[r["type"]] = by_type.get(r["type"], 0) + 1
        d = r.get("destination") or "-"
        by_dest[d] = by_dest.get(d, 0) + 1
    print(f"Inscrits : {nb_users} · Demandes : {len(rows)}")
    print("Par statut : " + ", ".join(f"{STATUS_LABEL.get(k, k)} {v}" for k, v in by_status.items()))
    print("Par type : " + ", ".join(f"{k} {v}" for k, v in sorted(by_type.items(), key=lambda x: -x[1])))
    print("Par destination : " + ", ".join(f"{k} {v}" for k, v in sorted(by_dest.items(), key=lambda x: -x[1])))


def cmd_settings(a):
    rows = api("GET", "site_settings", {"select": "settings", "id": "eq.1"})
    s = rows[0]["settings"] if rows else {}
    keys = ["formationPrix", "formationSession", "heroBadge", "contactPhone", "contactAddress",
            "contactWhatsapp", "statEtudiants", "statAnnees", "statPays"]
    for k in keys:
        if k in s:
            print(f"{k} : {s[k]}")


def _telegram(text: str):
    token = _env("TELEGRAM_BOT_TOKEN")
    chat = os.environ.get("AR_OWNER_TELEGRAM_ID") or os.environ.get("TELEGRAM_HOME_CHANNEL") or ""
    if not chat:
        sys.exit("Erreur : définissez AR_OWNER_TELEGRAM_ID (ou TELEGRAM_HOME_CHANNEL).")
    for i in range(0, len(text), 4000):  # limite Telegram : 4096 caractères
        body = urllib.parse.urlencode({"chat_id": chat, "text": text[i:i + 4000]}).encode()
        try:
            urllib.request.urlopen(f"https://api.telegram.org/bot{token}/sendMessage", body, timeout=30)
        except urllib.error.HTTPError as e:
            sys.exit(f"Erreur Telegram {e.code} : {e.read().decode()[:300]}")


def cmd_notify(a):
    _telegram(a.message)
    print("Message envoyé au propriétaire sur Telegram.")


def main():
    p = argparse.ArgumentParser(description="Gestion des demandes Action Réussite")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("list", help="lister les demandes")
    s.add_argument("--status", choices=STATUSES)
    s.add_argument("--type", choices=("contact", "formation", "consultation", "destination"))
    s.add_argument("--destination")
    s.add_argument("--search", help="nom, email ou objet")
    s.add_argument("--limit", type=int, default=10)
    s.set_defaults(func=cmd_list)

    s = sub.add_parser("show", help="détail + conversation")
    s.add_argument("id")
    s.set_defaults(func=cmd_show)

    s = sub.add_parser("status", help="changer le statut")
    s.add_argument("id")
    s.add_argument("status", choices=STATUSES)
    s.set_defaults(func=cmd_status)

    s = sub.add_parser("reply", help="répondre au client dans son espace sur le site")
    s.add_argument("id")
    s.add_argument("message")
    s.set_defaults(func=cmd_reply)

    s = sub.add_parser("new", help="nouveautés depuis le dernier appel")
    s.add_argument("--send", action="store_true", help="envoyer aussi sur Telegram au proprio")
    s.add_argument("--quiet", action="store_true", help="ne rien afficher s'il n'y a rien")
    s.add_argument("--dry-run", action="store_true", help="ne pas avancer le curseur")
    s.set_defaults(func=cmd_new)

    sub.add_parser("stats", help="statistiques").set_defaults(func=cmd_stats)
    sub.add_parser("settings", help="infos affichées sur le site").set_defaults(func=cmd_settings)

    s = sub.add_parser("notify", help="envoyer un message Telegram au proprio")
    s.add_argument("message")
    s.set_defaults(func=cmd_notify)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
