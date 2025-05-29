const mongoose = require('mongoose');

const castilloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String },
  estado: { type: String, enum: ['disponible', 'reservado'], default: 'disponible' }
});

module.exports = mongoose.model('Castillo', castilloSchema);
