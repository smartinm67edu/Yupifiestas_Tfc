document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('availabilityContainer');

  async function cargarCastillos() {
    try {
      const res = await fetch('/castillos');
      const castillos = await res.json();

      container.innerHTML = '';

      if (!Array.isArray(castillos) || castillos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay castillos disponibles.</p>';
        return;
      }

      castillos.forEach(c => {
        const div = document.createElement('div');
        div.className = 'col-md-4';
        div.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${c.nombre}</h5>
              <p class="card-text">Categoría: ${c.categoria || 'Sin categoría'}</p>
              <p class="card-text ${c.estado === 'disponible' ? 'text-success' : 'text-danger'}">
                Estado: ${c.estado}
              </p>
            </div>
          </div>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error('Error al cargar castillos:', err);
      container.innerHTML = '<p class="text-danger">Error al cargar castillos disponibles</p>';
    }
  }

  cargarCastillos();
});
