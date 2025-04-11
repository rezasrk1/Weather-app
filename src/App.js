import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGithub, FaFacebook } from 'react-icons/fa'; // Make sure to install react-icons
import './App.css';

const API_KEY = '3768ad38c7fc73858349c32ff3347b71';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <p>Md Saiful Islam</p>
        <div className="social-links">
          <a href="https://github.com/rezasrk1" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
          <a href="https://fb.com/iamrezasrk" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="social-icon" />
          </a>
        </div>
        <p className="made-by">Made by Reza SRK</p>
      </div>
    </div>
  );
};

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      const params = {
        q: cityName, // Removed forced country code
        appid: API_KEY,
        units: 'metric',
      };

      const response = await axios.get(API_URL, { params });
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'City not found. Please try again.');
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
          setError('Please enable location access to use this feature.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    fetchWeatherByLocation();
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
          onKeyPress={(e) => e.key === 'Enter' && fetchWeatherByCity(city)}
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
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <div className="weather-details">
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default App;