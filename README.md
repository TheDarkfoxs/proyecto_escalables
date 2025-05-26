# Stuffed Entertainment - Gaming Platform

Una plataforma completa de entretenimiento gaming construida con el stack MEAN (MongoDB, Express.js, Angular, Node.js).

## 🚀 Características

### Frontend (Angular)
- **Navegación moderna** con Angular Material Design
- **Sistema de autenticación** completo (login/registro)
- **Gestión de roles** (usuarios y administradores)
- **Páginas principales**:
  - Home con contenido destacado
  - Catálogo de juegos con filtros
  - Comunidad con posts y comentarios
  - Centro de soporte con FAQ
  - Tienda de mercancía oficial
  - Perfil de usuario personalizable
  - Panel de administración completo

### Backend (Node.js + Express)
- **API RESTful** con todas las operaciones CRUD
- **Autenticación JWT** segura
- **Middleware de autorización** por roles
- **Modelos de datos** para:
  - Usuarios con roles y permisos
  - Juegos con información detallada
  - Posts de comunidad con likes y comentarios
  - Artículos de soporte categorizados
  - Mercancía con stock y variantes
- **Validación de datos** con express-validator
- **Manejo de errores** centralizado

### Base de Datos (MongoDB)
- **Esquemas optimizados** para cada entidad
- **Relaciones entre documentos** con populate
- **Índices** para búsquedas eficientes
- **Validaciones** a nivel de base de datos

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v4.4 o superior)
- Angular CLI (v16 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd stuffed-entertainment
\`\`\`

### 2. Configurar el Backend

\`\`\`bash
cd backend
npm install
\`\`\`

Crear archivo `.env` en la carpeta backend:
\`\`\`env
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/stuffed_entertainment
\`\`\`

### 3. Configurar el Frontend

\`\`\`bash
cd frontend
npm install
\`\`\`

### 4. Iniciar MongoDB

Asegúrate de que MongoDB esté ejecutándose:
\`\`\`bash
# En Windows
net start MongoDB

# En macOS/Linux
sudo systemctl start mongod
# o
brew services start mongodb-community
\`\`\`

## 🚀 Ejecución

### Desarrollo

1. **Iniciar el Backend**:
\`\`\`bash
cd backend
npm run dev
\`\`\`
El servidor estará disponible en `http://localhost:3000`

2. **Iniciar el Frontend**:
\`\`\`bash
cd frontend
ng serve
\`\`\`
La aplicación estará disponible en `http://localhost:4200`

### Producción

1. **Backend**:
\`\`\`bash
cd backend
npm start
\`\`\`

2. **Frontend**:
\`\`\`bash
cd frontend
ng build --prod
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
stuffed-entertainment/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   ├── postController.js
│   │   ├── supportController.js
│   │   ├── merchandiseController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleAuth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   │   ├── Post.js
│   │   ├── Support.js
│   │   └── Merchandise.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── games.js
│   │   ├── posts.js
│   │   ├── support.js
│   │   ├── merchandise.js
│   │   └── users.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── environments/
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
└── README.md
\`\`\`

## 🔐 Roles y Permisos

### Usuario No Autenticado
- Ver catálogo de juegos
- Leer posts de la comunidad
- Consultar centro de soporte
- Ver productos de la tienda

### Usuario Autenticado
- Todas las funciones anteriores
- Comprar juegos y mercancía
- Crear posts en la comunidad
- Dar likes y comentar
- Gestionar perfil personal

### Administrador
- Todas las funciones anteriores
- Crear, editar y eliminar juegos
- Gestionar posts de la comunidad
- Crear artículos de soporte
- Administrar productos de la tienda
- Gestionar usuarios

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil

### Juegos
- `GET /api/games` - Listar juegos
- `GET /api/games/:id` - Obtener juego específico
- `GET /api/games/featured` - Juegos destacados
- `POST /api/games` - Crear juego (Admin)
- `PUT /api/games/:id` - Actualizar juego (Admin)
- `DELETE /api/games/:id` - Eliminar juego (Admin)

### Posts
- `GET /api/posts` - Listar posts
- `GET /api/posts/:id` - Obtener post específico
- `POST /api/posts` - Crear post (Autenticado)
- `PUT /api/posts/:id` - Actualizar post (Autor/Admin)
- `DELETE /api/posts/:id` - Eliminar post (Autor/Admin)
- `POST /api/posts/:id/like` - Dar like (Autenticado)
- `POST /api/posts/:id/comment` - Comentar (Autenticado)

### Soporte
- `GET /api/support` - Listar artículos de soporte
- `GET /api/support/:id` - Obtener artículo específico
- `POST /api/support/:id/helpful` - Marcar como útil
- `POST /api/support` - Crear artículo (Admin)
- `PUT /api/support/:id` - Actualizar artículo (Admin)
- `DELETE /api/support/:id` - Eliminar artículo (Admin)

### Mercancía
- `GET /api/merchandise` - Listar productos
- `GET /api/merchandise/:id` - Obtener producto específico
- `GET /api/merchandise/featured` - Productos destacados
- `POST /api/merchandise` - Crear producto (Admin)
- `PUT /api/merchandise/:id` - Actualizar producto (Admin)
- `DELETE /api/merchandise/:id` - Eliminar producto (Admin)

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario específico
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Desactivar usuario (Admin)
- `POST /api/users/purchase/game` - Comprar juego
- `POST /api/users/purchase/merchandise` - Comprar mercancía

## 🎨 Tecnologías Utilizadas

### Frontend
- **Angular 16** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje tipado

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **express-validator** - Validación de datos

## 🔧 Configuración Adicional

### Variables de Entorno
Asegúrate de configurar las siguientes variables de entorno:

\`\`\`env
# Backend (.env)
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/stuffed_entertainment
\`\`\`

### Datos de Prueba
Para poblar la base de datos con datos de prueba, puedes crear un usuario administrador:

\`\`\`javascript
// Ejecutar en MongoDB shell o crear un script
db.users.insertOne({
  username: "admin",
  email: "admin@stuffedentertainment.com",
  password: "$2a$10$...", // Hash de "admin123"
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema:

- Crea un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de la API

## 🚀 Próximas Características

- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat en vivo para soporte
- [ ] Integración con pasarelas de pago
- [ ] Sistema de reviews y ratings
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Integración con redes sociales
- [ ] Sistema de logros y badges

---

**Stuffed Entertainment** - La mejor experiencia gaming 🎮
