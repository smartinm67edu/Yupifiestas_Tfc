class AuthService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/auth';
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
                    password
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const auth = new AuthService();

    document.getElementById('register-btn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (!email || !password) {
                throw new Error('Por favor complete todos los campos');
            }

            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            const result = await auth.register(email, password);
            alert(result.message);
            
            // Clear form and show login
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
            
        } catch (error) {
            alert(error.message);
        }
    });
});