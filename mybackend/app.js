const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const conectarDB = require('./db');
const scoresRouter = require('./routes/scores');

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Conexión a MongoDB
conectarDB();

// Rutas
app.use('/api/scores', scoresRouter);

module.exports = app;
