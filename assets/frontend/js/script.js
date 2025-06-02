document.addEventListener('DOMContentLoaded', () => {
    // ================= CONFIGURACIÓN =================
    const CONFIG = {
        API_URL: 'http://localhost:5000',
        ADMIN_EMAIL: 'admin@yupifiestas.es',
        CAROUSEL_INTERVAL: 5000
    };

    // ================= UTILIDADES =================
    const utils = {
        playSound(url, volume = 0.1) {
            try {
                const sound = new Audio(url);
                sound.volume = volume;
                sound.play().catch(e => console.log('Audio no permitido automáticamente'));
            } catch (e) {
                console.log('Error al reproducir sonido:', e);
            }
        },

        animateElement(element, scale = 1.3, duration = 300) {
            if (element) {
                element.style.transform = `scale(${scale})`;
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, duration);
            }
        }
    };

    // ================= INICIALIZADORES =================
    const init = {
        menuToggle() {
            const menuToggle = document.getElementById('menu-toggle');
            const navLinks = document.getElementById('nav-links');

            if (!menuToggle || !navLinks) return;

            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    menuToggle.textContent = '☰';
                });
            });
        },

        carousel() {
            const track = document.querySelector('.carousel-track');
            if (!track) return;

            const slides = Array.from(track.children);
            const nextButton = document.querySelector('.carousel-button.next');
            const prevButton = document.querySelector('.carousel-button.prev');
            const dotsContainer = document.querySelector('.carousel-dots');
            let currentIndex = 0;

            // Crear indicadores
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer?.appendChild(dot);
            });

            const moveToSlide = (index) => {
                if (!track) return;
                track.style.transform = `translateX(-${index * 100}%)`;
                document.querySelector('.slide.active')?.classList.remove('active');
                slides[index]?.classList.add('active');
                document.querySelector('.carousel-dot.active')?.classList.remove('active');
                dotsContainer?.children[index]?.classList.add('active');
                currentIndex = index;
            };

            nextButton?.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            });

            prevButton?.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
            });

            // Autoplay
            setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, CONFIG.CAROUSEL_INTERVAL);
        },

        auth() {
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const showRegister = document.getElementById('show-register');
            const showLogin = document.getElementById('show-login');
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const authContainer = document.getElementById('auth-container');
            const userInfo = document.getElementById('user-info');
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');

            showRegister.addEventListener('click', () => {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            });

            showLogin.addEventListener('click', () => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            });

            loginBtn.addEventListener('click', async () => {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                try {
                    const res = await fetch('http://localhost:5000/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        alert(data.message || 'Error al iniciar sesión');
                        return;
                    }

                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    showUserInfo(data.user);

                    if (data.user.email === CONFIG.ADMIN_EMAIL) {
                        document.body.classList.add('admin');
                    } else {
                        document.body.classList.remove('admin');
                    }

                    window.location.href = "../../html/reservas.html";

                } catch (err) {
                    alert('Error de conexión al servidor');
                    console.error(err);
                }
            });

            registerBtn.addEventListener('click', async () => {
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;

                if (password !== confirmPassword) {
                    alert('Las contraseñas no coinciden');
                    return;
                }

                try {
                    const res = await fetch('http://localhost:5000/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        alert(data.message || 'Error en el registro');
                        return;
                    }

                    alert('✅ Usuario registrado, ahora puedes iniciar sesión');
                    showLogin.click();
                } catch (err) {
                    alert('Error de conexión al servidor');
                    console.error(err);
                }
            });

            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('user');
                location.reload();
            });

            const showUserInfo = (user) => {
                authContainer.style.display = 'none';
                userInfo.style.display = 'block';
                userName.textContent = user.email;
                userEmail.textContent = user.email;
            };

            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                showUserInfo(user);
                if (user.email === CONFIG.ADMIN_EMAIL) {
                    document.body.classList.add('admin');
                }
            }
        }
    };

    // ================= EVENTOS =================
    function initEventListeners() {
        document.querySelectorAll('.evento-video, .pack-video').forEach(video => {
            video.addEventListener('mouseenter', () => {
                video.style.transform = 'scale(1.03)';
                video.style.transition = 'transform 0.3s ease';
            });
            video.addEventListener('mouseleave', () => {
                video.style.transform = 'scale(1)';
            });
        });

        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            document.querySelectorAll('.zoomable').forEach(img => {
                img.addEventListener('click', () => {
                    const lightboxImg = lightbox.querySelector('.lightbox-img');
                    if (lightboxImg) {
                        lightboxImg.src = img.src;
                        lightbox.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            lightbox.querySelector('.close-lightbox')?.addEventListener('click', () => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    }

    // ================= VISIBILIDAD EVENTOS =================
    function mostrarEventosAlScroll() {
        const eventos = document.querySelectorAll('.evento');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        eventos.forEach(evento => observer.observe(evento));
    }

    // ================= INICIALIZACIÓN =================
    function initialize() {
        init.menuToggle();
        init.carousel();
        init.auth();
        initEventListeners();
        mostrarEventosAlScroll(); // <-- añadido aquí
    }

    initialize();
});
