import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { parseFile } from 'music-metadata';
import songsRouter from './routes/songs.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import streamRouter from './routes/stream.js'
import playlistRouter from './routes/playlists.js'
import { fileURLToPath } from 'url';
import pool from './database.js';
import {scanMusic} from './scanMusic.js'
await scanMusic();
await scanMusic();






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// Debug/health endpoints
app.get('/health', (req, res) => res.status(200).send('ok'));
app.get('/_routes', (req, res) => {
  const routes = [];
  const stack = app?._router?.stack ?? [];
  for (const layer of stack) {
    if (layer.route?.path) {
      routes.push({ path: layer.route.path, methods: layer.route.methods });
    } else if (layer.name === 'router' && layer.regexp) {
      routes.push({ mount: String(layer.regexp) });
    }
  }
  res.json(routes);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/songs', songsRouter);
app.use('/stream', streamRouter);
app.use('/playlists', playlistRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;
