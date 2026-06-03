import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from 'music-metadata';
import db from './database.js';
import pool from "./database.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

export { scanMusic}
const musicFolder = path.join("../Jonify-pro/music");

async function scanMusic() {

    const files = fs.readdirSync(musicFolder);

    for (const file of files) {

        if (!file.endsWith(".mp3")) continue;

        const filePath = path.join(musicFolder, file);

        try {

            const metadata = await parseFile(filePath);

            const title =
                metadata.common.title || file;

            const artist =
                metadata.common.artist || "Unknown";

            const album =
                metadata.common.album || "Unknown";

            const duration =
                metadata.format.duration || 0;

            await pool.query("INSERT IGNORE INTO songs(title, artist, album, duration, filepath) VALUES (?, ?, ?, ?, ?)", [title, artist, album, duration, filePath])

            console.log(`Added: ${title}`);


        } catch (err) {

            console.log("Error reading file:", file);
        }
    }

await pool.query("INSERT IGNORE INTO playlists (name) VALUES ('AllSongs')")
const [[allSongsPlaylist]] = await pool.query("SELECT id FROM playlists WHERE name = 'AllSongs'")
const [songs] = await pool.query('SELECT * FROM songs')
for (const i of songs) {
    await pool.query("INSERT IGNORE INTO playlist_songs (playlist_id, song_id, time_added) VALUES (?, ?, NOW())", [allSongsPlaylist.id, i.id])
}}

