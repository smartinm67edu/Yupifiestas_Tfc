const mongoose = require('mongoose');

const castilloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { 
    type: String, 
    enum: ['infantil', 'eventos', 'acuatico', 'otros'],
    required: true 
  },
  estado: { 
    type: String, 
    enum: ['disponible', 'reservado'], 
    default: 'disponible' 
  },
  imagen: String,
  descripcion: String,
  precio: Number
});

module.exports = mongoose.model('Castillo', castilloSchema);