import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/:id', (req, res) => {
    const songId = req.params.id;
    const musicFolder = path.join(__dirname, "../music");
    const filePath = path.join(musicFolder, songId);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'audio/mpeg');
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } else {
        res.status(404).json({
            success: false,
            message: 'Song not found'
        });
    }
})

export default router;
