class ReservasManager {
    constructor() {
        this.auth = new AuthService();
    }

    async init() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        await this.loadUserInfo();
        this.setupEventListeners();
        await this.loadCastillos();
    }

    async loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('user-email').textContent = user.email;
        }
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadCastillos());
        document.getElementById('eventos-tab').addEventListener('click', () => this.loadEventos());
        document.getElementById('packs-tab').addEventListener('click', () => this.loadPacks());
        document.getElementById('refreshEventosBtn').addEventListener('click', () => this.loadEventos());
        document.getElementById('refreshPacksBtn').addEventListener('click', () => this.loadPacks());
        document.getElementById('logout-btn').addEventListener('click', () => this.auth.logout());
    }

    async loadCastillos() {
        const tbody = document.getElementById('castillosTableBody');
        try {
            const castillos = await this.auth.loadCastillos();
            tbody.innerHTML = '';
            castillos.forEach(castillo => {
                tbody.innerHTML += this.renderCastilloRow(castillo);
            });
        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = this.renderErrorRow('Error al cargar los castillos');
        }
    }

    async loadEventos() {
        const tbody = document.getElementById('eventosTableBody');
        try {
            const eventos = await this.auth.loadEventos();
            tbody.innerHTML = '';
            eventos.forEach(evento => {
                tbody.innerHTML += this.renderEventoRow(evento);
            });
        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = this.renderErrorRow('Error al cargar los eventos');
        }
    }

    async loadPacks() {
        const container = document.getElementById('packsContainer');
        try {
            const packs = await this.auth.loadPacks();
            container.innerHTML = '';
            packs.forEach(pack => {
                container.innerHTML += this.renderPackCard(pack);
            });
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = this.renderError('Error al cargar los packs');
        }
    }

    renderCastilloRow(castillo) {
        return `
            <tr>
                <td><img src="${castillo.imagen}" alt="${castillo.nombre}" style="height: 50px;"></td>
                <td>${castillo.nombre}</td>
                <td>${castillo.descripcion}</td>
                <td>${castillo.capacidad} niños</td>
                <td>${castillo.dimensiones}</td>
                <td>
                    <span class="badge ${castillo.disponible ? 'bg-success' : 'bg-danger'}">
                        ${castillo.disponible ? 'Disponible' : 'Reservado'}
                    </span>
                </td>
            </tr>
        `;
    }

    renderEventoRow(evento) {
        return `
            <tr>
                <td>${new Date(evento.fecha).toLocaleDateString()}</td>
                <td>${evento.cliente}</td>
                <td>${evento.direccion}</td>
                <td>${evento.castillos.map(c => c.nombre).join(', ')}</td>
                <td>${evento.pack ? evento.pack.nombre : 'Sin pack'}</td>
                <td>
                    <span class="badge bg-${this.getStatusColor(evento.estado)}">
                        ${evento.estado}
                    </span>
                </td>
            </tr>
        `;
    }

    renderPackCard(pack) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${pack.imagen}" class="card-img-top" alt="${pack.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${pack.nombre}</h5>
                        <p class="card-text">${pack.descripcion}</p>
                        <ul class="list-unstyled">
                            <li><strong>Precio:</strong> ${pack.precio}€</li>
                            <li><strong>Descuento:</strong> ${pack.descuento}%</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    renderErrorRow(message) {
        return `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    ${message}. Por favor, intente más tarde.
                </td>
            </tr>
        `;
    }

    renderError(message) {
        return `
            <div class="col-12 text-center text-danger">
                ${message}. Por favor, intente más tarde.
            </div>
        `;
    }

    getStatusColor(estado) {
        switch(estado) {
            case 'pendiente': return 'warning';
            case 'confirmado': return 'success';
            case 'cancelado': return 'danger';
            default: return 'secondary';
        }
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    const reservasManager = new ReservasManager();
    reservasManager.init();
});