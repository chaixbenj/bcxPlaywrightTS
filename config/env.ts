import * as dotenv from 'dotenv';
import * as path from 'path';

// Détermine l'environnement actif (par défaut : recette)
const environment = process.env.ENVIRONMENT || 'recette';

// Charge le fichier .env correspondant à l'environnement actif
const envPath = path.resolve(__dirname, `../.env.${environment}`);
dotenv.config({ path: envPath });

// Expose les variables d'environnement
export const ENVIRONMENT = process.env.ENVIRONMENT || 'recette';
export const BASE_URL = process.env.BASE_URL || 'http://localhost';
export const TIMEOUT =  parseInt(process.env.TIMEOUT || '60000', 10);
export const USERNAME = process.env.USERNAME || 'defaultUser';
export const PASSWORD = process.env.PASSWORD || 'defaultPassword';
export const DATA_PATH = process.env.DATA_PATH || 'data/';
export const SQL_PATH = process.env.SQL_PATH || 'data/';
export const ACTION_TIMEOUT = parseInt(process.env.ACTION_TIMEOUT || '10000', 10);
export const ASSERT_TIMEOUT = parseInt(process.env.ASSERT_TIMEOUT || '10000', 10);
export const API_PROXI = process.env.API_PROXI || null;
export const USE_AI = process.env.USE_AI || false;
export const ENTRY_ELEMENT = process.env.ENTRY_ELEMENT || 'input, textarea';
export const CLICKABLE_ELEMENT = process.env.CLICKABLE_ELEMENT || 'button, a, input, li, ul, select, option';
export const ATTRIBUTE_POTENTIAL_ELEMENT = process.env.ATTRIBUTE_POTENTIAL_ELEMENT || 'id, name, placeholder, data-qa, data-test-id, aria-label, title, href';
export const APPIUM_PORT = 4723;
export const APPIUM_HOST = '127.0.0.1';


// Vérification si les variables critiques sont manquantes
if (!BASE_URL) {
    throw new Error(`La variable BASE_URL est manquante dans le fichier .env.${environment}`);
}

export const MYSQL_CONFIG = {
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "MyKanbansDev",
};