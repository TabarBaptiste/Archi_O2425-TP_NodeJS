# Monumento API - Archi O24-25 - TP NodeJS - TABAR LABONNE Baptiste

## 📋 Table des matières

- [Monumento API - Archi O24-25 - TP NodeJS - TABAR LABONNE Baptiste](#monumento-api---archi-o24-25---tp-nodejs---tabar-labonne-baptiste)
  <!-- - [📋 Table des matières](#-table-des-matières)
  - [🛠️ Technologies utilisées](#️-technologies-utilisées)
  - [📁 Structure du projet](#-structure-du-projet) -->
  <!-- - [🚀 Installation et démarrage](#-installation-et-démarrage) -->
  - [📖 Partie 1 - Système de Favoris](#-partie-1---système-de-favoris)
    - [🗄️ Modèle Favorite](#️-modèle-favorite)
    - [🔗 Relations Many-to-Many](#-relations-many-to-many)
  - [🌐 Partie 2 - Routes API Favoris](#-partie-2---routes-api-favoris)
    - [➕ POST `/api/favorites/:monumentId` - Ajouter un favori](#-post-apifavoritesmonumentid---ajouter-un-favori)
    - [❌ DELETE `/api/favorites/:monumentId` - Supprimer un favori](#-delete-apifavoritesmonumentid---supprimer-un-favori)
    - [📋 GET `/api/favorites` - Lister les favoris](#-get-apifavorites---lister-les-favoris)
  - [🔔 Partie 3 - Notifications WebSocket](#-partie-3---notifications-websocket)
    - [⚙️ Configuration Socket.io](#️-configuration-socketio)
    - [📡 Émission d'événements](#-émission-dévénements)
    - [📄 Format des notifications](#-format-des-notifications)
  - [🧪 Partie 4 - Tests et Simulation](#-partie-4---tests-et-simulation)
    - [🔐 1. Authentification](#-1-authentification)
    - [🏛️ 2. Tests des routes Monuments](#️-2-tests-des-routes-monuments)
    - [⭐ 3. Tests des routes Favoris](#-3-tests-des-routes-favoris)
    - [🔌 4. Tests WebSocket](#-4-tests-websocket)
    - [📱 Interface de test WebSocket](#-interface-de-test-websocket)
  <!-- - [🔒 Sécurité et Authentification](#-sécurité-et-authentification)
  - [⚠️ Gestion d'erreurs](#️-gestion-derreurs)
  - [📊 Base de données](#-base-de-données)
  - [🚀 Déploiement](#-déploiement) -->

<!-- ## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MySQL, Sequelize ORM
- **Authentification** : JWT (RS256)
- **WebSocket** : Socket.io
- **Documentation** : Swagger
- **Sécurité** : bcrypt, express-rate-limit
- **Outils** : nodemon, morgan

## 📁 Structure du projet

```
monumento-api/
├── 📄 server.js                    # Point d'entrée principal
├── 📄 helper.js                    # Gestion centralisée des erreurs
├── 📄 package.json                 # Dépendances et scripts
├── 📄 README.md                    # Documentation du projet
├── 🗂️ client/
│   ├── 📄 index.html               # Interface web principale
│   └── 📄 test-websocket.html      # Interface de test WebSocket
├── 🗂️ src/
│   ├── 🗂️ auth/
│   │   ├── 📄 auth.js              # Middleware d'authentification JWT
│   │   ├── 🔑 jwtRS256.key         # Clé privée JWT
│   │   └── 🔑 jwtRS256.key.pub     # Clé publique JWT
│   ├── 🗂️ db/
│   │   ├── 📄 sequelize.js         # Configuration Sequelize + Relations
│   │   └── 📄 monuments-list.js    # Données de seed (monuments)
│   ├── 🗂️ docs/
│   │   └── 📄 swagger.js           # Configuration Swagger UI
│   ├── 🗂️ models/
│   │   ├── 📄 monument.js          # Modèle Monument
│   │   ├── 📄 user.js              # Modèle User
│   │   ├── 📄 anecdote.js          # Modèle Anecdote
│   │   └── 📄 favorite.js          # ⭐ Modèle Favorite (nouveau)
│   ├── 🗂️ routes/
│   │   ├── 📄 createMonument.route.js        # POST monuments + WebSocket
│   │   ├── 📄 findAllMonuments.route.js      # GET monuments
│   │   ├── 📄 findMonumentByPK.route.js      # GET monument/:id
│   │   ├── 📄 updateMonument.route.js        # PUT monument/:id
│   │   ├── 📄 deleteMonument.route.js        # DELETE monument/:id
│   │   ├── 📄 searchMonuments.route.js       # GET monuments/search
│   │   ├── 📄 login.route.js                 # POST login
│   │   ├── 📄 register.route.js              # POST register
│   │   ├── 📄 refreshToken.route.js          # POST refresh-token
│   │   ├── 📄 addFavorite.route.js           # ⭐ POST favorites/:id (nouveau)
│   │   ├── 📄 removeFavorite.route.js        # ⭐ DELETE favorites/:id (nouveau)
│   │   └── 📄 getFavorites.route.js          # ⭐ GET favorites (nouveau)
│   └── 🗂️ socket/
│       └── 📄 index.js             # Configuration Socket.io + Chat
``` -->

<!-- ## 🚀 Installation et démarrage

```bash
# 1. Cloner le repository
git clone <repository-url>
cd monumento-api

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données MySQL
# Créer une base de données 'monumento'
# Modifier src/db/sequelize.js si nécessaire

# 4. Démarrer le serveur
npm start

# 5. Accès aux services
# API : http://localhost:3000
# Documentation Swagger : http://localhost:3000/api-docs
# Interface WebSocket : http://localhost:3000/client/test-websocket.html
``` -->

---

## 📖 Partie 1 - Système de Favoris

### 🗄️ Modèle Favorite

Création du modèle `Favorite` pour gérer la relation Many-to-Many entre `User` et `Monument`.

**Fichier** : [`src/models/favorite.js`](src/models/favorite.js)

```javascript
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Favorite', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: "L'ID de l'utilisateur est requis" },
                isInt: { msg: "L'ID de l'utilisateur doit être un nombre entier" }
            }
        },
        monumentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: "L'ID du monument est requis" },
                isInt: { msg: "L'ID du monument doit être un nombre entier" }
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'monumentId'],
                name: 'unique_user_monument_favorite'
            }
        ]
    });
};
```

**Caractéristiques** :

- ✅ Clé primaire auto-incrémentée
- ✅ Validation des champs requis
- ✅ Index unique composite pour éviter les doublons
- ✅ Timestamps personnalisés (`created` seulement)

### 🔗 Relations Many-to-Many

Configuration des associations Sequelize dans [`src/db/sequelize.js`](src/db/sequelize.js) :

```javascript
// Relations Many-to-Many User <-> Monument via Favorite
UserModel.belongsToMany(MonumentModel, { 
    through: FavoriteModel, 
    foreignKey: 'userId', 
    otherKey: 'monumentId',
    as: 'favoriteMonuments' 
});

MonumentModel.belongsToMany(UserModel, { 
    through: FavoriteModel, 
    foreignKey: 'monumentId', 
    otherKey: 'userId',
    as: 'favoritedByUsers' 
});

// Relations directes avec le modèle Favorite
UserModel.hasMany(FavoriteModel, { foreignKey: 'userId', as: 'favorites' });
FavoriteModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

MonumentModel.hasMany(FavoriteModel, { foreignKey: 'monumentId', as: 'favorites' });
FavoriteModel.belongsTo(MonumentModel, { foreignKey: 'monumentId', as: 'monument' });
```

---

## 🌐 Partie 2 - Routes API Favoris

### ➕ POST `/api/favorites/:monumentId` - Ajouter un favori

**Fichier** : [`src/routes/addFavorite.route.js`](src/routes/addFavorite.route.js)

**Fonctionnalités** :

- ✅ Authentification JWT requise
- ✅ Vérification de l'existence du monument
- ✅ Prévention des doublons (erreur 400)
- ✅ Gestion d'erreurs centralisée

**Exemple de requête** :

```http
POST /api/favorites/1
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json
```

**Réponse succès (201)** :

```json
{
  "message": "Le monument \"Tour Eiffel\" a été ajouté à vos favoris.",
  "data": {
    "id": 5,
    "userId": 1,
    "monumentId": 1,
    "created": "2025-09-19T10:15:00.000Z"
  }
}
```

**Réponse doublon (400)** :

```json
{
  "message": "Ce monument est déjà dans vos favoris",
  "data": null
}
```

### ❌ DELETE `/api/favorites/:monumentId` - Supprimer un favori

**Fichier** : [`src/routes/removeFavorite.route.js`](src/routes/removeFavorite.route.js)

**Fonctionnalités** :

- ✅ Suppression sécurisée (utilisateur connecté uniquement)
- ✅ Vérification de l'existence du favori
- ✅ Retour du nom du monument supprimé

**Exemple de requête** :

```http
DELETE /api/favorites/1
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Réponse succès (200)** :

```json
{
  "message": "Le monument \"Tour Eiffel\" a été supprimé de vos favoris.",
  "data": null
}
```

### 📋 GET `/api/favorites` - Lister les favoris

**Fichier** : `src/routes/getFavorites.route.js`

**Fonctionnalités** :

- ✅ Liste personnalisée par utilisateur
- ✅ Inclut les détails complets des monuments
- ✅ Tri par date d'ajout décroissante

**Exemple de requête** :

```http
GET /api/favorites
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Réponse (200)** :

```json
{
  "message": "1 monument(s) trouvé(s) dans vos favoris.",
  "data": [
    {
      "id": 2,
      "userId": 1,
      "monumentId": 2,
      "created": "2025-09-19T10:00:44.000Z",
      "monument": {
        "id": 2,
        "title": "Statue de la Liberté",
        "country": "États-Unis",
        "city": "New York",
        "buildYear": 1886,
        "picture": "https://github.com/ehformation/monumento/blob/main/images/statue-liberte.png?raw=true",
        "description": "Offerte par la France, cette statue est un symbole de liberté situé à l'entrée du port de New York."
      }
    }
  ]
}
```

---

## 🔔 Partie 3 - Notifications WebSocket

### ⚙️ Configuration Socket.io

**Modification de `server.js`** :

```javascript
const io = setupSocketServer(server);
app.set('io', io); // Rendre accessible aux routes
```

**Socket.io existant** (`src/socket/index.js`) :

- ✅ Authentification JWT pour WebSocket
- ✅ Chat en temps réel par monument
- ✅ Gestion des salles (`monument_${id}`)

### 📡 Émission d'événements

**Modification de [`src/routes/createMonument.route.js`](src/routes/createMonument.route.js)** :

```javascript
// Après création du monument
const io = app.get('io');
if (io) {
    const notificationData = {
        event: "newMonument",
        data: {
            id: createdMonument.id,
            title: createdMonument.title,
            description: createdMonument.description,
            createdAt: createdMonument.created || new Date()
        }
    };
    
    // Diffuser à tous les clients connectés
    io.emit('newMonument', notificationData);
    console.log('Notification WebSocket envoyée pour le nouveau monument:', createdMonument.title);
}
```

### 📄 Format des notifications

**Événement émis** : [`newMonument`](src\routes\createMonument.route.js#15#30)

**Structure JSON** :

```json
{
  "event": "newMonument",
  "data": {
    "id": 15,
    "title": "Arc de Triomphe",
    "description": "Construit pour célébrer les victoires de Napoléon",
    "createdAt": "2025-09-19T10:15:00Z"
  }
}
```

---

## 🧪 Partie 4 - Tests et Simulation

### 🔐 1. Authentification

Avant de tester les routes, obtenez un token JWT :

**Postman/Thunder Client** :

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Réponse** :

```json
{
  "message": "Authentification réussie",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
  }
}
```

### 🏛️ 2. Tests des routes Monuments

**Lister tous les monuments** :

```http
GET http://localhost:3000/api/monuments
Authorization: Bearer VOTRE_TOKEN
```

**Créer un monument** (+ notification WebSocket) :

```http
POST http://localhost:3000/api/monuments
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json

{
  "monument": {
    "title": "Arc de Triomphe",
    "country": "France",
    "city": "Paris",
    "buildYear": 1836,
    "description": "Construit pour célébrer les victoires de Napoléon"
  }
}
```

### ⭐ 3. Tests des routes Favoris

**Ajouter un favori** :

```http
POST http://localhost:3000/api/favorites/1
Authorization: Bearer VOTRE_TOKEN
```

**Lister mes favoris** :

```http
GET http://localhost:3000/api/favorites
Authorization: Bearer VOTRE_TOKEN
```

**Supprimer un favori** :

```http
DELETE http://localhost:3000/api/favorites/1
Authorization: Bearer VOTRE_TOKEN
```

**Test de doublon** :

```http
POST http://localhost:3000/api/favorites/1
Authorization: Bearer VOTRE_TOKEN
# (deux fois de suite) → Erreur 400 attendue
```

### 🔌 4. Tests WebSocket

**Outils utilisés** :

- 🌐 **Interface web** : `http://localhost:3000/client/test-websocket.html`
- 🛠️ **Postman** : WebSocket requests
<!-- - 📱 **Socket.io client** : Applications dédiées -->

**Scénario de test complet** :

1. **Connexion WebSocket** :

   ```javascript
   const socket = io('http://localhost:3000', {
     auth: { token: 'VOTRE_TOKEN' }
   });
   ```

2. **Écouter les notifications** :

   ```javascript
   socket.on('newMonument', (data) => {
     console.log('Nouveau monument créé:', data);
   });
   ```

3. **Créer un monument via API** :

   ```http
   POST /api/monuments
   # → Notification WebSocket émise automatiquement
   ```

4. **Vérifier la réception** :

   ```json
   {
     "event": "newMonument",
     "data": {
       "id": 15,
       "title": "Arc de Triomphe",
       "description": "Construit pour célébrer les victoires de Napoléon",
       "createdAt": "2025-09-19T10:15:00Z"
     }
   }
   ```

### 📱 Interface de test WebSocket

**URL** : `http://localhost:3000/client/test-websocket.html`

**Fonctionnalités** :

- ✅ Connexion WebSocket avec authentification JWT
- ✅ Log en temps réel des événements
- ✅ Interface utilisateur intuitive
- ✅ Gestion des erreurs de connexion

**Instructions d'utilisation** :

1. Ouvrir l'interface dans le navigateur
2. Coller le token JWT dans le champ prévu
3. Cliquer sur "Se connecter"
4. Créer un monument via Postman/Thunder Client
5. Observer la notification en temps réel

<!-- ---

## 🔒 Sécurité et Authentification

**JWT (RS256)** :

- ✅ Clés publique/privée RSA
- ✅ Payload inclut : `{ id, userName, iat, exp }`
- ✅ Expiration : 30 minutes (access) / 7 jours (refresh)
- ✅ Rate limiting sur la connexion (5 tentatives/15min)

**Validation des données** :

- ✅ Sequelize validators sur tous les modèles
- ✅ Gestion centralisée des erreurs (`helper.js`)
- ✅ Prévention des doublons au niveau base de données

**Middleware d'authentification** :

- ✅ Routes publiques : `/login`, `/register`, `/api-docs`
- ✅ Routes protégées : toutes les autres
- ✅ Vérification JWT sur WebSocket

---

## ⚠️ Gestion d'erreurs

**Types d'erreurs gérées** (`helper.js`) :

- ✅ `SequelizeValidationError` → 400 + détails
- ✅ `SequelizeUniqueConstraintError` → 400 + détails
- ✅ `TokenExpiredError` → 500
- ✅ `JsonWebTokenError` → 500
- ✅ Autres erreurs → 500 + message générique

**Format de réponse d'erreur** :

```json
{
  "message": "Description de l'erreur",
  "data": ["Détail 1", "Détail 2"] // ou null
}
```

---

## 📊 Base de données

**Tables créées** :

- 🗄️ `Users` - Utilisateurs (username, password, tokens)
- 🗄️ `Monuments` - Monuments (title, country, city, etc.)
- 🗄️ `Anecdotes` - Anecdotes liées aux monuments
- 🗄️ ⭐ `Favorites` - **Nouvelle table** pour les favoris

**Relations** :

- 👤 User ↔ Monument (Many-to-Many via Favorites)
- 🏛️ Monument → Anecdotes (One-to-Many)
- ⭐ User → Favorites (One-to-Many)
- ⭐ Monument → Favorites (One-to-Many)

**Index et contraintes** :

- ✅ Index unique sur `(userId, monumentId)` dans Favorites
- ✅ Clés étrangères avec contraintes d'intégrité
- ✅ Validation au niveau applicatif et base de données

---

## 🚀 Déploiement

**Variables d'environnement recommandées** :

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=monumento
DB_USER=root
DB_PASSWORD=your_password
JWT_PRIVATE_KEY_PATH=./src/auth/jwtRS256.key
JWT_PUBLIC_KEY_PATH=./src/auth/jwtRS256.key.pub
PORT=3000
```

**Scripts disponibles** :

```bash
npm start          # Démarrage production
npm run dev        # Développement avec nodemon
npm run migrate    # Synchronisation base de données
```

**Endpoints principaux** :

- 📖 **API Documentation** : `http://localhost:3000/api-docs`
- 🔌 **WebSocket Test** : `http://localhost:3000/client/test-websocket.html`
- 🏠 **Page d'accueil** : `http://localhost:3000/client/index.html`

---

## 📝 Résumé des fonctionnalités

✅ **Partie 1** - Modèle Favorite + Relations Many-to-Many  
✅ **Partie 2** - 3 routes API Favoris (POST, DELETE, GET)  
✅ **Partie 3** - Notifications WebSocket pour nouveaux monuments  
✅ **Partie 4** - Tests complets + Interface WebSocket  

**Bonus implémentés** :

- 🔐 Authentification JWT sécurisée
- 📚 Documentation Swagger complète
- 🎯 Gestion d'erreurs robuste
- 🚀 Interface de test intégrée
- 💾 Base de données optimisée avec index
 -->

---
Author : TABAR LABONNE Baptiste - Archi O24-25
