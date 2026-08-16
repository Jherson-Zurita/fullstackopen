import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    if (!apiKey) {
      setError('Falta configurar VITE_WEATHER_API_KEY para mostrar el clima')
      return
    }

    setWeather(null)
    setError(null)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: apiKey,
          units: 'metric',
          lang: 'es'
        }
      })
      .then((response) => {
        setWeather(response.data)
      })
      .catch(() => {
        setError(`No se pudo obtener el clima para ${capital}`)
      })
  }, [capital])

  if (error) {
    return <p>{error}</p>
  }

  if (!weather) {
    return <p>Cargando clima...</p>
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>
        <strong>temperature</strong> {weather.main.temp} Celsius
      </p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>
        <strong>wind</strong> {weather.wind.speed} m/s
      </p>
    </div>
  )
}

export default Weather
