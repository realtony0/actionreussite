# Démarrage rapide : WhatsApp + Telegram, gratuit, sur ton Mac

But : faire marcher le bot **tout de suite**, sans serveur et sans payer, pour tester WhatsApp et
Telegram. Azure (le serveur et le modèle payé par les crédits) viendra ensuite, voir `README.md`.

- **IA gratuite :** Google Gemini (free tier), ou Groq en secours.
- **Machine :** ton Mac. Le bot répond tant que le Mac est allumé et que le Terminal reste ouvert.
- **Pour l'instant :** pas d'email ni de Supabase. On les branche après.

Compter environ 20 minutes.

---

## 1. Une clé IA gratuite

Sur **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**, se connecter avec un compte
Google, cliquer « Create API key » et copier la clé (`AIza...`). Pas de carte bancaire.

## 2. Installer Hermes sur le Mac

Dans le Terminal :

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

```bash
source ~/.zshrc
```

Choisir le modèle :

```bash
hermes model
```

Choisir **Google / Gemini**, coller la clé, puis prendre le modèle **`gemini-2.5-flash`** (ou le
« flash » le plus récent proposé).

## 3. Mettre la config Action Réussite

```bash
git clone -b claude/cool-hamilton-4le7rc https://github.com/realtony0/actionreussite.git ~/actionreussite-bot
```

```bash
bash ~/actionreussite-bot/hermes/install.sh
```

Le script signale que `SUPABASE_URL`, etc. manquent : c'est normal à ce stade, on ignore.

## 4. Telegram (le canal du proprio)

1. Dans Telegram, ouvrir **@BotFather**, taper `/newbot`, donner un nom (ex. `Hermes Action Réussite`)
   et un identifiant qui finit par `bot`. Copier le **token**.
2. Ouvrir **@userinfobot** avec le compte du proprio et copier son **ID** (un nombre).
3. Ouvrir le fichier de config :

```bash
open -e ~/.hermes/.env
```

Ajouter ces lignes, puis enregistrer :

```
TELEGRAM_BOT_TOKEN=le_token_de_botfather
TELEGRAM_ALLOWED_USERS=id_du_proprio
TELEGRAM_HOME_CHANNEL=id_du_proprio
AR_OWNER_TELEGRAM_ID=id_du_proprio

WHATSAPP_ENABLED=true
WHATSAPP_MODE=bot
WHATSAPP_ALLOW_ALL_USERS=true
```

## 5. WhatsApp (les clients) : avec le WhatsApp Business existant

Le proprio a déjà **WhatsApp Business** sur le numéro de l'agence : on y branche le bot directement,
pas besoin d'une deuxième puce. Le bot devient un « appareil connecté », comme WhatsApp Web. L'appli
continue de marcher normalement sur le téléphone.

```bash
hermes whatsapp
```

Un QR code s'affiche. Sur le téléphone de l'agence, dans **WhatsApp Business** : **⋮ / Paramètres →
Appareils connectés → Connecter un appareil**, puis scanner.

> ⚠️ **À lire avant :**
> - **Risque sur le numéro :** le bot passe par WhatsApp Web (non officiel). WhatsApp peut restreindre un
>   numéro qui répond automatiquement, et c'est le numéro affiché partout sur le site. Pour limiter le
>   risque : commencer par quelques numéros de test (ci-dessous), puis ouvrir à tous. Le bot doit répondre
>   seulement quand on lui écrit, jamais envoyer de messages en masse.
> - **Double réponse :** si le proprio répond aussi à la main depuis son téléphone, le client peut recevoir
>   deux réponses. Désactiver dans WhatsApp Business le message d'accueil et le message d'absence
>   automatiques (Outils professionnels → Message d'accueil / Message d'absence), sinon le client reçoit
>   ces messages en plus de ceux du bot.
> - **Pour débrancher le bot :** dans Appareils connectés, déconnecter l'appareil.

**Phase de test** : dans `~/.hermes/.env`, remplacer `WHATSAPP_ALLOW_ALL_USERS=true` par une liste de
numéros de test (indicatif pays, sans `+` ni espaces) :

```
WHATSAPP_ALLOWED_USERS=2250700000000,2250500000000
```

Le bot ne répond alors qu'à ces numéros, et les vrais clients ne voient rien. Une fois le test bon,
remettre `WHATSAPP_ALLOW_ALL_USERS=true` et supprimer la ligne `WHATSAPP_ALLOWED_USERS`.

Plus tard, la version 100 % officielle sera l'API WhatsApp Business de Meta (`hermes whatsapp-cloud`).
Avec la « coexistence » de Meta, le numéro reste utilisable dans l'appli. Il faut un compte Meta Business
et un serveur, à faire au moment d'Azure.

## 6. Lancer le bot

```bash
caffeinate -i hermes gateway
```

`caffeinate` empêche le Mac de se mettre en veille. Laisser cette fenêtre de Terminal ouverte, et
taper `Ctrl+C` pour arrêter le bot.

## 7. Tester

- **Telegram :** le proprio écrit « Salut, tu es qui ? » au bot. Il doit répondre en se présentant
  comme Hermes, l'assistant d'Action Réussite.
- **WhatsApp :** depuis un numéro de test, écrire au numéro de l'agence « Bonjour, quelles destinations
  proposez-vous ? ». Il doit répondre poliment, sans rien promettre.
- **Transfert :** écrire sur WhatsApp « J'ai payé mais je n'ai pas de nouvelles de mon dossier ». Le
  client doit recevoir « un conseiller vous recontacte », et le proprio un résumé sur Telegram.

Pour l'instant, le bot ne connaît ni les prix ni les dates du site, parce que Supabase n'est pas encore
branché. Il doit donc renvoyer vers un conseiller pour ces questions.

## Si ça ne marche pas

| Problème | Solution |
|---|---|
| `hermes: command not found` | Fermer et rouvrir le Terminal, ou lancer `source ~/.zshrc` |
| Erreur « quota » / « 429 » de Gemini | Limite gratuite atteinte : attendre une minute. Sinon passer à Groq (ci-dessous) |
| Le bot ne répond pas sur Telegram | Vérifier `TELEGRAM_ALLOWED_USERS` (un nombre, pas un @pseudo), puis relancer le bot |
| Le QR WhatsApp expire | Relancer `hermes whatsapp` |
| Autre chose | Lancer `hermes doctor`, et lire `~/.hermes/logs/gateway.log` |

**Groq en secours** (gratuit aussi, celui de l'agent du cabinet NDAO) : créer une clé sur
console.groq.com/keys, puis dans `hermes model` choisir « Custom endpoint » avec l'URL
`https://api.groq.com/openai/v1` et le modèle `llama-3.3-70b-versatile`. Les limites gratuites de Groq
sont plus serrées : Gemini reste le premier choix.

## Ensuite

1. **Supabase :** brancher les demandes du site (alertes, consultation, statut). Voir la section 4 du README.
2. **Email :** voir la section 6 du README.
3. **Azure :** déplacer le bot sur une VM Azure (allumée 24h/24) et passer le modèle sur Azure OpenAI.
   Voir la section 2 du README. La connexion WhatsApp se refait avec `hermes whatsapp` sur la VM.
