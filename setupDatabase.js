
import pool from './database.js'
import path from "path";
import fs from "fs";
import {parseFile} from "music-metadata";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    await pool.execute('DROP TABLE IF EXISTS playlist_songs;');
    await pool.execute('DROP TABLE IF EXISTS songs;');
    await pool.execute('DROP TABLE IF EXISTS playlists;')







    await pool.execute(`
        CREATE TABLE IF NOT EXISTS songs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            artist VARCHAR(255),
            album VARCHAR(255),
            duration FLOAT,
            filepath TEXT UNIQUE
        ) `);
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS playlists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS playlist_songs (
            playlist_id INT,
            song_id INT,
            time_added TIMESTAMP,
            PRIMARY KEY (playlist_id, song_id),
            FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
            FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
        )
    `);


    console.log("Songs table created");
}

setupDatabase();