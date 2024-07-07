import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedValidationsPath = path.join(__dirname, './../validations/rules');
const validationPath = path.join(__dirname, './../../src/validations/rules');

const sharedValidationFiles = fs.readdirSync(sharedValidationsPath);
const validationFiles = fs.readdirSync(validationPath);

let customJoi = Joi;

// Fonction pour charger et étendre les fichiers de validation
const extendJoiWithFiles = async (files, directory) => {
    for (const file of files) {
        const extensionPath = path.join(directory, file);
        if(!extensionPath.endsWith('.js') && !extensionPath.endsWith('.ts'))
            continue;

        const extensionModule = await import(extensionPath);
        try{
            customJoi = customJoi.extend(extensionModule.default.joi);
        }catch (e){}
    }
};

await extendJoiWithFiles(sharedValidationFiles, sharedValidationsPath);

await extendJoiWithFiles(validationFiles, validationPath);

export default customJoi;
