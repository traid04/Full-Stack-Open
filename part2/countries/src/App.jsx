import { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherInfo = ({country}) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const lat = country.capitalInfo?.latlng?.[0] ??  country.latlng[0];
    const lng = country.capitalInfo?.latlng?.[1] ?? country.latlng[1];
    const APIKey = import.meta.env.VITE_OPENWEATHER_API;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${APIKey}`)
      .then(result => setWeather(result.data));
  }, []);
  if (!weather) {
    return <p>Loading weather info...</p>
  }
  return (
    <div>
      <h1>Weather in {country.capital}</h1>
      <p>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(result => setCountries(result.data));
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
    setFilteredCountries(filtered);
  }, [search, countries]);

  const toggleSelectedCountry = country => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
    else {
      const filteredSelectedCountries = selectedCountries.filter(c => c !== country);
      setSelectedCountries(filteredSelectedCountries);
    }
  }

  const renderCountry = country => {
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h1>Languages:</h1>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <WeatherInfo country={country} />
      </>
    )
  }

  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    else if (filteredCountries.length > 1) {
      return filteredCountries.map(country => {
        return (
          <div key={country.name.common}>
            <p>{country.name.common} <button onClick={() => toggleSelectedCountry(country.name.common)}>{selectedCountries.includes(country.name.common) ? 'Hide' : 'Show'}</button></p>
            <div>{selectedCountries.includes(country.name.common) ? renderCountry(country) : null}</div>
          </div>
        )})
    }
    else if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      return renderCountry(country);
    }
    else {
      return (<p>No matches found</p>)
    }
  }

  const handleSearch = e => {
    setSearch(e.target.value);
  }

  return (
    <div>
      <p> find countries <input value={search} type="text" onChange={handleSearch}/> </p>
      {renderCountries()}
    </div>
  )
}

export default App