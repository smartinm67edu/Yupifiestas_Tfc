class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token');
    }

    // Add checkAuth method
    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    async register(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email.trim().toLowerCase(),
                    password 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw new Error(error.message || 'Error en el registro');
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el login');
            }

            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async loadCastillos() {
        try {
            const response = await this.fetchWithAuth('/castillos');
            console.log('Respuesta castillos:', response);
            return response;
        } catch (error) {
            console.error('Error cargando castillos:', error);
            throw error;
        }
    }

    // Add fetchWithAuth method
    async fetchWithAuth(endpoint) {
        if (!this.token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la petición');
        }

        return response.json();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Add data loading methods
    async loadEventos() {
        try {
            return await this.fetchWithAuth('/eventos');
        } catch (error) {
            console.error('Error cargando eventos:', error);
            throw error;
        }
    }

    async loadPacks() {
        try {
            return await this.fetchWithAuth('/packs');
        } catch (error) {
            console.error('Error cargando packs:', error);
            throw error;
        }
    }
}

// Initialize single instance
if (!window.authService) {
    window.authService = new AuthService();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const auth = new AuthService();

    // Login form handler
    document.getElementById('login-btn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            await auth.login(email, password);
        } catch (error) {
            alert(error.message);
        }
    });

    // Register form handler
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;

                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                await auth.register(email, password);
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Logout handler
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        auth.logout();
    });

    // Form toggle handlers
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // Verificar si estamos en la página de reservas
    if (window.location.pathname.includes('reserva.html')) {
        if (!window.authService.checkAuth()) {
            return;
        }
    }
});