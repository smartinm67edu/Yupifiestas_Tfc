const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }],
    pack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pack'
    },
    ubicacion: String,
    precio: Number,
    descripcion: String
});

module.exports = mongoose.model('Evento', eventoSchema);