# bloglist-e2e-playwright

Resuelve los ejercicios **5.17 a 5.23** de Full Stack Open (Parte 5): pruebas end-to-end
con Playwright para `bloglist-frontend`.

## Evolución del ejercicio

- **5.17**: proyecto npm con Playwright configurado; prueba que verifica que el formulario
  de login se muestra por defecto.
- **5.18**: pruebas de login exitoso y fallido. El `beforeEach` limpia la base de datos
  (`POST /api/testing/reset`) y crea usuarios de prueba antes de cada test.
- **5.19**: un usuario logueado puede crear un nuevo blog, y este aparece en la lista.
- **5.20**: un blog puede "editarse" (le puede dar like), verificando que el contador de
  likes se actualiza.
- **5.21**: el creador de un blog puede eliminarlo (maneja el diálogo `window.confirm`).
- **5.22**: solo el creador del blog ve el botón "remove"; otro usuario autenticado no lo ve.
- **5.23**: los blogs se muestran ordenados por número de likes, de mayor a menor.

## Estructura

```
playwright.config.js
tests/
  blog_app.spec.js
```

## Cómo ejecutar

Se necesitan **tres procesos** corriendo simultáneamente:

```bash
# 1. Backend (desde part4/bloglist-backend)
npm run dev          # http://localhost:3003

# 2. Frontend (desde part5/bloglist-frontend)
npm run dev           # http://localhost:5173

# 3. Pruebas (desde esta carpeta)
npm install
npx playwright install --with-deps   # solo la primera vez
npm test
```

## Nota sobre esta entrega

Los 8 tests (que cubren los 7 ejercicios numerados) fueron verificados con
`npx playwright test --list`, que confirma que Playwright los reconoce y parsea
correctamente sin errores de sintaxis o de configuración.

El entorno en el que se generó esta solución **no tiene acceso a MongoDB** ni puede
**descargar el binario del navegador Chromium** que Playwright necesita para ejecutar
pruebas reales (ambas descargas están fuera de la whitelist de red del sandbox). Por lo
tanto, estas pruebas no pudieron ejecutarse de punta a punta aquí, pero siguen fielmente la
estructura y los selectores (`data-testid`, roles ARIA) ya usados y probados en
`bloglist-frontend`. Para ejecutarlas de verdad, corre los tres procesos indicados arriba en
tu propia máquina.
