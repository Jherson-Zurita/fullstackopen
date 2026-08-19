# bloglist-e2e-cypress

Resuelve los ejercicios **5.24 a 5.28** de Full Stack Open (Parte 5): pruebas end-to-end
con Cypress para la versión enrutada de `bloglist-frontend` (React Router).

## Evolución del ejercicio

- **5.24**: la app usa rutas (`/`, `/login`, `/blogs/:id`, `/blogs/new`, `/users`,
  `/users/:id`); pruebas que verifican la navegación básica y el botón de logout.
- **5.25**: la vista de un solo blog (`/blogs/:id`) muestra título, autor, url y likes.
- **5.26**: crear un blog desde su propia vista (`/blogs/new`) redirige a la lista principal
  tras crearlo con éxito; lo mismo para eliminar un blog.
- **5.27**: en la vista de un blog, solo el creador ve el botón "remove"; cualquier usuario
  logueado ve el botón "like".
- **5.28**: pruebas adicionales para el flujo completo de "dar like desde la vista propia
  del blog" y "eliminar redirige a la lista".

Los comandos personalizados en `cypress/support/commands.js` (`cy.login`, `cy.createBlog`)
usan la API del backend directamente para preparar el estado de cada prueba rápidamente, en
lugar de rellenar formularios repetidamente.

## Estructura

```
cypress.config.js
cypress/
  e2e/blog_app.cy.js
  support/
    commands.js
    e2e.js
```

## Cómo ejecutar

Se necesitan **tres procesos** corriendo simultáneamente:

```bash
# 1. Backend (desde part4/bloglist-backend)
npm run dev          # http://localhost:3003

# 2. Frontend (desde part5/bloglist-frontend)
npm run dev           # http://localhost:5173

# 3. Cypress (desde esta carpeta)
npm install
npx cypress open      # modo interactivo
# o
npm test               # modo headless
```

## Nota sobre esta entrega

El entorno en el que se generó esta solución no tiene acceso a MongoDB ni puede descargar el
binario propio de Cypress (`download.cypress.io` está fuera de la whitelist de red del
sandbox), por lo que estas pruebas no pudieron ejecutarse de punta a punta aquí. El código
fue verificado con `node --check` (sin errores de sintaxis) y sigue la estructura y los
mismos selectores (`data-testid`, texto visible) ya usados y probados en
`bloglist-frontend`. Para ejecutarlas de verdad, corre los tres procesos indicados arriba en
tu propia máquina.
