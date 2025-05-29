require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const vistaRoutes = require('./routes/vistaRoutes'); // para /api/castillos, /api/eventos

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/auth', authRoutes);
app.use('/api', vistaRoutes);

// Servir frontend desde carpeta pública
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });
