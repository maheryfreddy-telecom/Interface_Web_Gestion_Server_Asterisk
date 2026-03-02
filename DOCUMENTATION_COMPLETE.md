# Documentation Complète du Projet VoIP Asterisk

Date de création : 20 décembre 2025

---

## Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Serveur Asterisk](#serveur-asterisk)
4. [Base de données MariaDB](#base-de-données-mariadb)
5. [Backend NestJS](#backend-nestjs)
6. [Frontend React](#frontend-react)
7. [Guide de démarrage](#guide-de-démarrage)
8. [Utilisation de l'application](#utilisation-de-lapplication)
9. [Maintenance et dépannage](#maintenance-et-dépannage)

---

## Vue d'ensemble du projet

### Description générale

Ce projet est une interface web complète de gestion pour un serveur Asterisk. Il permet de gérer les comptes SIP, visualiser les appels en temps réel, consulter l'historique des appels et administrer le système via une interface moderne et sécurisée.

### Objectifs du système

- Créer et supprimer des comptes SIP automatiquement
- Surveiller les appareils connectés en temps réel
- Consulter l'historique des appels avec filtres avancés
- Visualiser les statistiques via des graphiques
- Gérer l'administration de manière sécurisée

### Technologies utilisées

- Serveur VoIP : Asterisk avec PJSIP
- Base de données : MariaDB 10.x
- Backend : NestJS 11.x avec TypeORM
- Frontend : React 19.x avec Material-UI 7.x
- Authentification : JWT (JSON Web Tokens)
- Sécurité : Bcrypt pour les mots de passe

---

## Architecture technique

### Schéma général

```
┌─────────────────┐
│  Navigateur     │  Port 5174
│  (Frontend)     │
└────────┬────────┘
         │ HTTP
         │
┌────────▼────────┐
│  Backend API    │  Port 3000
│  (NestJS)       │
└────────┬────────┘
         │ SQL
         │
┌────────▼────────┐
│  MariaDB        │  Port 3306
│  (asteriskdb)   │  IP: 192.168.88.250
└────────┬────────┘
         │
┌────────▼────────┐
│  Asterisk       │  Port 5060 (SIP)
│  (PJSIP)        │  IP: 192.168.88.250
└─────────────────┘
```

### Flux de communication

1. L'utilisateur accède à l'interface web via le navigateur
2. Le frontend communique avec le backend via des requêtes HTTP
3. Le backend interroge la base de données MariaDB
4. Asterisk lit sa configuration depuis MariaDB
5. Les changements dans la base sont appliqués à Asterisk

---

## Serveur Asterisk

### Configuration générale

- Version : Asterisk 16 ou supérieur
- Protocole : PJSIP (moderne, remplace SIP chan_sip)
- Adresse IP : 192.168.88.250
- Port SIP : 5060 (UDP)
- Transport : transport-udp

### Tables utilisées par Asterisk

Le serveur Asterisk stocke sa configuration PJSIP dans MariaDB. Trois tables principales sont utilisées pour chaque compte SIP :

**ps_endpoints**
Configure les paramètres du point de terminaison SIP (téléphone, softphone, etc.)

**ps_aors**
Définit les adresses de contact (Address of Record) pour l'enregistrement

**ps_auths**
Stocke les informations d'authentification (nom d'utilisateur et mot de passe)

### Configuration type d'un compte SIP

Quand vous créez un compte SIP "101" avec mot de passe "secret123" :

**Table ps_endpoints :**
- id : 101
- transport : transport-udp
- aors : 101
- auth : 101-auth
- context : from-internal
- disallow : all
- allow : ulaw,alaw
- direct_media : yes
- force_rport : yes
- ice_support : yes
- rewrite_contact : yes
- rtp_symmetric : yes

**Table ps_aors :**
- id : 101
- max_contacts : 1
- remove_existing : yes

**Table ps_auths :**
- id : 101-auth
- auth_type : userpass
- username : 101
- password : secret123

### Codecs audio configurés

Par défaut, les codecs suivants sont activés :
- ulaw (G.711 mu-law) : Standard nord-américain
- alaw (G.711 a-law) : Standard européen

Ces codecs offrent une excellente qualité audio sans compression.

---

## Base de données MariaDB

### Informations de connexion

- Type : MariaDB (compatible MySQL)
- Hôte : 192.168.88.250
- Port : 3306
- Base de données : asteriskdb
- Utilisateur : root
- Mot de passe : maheryfreddy

**IMPORTANT** : Ces identifiants sont stockés dans le fichier .env du backend et ne doivent jamais être versionnés dans Git.

### Structure des tables

#### Table : ps_endpoints

Stocke la configuration des comptes SIP.

Colonnes principales :
- id : Identifiant unique du compte (exemple : "101")
- transport : Type de transport (transport-udp)
- aors : Référence à la table ps_aors
- auth : Référence à la table ps_auths
- context : Contexte de dialplan Asterisk
- disallow : Codecs interdits
- allow : Codecs autorisés
- direct_media : Communication directe entre téléphones
- force_rport : Force le port de retour
- ice_support : Support ICE pour NAT
- rewrite_contact : Réécriture de l'en-tête Contact
- rtp_symmetric : RTP symétrique pour NAT

#### Table : ps_aors

Gère les adresses de contact.

Colonnes principales :
- id : Identifiant (même que ps_endpoints)
- max_contacts : Nombre maximum d'enregistrements simultanés
- remove_existing : Supprimer les contacts existants lors d'un nouvel enregistrement
- qualify_frequency : Fréquence de vérification de disponibilité

#### Table : ps_auths

Stocke les informations d'authentification.

Colonnes principales :
- id : Identifiant (format : "nomcompte-auth")
- auth_type : Type d'authentification (userpass ou md5)
- username : Nom d'utilisateur pour l'authentification
- password : Mot de passe en clair (sécurisé par TLS)
- realm : Domaine d'authentification

#### Table : ps_contacts

Table en lecture seule, mise à jour par Asterisk.

Colonnes principales :
- id : Identifiant unique du contact
- uri : Adresse SIP complète de l'appareil
- user_agent : Information sur le logiciel/appareil
- expiration_time : Date d'expiration de l'enregistrement
- qualify_timeout : Timeout pour les tests de disponibilité

Cette table permet de voir quels appareils sont actuellement connectés.

#### Table : cdr

Historique de tous les appels (Call Detail Records).

Colonnes principales :
- uniqueid : Identifiant unique de l'appel
- src : Numéro source (appelant)
- dst : Numéro destination (appelé)
- dcontext : Contexte de dialplan
- clid : Caller ID
- channel : Canal de l'appelant
- dstchannel : Canal de l'appelé
- start : Date et heure de début d'appel
- answer : Date et heure de réponse
- end : Date et heure de fin d'appel
- duration : Durée totale en secondes
- billsec : Durée facturable en secondes
- disposition : Résultat de l'appel (ANSWERED, NO ANSWER, BUSY, FAILED)

#### Table : users

Table créée pour l'application web, ne fait pas partie d'Asterisk.

Colonnes :
- id : Identifiant auto-incrémenté
- username : Nom d'utilisateur pour la connexion web
- email : Adresse email
- password : Mot de passe haché avec bcrypt
- role : Rôle (admin ou user)
- createdAt : Date de création du compte

---

## Backend NestJS

### Informations générales

- Framework : NestJS version 11.0.1
- Langage : TypeScript
- Port : 3000
- URL : http://localhost:3000
- Documentation API : http://localhost:3000/api (Swagger)

### Structure du projet

```
back-end-asterisk/
├── src/
│   ├── auth/                    # Module d'authentification
│   │   ├── auth.controller.ts   # Routes de connexion
│   │   ├── auth.service.ts      # Logique d'authentification
│   │   ├── jwt.strategy.ts      # Stratégie JWT
│   │   ├── jwt-auth.guard.ts    # Protection des routes
│   │   ├── entities/
│   │   │   └── user.entity.ts   # Modèle utilisateur
│   │   └── dto/                 # Objets de transfert
│   │
│   ├── new_endpoint/            # Création de comptes SIP
│   │   ├── new_endpoint.controller.ts
│   │   ├── new_endpoint.service.ts
│   │   └── dto/
│   │
│   ├── ps_endpoints/            # Gestion des endpoints
│   │   ├── ps_endpoints.controller.ts
│   │   ├── ps_endpoints.service.ts
│   │   ├── entities/
│   │   │   └── ps_endpoint.entity.ts
│   │   └── dto/
│   │
│   ├── ps_aors/                 # Gestion des AORs
│   ├── ps_auths/                # Gestion des authentifications
│   ├── ps_contacts/             # Consultation des contacts
│   ├── cdr/                     # Historique des appels
│   │
│   ├── app.module.ts            # Module principal
│   └── main.ts                  # Point d'entrée
│
├── .env                         # Variables d'environnement (NE PAS VERSIONNER)
├── .env.example                 # Template des variables
├── package.json                 # Dépendances du projet
└── tsconfig.json                # Configuration TypeScript
```

### Modules et fonctionnalités

#### Module Auth (Authentification)

**Routes disponibles :**

POST /auth/login
- Corps : { "username": "admin", "password": "admin123" }
- Réponse : { "access_token": "...", "user": {...} }
- Description : Connexion à l'interface web

POST /auth/register
- Corps : { "username": "...", "email": "...", "password": "..." }
- Description : Création d'un nouvel utilisateur (actuellement désactivé)

GET /auth/profile
- En-tête : Authorization: Bearer TOKEN
- Description : Récupère les informations de l'utilisateur connecté

PUT /auth/update-username
- Corps : { "newUsername": "..." }
- Description : Modifie le nom d'utilisateur

PUT /auth/update-password
- Corps : { "currentPassword": "...", "newPassword": "..." }
- Description : Modifie le mot de passe

**Sécurité :**
- Les mots de passe sont hachés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 24 heures
- Toutes les routes sauf login et register nécessitent un token JWT valide

#### Module New Endpoint (Création de comptes SIP)

**Route disponible :**

POST /new-endpoint
- Corps : { "username": "101", "password": "secret123", "context": "from-internal" }
- Description : Crée un compte SIP complet (AOR + Auth + Endpoint) en une seule opération
- Transaction SQL : Si une étape échoue, tout est annulé

DELETE /new-endpoint/:username
- Paramètre : username (exemple : "101")
- Description : Supprime complètement un compte SIP (AOR + Auth + Endpoint)
- Transaction SQL : Suppression atomique

**Fonctionnement interne :**

Lors de la création :
1. Démarre une transaction SQL
2. Crée l'entrée dans ps_aors
3. Crée l'entrée dans ps_auths
4. Crée l'entrée dans ps_endpoints
5. Valide la transaction (commit)
6. Si erreur : annule tout (rollback)

Configuration automatique :
- Transport : transport-udp
- Codecs : ulaw et alaw
- NAT : force_rport, rtp_symmetric activés
- ICE : Support activé pour WebRTC
- Direct media : Activé pour optimiser la bande passante

#### Module PS Endpoints

Routes CRUD classiques :
- GET /ps-endpoints : Liste tous les endpoints
- GET /ps-endpoints/:id : Détails d'un endpoint
- POST /ps-endpoints : Crée un endpoint (utiliser /new-endpoint de préférence)
- PATCH /ps-endpoints/:id : Modifie un endpoint
- DELETE /ps-endpoints/:id : Supprime un endpoint (utiliser /new-endpoint/:username de préférence)

#### Module PS AORs

Routes CRUD pour les AORs :
- GET /ps-aors : Liste tous les AORs
- GET /ps-aors/:id : Détails d'un AOR
- POST /ps-aors : Crée un AOR
- PATCH /ps-aors/:id : Modifie un AOR
- DELETE /ps-aors/:id : Supprime un AOR

#### Module PS Auths

Routes CRUD pour les authentifications :
- GET /ps-auths : Liste toutes les authentifications
- GET /ps-auths/:id : Détails d'une authentification
- POST /ps-auths : Crée une authentification
- PATCH /ps-auths/:id : Modifie une authentification
- DELETE /ps-auths/:id : Supprime une authentification

#### Module PS Contacts

GET /ps-contacts
- Description : Liste les appareils actuellement enregistrés
- Mis à jour en temps réel par Asterisk
- Lecture seule (pas de modification possible)

Informations retournées :
- Extension enregistrée
- Adresse IP et port de l'appareil
- User-Agent (logiciel/modèle)
- Date d'expiration de l'enregistrement

#### Module CDR (Historique des appels)

GET /cdr
- Description : Récupère l'historique des appels
- Pagination automatique
- Filtrage possible

Filtres disponibles :
- Date de début et fin
- Numéro source
- Numéro destination
- Contexte
- Statut (ANSWERED, NO ANSWER, BUSY, FAILED)
- Durée minimale

### Configuration (.env)

Le fichier .env contient les informations sensibles :

```env
# Base de données
DB_TYPE=mariadb
DB_HOST=192.168.88.250
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=maheryfreddy
DB_DATABASE=asteriskdb

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
```

**IMPORTANT** : Ne jamais committer le fichier .env dans Git. Utilisez .env.example comme template.

### Dépendances principales

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/typeorm": "^11.0.0",
  "@nestjs/jwt": "^11.0.2",
  "@nestjs/passport": "^11.0.5",
  "typeorm": "^0.3.28",
  "mysql2": "^3.16.0",
  "bcrypt": "^6.0.0",
  "passport-jwt": "^4.0.1"
}
```

---

## Frontend React

### Informations générales

- Framework : React version 19.2.0
- Bibliothèque UI : Material-UI version 7.3.6
- Build tool : Vite version 7.2.4
- Port : 5174
- URL : http://localhost:5174

### Structure du projet

```
interface_asterisk/
├── src/
│   ├── pages/                   # Pages de l'application
│   │   ├── LoginPage.tsx        # Page de connexion
│   │   ├── DashboardPage.tsx    # Tableau de bord
│   │   ├── ExtensionsPage.tsx   # Gestion des comptes SIP
│   │   ├── ContactsPage.tsx     # Appareils connectés
│   │   ├── CdrPage.tsx          # Historique des appels
│   │   └── ProfilePage.tsx      # Profil utilisateur
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx       # Layout principal (menu, header)
│   │
│   ├── components/              # Composants réutilisables
│   │   ├── ProtectedRoute.tsx   # Protection des routes
│   │   └── AddEndpoint.tsx      # Modal d'ajout de compte
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx      # Gestion de l'authentification
│   │
│   ├── services/
│   │   └── api.ts               # Configuration Axios
│   │
│   ├── theme.ts                 # Thème Material-UI personnalisé
│   ├── App.tsx                  # Composant racine
│   └── main.tsx                 # Point d'entrée
│
├── public/                      # Fichiers statiques
├── package.json                 # Dépendances
└── vite.config.ts               # Configuration Vite
```

### Pages de l'application

#### LoginPage (Page de connexion)

**Fonctionnalités :**
- Formulaire de connexion avec validation
- Champs : nom d'utilisateur et mot de passe
- Bouton pour afficher/masquer le mot de passe
- Affichage des erreurs de connexion
- Indicateur de chargement pendant l'authentification
- Design avec dégradé violet

**Identifiants par défaut :**
- Nom d'utilisateur : admin
- Mot de passe : admin123

**Redirection automatique :**
Après connexion réussie, redirection vers le tableau de bord.

#### DashboardPage (Tableau de bord)

**Sections affichées :**

1. KPIs (Indicateurs clés)
- Extensions totales : Nombre de comptes SIP créés
- Appareils en ligne : Nombre d'appareils actuellement connectés
- Total appels : Nombre total d'appels dans l'historique
- Taux de réussite : Pourcentage d'appels répondus

2. Graphique camembert
- Répartition des appels par statut
- Affichage des pourcentages
- Légende avec couleurs
- Types : ANSWERED, NO ANSWER, BUSY, FAILED

3. Graphique linéaire
- Activité des dernières 24 heures
- Nombre d'appels par heure
- Courbe avec points
- Axes avec labels

4. Statistiques détaillées
- Appels répondus
- Appels manqués
- Durée totale en minutes
- Durée moyenne par appel

**Actualisation :**
Les données sont rechargées automatiquement à l'ouverture de la page.

#### ExtensionsPage (Gestion des comptes SIP)

**Fonctionnalités :**

1. Liste des comptes
- Tableau avec tous les endpoints
- Colonnes : ID, Transport, AORs, Auth, Context, Codecs
- Bouton de suppression pour chaque compte

2. Ajout de compte
- Bouton "Nouveau compte SIP"
- Modal avec formulaire
- Champs : Nom d'utilisateur, Mot de passe, Contexte
- Validation des données
- Création automatique (AOR + Auth + Endpoint)

3. Suppression de compte
- Bouton avec icône de corbeille
- Confirmation de suppression
- Suppression complète (AOR + Auth + Endpoint)

4. Actualisation
- Bouton "Actualiser" pour recharger la liste

**Exemple de création :**
- Nom d'utilisateur : 102
- Mot de passe : motdepasse123
- Contexte : from-internal (par défaut)

#### ContactsPage (Appareils en ligne)

**Affichage :**
- Tableau avec les appareils enregistrés en temps réel
- Colonnes : Extension, Adresse IP (URI), Logiciel (User Agent), Statut, Expiration

**Informations affichées :**
- Extension : Numéro du compte SIP
- URI : Adresse complète (sip:extension@ip:port)
- User Agent : Logiciel utilisé (ex: Zoiper, Linphone, téléphone IP)
- Statut : ONLINE ou OFFLINE
- Expiration : Date d'expiration de l'enregistrement

**Actualisation :**
Bouton "Actualiser" pour voir les changements en temps réel.

#### CdrPage (Historique des appels)

**Fonctionnalités :**

1. Filtres avancés
- Date de début et fin
- Numéro source (appelant)
- Numéro destination (appelé)
- Contexte
- Statut (ANSWERED, NO ANSWER, BUSY, FAILED)
- Durée minimale en secondes

2. Tableau des appels
- Source : Numéro de l'appelant
- Destination : Numéro de l'appelé
- Début : Date et heure de l'appel
- Durée : Durée totale en secondes
- Facturable : Durée de conversation en secondes
- Statut : Résultat de l'appel

3. Pagination
- Choix du nombre de lignes : 25, 50 ou 100 par page
- Navigation entre les pages
- Compteur total d'appels

4. Export CSV
- Bouton "Exporter CSV"
- Télécharge les données filtrées
- Format compatible Excel

**Affichage/Masquage des filtres :**
Bouton pour afficher ou masquer la section de filtres.

#### ProfilePage (Profil utilisateur)

**Fonctionnalités :**

1. Changement de nom d'utilisateur
- Formulaire avec un champ
- Validation (minimum 3 caractères)
- Vérification de disponibilité
- Confirmation de succès

2. Changement de mot de passe
- Trois champs : mot de passe actuel, nouveau, confirmation
- Validation :
  - Mot de passe actuel correct
  - Nouveau mot de passe minimum 6 caractères
  - Confirmation identique au nouveau
- Affichage/masquage des mots de passe
- Confirmation de succès

**Messages d'erreur :**
- Affichage clair des erreurs
- Suggestions de correction

### Composants principaux

#### MainLayout

Le layout principal contient :

1. Header (barre supérieure)
- Logo et titre de l'application
- Nom de l'utilisateur connecté
- Menu utilisateur (profil, déconnexion)

2. Menu latéral
- Dashboard
- Extensions SIP
- Appareils en ligne
- Historique CDR
- Indicateur de connexion au serveur Asterisk

3. Zone de contenu
- Affiche la page active
- Animations de transition

#### ProtectedRoute

Composant de protection :
- Vérifie si l'utilisateur est connecté
- Redirige vers /login si non connecté
- Autorise l'accès si token JWT valide

#### AuthContext

Gestion globale de l'authentification :
- État de connexion
- Informations utilisateur
- Token JWT
- Fonctions login() et logout()
- Persistance dans localStorage

### Thème personnalisé

**Palette de couleurs :**
- Primaire : Bleu (#1976d2)
- Secondaire : Violet (#9c27b0)
- Succès : Vert (#2e7d32)
- Erreur : Rouge (#d32f2f)
- Warning : Orange (#ed6c02)

**Police :**
- Principale : Inter
- Alternative : Roboto

**Effets visuels :**
- Dégradés sur les boutons et menu
- Ombres douces
- Animations de transition
- Coins arrondis (12px)

### Configuration Axios

**URL de base :**
http://localhost:3000

**Intercepteurs :**

1. Requête sortante
- Ajoute automatiquement le token JWT dans l'en-tête Authorization
- Format : Bearer TOKEN

2. Réponse entrante
- Détecte les erreurs 401 (non autorisé)
- Déconnecte automatiquement l'utilisateur
- Redirige vers la page de connexion

### Dépendances principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "@mui/material": "^7.3.6",
  "@mui/icons-material": "^7.3.6",
  "axios": "^1.13.2",
  "recharts": "^3.6.0"
}
```

---

## Guide de démarrage

### Prérequis

Avant de démarrer, assurez-vous d'avoir :

1. Node.js version 18 ou supérieure installée
2. npm (gestionnaire de paquets Node.js)
3. Accès au serveur Asterisk (192.168.88.250)
4. Accès à la base de données MariaDB (192.168.88.250:3306)
5. Connexion réseau stable

### Vérification des prérequis

Ouvrez un terminal et vérifiez les versions :

```bash
node --version
# Doit afficher : v18.0.0 ou supérieur

npm --version
# Doit afficher : 9.0.0 ou supérieur
```

### Installation du projet

#### Étape 1 : Récupérer le projet

Si le projet est sur Git :
```bash
git clone [url-du-projet]
cd projet_voip
```

Si vous avez déjà le projet :
```bash
cd /home/freddy/projet_voip
```

#### Étape 2 : Installer le backend

```bash
# Aller dans le dossier backend
cd back-end-asterisk

# Installer les dépendances
npm install

# Attendre la fin de l'installation (peut prendre 2-3 minutes)
```

#### Étape 3 : Configurer le backend

Créer le fichier .env :
```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier (avec nano, vim, ou un éditeur de texte)
nano .env
```

Contenu du fichier .env :
```env
DB_TYPE=mariadb
DB_HOST=192.168.88.250
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=maheryfreddy
DB_DATABASE=asteriskdb

JWT_SECRET=changez_ce_secret_en_production_123456789
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

Enregistrer et fermer (Ctrl+X, puis Y, puis Entrée).

#### Étape 4 : Créer l'utilisateur admin

```bash
# Exécuter le script de création
node create-admin.js
```

Vous devriez voir :
```
Utilisateur admin créé avec succès
Username: admin
Password: admin123
```

#### Étape 5 : Installer le frontend

```bash
# Revenir au dossier principal
cd ..

# Aller dans le dossier frontend
cd interface_asterisk

# Installer les dépendances
npm install

# Attendre la fin de l'installation (peut prendre 2-3 minutes)
```

### Démarrage de l'application

#### Démarrer le backend

Ouvrir un terminal :
```bash
cd /home/freddy/projet_voip/back-end-asterisk
npm run start:dev
```

Vous devriez voir :
```
Application running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

Le backend est maintenant démarré. Laissez ce terminal ouvert.

#### Démarrer le frontend

Ouvrir un NOUVEAU terminal :
```bash
cd /home/freddy/projet_voip/interface_asterisk
npm run dev
```

Vous devriez voir :
```
VITE ready in XXX ms

Local:   http://localhost:5174/
Network: use --host to expose
```

Le frontend est maintenant démarré. Laissez ce terminal ouvert.

### Première connexion

1. Ouvrir votre navigateur web (Chrome, Firefox, Edge)
2. Aller à l'adresse : http://localhost:5174
3. Vous verrez la page de connexion
4. Entrer les identifiants :
   - Nom d'utilisateur : admin
   - Mot de passe : admin123
5. Cliquer sur "Se connecter"

Si tout fonctionne :
- Vous serez redirigé vers le tableau de bord
- Vous verrez les statistiques et graphiques
- Le menu latéral affiche toutes les pages disponibles

### Arrêt de l'application

Pour arrêter proprement l'application :

1. Dans le terminal du frontend : appuyer sur Ctrl+C
2. Dans le terminal du backend : appuyer sur Ctrl+C

Les serveurs s'arrêteront proprement.

### Redémarrage

Pour redémarrer :
1. Suivre les étapes "Démarrer le backend"
2. Suivre les étapes "Démarrer le frontend"
3. Se reconnecter à l'interface web

---

## Utilisation de l'application

### Créer un compte SIP

1. Cliquer sur "Extensions SIP" dans le menu latéral
2. Cliquer sur le bouton "Nouveau compte SIP" en haut à droite
3. Une fenêtre s'ouvre avec un formulaire
4. Remplir les champs :
   - Nom d'utilisateur : exemple "102" (uniquement chiffres et lettres)
   - Mot de passe : exemple "motdepasse123" (minimum 6 caractères)
   - Contexte : laisser "from-internal" (valeur par défaut)
5. Cliquer sur "Créer"
6. Un message de confirmation apparaît
7. Le nouveau compte apparaît dans la liste

Le compte est immédiatement utilisable sur Asterisk.

### Configurer un téléphone

Une fois le compte créé, configurer votre téléphone ou softphone :

**Paramètres SIP :**
- Serveur SIP : 192.168.88.250
- Port : 5060
- Transport : UDP
- Nom d'utilisateur : (celui que vous avez créé, exemple : 102)
- Mot de passe : (celui que vous avez défini)
- Domaine : 192.168.88.250

**Softphones recommandés :**
- Zoiper (Windows, Mac, Linux, Mobile)
- Linphone (Windows, Mac, Linux, Mobile)
- MicroSIP (Windows uniquement)

### Vérifier la connexion

1. Après configuration du téléphone, attendre 5-10 secondes
2. Dans l'interface web, cliquer sur "Appareils en ligne"
3. Cliquer sur "Actualiser"
4. Votre appareil doit apparaître avec :
   - L'extension (ex: 102)
   - L'adresse IP de votre appareil
   - Le nom du logiciel utilisé
   - Le statut "ONLINE"

Si l'appareil n'apparaît pas :
- Vérifier les paramètres du téléphone
- Vérifier que le serveur Asterisk est accessible (ping 192.168.88.250)
- Vérifier qu'aucun firewall ne bloque le port 5060

### Consulter l'historique des appels

1. Cliquer sur "Historique CDR" dans le menu latéral
2. La liste de tous les appels s'affiche
3. Pour filtrer :
   - Cliquer sur "Afficher les filtres"
   - Choisir vos critères (dates, numéros, statut)
   - Cliquer sur "Appliquer les filtres"
4. Pour exporter :
   - Cliquer sur "Exporter CSV"
   - Le fichier se télécharge automatiquement

### Changer son mot de passe

1. Cliquer sur l'icône utilisateur en haut à droite
2. Cliquer sur "Mon profil"
3. Dans la section "Changer le Mot de Passe" :
   - Entrer le mot de passe actuel
   - Entrer le nouveau mot de passe (minimum 6 caractères)
   - Confirmer le nouveau mot de passe
4. Cliquer sur "Modifier le Mot de Passe"
5. Un message de confirmation apparaît

### Se déconnecter

1. Cliquer sur l'icône utilisateur en haut à droite
2. Cliquer sur "Déconnexion"
3. Vous êtes redirigé vers la page de connexion

---

## Maintenance et dépannage

### Problèmes courants

#### Le backend ne démarre pas

Erreur : "Error: listen EADDRINUSE: address already in use :::3000"

Solution :
```bash
# Trouver le processus utilisant le port 3000
lsof -ti:3000

# Tuer le processus (remplacer PID par le numéro affiché)
kill -9 PID

# Redémarrer le backend
npm run start:dev
```

#### Le frontend ne démarre pas

Erreur : "Port 5174 is already in use"

Solution :
```bash
# Appuyer sur Ctrl+C dans le terminal du frontend
# Puis redémarrer
npm run dev
```

#### Impossible de se connecter

Erreur : "Identifiants incorrects"

Vérifications :
1. Le backend est bien démarré (vérifier le terminal)
2. L'utilisateur admin existe (voir section "Créer l'utilisateur admin")
3. Les identifiants sont corrects :
   - Nom d'utilisateur : admin
   - Mot de passe : admin123

Solution si l'admin n'existe pas :
```bash
cd /home/freddy/projet_voip/back-end-asterisk
node create-admin.js
```

#### Les données ne s'affichent pas

Problème : Le dashboard ou les pages sont vides

Vérifications :
1. Le backend est démarré
2. La base de données est accessible :
```bash
# Tester la connexion (depuis le serveur)
mysql -h 192.168.88.250 -u root -pmaheryfreddy -e "USE asteriskdb; SELECT COUNT(*) FROM ps_endpoints;"
```
3. Vérifier la console du navigateur (F12) pour voir les erreurs

#### Un appareil ne se connecte pas

Vérifications :
1. Le compte SIP existe (vérifier dans Extensions SIP)
2. Les paramètres du téléphone sont corrects
3. Le serveur Asterisk est accessible :
```bash
ping 192.168.88.250
```
4. Le port 5060 n'est pas bloqué par un firewall

### Logs et débogage

#### Logs du backend

Les logs s'affichent directement dans le terminal où le backend est démarré.

Pour voir les erreurs détaillées :
```bash
# Dans le terminal du backend
# Les erreurs apparaissent en rouge
# Les succès apparaissent en vert
```

#### Logs du frontend

Pour voir les erreurs du frontend :
1. Ouvrir le navigateur
2. Appuyer sur F12 (outils développeur)
3. Aller dans l'onglet "Console"
4. Les erreurs JavaScript s'affichent ici

#### Logs Asterisk

Pour voir les logs du serveur Asterisk (nécessite accès SSH) :
```bash
# Se connecter au serveur
ssh root@192.168.88.250

# Voir les logs en temps réel
asterisk -rvvv

# Ou consulter les fichiers de log
tail -f /var/log/asterisk/full
```

### Sauvegarde

#### Sauvegarder la base de données

Créer une sauvegarde complète :
```bash
# Depuis n'importe quel terminal
mysqldump -h 192.168.88.250 -u root -pmaheryfreddy asteriskdb > backup_$(date +%Y%m%d).sql
```

Restaurer une sauvegarde :
```bash
mysql -h 192.168.88.250 -u root -pmaheryfreddy asteriskdb < backup_20251220.sql
```

#### Sauvegarder le code

Méthode 1 : Copie simple
```bash
# Copier tout le projet
cp -r /home/freddy/projet_voip /home/freddy/projet_voip_backup_$(date +%Y%m%d)
```

Méthode 2 : Git (recommandé)
```bash
cd /home/freddy/projet_voip
git add .
git commit -m "Sauvegarde du $(date +%Y-%m-%d)"
git push
```

**ATTENTION** : Ne jamais sauvegarder le fichier .env dans Git !

### Mise à jour

#### Mettre à jour les dépendances

Backend :
```bash
cd /home/freddy/projet_voip/back-end-asterisk
npm update
npm audit fix
```

Frontend :
```bash
cd /home/freddy/projet_voip/interface_asterisk
npm update
npm audit fix
```

#### Après une mise à jour

1. Arrêter le backend et le frontend (Ctrl+C)
2. Redémarrer le backend
3. Redémarrer le frontend
4. Vider le cache du navigateur (Ctrl+Shift+Delete)
5. Recharger l'application (Ctrl+F5)

### Support et assistance

En cas de problème non résolu :

1. Vérifier cette documentation
2. Consulter les logs (backend, frontend, Asterisk)
3. Vérifier la configuration (.env)
4. Tester la connexion à la base de données
5. Vérifier que le serveur Asterisk répond

Informations utiles pour le support :
- Version de Node.js : node --version
- Version de npm : npm --version
- Système d'exploitation : uname -a
- Messages d'erreur exacts (copier-coller)
- Étapes pour reproduire le problème

---

## Annexes

### Ports utilisés

- 3000 : Backend API (NestJS)
- 5174 : Frontend web (React/Vite)
- 3306 : Base de données MariaDB
- 5060 : SIP (Asterisk)
- 10000-20000 : RTP (média audio/vidéo)

### Commandes utiles

#### Backend
```bash
# Démarrer en mode développement
npm run start:dev

# Démarrer en mode production
npm run build
npm run start:prod

# Lancer les tests
npm test

# Formater le code
npm run format
```

#### Frontend
```bash
# Démarrer en mode développement
npm run dev

# Créer une version de production
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier le code
npm run lint
```

#### Base de données
```bash
# Se connecter à MariaDB
mysql -h 192.168.88.250 -u root -pmaheryfreddy asteriskdb

# Lister les tables
SHOW TABLES;

# Compter les endpoints
SELECT COUNT(*) FROM ps_endpoints;

# Voir les appareils connectés
SELECT * FROM ps_contacts;

# Statistiques des appels
SELECT disposition, COUNT(*) FROM cdr GROUP BY disposition;
```

### Structure complète des dossiers

```
projet_voip/
├── back-end-asterisk/
│   ├── node_modules/
│   ├── src/
│   │   ├── auth/
│   │   ├── cdr/
│   │   ├── new_endpoint/
│   │   ├── ps_aors/
│   │   ├── ps_auths/
│   │   ├── ps_contacts/
│   │   ├── ps_endpoints/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── create-admin.js
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── interface_asterisk/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── theme.ts
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── DOCUMENTATION_COMPLETE.md
├── GUIDE_DEMARRAGE.md
└── README.md
```

### Glossaire

**AOR (Address of Record)** : Adresse SIP d'un compte, utilisée pour l'enregistrement et le routage des appels.

**Asterisk** : Serveur de téléphonie open source qui gère les appels VoIP.

**Backend** : Partie serveur de l'application qui traite la logique métier et communique avec la base de données.

**Bcrypt** : Algorithme de hachage sécurisé pour stocker les mots de passe.

**CDR (Call Detail Record)** : Enregistrement détaillé d'un appel téléphonique.

**Endpoint** : Point de terminaison SIP (téléphone, softphone, passerelle).

**Frontend** : Partie cliente de l'application, interface utilisateur dans le navigateur.

**JWT (JSON Web Token)** : Standard de jeton sécurisé pour l'authentification.

**MariaDB** : Système de gestion de base de données relationnelle (fork de MySQL).

**NestJS** : Framework Node.js pour créer des applications serveur évolutives.

**PJSIP** : Stack SIP moderne utilisée par Asterisk pour la téléphonie.

**React** : Bibliothèque JavaScript pour créer des interfaces utilisateur.

**SIP (Session Initiation Protocol)** : Protocole de signalisation pour les communications VoIP.

**Softphone** : Logiciel de téléphonie installé sur ordinateur ou smartphone.

**TypeORM** : ORM (Object-Relational Mapping) pour TypeScript et JavaScript.

**VoIP (Voice over IP)** : Technologie permettant de passer des appels via Internet.

---

**Fin de la documentation**

Document créé le : 20 décembre 2025
Version : 1.0
---
Auteur: **Freddy MAHERY NOMENA**
