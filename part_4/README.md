# bloglist-backend

Resuelve los ejercicios **4.1 a 4.23** de Full Stack Open (Parte 4): backend Express +
MongoDB para una lista de blogs, con pruebas unitarias, pruebas de integración y
autenticación basada en JWT.

## Evolución del ejercicio

### 4a — Estructura de la aplicación, introducción a pruebas
- **4.1 / 4.2**: proyecto npm funcional, refactorizado en módulos (`app.js`, `index.js`,
  `models/`, `controllers/`, `utils/`), con `nodemon` para desarrollo.
- **4.3 – 4.7\***: `utils/list_helper.js` con las funciones `dummy`, `totalLikes`,
  `favoriteBlog`, `mostBlogs` (con Lodash) y `mostLikes`, cada una con sus pruebas unitarias
  en `tests/list_helper.test.js` usando el test runner nativo de Node (`node:test`).

### 4b — Probando el backend
- **4.8**: prueba con SuperTest que verifica `GET /api/blogs` (código 200, JSON, cantidad
  correcta). Entorno de test separado (`NODE_ENV=test`, `TEST_MONGODB_URI`).
- **4.9**: la propiedad identificadora se llama `id` (transformada en el esquema con
  `toJSON`), no `_id`.
- **4.10**: prueba de `POST /api/blogs`, verificando que el total de blogs aumenta en uno.
- **4.11\* / 4.12\***: si falta `likes` en la solicitud, por defecto es `0`; si falta `title`
  o `url`, la API responde `400 Bad Request`.
- **4.13 / 4.14**: `DELETE /api/blogs/:id` y `PUT /api/blogs/:id` (actualizar likes), ambos
  con pruebas.

### 4d — Autenticación basada en token
- **4.15**: `POST /api/users` (username, password, name) con contraseñas hasheadas con
  `bcrypt`; `GET /api/users` lista los usuarios.
- **4.16\***: validación de longitud mínima (3 caracteres) y unicidad de `username`, con
  pruebas que verifican los códigos de error.
- **4.17**: los blogs referencian a su creador (`user`) y se usa `populate` para mostrar la
  información del usuario en `GET /api/blogs` y los blogs de cada usuario en `GET /api/users`.
- **4.18**: `POST /api/login` genera un JWT firmado con `SECRET`, válido por una hora.
- **4.19**: `POST /api/blogs` requiere un token válido; el usuario del token es el creador.
- **4.20\***: middleware `tokenExtractor` que toma el token del header `Authorization` y lo
  asigna a `request.token`.
- **4.21\***: `DELETE /api/blogs/:id` solo lo puede ejecutar el usuario que creó el blog.
- **4.22\***: middleware `userExtractor` que resuelve el usuario a partir del token y lo
  asigna a `request.user`, registrado solo en las rutas `/api/blogs`.
- **4.23\***: pruebas actualizadas tras introducir la autenticación; nueva prueba que
  verifica `401 Unauthorized` si no se envía token al crear un blog.

## Estructura

```
index.js
app.js
models/
  blog.js
  user.js
controllers/
  blogs.js
  users.js
  login.js
  testing.js        # endpoint auxiliar para limpiar la DB entre pruebas (solo en test)
utils/
  config.js
  logger.js
  middleware.js       # requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor
  list_helper.js       # funciones auxiliares (4.3-4.7)
tests/
  list_helper.test.js  # pruebas unitarias (sin base de datos)
  blog_api.test.js      # pruebas de integración con SuperTest
  user_api.test.js
  test_helper.js
requests/
  api.rest             # ejemplos de peticiones (cliente REST de VS Code)
eslint.config.mjs
.env.example
```

## Cómo ejecutar

```bash
npm install
cp .env.example .env
# edita .env con tu MONGODB_URI, TEST_MONGODB_URI y un SECRET propio

npm run dev      # desarrollo, con nodemon
npm start        # producción
```

## Pruebas

```bash
npm test
```

Ejecuta tanto las pruebas unitarias de `list_helper` como las pruebas de integración con
SuperTest (que usan `TEST_MONGODB_URI` y limpian la base de datos antes de cada prueba).

**Nota sobre esta entrega**: el entorno en el que se generó esta solución no tiene acceso a
una instancia real de MongoDB (ni local ni a través de `mongodb-memory-server`, cuyo binario
está bloqueado por la red del sandbox). Se verificó exhaustivamente lo que sí es posible sin
base de datos:
- Las **10 pruebas unitarias** de `list_helper.js` se ejecutaron y pasan (`node --test`).
- El servidor arranca correctamente y todas las rutas y validaciones que no dependen de datos
  ya existentes en Mongo se probaron en vivo con `curl` (endpoint desconocido → 404, usuario
  sin username/password → 400, username corto → 400, crear blog sin token → 401).
- El resto del código (controladores, modelos, middlewares de auth) sigue exactamente los
  patrones oficiales del curso y las pruebas de integración (`blog_api.test.js`,
  `user_api.test.js`) están completas y listas para ejecutarse contra tu propia base de datos
  de pruebas en MongoDB Atlas.
