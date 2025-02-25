# Proxy API Dynamique pour Cloudflare Workers

Ce projet fournit un proxy API dynamique déployable sur Cloudflare Workers. Il permet de contourner les restrictions CORS et de définir automatiquement l'en-tête `Host` lors de l'accès à des API tierces.

## Fonctionnalités

- ✅ Calcul automatique de l'en-tête `Host` en fonction de l'URL cible
- ✅ Gestion des requêtes CORS (Cross-Origin Resource Sharing)
- ✅ Support des méthodes HTTP (GET, POST, PUT, etc.)
- ✅ Gestion des réponses JSON et non-JSON
- ✅ Facile à déployer sur Cloudflare Workers

## Déploiement

### Prérequis

- Un compte [Cloudflare](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (l'outil CLI de Cloudflare Workers)

### Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/dynamic-api-proxy.git
   cd dynamic-api-proxy
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Connectez Wrangler à votre compte Cloudflare :
   ```bash
   npx wrangler login
   ```

4. Déployez le worker :
   ```bash
   npm run publish
   ```

## Utilisation

Une fois déployé, vous pouvez utiliser votre Worker comme suit :

```
https://url-of-your-server-that-host-this-proxy.com?url=https://api-cible.com/chemin
```

### Exemple d'utilisation avec Plasmic

Dans Plasmic, configurez le composant REST API avec l'URL suivante :

```
https://url-of-your-server-that-host-this-proxy.com?url=https://formbricks.com/api/oss-friends
```

### Paramètres

- `url` (obligatoire) : L'URL de l'API cible à appeler

## Développement local

Pour tester le worker localement :

```bash
npm run dev
```

Cela démarrera un serveur local sur `http://localhost:8787`.

## Personnalisation

Vous pouvez personnaliser le comportement du proxy en modifiant le fichier `src/index.js`.

## Sécurité

Ce proxy est configuré pour autoriser les requêtes depuis n'importe quelle origine (`Access-Control-Allow-Origin: *`). Pour une version de production, il est recommandé de restreindre cela à votre domaine spécifique.

## Licence

[MIT](LICENSE)