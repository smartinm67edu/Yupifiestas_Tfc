require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Castillo = require('./models/Castillo');
const Evento = require('./models/Evento');
const Pack = require('./models/Pack');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas para Castillos
app.get('/api/castillos', async (req, res) => {
    try {
        const castillos = await Castillo.find();
        res.json(castillos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener castillos' });
    }
});

// Rutas para Eventos
app.get('/api/eventos', async (req, res) => {
    try {
        const eventos = await Evento.find()
            .populate('castillos')
            .populate('pack');
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener eventos' });
    }
});

// Rutas para Packs
app.get('/api/packs', async (req, res) => {
    try {
        const packs = await Pack.find().populate('castillos');
        res.json(packs);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener packs' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));