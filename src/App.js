import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '3768ad38c7fc73858349c32ff3347b71';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      const params = {
        q: `${cityName},BD`, // Add country code
        appid: API_KEY,
        units: 'metric',
      };
      console.log('API Request Params:', params); // Debugging log

      const response = await axios.get(API_URL, { params });
      console.log('API Response:', response.data); // Debugging log

      setWeather(response.data);
      setError('');
    } catch (err) {
      console.error('API Error:', err.response ? err.response.data : err.message); // Debugging log
      setError('City not found. Please try again.');
      setWeather(null);
    }
  };

  // Fetch weather by user's location
  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(API_URL, {
              params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: 'metric',
              },
            });
            setWeather(response.data);
            setError('');
          } catch (err) {
            setError('Unable to fetch weather data.');
          }
        },
        (error) => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    fetchWeatherByLocation(); // Fetch weather for user's location on load
  }, []);

  return (
    <div className="app">
      <h1>Weather App</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => fetchWeatherByCity(city)}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-display">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{Math.round(weather.main.temp)}°C</p>
          <p>{weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;