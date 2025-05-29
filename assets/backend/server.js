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

// Import models
const User = require('./models/user');
const Castillo = require('./models/castillo');

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('Recibida petición de registro:', req.body); // Debug log

        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Verificar si el usuario existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const user = new User({
            username: email.split('@')[0],
            email,
            password: hashedPassword
        });

        await user.save();
        console.log('Usuario guardado:', user); // Debug log

        res.status(201).json({ 
            message: 'Usuario registrado correctamente',
            userId: user._id 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        // Create token
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

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Autenticación fallida'
        });
    }
};

// Proteger ruta de castillos
app.get('/api/castillos', authMiddleware, async (req, res) => {
    try {
        const castillos = await Castillo.find();
        res.json(castillos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener castillos' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));