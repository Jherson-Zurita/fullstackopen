# courseinfo

Proyecto que resuelve los ejercicios **1.1, 1.2, 1.3, 1.4, 1.5** (Parte 1) y
**2.1, 2.2, 2.3, 2.4, 2.5** (Parte 2) de Full Stack Open.

Como estos ejercicios son incrementales sobre el mismo proyecto, este repositorio contiene
el **estado final** (equivalente al ejercicio 2.5), que ya incluye todos los pasos anteriores.

## Evolución del ejercicio

- **1.1**: App con variables individuales, refactorizada en componentes `Header`, `Content`
  y `Total`, todos definidos dentro de `App.jsx`.
- **1.2**: `Content` deja de mostrar las partes directamente y en su lugar renderiza varios
  componentes `Part`.
- **1.3**: Las variables sueltas se convierten en objetos `part1`, `part2`, `part3`.
- **1.4**: Los objetos se agrupan en un array `parts`, que se pasa como prop.
- **1.5**: `course` y `parts` se agrupan en un único objeto `course`.
- **2.1**: Se agrega el componente `Course`, que envuelve `Header` + `Content`.
- **2.2**: Se muestra la suma total de ejercicios con `Total`.
- **2.3**: El total se calcula con `Array.prototype.reduce`.
- **2.4**: La app soporta un **array de varios cursos** (`courses`), renderizados con `.map`.
- **2.5**: El componente `Course` (y sus subcomponentes `Header`, `Content`, `Part`, `Total`)
  se extraen a su propio módulo `src/Course.jsx`, importado en `App.jsx`.

## Estructura

```
src/
  main.jsx     # punto de entrada
  App.jsx      # datos de los cursos + renderizado de la lista de cursos
  Course.jsx   # componente Course y subcomponentes Header, Content, Part, Total
```

## Cómo ejecutar

```bash
npm install
npm run dev
```
