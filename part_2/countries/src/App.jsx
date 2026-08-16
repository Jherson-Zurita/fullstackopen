import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    // al cambiar la búsqueda, se limpia el país seleccionado manualmente con "show"
    setSelectedCountry(null)
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : (
        <CountryList countries={countriesToShow} onShow={setSelectedCountry} />
      )}
    </div>
  )
}

export default App
