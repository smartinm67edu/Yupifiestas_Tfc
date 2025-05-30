class AuthService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en el login');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async register(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    async loadCastillos() {
        return this.fetchProtectedResource('/castillos');
    }

    async loadEventos() {
        return this.fetchProtectedResource('/eventos');
    }

    async loadPacks() {
        return this.fetchProtectedResource('/packs');
    }

    async fetchProtectedResource(endpoint) {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Error al cargar ${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    getToken() {
        return this.token;
    }
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
    document.getElementById('register-btn')?.addEventListener('click', async (e) => {
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
});