# Hermes, le bot du propriétaire d'Action Réussite

Ce dossier configure [Hermes Agent](https://github.com/NousResearch/hermes-agent) (Nous Research),
un agent IA auto-hébergé, pour qu'il :

| Canal | Rôle |
|---|---|
| **Telegram** (le propriétaire) | alertes de nouvelles demandes, consulter, changer le statut, répondre aux clients sur le site |
| **WhatsApp** (les clients) | répondre aux questions simples, transmettre le reste au propriétaire |
| **Email** (les clients) | même chose par email |

```
hermes/
├── SOUL.md                       # personnalité et règles du bot
├── config.azure.yaml             # modèle IA sur Azure (Microsoft Foundry)
├── env.example                   # variables à mettre dans ~/.hermes/.env
├── install.sh                    # copie skills + SOUL.md dans ~/.hermes
├── scripts/alertes-demandes.sh   # tâche planifiée : nouvelles demandes → Telegram
└── skills/
    ├── actionreussite-demandes/  # lire/traiter les demandes Supabase (scripts/ar.py)
    └── actionreussite-reponses/  # règles de réponse aux clients WhatsApp/email
```

## 1. Ce qu'il faut avant de commencer

- L'abonnement **Azure for Students** (100 $ de crédits) : il paie le modèle IA (Azure OpenAI dans
  Microsoft Foundry) et fournit le serveur (une petite VM Linux comprise dans les services gratuits).
- Le téléphone du propriétaire, avec Telegram.
- **Un numéro WhatsApp dédié à l'agence** (voir l'avertissement en section 5).
- Une boîte email dédiée (ex. `contact@actionreussite.com` ou un Gmail) avec un mot de passe d'application.
- L'accès au projet Supabase du site.

## 2. Azure : le serveur et le modèle IA

### 2a. Le modèle IA (Microsoft Foundry)

1. Sur [ai.azure.com](https://ai.azure.com), créer une ressource Azure OpenAI / Foundry (région
   proche, ex. *Sweden Central* ou *France Central*) et **déployer un modèle de chat**, de type
   *Global Standard*. Pour faire durer les crédits, prendre un modèle « mini » (`gpt-4o-mini` ou `gpt-4.1-mini`) :
   quelques dollars par mois suffisent pour des centaines de messages. Noter le **nom de la ressource** et
   le **nom du déploiement**.
2. Le point d'accès à utiliser est `https://<ressource>.openai.azure.com/openai/v1`.

Hermes gère Azure en natif (fournisseur `azure-foundry`).

> **Azure for Students :** le quota de modèles est réduit, et certains modèles ou certaines régions peuvent
> être refusés. Si le déploiement est refusé, essayer une autre région ou un autre modèle « mini ».
> Quand les 100 $ sont épuisés, les services s'arrêtent : pas de facture surprise. Les crédits se
> renouvellent chaque année tant que vous êtes étudiant. Suivre la consommation dans
> *Cost Management* sur le portail.

### 2b. Le serveur (VM Azure)

Avec l'[Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (ou le Cloud Shell du portail).
La VM reçoit une **identité managée**, donc aucune clé IA n'est stockée sur le serveur :

```bash
az group create --name actionreussite-rg --location francecentral
```

```bash
az vm create --resource-group actionreussite-rg --name hermes-vm --image Ubuntu2404 --size Standard_B1s --admin-username hermes --generate-ssh-keys --assign-identity
```

Donner à la VM le droit d'utiliser le modèle (remplacer `<ressource>` et `<groupe-de-la-ressource>`) :

```bash
az role assignment create --assignee "$(az vm show -g actionreussite-rg -n hermes-vm --query identity.principalId -o tsv)" --role "Azure AI User" --scope "$(az cognitiveservices account show -g <groupe-de-la-ressource> -n <ressource> --query id -o tsv)"
```

Si le rôle « Azure AI User » n'existe pas sur votre abonnement, prendre « Cognitive Services OpenAI User ».
Le rôle peut mettre quelques minutes à s'appliquer.

Se connecter à la VM (l'IP publique est affichée par `az vm create`) :

```bash
ssh hermes@<ip-publique>
```

`Standard_B1s` (1 vCPU, 1 Go) fait partie des services gratuits d'Azure for Students (750 h/mois pendant
12 mois, soit une VM allumée en permanence), avec un disque de 64 Go gratuit. Une VM plus grosse
(ex. `Standard_B2s`, environ 30 à 40 $/mois) viderait les crédits en trois mois. Aucun port entrant n'est nécessaire en plus de SSH : Telegram, WhatsApp et l'email fonctionnent en
connexion sortante.

### 2c. Installer Hermes sur la VM

1 Go de mémoire, c'est juste : ajouter 2 Go de swap avant d'installer.

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Installer Hermes sans le navigateur intégré (inutile ici et trop lourd pour cette VM) :

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

```bash
source ~/.bashrc
```

```bash
hermes model
```

Dans `hermes model`, choisir **Azure Foundry**, coller l'URL `https://<ressource>.openai.azure.com/openai/v1`,
puis l'authentification **Microsoft Entra ID** (l'identité managée de la VM), et le déploiement.
Le bloc obtenu doit ressembler à `hermes/config.azure.yaml`. Vérifier avec :

```bash
hermes doctor
```

Sans identité managée, choisir « API key » et mettre `AZURE_FOUNDRY_API_KEY` dans `~/.hermes/.env`.

