Projet challenge OlivePeace

## Les participants
- AHMINDACHE Jawad (Jawad-Ahmindache)
- LAZAREVIC Stéphane (stephanelazarevic)
- IMAMI Hajar (imami07)

## Les fonctionnalités

### Jawad
  - Suppresion  
  - Component table
  - Component UseForm
  - Système de produits
  - Système de catégorie de produits et de promotion
  - Système de recherche facetée côté front et back avec design pattern QueryBuilder
  - Dashboard admin personalisable
  - Page Authentification et inscription
  - Admin : Gestion produit, promotion, catégorie de produit, utilisateurs
  - Envoi des mail de confirmation, stock épuisé 
  - Les fonctionnalités qui traite les requetes et les erreurs
  - Les middleware
  - La navbar (Sauf panier)
  - La page d'accueil
  - Page de commande et historique des commandes
  - Paiement stripe (non achevé)
  - Seeders (tous)
  - Suivi historique de stock
  - Blocage compte pendant 15 min si trop de tentatives
    
### Lazarevic Stéphane
  - Système de Panier
  - Gestion des stock v1 (Non mis en prod)
  
### Imami Hajar
  - Création d'un premier composable useForm (non achevé)
  - Envoi de mail alerte (non achevé)
  - Dossier RGPD pdf
## Installation du projet
1) cloner le projet
2) Copier le .env.example en .env à la racine du projet
3) Modifier les informations SMTP du .env (par défaut smtp de myges) donc mettre son email myges dans MAIL_FROM et MAIL_USER puis mettre son mot de passe myges dans MAIL_PASS.
(Si pas myges choisir un autre smtp mais faudra alors mettre un autre MAIL_HOST et peut être un autre port.)
4) Lancer le docker compose puis aller sur le conteneur olivepeace-server et faire un npm run seed

Les adresses par défaut de l'app : 

Front : http://localhost:5175

Api : http://localhost:3026

Url de la prod : https://olivepeace.hyarotech.com/
