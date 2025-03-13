const apiKey = 'fdb83fd7034caa973d728f28976bf0f4'; 

document.addEventListener('DOMContentLoaded', loadStoredWeather);

document.getElementById('cityInput').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        getWeather(); 
    }
});

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const errorContainer = document.getElementById('errorMessage'); 
    errorContainer.textContent = ""; 

    if (!city) {
        errorContainer.textContent = "Bitte gib eine Stadt ein!";
        return;
    }

    const storedWeather = JSON.parse(localStorage.getItem('weatherData')) || [];
    if (storedWeather.some(item => item.name.toLowerCase() === city.toLowerCase())) {
        errorContainer.textContent = `Die Stadt "${city}" ist bereits auf deinem Dashboard.`;
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Die Stadt "${city}" konnte nicht gefunden werden`);

        const data = await response.json();
        saveWeatherData(data);
        displayWeather(data);
    } catch (error) {
        errorContainer.textContent = error.message; // Zeigt Fehlermeldung an
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
    
    const country = data.sys.country;  
    const lat = data.coord.lat.toFixed(2);
    const lon = data.coord.lon.toFixed(2);

    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');
    weatherCard.style.backgroundImage = `url(${bgImage})`;
    
    weatherCard.innerHTML = `
        <button class="close-btn" onclick="removeWeather('${data.name}')">🗑️</button>
        <h2>${data.name}</h2>
        <h3>${country}</h3>
        <p>${lat}°, ${lon}°</p>
        <p>Lokate Uhrzeit: </br> <b class="localtime" >${localTime.toLocaleTimeString()}</></p>
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
