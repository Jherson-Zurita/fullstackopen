# countries

Resuelve los ejercicios **2.18\*, 2.19\*, 2.20\*** de Full Stack Open (Parte 2).

## Evolución del ejercicio

- **2.18\***: Campo de búsqueda que filtra países obtenidos desde la API de
  [REST Countries (proxy de Helsinki)](https://studies.cs.helsinki.fi/restcountries/).
  - Si hay más de 10 coincidencias: "Too many matches, specify another filter".
  - Si hay entre 2 y 10: se listan los nombres.
  - Si hay exactamente 1: se muestran sus datos (capital, área, idiomas, bandera).
- **2.19\***: Cada país en la lista de coincidencias tiene un botón "show" que permite ver
  sus detalles completos sin necesidad de refinar la búsqueda hasta dejar una sola coincidencia.
- **2.20\***: Se agrega el reporte del clima de la capital del país seleccionado, usando la
  API de [OpenWeatherMap](https://openweathermap.org/api). La clave de API se lee desde una
  variable de entorno (`VITE_WEATHER_API_KEY`), **nunca hardcodeada en el código fuente**.

## Estructura

```
src/
  main.jsx
  App.jsx                       # búsqueda, país seleccionado
  components/
    CountryList.jsx              # lógica de "demasiadas / varias / una coincidencia"
    CountryDetails.jsx           # capital, área, idiomas, bandera
    Weather.jsx                  # clima de la capital (OpenWeatherMap)
.env.example                     # plantilla de variables de entorno
```

## Cómo ejecutar

```bash
npm install
cp .env.example .env
# edita .env y coloca tu propia clave de OpenWeatherMap
npm run dev
```

**Nota**: si no se configura `VITE_WEATHER_API_KEY`, la aplicación funciona igualmente para
2.18 y 2.19 (búsqueda y detalles del país); solo el bloque de clima (2.20) mostrará un
mensaje indicando que falta la clave.
