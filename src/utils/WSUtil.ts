import { request, APIRequestContext } from '@playwright/test';
import { API_PROXI } from '../../config/env';

export class WSUtil {
    private static requestContext: APIRequestContext;

    /**
     * Initialise le contexte de requête Playwright (à appeler une seule fois au début)
     * @param proxy Activer/désactiver le proxy
     */
    public static async init(proxy: boolean = false) {
        WSUtil.requestContext = await request.newContext({
            proxy: proxy && API_PROXI ? { server: API_PROXI } : undefined
        });
    }

    /**
     * Appel Webservice avec Playwright
     * @param uri - URL du webservice
     * @param method - Méthode HTTP (GET, POST, PUT, DELETE)
     * @param queryString - Paramètres de requête
     * @param headers - En-têtes HTTP sous forme de chaîne ("Content-Type=application/json;Authorization=Bearer xxx")
     * @param payload - Corps de la requête (JSON ou texte brut)
     * @param apiAuth - Token d'authentification (Basic ou Bearer)
     * @param expectedStatus - Statut HTTP attendu (ex: 200)
     * @param log - Activer/désactiver les logs
     * @returns Réponse du webservice sous forme de string
     */
    public static async callWS(
        uri: string,
        method: string,
        queryString: string | null = null,
        headers: string | null = null,
        payload: string | null = null,
        apiAuth: string | null = null,
        expectedStatus: number = 200,
        log: boolean = false
    ): Promise<string> {
        if (!WSUtil.requestContext) {
            throw new Error("WSUtil non initialisé. Appelle WSUtil.init() avant d'utiliser callWS.");
        }

        // Construction de l'URL avec query string
        if (queryString) {
            const encodedQuery = new URLSearchParams(queryString).toString();
            uri = `${uri}?${encodedQuery}`;
        }

        // Construction des headers
        const headersObject: Record<string, string> = {};
        if (headers) {
            headers.split(";").forEach(header => {
                const [key, value] = header.split("=");
                if (key && value) headersObject[key.trim()] = value.trim();
            });
        }

        // Ajout de l'authentification
        if (apiAuth) {
            headersObject["Authorization"] = apiAuth.startsWith("Basic") || apiAuth.startsWith("Bearer")
                ? apiAuth
                : `Basic ${apiAuth}`;
        }

        try {
            // Exécution de la requête
            const response = await WSUtil.requestContext.fetch(uri, {
                method: method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE",
                headers: headersObject,
                ...(payload && method !== "GET" && method !== "DELETE" ? { body: payload } : {})
            });
            

            const status = response.status();
            const responseBody = await response.text();

            // Vérification du statut attendu
            if (expectedStatus !== -1 && status !== expectedStatus) {
                console.error(`Erreur: statut HTTP ${status} au lieu de ${expectedStatus}`);
            }

            // Logging
            if (log) {
                console.log(`Requête ${method} ${uri}`);
                console.log(`Statut: ${status}`);
                console.log(`Réponse: ${responseBody.substring(0, 500)}...`); // Tronque si trop long
            }

            return responseBody;
        } catch (error) {
            console.error(`Exception dans callWS:`, error);
            return "exception";
        }
    }
}
