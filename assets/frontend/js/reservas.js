class ReservasManager {
    constructor() {
        this.init();
    }

    async init() {
        if (!window.authService.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        this.setupEventListeners();
        await this.loadAllData();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadCastillos());
        document.getElementById('refreshEventosBtn')?.addEventListener('click', () => this.loadEventos());
        document.getElementById('refreshPacksBtn')?.addEventListener('click', () => this.loadPacks());
        document.getElementById('logout-btn')?.addEventListener('click', () => window.authService.logout());
    }

    async loadAllData() {
        await Promise.all([
            this.loadCastillos(),
            this.loadEventos(),
            this.loadPacks()
        ]);
    }

    async loadCastillos() {
        try {
            const castillos = await window.authService.loadCastillos();
            const tbody = document.getElementById('castillosTableBody');
            tbody.innerHTML = castillos.map(castillo => `
                <tr>
                    <td><img src="${castillo.imagen}" alt="${castillo.nombre}" height="50"></td>
                    <td>${castillo.nombre}</td>
                    <td>${castillo.descripcion}</td>
                    <td>${castillo.capacidad} personas</td>
                    <td>${castillo.dimensiones}</td>
                    <td>${castillo.disponible ? 
                        '<span class="badge bg-success">Disponible</span>' : 
                        '<span class="badge bg-danger">No disponible</span>'}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading castillos:', error);
        }
    }

    async loadEventos() {
        try {
            const eventos = await window.authService.loadEventos();
            const tbody = document.getElementById('eventosTableBody');
            tbody.innerHTML = eventos.map(evento => `
                <tr>
                    <td>${evento.descripcion}</td>
                    <td>${evento.precio}€</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading eventos:', error);
            const tbody = document.getElementById('eventosTableBody');
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error al cargar los eventos
                    </td>
                </tr>
            `;
        }
    }

    async loadPacks() {
        try {
            const packs = await window.authService.loadPacks();
            const container = document.getElementById('packsContainer');
            container.innerHTML = packs.map(pack => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${pack.nombre}</h5>
                            <p class="card-text">${pack.descripcion}</p>
                            <p class="card-text">
                                <strong>Precio:</strong> ${pack.precio}€
                                ${pack.descuento ? `<span class="badge bg-danger">-${pack.descuento}%</span>` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading packs:', error);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.reservasManager = new ReservasManager();
});