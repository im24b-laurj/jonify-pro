import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from "../database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/:id', async (req, res) => {

    const [rows] = await pool.query('SELECT filepath FROM songs WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Song not found' })
    const filePath = rows[0].filepath
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File missing' })


    const fileSize = fs.statSync(filePath).size
    const range = req.headers.range


    if (range) {

        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunkSize = end - start + 1

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg'
        })

        fs.createReadStream(filePath, { start, end }).pipe(res)
    } else {

        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
            'Accept-Ranges': 'bytes'
        })
        fs.createReadStream(filePath).pipe(res)
    }
})

export default router;
