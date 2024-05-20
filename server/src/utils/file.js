import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir __filename et __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function moveFile(from, to) {
    try {
        await fs.rename(from, to);
    } catch (err) {
        if (err.code === 'EXDEV')
            await copyAndDelete(from, to);
        else
            throw err;

    }
}

async function copyAndDelete(from, to) {
    try {
        await fs.copyFile(from, to);
        await fs.unlink(from);
    } catch (err) {
        throw err;
    }
}

async function moveTmpToUpload(fileName) {
    const tmpDir = path.join(__dirname, '../tmp');
    const uploadDir = path.join(__dirname, '../uploads');

    const from = path.join(tmpDir, fileName);
    const to = path.join(uploadDir, fileName);

    try {
        await fs.access(from);
        await moveFile(from, to);
    } catch (err) {
        if (err.code === 'ENOENT')
            console.log(`Le fichier ${from} n'existe pas`);
        else
            throw err;

    }
}

export {
    moveFile,
    moveTmpToUpload
};
