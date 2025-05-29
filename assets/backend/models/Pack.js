const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }],
    precio: { type: Number, required: true },
    descuento: { type: Number, default: 0 },
    imagen: { type: String, required: true }
});

module.exports = mongoose.model('Pack', packSchema);