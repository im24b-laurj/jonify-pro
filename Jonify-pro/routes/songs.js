import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from 'music-metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

import pool from "../database.js";



router.get('/cover/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT filepath FROM songs WHERE id = ?', [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Song not found' });

    const metadata = await parseFile(rows[0].filepath);
    const picture = metadata.common.picture?.[0];




    if (!picture) return res.status(404).json({ success: false, message: 'No cover found' });

    res.set('Content-Type', picture.format);
    res.send(Buffer.from(picture.data));
});


router.get('/', async (req, res) => {
    const [songs] = await pool.query("SELECT * FROM songs");
    res.status(200).json({
        success: true,
        count: songs.length,
        songs: songs
    });
})

router.get('/:id', async (req, res) => {
    const [songs] = await pool.query("SELECT * FROM songs");
    for (const i of songs) {
        if (i.id == req.params.id) {
            return res.status(200).json({
                success: true,
                song: i
            });
        }


    }

})










export default router