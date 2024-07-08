import path from 'path';
import { fileURLToPath } from 'url';

// Utilisation de import.meta.url et fileURLToPath pour obtenir le chemin absolu
const __filename = fileURLToPath(import.meta.url); //je veux retourner dans le dossier parent
export const __root = path.dirname(__filename)+"/..";