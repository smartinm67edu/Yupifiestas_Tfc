const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    imagen: { 
        type: String 
    },
    precio: { 
        type: Number, 
        required: true 
    },
    descuento: { 
        type: Number, 
        default: 0 
    },
    castillos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Castillo'
    }]
});

module.exports = mongoose.model('Pack', packSchema);