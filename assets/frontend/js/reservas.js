class ReservasManager {
    constructor() {
        if (!window.authService) {
            console.error('AuthService no está inicializado');
            return;
        }
        this.init();
    }

    async init() {
        try {
            if (!window.authService.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            console.log('Iniciando carga de datos...');
            await this.loadAllData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error en inicialización:', error);
        }
    }

    setupEventListeners() {
        // Refresh buttons
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadCastillos());
        document.getElementById('refreshEventosBtn')?.addEventListener('click', () => this.loadEventos());
        document.getElementById('refreshPacksBtn')?.addEventListener('click', () => this.loadPacks());
    }

    async loadAllData() {
        try {
            console.log('Cargando todos los datos...');
            await Promise.all([
                this.loadCastillos(),
                this.loadEventos(),
                this.loadPacks()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    async loadCastillos() {
        try {
            const tableBody = document.getElementById('castillosTableBody');
            if (!tableBody) {
                console.error('No se encontró la tabla de castillos');
                return;
            }

            // Mostrar spinner
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </td>
                </tr>
            `;

            console.log('Solicitando castillos...');
            const castillos = await window.authService.loadCastillos();
            console.log('Castillos recibidos:', castillos);

            if (!castillos || castillos.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">No hay castillos disponibles</td>
                    </tr>
                `;
                return;
            }

            // Renderizar castillos
            tableBody.innerHTML = castillos.map(castillo => `
                <tr>
                    <td>
                        <img src="${castillo.imagen || '../img/castillos/default.jpg'}" 
                             alt="${castillo.nombre}"
                             class="img-thumbnail"
                             style="width: 100px">
                    </td>
                    <td>${castillo.nombre}</td>
                    <td>${castillo.descripcion || 'Sin descripción'}</td>
                    <td>${castillo.capacidad || 'N/A'}</td>
                    <td>${castillo.dimensiones || 'N/A'}</td>
                    <td>
                        <span class="badge bg-success">Disponible</span>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading castillos:', error);
            document.getElementById('castillosTableBody').innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error al cargar los castillos: ${error.message}
                    </td>
                </tr>
            `;
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.reservasManager) {
        window.reservasManager = new ReservasManager();
    }
});