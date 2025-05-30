require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error de conexión MongoDB:', err));

// Import User model
const User = require('./models/user');
const authMiddleware = require('./middleware/auth');
const Castillo = require('./models/castillo');
const Evento = require('./models/evento');
const Pack = require('./models/pack');

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send response
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
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));