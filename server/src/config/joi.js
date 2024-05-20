import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le dossier de validations
const validationsPath = path.join(__dirname, '../validations');

// Lire tous les fichiers dans le dossier de validations
const validationFiles = fs.readdirSync(validationsPath);

// Charger toutes les extensions et les appliquer à Joi
let customJoi = Joi;

for (const file of validationFiles) {
    const extension = (await import(path.join(validationsPath, file))).default.joi;
    customJoi = customJoi.extend(extension);
}


export default customJoi;
