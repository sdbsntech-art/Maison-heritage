# Maison Heritage — Full Stack

Boutique en ligne **React (Vite)** + **API Laravel 11** pour Maison Heritage by Bint Khalifa.

## Structure

| Dossier | Rôle |
|---------|------|
| `frontend/` | Site vitrine, boutique, panier, admin (React) |
| `backend/` | API REST : produits, commandes, auth admin (Laravel + Sanctum) |

## Démarrage rapide avec Docker (recommandé)

Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```powershell
cd "c:\Users\princ\OneDrive\Desktop\maison heritage"
docker compose up --build
```

- **Site** : http://localhost:5173  
- **API** : http://localhost:8000/api/health  

Identifiants admin (API + fallback local) :  
- Utilisateur : `SOKHNA DIBOR DIOUF`  
- Mot de passe : `ZAYEL`  

## Installation manuelle (sans Docker)

### 1. Backend Laravel

Prérequis : PHP 8.2+, Composer, extension `pdo_sqlite`

```powershell
cd backend
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan serve
```

API disponible sur http://127.0.0.1:8000

### 2. Frontend React

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Le proxy Vite envoie `/api` vers `http://localhost:8000` (voir `vite.config.js`).

Variable optionnelle : `VITE_API_URL=/api` (défaut) ou `http://localhost:8000/api`

## Endpoints API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/health` | Non | Santé de l’API |
| GET | `/api/products` | Non | Liste des produits |
| POST | `/api/orders` | Non | Créer une commande (panier WhatsApp) |
| POST | `/api/admin/login` | Non | Connexion admin → token Bearer |
| POST | `/api/products` | Oui | Ajouter un produit |
| PUT | `/api/products/{id}` | Oui | Modifier produit / prix / photo |
| DELETE | `/api/products/{id}` | Oui | Supprimer un produit |
| GET | `/api/orders` | Oui | Commandes admin |
| PATCH | `/api/orders/{id}/status` | Oui | Changer le statut |
| GET | `/api/stats` | Oui | Tableau investissement |

## Comportement hors ligne

Si l’API n’est pas joignable, le frontend continue avec **localStorage** (produits, commandes, admin local). Dès que Laravel répond, les données sont synchronisées depuis le serveur.

## Production

1. Backend : MySQL dans `.env`, `php artisan migrate --force`, hébergement PHP (Forge, VPS, etc.)  
2. Frontend : `npm run build` → déployer `frontend/dist`  
3. Définir `VITE_API_URL=https://votre-domaine.com/api` avant le build  

---

© Maison Heritage by Bint Khalifa — Dakar, Sénégal
