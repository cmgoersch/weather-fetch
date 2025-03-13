const apiKey = 'fdb83fd7034caa973d728f28976bf0f4'; 

document.addEventListener('DOMContentLoaded', loadStoredWeather);

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Stadt nicht gefunden');
        
        const data = await response.json();
        saveWeatherData(data);
        displayWeather(data);
    } catch (error) {
        console.error(error);
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherContainer');
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    
    const now = new Date();
    const localTime = new Date(now.getTime() + data.timezone * 1000);
    const hour = localTime.getHours();
    const bgImage = hour >= 6 && hour < 18 ? "images/day.gif" : "images/night.gif";
    
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');
    weatherCard.style.backgroundImage = `url(${bgImage})`;
    
    weatherCard.innerHTML = `
        <button class="close-btn" onclick="removeWeather('${data.name}')">🗑️</button>
        <h2>${data.name}</h2>
        <p>Uhrzeit: ${localTime.toLocaleTimeString()}</p>
        <img src="${icon}" alt="Wetter Icon">
        <p>${description}</p>
        <p>${temp}°C</p>
    `;
    
    weatherContainer.appendChild(weatherCard);
}

function saveWeatherData(data) {
    let storedWeather = JSON.parse(localStorage.getItem('weatherData')) || [];
    if (!storedWeather.some(item => item.name === data.name)) {
        storedWeather.push(data);
        localStorage.setItem('weatherData', JSON.stringify(storedWeather));
    }
}

function loadStoredWeather() {
    const storedWeather = JSON.parse(localStorage.getItem('weatherData')) || [];
    storedWeather.forEach(displayWeather);
}

function removeWeather(cityName) {
    let storedWeather = JSON.parse(localStorage.getItem('weatherData')) || [];
    storedWeather = storedWeather.filter(item => item.name !== cityName);
    localStorage.setItem('weatherData', JSON.stringify(storedWeather));
    
    document.getElementById('weatherContainer').innerHTML = '';
    loadStoredWeather();
}
