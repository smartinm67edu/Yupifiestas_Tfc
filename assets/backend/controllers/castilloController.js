// backend/controllers/castilloController.js
const Castillo = require('../models/Castillo');

exports.getCastillosDisponibles = async (req, res) => {
  try {
    const castillos = await Castillo.find({ estado: 'disponible' });
    res.json(castillos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};