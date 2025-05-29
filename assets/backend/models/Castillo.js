const mongoose = require('mongoose');

const castilloSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagen: { type: String, required: true },
    descripcion: { type: String, required: true },
    capacidad: { type: Number, required: true },
    dimensiones: { type: String, required: true },
    disponible: { type: Boolean, default: true },
    precio: { type: Number, required: true }
});

module.exports = mongoose.model('Castillo', castilloSchema);