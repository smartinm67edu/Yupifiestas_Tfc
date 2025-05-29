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

async function loadCastillos() {
  const container = document.getElementById('availabilityContainer');
  
  try {
    const response = await fetch('http://localhost:5000/api/castillos');
    const castillos = await response.json();
    
    container.innerHTML = ''; // Limpiar spinner
    
    castillos.forEach(castillo => {
      const card = `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm castle-card">
            <img src="${castillo.imagen}" class="card-img-top" alt="${castillo.nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${castillo.nombre}</h5>
              <p class="card-text flex-grow-1">${castillo.descripcion}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span class="badge bg-info me-2">
                    <i class="fas fa-users me-1"></i>${castillo.capacidad} niños
                  </span>
                  <span class="badge bg-secondary">
                    <i class="fas fa-expand-arrows-alt me-1"></i>${castillo.dimensiones}
                  </span>
                </div>
                <span class="badge ${castillo.disponible ? 'badge-available' : 'badge-reserved'}">
                  ${castillo.disponible ? 'Disponible' : 'Reservado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });

  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          Error al cargar los castillos. Por favor, intente más tarde.
        </div>
      </div>
    `;
  }
}

// Cargar castillos al iniciar
document.addEventListener('DOMContentLoaded', loadCastillos);

// Recargar al hacer click en Actualizar 
document.getElementById('refreshBtn').addEventListener('click', loadCastillos);