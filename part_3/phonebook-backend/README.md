# phonebook-backend

Resuelve los ejercicios **3.1 a 3.22** de Full Stack Open (Parte 3): backend Express +
MongoDB/Mongoose para la agenda telefónica, con validaciones, manejo de errores, logging,
ESLint, y el frontend de la Parte 2 integrado como build de producción.

## Evolución del ejercicio

- **3.1**: API con datos codificados en `GET /api/persons`. Scripts `start` y `dev` (nodemon).
- **3.2**: Ruta `GET /info` con hora de la solicitud y cantidad de entradas.
- **3.3**: `GET /api/persons/:id`, responde `404` si no existe.
- **3.4**: `DELETE /api/persons/:id`.
- **3.5**: `POST /api/persons` con id aleatorio (versión inicial sin DB).
- **3.6**: Validación de nombre/número faltante y nombre duplicado, con `{ error: '...' }`.
- **3.7 / 3.8\***: Middleware `morgan` en modo `tiny`, extendido con un token personalizado
  que muestra el body de las solicitudes POST.
- **3.9 / 3.10 / 3.11**: Integración con el frontend de la Parte 2 (mismo endpoint
  `/api/persons`), despliegue a un servicio en la nube (Fly.io/Render), y build de producción
  del frontend copiado a `dist/` (servido por Express con `express.static`).
- **3.12**: Script `mongo.js` para agregar/listar entradas desde la línea de comandos.
- **3.13 – 3.16**: Migración completa de la API a MongoDB vía Mongoose (`models/person.js`,
  `controllers/persons.js`), con manejo de errores centralizado en
  `utils/middleware.js` (`errorHandler`).
- **3.17\* / 3.18\***: `PUT /api/persons/:id` para actualizar el número; `GET /:id` e `/info`
  también usan la base de datos.
- **3.19\* / 3.20\***: Validaciones de Mongoose — nombre con mínimo 3 caracteres, número con
  formato `XX(X)-XXXXXXX` mediante validador personalizado; validadores habilitados también
  en `findByIdAndUpdate` (`runValidators: true`).
- **3.21**: Nueva build full-stack desplegada con base de datos en producción.
- **3.22**: ESLint configurado (`eslint.config.mjs`), sin advertencias.

## Estructura

```
index.js               # arranque del servidor
app.js                 # configuración de Express, middlewares, mongoose.connect
mongo.js               # script CLI (ejercicio 3.12)
models/person.js        # esquema y validaciones de Mongoose
controllers/persons.js  # rutas /api/persons
utils/
  config.js             # variables de entorno (PORT, MONGODB_URI)
  logger.js             # logging centralizado
  middleware.js          # requestLogger, unknownEndpoint, errorHandler
dist/                   # build de producción del frontend (Parte 2), servido por Express
eslint.config.mjs
.env.example
```

## Cómo ejecutar

```bash
npm install
cp .env.example .env
# edita .env con tu MONGODB_URI real de MongoDB Atlas

npm run dev      # con nodemon, http://localhost:3001
# o
npm start
```

Con el servidor corriendo, abrir `http://localhost:3001` sirve la aplicación full-stack
completa (frontend + backend en el mismo origen).

## Lint

```bash
npm run lint
```

## Notas sobre el entorno de desarrollo de este ejercicio

Este proyecto fue verificado con `npm run lint` (sin advertencias) y probando manualmente,
con `curl`, las rutas que no requieren una base de datos activa (endpoint desconocido → 404,
id malformado → 400, validación de campos faltantes → 400, y que el frontend estático se
sirve correctamente en `/`). El entorno de generación de esta entrega no tiene acceso a una
instancia real de MongoDB, por lo que las rutas que dependen de la base de datos deben
probarse conectando tu propia base de MongoDB Atlas (ver `.env.example`).
