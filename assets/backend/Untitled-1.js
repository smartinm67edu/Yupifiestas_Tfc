// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('tu_url_de_mongodb_atlas');

// Modelo
const Castillo = mongoose.model('Castillo', {
  nombre: String,
  imagen: String,
  descripcion: String,
  capacidad: Number,
  dimensiones: String,
  disponible: Boolean
});

// Rutas
app.get('/api/castillos', async (req, res) => {
  try {
    const castillos = await Castillo.find();
    res.json(castillos);
  } catch (error) {
    res.status(500).json({error: 'Error al obtener castillos'});
  }
});

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));