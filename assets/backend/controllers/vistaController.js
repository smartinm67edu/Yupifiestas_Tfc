const Castillo = require('../models/Castillo');

exports.getCastillosDisponibles = async (req, res) => {
  try {
    const disponibles = await Castillo.find({ estado: 'disponible' });
    res.json(disponibles);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener castillos' });
  }
};
