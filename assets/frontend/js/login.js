document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');

  // Alternar formularios
  showRegister?.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });

  showLogin?.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  // Registro
  registerBtn?.addEventListener('click', async () => {
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!email || !password || !confirmPassword) return alert('Completa todos los campos');
    if (password !== confirmPassword) return alert('Las contraseñas no coinciden');

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.status === 201) {
        alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        showLogin.click();
      } else {
        alert(`❌ ${data.message || 'Error al registrarse'}`);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error al conectar con el servidor');
    }
  });

  // Login
  loginBtn?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) return alert('Completa todos los campos');

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/index.html';
      } else {
        alert(data.message || '❌ Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error al conectar con el servidor');
    }
  });

  // Mostrar sesión activa
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  if (user) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    userInfo.style.display = 'block';
    userName.textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';
    userEmail.textContent = user.email;
  }

  // Logout
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('user');
    location.reload();
  });
});
