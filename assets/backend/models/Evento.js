const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    fecha: Date,
    imagen: String,
    precio: Number,
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }]
});

module.exports = mongoose.model('Evento', eventoSchema);