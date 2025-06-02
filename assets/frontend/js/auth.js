class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token');
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
            
            // Actualizar el email del usuario en la interfaz
            this.updateUserDisplay();
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    updateUserDisplay() {
        const userEmail = document.getElementById('user-email');
        if (userEmail) {
            const user = JSON.parse(localStorage.getItem('user'));
            userEmail.textContent = user ? user.email : '';
        }
    }

    async fetchWithAuth(endpoint) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la petición');
        }

        return response.json();
    }

    async loadCastillos() {
        return this.fetchWithAuth('/castillos');
    }

    async loadEventos() {
        return this.fetchWithAuth('/eventos');
    }

    async loadPacks() {
        return this.fetchWithAuth('/packs');
    }

    isAuthenticated() {
        return !!this.token;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

window.authService = new AuthService();

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