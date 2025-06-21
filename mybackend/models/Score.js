const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  jugador: String,
  puntos: Number,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
