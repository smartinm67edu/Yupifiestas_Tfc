const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routers
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de MongoDB:', err));

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes); 
app.use('/api/reservas', reservaRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor de Yupifiestas funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Servidor en http://localhost:${PORT}`));