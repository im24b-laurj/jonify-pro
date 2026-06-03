import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from 'music-metadata';
import pool from "../database.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();



router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM playlists');
    res.status(200).json({
        success: true,
        count: rows.length,
        playlists: rows
    });
})

router.get('/:id', async (req, res) => {
    const playlistId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM playlists WHERE id = ?', [playlistId]);
    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Playlist not found'
        });
    }
    res.status(200).json({
        success: true,
        playlist: rows[0]
    });
})
router.get('/all/songs', async (req, res) => {
    const [songs] = await pool.query('SELECT * FROM songs')
    if (songs.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No songs found for this playlist'
        });
    }
    res.status(200).json({
        success: true,
        count: songs.length,
        songs: songs
    });
})



router.get('/:id/songs', async (req, res) => {
    const playlistId = req.params.id;
    const [songs] = await pool.query('SELECT s.*, ps.time_added FROM songs s JOIN playlist_songs ps ON s.id = ps.song_id WHERE ps.playlist_id = ?', [playlistId]);
    if (songs.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No songs found for this playlist'
        });
    }

    res.status(200).json({
        success: true,
        count: songs.length,
        songs: songs
    });
})



router.post('/', async (req, res) => {
    const playlistId = req.body.name;
    await pool.query('INSERT INTO playlists (name) VALUES (?)', [playlistId]);
    res.status(201).json({
        success: true,
        message: 'Playlist created'
    });

})

router.post('/song', async (req, res) => {
    const playlistId = req.body.playlistId;
    const songId = req.body.songId;
    const current_time = new Date();
    try {const [result] = await pool.query('INSERT IGNORE INTO playlist_songs (playlist_id, song_id, time_added) VALUES (?, ?, ?)', [playlistId, songId, current_time]);
        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: 'Playlist or song not found, or song already in playlist'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Song added to playlist'
        });} catch (err) {
        res.status(500)
    }
})



router.delete('/del/:id', async(req, res) => {
    const playlistId = req.params.id;
    try{await pool.query('DELETE FROM playlists WHERE id = ?', [playlistId]);
    res.status(200).json({
        success: true,
        message: 'Playlist deleted'
    });} catch(err) {res.status(500)}

})
router.delete('/song', async(req, res) => {
    const playlistId = req.body.playlistId;
    const songId = req.body.songId;
    try{await pool.query('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?', [playlistId, songId]);
    res.status(200).json({
        success: true,
        message: 'Song removed from playlist'
    });} catch(err) {res.status(500)}
})

router.put('/:id', (req, res) => {
    const playlistId = req.params.id;
    const newName = req.body.name;
    try {
        pool.query('UPDATE playlists SET name = ? WHERE id = ?', [newName, playlistId])
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Playlist not found'
        });
    }
    res.status(200).json({
        success: true,
        message: 'Playlist renamed'
    });
})
export default router