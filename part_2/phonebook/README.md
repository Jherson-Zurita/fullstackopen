# phonebook

Resuelve los ejercicios **2.6 a 2.17** de Full Stack Open (Parte 2), incluyendo la
comunicación completa con un backend simulado mediante **json-server**.

## Evolución del ejercicio

- **2.6, 2.7, 2.8**: Formulario para agregar personas (nombre + número) a una lista en estado.
- **2.9**: Se evita agregar nombres duplicados (con un `alert` en las primeras versiones).
- **2.10**: Campo de filtro que muestra solo las personas cuyo nombre coincide (case-insensitive).
  Se extraen los componentes `Filter`, `PersonForm` y `Persons`.
- **2.11**: Se agrega `json-server` como "backend" de desarrollo, con datos iniciales en
  `db.json`, y se cargan las personas mediante `axios` en un `useEffect`.
- **2.12**: Las nuevas personas se guardan en el servidor con `axios.post`.
- **2.13**: Toda la lógica de comunicación con el backend se extrae al módulo
  `src/services/persons.js`.
- **2.14**: Botón "delete" en cada persona, que borra tanto del estado como del servidor
  (`axios.delete`), con confirmación previa (`window.confirm`).
- **2.15**: Si el nombre ya existe, se pregunta si se desea actualizar el número
  (`axios.put`) en lugar de crear una entrada duplicada.
- **2.16**: Componente `Notification` que muestra mensajes de éxito en verde.
- **2.17**: Manejo de errores: si se intenta actualizar/eliminar una persona que ya no existe
  en el servidor (fue borrada por otro cliente), se muestra una notificación en rojo y se
  elimina también del estado local.

## Estructura

```
db.json                      # datos para json-server
src/
  main.jsx
  App.jsx                    # estado global y lógica de negocio
  services/persons.js        # comunicación HTTP con el backend (axios)
  components/
    Filter.jsx
    PersonForm.jsx
    Persons.jsx               # incluye Person
    Notification.jsx
```

## Cómo ejecutar

En una terminal, levantar el backend simulado:

```bash
npm install
npm run server     # json-server en http://localhost:3001
```

En otra terminal, levantar el frontend:

```bash
npm run dev         # vite en http://localhost:5173, con proxy /api -> :3001
```

Las peticiones del frontend a `/api/persons` se redirigen automáticamente a
`http://localhost:3001/persons` gracias a la configuración de proxy en `vite.config.js`.
