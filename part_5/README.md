# Full Stack Open — Soluciones Parte 5

Este paquete contiene las soluciones a los **31 ejercicios numerados** (5.1-5.31) de la
Parte 5 del curso Full Stack Open: testing de aplicaciones React, con Vitest/React Testing
Library para pruebas unitarias/de componentes, y Playwright + Cypress para pruebas
end-to-end.

## Contenido

### `bloglist-frontend/` (ejercicios 5.1-5.16, más 5.24-5.31 de routing/estilos)
Frontend en React de la lista de blogs: login persistente, CRUD de blogs con permisos según
el usuario, componente `Togglable`, enrutamiento con React Router, y pruebas con Vitest + RTL.

### `bloglist-e2e-playwright/` (ejercicios 5.17-5.23)
Suite de pruebas end-to-end con Playwright: login, creación/edición/eliminación de blogs,
permisos de eliminación, y orden por likes.

### `bloglist-e2e-cypress/` (ejercicios 5.24-5.28)
Suite de pruebas end-to-end con Cypress para la versión enrutada de la aplicación: vista de
un solo blog, redirecciones tras crear/eliminar, y permisos condicionales.

Ambas suites E2E requieren el backend `bloglist-backend` de la Parte 4 (con MongoDB real)
corriendo en `localhost:3003`, y el frontend en `localhost:5173`.

## Verificación realizada en esta entrega

- **`bloglist-frontend`**: build de producción exitoso, ESLint sin advertencias, y **4/4
  pruebas de Vitest ejecutadas y pasando** (no dependen de base de datos).
- **Playwright**: los 8 tests fueron reconocidos y listados correctamente con
  `npx playwright test --list` (confirma sintaxis y configuración correctas).
- **Cypress**: los archivos fueron verificados con `node --check` (sin errores de sintaxis).

### Limitación del entorno

El entorno en el que se generó esta entrega no tiene acceso a MongoDB real, ni puede
descargar los binarios de navegador que Playwright y Cypress necesitan para ejecutar pruebas
reales (ambas descargas están fuera de la whitelist de red del sandbox). Por eso las
suites E2E no se ejecutaron de punta a punta aquí; siguen fielmente la estructura, selectores
y flujos ya verificados en `bloglist-frontend`, y están listas para ejecutarse en tu propia
máquina siguiendo las instrucciones de cada README.
