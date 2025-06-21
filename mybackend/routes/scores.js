// routes/scores.js
const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

//GET para obtener puntajes
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    console.error('Error al obtener los puntajes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST para agregar un nuevo puntaje
router.post('/', async (req, res) => {
  const { jugador, puntos } = req.body;

  const nuevoScore = new Score({
    jugador,
    puntos
  });

  try {
    const scoreGuardado = await nuevoScore.save();
    res.status(201).json(scoreGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
