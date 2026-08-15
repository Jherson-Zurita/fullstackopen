# unicafe

Resuelve los ejercicios **1.6, 1.7, 1.8, 1.9, 1.10, 1.11** de Full Stack Open (Parte 1).

## Evolución del ejercicio

- **1.6**: Botones `good`/`neutral`/`bad` que incrementan contadores en `useState`.
- **1.7**: Se agregan estadísticas: total de feedback, promedio y porcentaje de comentarios
  positivos.
- **1.8**: La visualización de estadísticas se extrae al componente `Statistics`. El estado
  permanece en `App`.
- **1.9**: Si no hay feedback (`total === 0`), se muestra "No feedback given" en lugar de la
  tabla de estadísticas.
- **1.10**: Se extraen los componentes `Button` (para los botones de feedback) y
  `StatisticLine` (para cada fila de estadística).
- **1.11**: Las estadísticas se muestran dentro de una tabla HTML (`<table>`), con cada
  `StatisticLine` representando una fila `<tr>`. No hay warnings en consola.

## Estructura

```
src/
  main.jsx        # punto de entrada
  App.jsx          # estado (good/neutral/bad) y botones de feedback
  Statistics.jsx   # componentes Statistics, StatisticLine y Button
```

## Cómo ejecutar

```bash
npm install
npm run dev
```
