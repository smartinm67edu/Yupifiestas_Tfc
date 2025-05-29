const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    cliente: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }],
    pack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pack'
    },
    precioTotal: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'cancelado'],
        default: 'pendiente'
    }
}, { timestamps: true });

module.exports = mongoose.model('Evento', eventoSchema);