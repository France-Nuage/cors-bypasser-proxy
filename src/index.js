/**
 * Proxy API dynamique pour Cloudflare Workers
 * Ce worker agit comme un proxy pour toute API, en configurant automatiquement
 * l'en-tête Host et en gérant les problèmes CORS.
 */

// Gestionnaire principal pour toutes les requêtes
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

/**
* Gère les requêtes entrantes
* @param {Request} request - La requête HTTP entrante
* @returns {Response} La réponse HTTP à renvoyer
*/
async function handleRequest(request) {
// Gérer les requêtes CORS préliminaires (OPTIONS)
if (request.method === 'OPTIONS') {
    return handleCORS();
}

// Obtenir l'URL de l'API cible à partir des paramètres de requête
const url = new URL(request.url);
const targetUrl = url.searchParams.get('url');

// Vérifier si une URL cible est fournie
if (!targetUrl) {
    return jsonResponse(
    { 
        error: 'Paramètre URL manquant',
        usage: 'Ajoutez ?url=https://api-exemple.com/chemin à votre requête',
        example: `${url.origin}?url=https://formbricks.com/api/oss-friends`
    }, 
    400
    );
}

try {
    // Extraire le nom d'hôte et d'autres informations de l'URL cible
    const targetUrlObj = new URL(targetUrl);
    const hostName = targetUrlObj.hostname;
    
    // Conserver la méthode HTTP originale
    const method = request.method;
    const headers = new Headers({
    'Host': hostName,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Vous pouvez ajouter d'autres en-têtes si nécessaire
    });

    // Préparer les options de requête pour fetch
    const fetchOptions = {
    method: method,
    headers: headers,
    };

    // Si la requête contient un corps (POST, PUT, etc.), le transmettre
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
    fetchOptions.body = await request.text();
    }
    
    // Effectuer la requête vers l'API cible
    const response = await fetch(targetUrl, fetchOptions);
    
    // Vérifier si la réponse est JSON
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
    // Pour les réponses JSON
    const data = await response.json();
    return jsonResponse(data);
    } else {
    // Pour les autres types de réponses
    const text = await response.text();
    return new Response(text, {
        status: response.status,
        headers: corsHeaders(contentType)
    });
    }
} catch (error) {
    // Gérer les erreurs
    return jsonResponse({ 
    error: error.message,
    details: "Une erreur s'est produite lors de la tentative d'accès à l'API cible"
    }, 500);
}
}

/**
* Renvoie une réponse JSON avec les en-têtes CORS appropriés
* @param {Object} data - Les données à envoyer sous forme de JSON
* @param {number} status - Le code d'état HTTP (défaut: 200)
* @returns {Response} La réponse HTTP formatée
*/
function jsonResponse(data, status = 200) {
return new Response(JSON.stringify(data), {
    status: status,
    headers: corsHeaders('application/json')
});
}

/**
* Gère les requêtes préliminaires CORS (OPTIONS)
* @returns {Response} Une réponse vide avec les en-têtes CORS
*/
function handleCORS() {
return new Response(null, {
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
    }
});
}

/**
* Génère les en-têtes CORS pour un type de contenu donné
* @param {string} contentType - Le type de contenu de la réponse
* @returns {Headers} Les en-têtes HTTP à utiliser
*/
function corsHeaders(contentType) {
const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Cache-Control': 'max-age=3600'
});

if (contentType) {
    headers.set('Content-Type', contentType);
}

return headers;
}