Si Azure OpenAI reste refusé sur l'abonnement étudiant, il existe une solution gratuite, la même que pour
l'agent du cabinet NDAO : Groq. Dans `hermes model`, choisir « Custom endpoint » avec l'URL
`https://api.groq.com/openai/v1`, une clé de console.groq.com et le modèle `llama-3.3-70b-versatile`.
La VM Azure reste utilisable pour héberger le bot.

## 3. Créer le bot Telegram du propriétaire

1. Dans Telegram, ouvrir **@BotFather** → `/newbot` → nom `Hermes Action Réussite`, identifiant
   finissant par `bot` (ex. `actionreussite_hermes_bot`). Copier le **token**.
2. Ouvrir **@userinfobot** avec le compte du propriétaire et copier son **ID numérique**.
3. Mettre ces valeurs dans `~/.hermes/.env` (voir `env.example`) : `TELEGRAM_BOT_TOKEN`, et l'ID dans
   `TELEGRAM_ALLOWED_USERS`, `TELEGRAM_HOME_CHANNEL` et `AR_OWNER_TELEGRAM_ID`.

Seul cet ID peut parler au bot sur Telegram (Hermes refuse tout le monde par défaut).

## 4. Brancher le site (Supabase) et installer les skills

Dans Supabase, aller dans **Project Settings → API** et copier l'URL du projet et la clé
**service_role** dans `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. Cette clé donne un accès complet à la
base : elle reste uniquement dans `~/.hermes/.env` sur le serveur.

```bash
git clone https://github.com/realtony0/actionreussite.git && cd actionreussite
```

```bash
bash hermes/install.sh
```

Si le repo est privé, copier plutôt le dossier `hermes/` depuis votre PC : `scp -r hermes hermes@<ip-publique>:~/`, puis `bash ~/hermes/install.sh`.

Tester :

```bash
set -a; . ~/.hermes/.env; set +a; python3 ~/.hermes/skills/actionreussite-demandes/scripts/ar.py list --limit 3
```

## 5. WhatsApp (répondre aux clients)

```bash
hermes whatsapp
```

Scanner le QR code avec le téléphone de l'agence (WhatsApp → Paramètres → Appareils connectés).
Les variables `WHATSAPP_*` de `env.example` mettent le bot en mode `bot`, ouvert à tous les clients.

> ⚠️ Hermes passe par WhatsApp Web (non officiel). WhatsApp peut restreindre un numéro qui répond
> automatiquement : **utilisez un numéro dédié, pas le numéro personnel du propriétaire**, et faites
> d'abord un essai. Pour une solution 100 % officielle, Hermes propose `hermes whatsapp-cloud`
> (API WhatsApp Business de Meta, compte Meta Business requis).

## 6. Email (répondre aux mails)

Remplir les variables `EMAIL_*` de `env.example`. Pour Gmail : activer la validation en deux étapes puis
créer un mot de passe d'application (myaccount.google.com/apppasswords). Garder
`EMAIL_AUTHSERV_ID=mx.google.com` pour Gmail. Sinon, mettre la valeur de l'en-tête
`Authentication-Results` de votre fournisseur, ou les mails seront ignorés.

Ou en mode guidé :

```bash
hermes gateway setup
```

## 7. Démarrer le bot en service (redémarre tout seul)

```bash
sudo hermes gateway install --system
```

```bash
sudo hermes gateway start --system
```

```bash
sudo hermes gateway status --system
```

Logs : `journalctl -u hermes-gateway -f` ou `~/.hermes/logs/gateway.log`. Diagnostic : `hermes doctor`.

## 8. Alertes automatiques des nouvelles demandes

Une vérification toutes les 5 minutes, sans IA (donc gratuite), envoyée sur Telegram seulement quand
il y a du nouveau :

```bash
hermes cron create "every 5m" --no-agent --script ~/.hermes/scripts/alertes-demandes.sh --deliver telegram --name "alertes-demandes"
```

Le premier passage initialise juste le compteur. Les demandes, inscriptions et messages clients arrivés
ensuite sont signalés. Si aucune alerte n'arrive, lancer `hermes cron run alertes-demandes` et lire
`~/.hermes/cron/output/`. Sinon, remplacer la commande par `alertes-demandes.sh --send` (envoi direct par
l'API Telegram, sans `--deliver`).

Résumé chaque matin (avec IA) :

```bash
hermes cron create "0 8 * * *" "Fais le point des demandes Action Réussite : en attente, en cours, nouveaux inscrits d'hier, et ce qui est urgent." --deliver telegram --timezone Africa/Abidjan --name "point-du-matin"
```

## 9. Utilisation au quotidien (exemples à écrire au bot sur Telegram)

- « Quelles sont les nouvelles demandes ? »
- « Montre-moi la demande #3f9a12bc »
- « Réponds à Awa que son dossier Canada est complet et qu'on la rappelle lundi » → le bot montre
  le brouillon, puis envoie après « OK ».
- « Passe #3f9a12bc en traité »
- « Combien d'inscrits pour la Chine ? »

Quand un client WhatsApp ou email pose une question délicate (paiement, dossier, réclamation…), le bot
lui répond qu'un conseiller le recontacte et envoie un résumé au propriétaire sur Telegram.

## Sécurité

- `~/.hermes/.env` contient toutes les clés : ne jamais le committer ni l'envoyer par message.
- Le bot ne supprime jamais de données. Il lit les demandes, change les statuts et ajoute des messages.
