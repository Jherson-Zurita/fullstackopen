# anecdotes

Resuelve los ejercicios **1.12, 1.13, 1.14** de Full Stack Open (Parte 1).

## Evolución del ejercicio

- **1.12**: Botón "next anecdote" que muestra una anécdota aleatoria usando
  `Math.floor(Math.random() * anecdotes.length)`.
- **1.13**: Botón "vote" que permite votar por la anécdota mostrada. Los votos se guardan en un
  array `points` (uno por anécdota), copiado inmutablemente en cada actualización.
- **1.14**: Se muestra además la anécdota con más votos (`points.indexOf(Math.max(...points))`).
  Si hay empate, se muestra la primera encontrada. Si aún no hay votos, se indica "No votes yet".

## Estructura

```
src/
  main.jsx   # punto de entrada
  App.jsx    # todo el estado y lógica de la app (anécdota seleccionada, votos)
```

## Cómo ejecutar

```bash
npm install
npm run dev
```
