---
name: actionreussite-demandes
description: Consulter, traiter et répondre aux demandes, inscriptions et messages du site Action Réussite (base Supabase). À utiliser quand le propriétaire demande « quelles sont les nouvelles demandes », « montre la demande de X », « passe-la en traité », « réponds-lui », ou veut des statistiques.
version: 1.0.0
author: Action Réussite
platforms: [linux, macos]
required_environment_variables:
  - name: SUPABASE_URL
    prompt: URL du projet Supabase (https://xxxx.supabase.co)
    help: Supabase > Project Settings > API > Project URL
  - name: SUPABASE_SERVICE_ROLE_KEY
    prompt: Clé service_role Supabase
    help: Supabase > Project Settings > API > service_role (secrète, ne jamais la partager)
metadata:
  hermes:
    tags: [actionreussite, supabase, crm, demandes]
    requires_toolsets: [terminal]
---

# Demandes du site Action Réussite

Le site actionreussite (Next.js + Supabase) stocke :
- `requests` : demandes des clients (types `contact`, `formation`, `consultation`, `destination` ;
  statuts `en_attente`, `en_cours`, `traite`).
- `messages` : conversation entre le client et l'équipe pour une demande (visible dans l'espace client).
- `profiles` : clients inscrits (nom, email, téléphone, destination souhaitée).
- `site_settings` : infos affichées sur le site (prix formation, date de session, contacts).

Tout passe par le script `${HERMES_SKILL_DIR}/scripts/ar.py` (Python standard, aucune dépendance).

## When to Use
- Le propriétaire veut voir, chercher, ou résumer des demandes.
- Il veut changer le statut d'une demande ou répondre à un client sur le site.
- Il veut des chiffres (inscrits, demandes par destination…).
- Une alerte « nouvelle demande » doit être produite (tâche planifiée).

## Quick Reference
```bash
python3 ${HERMES_SKILL_DIR}/scripts/ar.py list [--status en_attente|en_cours|traite] [--type formation] [--destination Canada] [--search "Kouassi"] [--limit 10]
python3 ${HERMES_SKILL_DIR}/scripts/ar.py show <id>          # id complet ou 8 premiers caractères
python3 ${HERMES_SKILL_DIR}/scripts/ar.py status <id> en_cours
python3 ${HERMES_SKILL_DIR}/scripts/ar.py reply <id> "texte de la réponse"
python3 ${HERMES_SKILL_DIR}/scripts/ar.py new [--send] [--quiet]
python3 ${HERMES_SKILL_DIR}/scripts/ar.py stats
python3 ${HERMES_SKILL_DIR}/scripts/ar.py settings
python3 ${HERMES_SKILL_DIR}/scripts/ar.py notify "texte"     # message Telegram au propriétaire
```

## Procedure
1. Pour « quoi de neuf » : `list --status en_attente`, puis résumer en français, court, une ligne par demande
   avec le `#id` de 8 caractères pour que le propriétaire puisse s'y référer.
2. Pour une demande précise : `show <id>` avant toute action, pour avoir la conversation complète.
3. Pour répondre à un client :
   - Rédiger un brouillon (ton : professionnel, chaleureux, vouvoiement, signé « L'équipe Action Réussite »).
   - **Montrer le brouillon au propriétaire et attendre son « OK »** avant `reply`. Ne jamais envoyer sans accord.
   - `reply` passe automatiquement la demande de `en_attente` à `en_cours`.
4. Pour un statut : confirmer l'id et le nom du client, puis `status`.
5. Les prix, dates et contacts officiels viennent de `settings` : ne jamais les inventer.

## Pitfalls
- Les ids raccourcis doivent être uniques ; si le script répond « correspond à N demandes », redemander.
- `reply` n'est possible que si la demande est liée à un compte client (`user_id`).
- Ne jamais afficher ni recopier `SUPABASE_SERVICE_ROLE_KEY`.
- Ne pas supprimer de données : ce skill ne fait que lire, changer un statut et ajouter des messages.

## Verification
- Après `status` ou `reply`, relancer `show <id>` et confirmer au propriétaire ce qui a changé.
