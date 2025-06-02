require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://smartinm67:U1IEy4r21jsjqiSx@cluster0.6wzykog.mongodb.net/Yupifiestas')
    .then(() => console.log('📡 MongoDB conectado'))
    .catch(err => console.error('❌ Error de conexión MongoDB:', err));

// Importar modelos
const User = require('./models/user');
const Castillo = require('./models/castillo');
const Evento = require('./models/evento');
const Pack = require('./models/pack');
const authMiddleware = require('./middleware/auth');

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta protegida para obtener castillos
app.get('/api/castillos', authMiddleware, async (req, res) => {
    try {
        const castillos = await Castillo.find();
        res.json(castillos);
    } catch (error) {
        console.error('Error al obtener castillos:', error);
        res.status(500).json({ message: 'Error al obtener castillos' });
    }
});

// Ruta para obtener eventos
app.get('/api/eventos', authMiddleware, async (req, res) => {
    try {
        const eventos = await Evento.find()
            .populate('castillos')
            .populate('pack');
        res.json(eventos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

// Ruta para obtener packs
app.get('/api/packs', authMiddleware, async (req, res) => {
    try {
        const packs = await Pack.find()
            .populate('castillos');
        res.json(packs);
    } catch (error) {
        console.error('Error al obtener packs:', error);
        res.status(500).json({ message: 'Error al obtener packs' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));