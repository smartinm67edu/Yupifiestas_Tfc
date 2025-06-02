# 🎪 Yupifiestas - Alquiler de Castillos Hinchables y Eventos

## 📝 Descripción
Yupifiestas es una plataforma web dedicada al alquiler de castillos hinchables y organización de eventos. Ofrecemos servicios para fiestas infantiles, despedidas de soltero/a, eventos corporativos y celebraciones especiales.

## 🚀 Características Principales
- Catálogo de castillos hinchables
- Sistema de reservas online
- Gestión de eventos personalizados
- Galería multimedia interactiva
- Panel de administración
- Sistema de autenticación de usuarios
- Blog informativo
- Diseño responsive

## 🛠️ Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome 6.4.0
- Node.js (Backend)
- MongoDB (Base de datos)

## 📁 Estructura del Proyecto
```
Yupifiestas_Tfc/
├── assets/
│   ├── backend/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   └── frontend/
│       ├── css/
│       ├── js/
│       ├── img/
│       └── html/
├── docs/
└── README.md
```

## 🔧 Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tuusuario/Yupifiestas_Tfc.git
```

2. Instalar dependencias:
```bash
cd Yupifiestas_Tfc
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar el servidor:
```bash
npm start
```

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🔐 Seguridad
- Autenticación JWT
- Encriptación de contraseñas
- Validación de formularios
- Protección contra XSS
- Headers de seguridad

## 📄 API Endpoints
```
GET    /api/castillos     - Lista de castillos
POST   /api/reservas      - Crear reserva
GET    /api/eventos       - Lista de eventos
POST   /api/auth/login    - Autenticación
POST   /api/auth/register - Registro
```

## 💻 Scripts Disponibles
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "build": "webpack --mode production"
}
```

## 🎨 Estilos y Temas
- Paleta de colores:
  - Primary: `#ff6b6b`
  - Secondary: `#4ecdc4`
  - Text: `#2d3436`
  - Background: `#f8f9fa`

## 📊 Base de Datos
- MongoDB Atlas
- Colecciones:
  - users
  - castillos
  - reservas
  - eventos
  - blog

## 🔍 Testing
```bash
npm test
```

## 📝 Licencia
MIT License - ver [LICENSE.md](LICENSE.md)

## ✨ Contribuir
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 👥 Autores
- TuNombre - Desarrollo Full Stack

## 🙏 Agradecimientos
- Font Awesome por los iconos
- Google Fonts por las tipografías
- Unsplash por las imágenes de stock

## 📞 Contacto
- Web: [www.yupifiestas.es](http://www.yupifiestas.es)
- Email: info@yupifiestas.es
- Tel: +34 123 456 789