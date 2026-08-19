# bloglist-frontend

Resuelve los ejercicios **5.1 a 5.16** de Full Stack Open (Parte 5): frontend en React para
la lista de blogs, con login, notificaciones, componente Togglable, testing con Vitest/RTL,
y enrutamiento con React Router (base para las pruebas E2E de 5.17 en adelante).

## Evolución del ejercicio

- **5.1**: formulario de login (`LoginForm.jsx`).
- **5.2**: la sesión persiste en `localStorage`; se restaura al recargar la página.
- **5.3**: formulario para crear un nuevo blog (`BlogForm.jsx`).
- **5.4**: componente `Notification.jsx` para mensajes de éxito/error.
- **5.5**: componente `Togglable.jsx` (con `forwardRef`/`useImperativeHandle`) para
  mostrar/ocultar el formulario de crear blog.
- **5.6**: `LoginForm` y `BlogForm` extraídos a sus propios componentes.
- **5.7 – 5.10**: componente `Blog.jsx` con detalles expandibles (título/autor siempre
  visibles; url, likes y usuario solo al expandir), botón "like", botón "remove" solo visible
  para el creador, lista ordenada por número de likes.
- **5.11 / 5.12**: contraseñas/roles vía token de autenticación en cada petición
  (`services/blogs.js`); proyecto configurado con ESLint.
- **5.13 – 5.15**: pruebas con Vitest + React Testing Library para `Blog.jsx` (título/autor
  visibles por defecto, detalles al hacer click en "view", el handler de "like" se llama la
  cantidad correcta de veces).
- **5.16**: prueba para `BlogForm.jsx` que confirma que el formulario llama al handler
  `createBlog` con los datos correctos al enviarse.

Además, el proyecto ya incluye el **enrutamiento con React Router** (rutas `/`, `/login`,
`/blogs/:id`, `/blogs/new`, `/users`, `/users/:id`) que sirve de base a los ejercicios de
Cypress (5.24-5.28), y estilos CSS básicos (5.29-5.31).

## Estructura

```
src/
  main.jsx
  App.jsx                # routing, estado global, lógica de negocio
  index.css               # estilos (5.29-5.31)
  services/
    login.js
    blogs.js               # incluye el token de autenticación
    users.js
  components/
    LoginForm.jsx
    BlogForm.jsx
    Blog.jsx                # vista compacta con detalles expandibles
    BlogDetails.jsx          # vista de página completa (/blogs/:id)
    BlogList.jsx
    Togglable.jsx
    Notification.jsx
    Navigation.jsx
  views/
    CreateBlog.jsx           # /blogs/new
    Users.jsx                # /users
    UserDetails.jsx           # /users/:id
tests/
  Blog.test.jsx
  BlogForm.test.jsx
testSetup.js
eslint.config.js
```

## Cómo ejecutar

```bash
npm install
npm run dev      # http://localhost:5173, con proxy /api -> http://localhost:3003
```

Requiere el backend `bloglist-backend` (Parte 4) corriendo en el puerto 3003.

## Pruebas y lint

```bash
npm test    # Vitest + React Testing Library
npm run lint
```

## Verificación realizada en esta entrega

- `npm run build`: compila sin errores.
- `npm run lint`: sin advertencias.
- `npm test`: **4/4 pruebas pasan** (Blog.test.jsx x3, BlogForm.test.jsx x1).
- `npx vite preview`: el build de producción sirve correctamente (HTTP 200).
