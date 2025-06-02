require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('📡 MongoDB conectado'))
    .catch(err => {
        console.error('❌ Error de conexión MongoDB:', err);
        process.exit(1);
    });

// Import models
const User = require('./models/user');
// Modelos
const Castillo = require('./models/castillo');
const Evento = require('./models/evento');
const Pack = require('./models/pack');

// Auth middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Autenticación fallida' });
    }
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Rutas protegidas
app.get('/api/castillos', authMiddleware, async (req, res) => {
    try {
        const castillos = await Castillo.find();
        console.log('Castillos encontrados:', castillos.length);
        res.json(castillos);
    } catch (error) {
        console.error('Error al obtener castillos:', error);
        res.status(500).json({ 
            message: 'Error al obtener castillos',
            error: error.message 
        });
    }
});

app.get('/api/eventos', authMiddleware, async (req, res) => {
    try {
        const eventos = await Evento.find();
        console.log('Eventos encontrados:', eventos.length);
        res.json(eventos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

app.get('/api/packs', authMiddleware, async (req, res) => {
    try {
        const packs = await Pack.find();
        console.log('Packs encontrados:', packs.length);
        res.json(packs);
    } catch (error) {
        console.error('Error al obtener packs:', error);
        res.status(500).json({ message: 'Error al obtener packs' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));