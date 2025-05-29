// frontend/js/reservaClient.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('availabilityContainer');
  const refreshBtn = document.getElementById('refreshBtn');

  async function cargarCastillos() {
    try {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      `;

      const response = await fetch('/api/castillos');
      if (!response.ok) throw new Error('Error al obtener castillos');
      
      const castillos = await response.json();
      
      if (castillos.length === 0) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <p class="text-muted">No hay castillos disponibles actualmente</p>
          </div>
        `;
        return;
      }

      container.innerHTML = castillos.map(castillo => `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <img src="${castillo.imagen || '../img/castillo-default.jpg'}" 
                 class="card-img-top" 
                 alt="${castillo.nombre}">
            <div class="card-body">
              <h5 class="card-title">${castillo.nombre}</h5>
              <p class="text-muted">${castillo.categoria}</p>
              <p class="card-text">${castillo.descripcion || 'Sin descripción'}</p>
            </div>
            <div class="card-footer bg-white">
              <button class="btn btn-primary w-100 reservar-btn" 
                      data-id="${castillo._id}">
                Reservar
              </button>
            </div>
          </div>
        </div>
      `).join('');

    } catch (err) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="alert alert-danger">${err.message}</div>
          <button class="btn btn-primary" onclick="location.reload()">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  refreshBtn.addEventListener('click', cargarCastillos);
  cargarCastillos(); // Carga inicial
});