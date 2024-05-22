import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../tmp');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Utiliser le chemin absolu du dossier
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(16).toString('hex'); // Génère un hash de 16 octets
        const ext = path.extname(file.originalname); // Obtient l'extension du fichier
        cb(null, `${hash}${ext}`);
    }
});

const upload = {};

upload.image = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extName) {
            return cb(null, true);
        }
        cb(new Error('Seuls les types de fichiers suivants sont autorisés: jpeg, jpg, png, webp et une taille de maximum 500ko'));
    },
    limits: { fileSize: 500000 }
});

export default upload;
