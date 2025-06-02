const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    imagen: String,
    precio: Number,
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }]
});

module.exports = mongoose.model('Pack', packSchema);