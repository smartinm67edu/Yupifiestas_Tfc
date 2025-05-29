class AuthService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/auth';
        this.token = localStorage.getItem('token');
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        if (!this.token && window.location.pathname.includes('reserva.html')) {
            window.location.href = 'login.html';
        }
    }

    async loadProtectedContent() {
        try {
            const response = await fetch('http://localhost:5000/api/castillos', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('No autorizado');
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            window.location.href = 'login.html';
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
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

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'reserva.html';
            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    username: email.split('@')[0]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            // Auto login after registration
            await this.login(email, password);
            return data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return !!this.token;
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