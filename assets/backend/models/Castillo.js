const mongoose = require('mongoose');

const castilloSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    imagen: String,
    dimensiones: String,
    capacidad: String,
    edad: String,
    precio: Number
});

module.exports = mongoose.model('Castillo', castilloSchema);