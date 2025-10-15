// Durham, NC latitude and longitude
const latitude = 35.9940;
const longitude = -78.8986;

// Weather code descriptions with emojis
const weatherDescriptions = {
    0: { text: 'Clear sky', emoji: '☀️' },
    1: { text: 'Mainly clear', emoji: '🌤️' },
    2: { text: 'Partly cloudy', emoji: '⛅' },
    3: { text: 'Overcast', emoji: '☁️' },
    45: { text: 'Foggy', emoji: '🌫️' },
    48: { text: 'Foggy', emoji: '🌫️' },
    51: { text: 'Light drizzle', emoji: '🌦️' },
    53: { text: 'Moderate drizzle', emoji: '🌦️' },
    61: { text: 'Light rain', emoji: '🌧️' },
    63: { text: 'Moderate rain', emoji: '🌧️' },
    65: { text: 'Heavy rain', emoji: '⛈️' },
    71: { text: 'Light snow', emoji: '🌨️' },
    73: { text: 'Moderate snow', emoji: '❄️' },
    75: { text: 'Heavy snow', emoji: '❄️' },
    95: { text: 'Thunderstorm', emoji: '⛈️' }
};

// ============================================
// FETCH 1: Current Weather Data
// ============================================
function fetchCurrentWeather() {
    const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    console.log('Fetching current weather...');
    
    fetch(currentUrl)
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data);
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById('weather-data').innerHTML = 
                '<p class="error">❌ Unable to load weather data. Please try again later.</p>';
        });
}

// ============================================
// FETCH 2: 7-Day Forecast Data
// ============================================
function fetchForecast() {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America/New_York`;
    
    console.log('Fetching 7-day forecast...');
    
    fetch(forecastUrl)
        .then(response => {
            console.log('Forecast response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Forecast data:', data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            document.getElementById('forecast-data').innerHTML = 
                '<p class="error">❌ Unable to load forecast. Please try again later.</p>';
        });
}

// ============================================
// Display Current Weather (DATA POINT 1)
// ============================================
function displayCurrentWeather(data) {
    const current = data.current;
    const weather = weatherDescriptions[current.weather_code] || { text: 'Unknown', emoji: '🌡️' };
    
    const html = `
        <div class="current-weather-card">
            <div class="weather-main">
                <div class="weather-emoji">${weather.emoji}</div>
                <div class="temperature">${Math.round(current.temperature_2m)}°F</div>
                <div class="weather-desc">${weather.text}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-icon">🌡️</div>
                    <div class="detail-info">
                        <span class="detail-label">Feels Like</span>
                        <span class="detail-value">${Math.round(current.apparent_temperature)}°F</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">💧</div>
                    <div class="detail-info">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${current.relative_humidity_2m}%</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">💨</div>
                    <div class="detail-info">
                        <span class="detail-label">Wind Speed</span>
                        <span class="detail-value">${Math.round(current.wind_speed_10m)} mph</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('weather-data').innerHTML = html;
}

// ============================================
// Display 7-Day Forecast (DATA POINT 2)
// ============================================
function displayForecast(data) {
    const daily = data.daily;
    let html = '<div class="forecast-grid">';
    
    // Loop through each day (7 days)
    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const month = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weather = weatherDescriptions[daily.weather_code[i]] || { text: 'Unknown', emoji: '🌡️' };
        
        html += `
            <div class="forecast-day">
                <div class="day-header">
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${month}</div>
                </div>
                <div class="day-emoji">${weather.emoji}</div>
                <div class="day-temps">
                    <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                    <span class="temp-divider">/</span>
                    <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
                <div class="day-precip">
                    <span class="precip-icon">💧</span>
                    <span>${daily.precipitation_probability_max[i]}%</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    document.getElementById('forecast-data').innerHTML = html;
}

// ============================================
// Navigation Between Data Points
// ============================================
const currentNav = document.getElementById('current-nav');
const forecastNav = document.getElementById('forecast-nav');
const currentSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-weather');

// Switch to Current Weather
currentNav.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update navigation active state
    currentNav.classList.add('active');
    forecastNav.classList.remove('active');
    
    // Show/hide sections
    currentSection.classList.add('active');
    forecastSection.classList.remove('active');
});

// Switch to 7-Day Forecast
forecastNav.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update navigation active state
    forecastNav.classList.add('active');
    currentNav.classList.remove('active');
    
    // Show/hide sections
    forecastSection.classList.add('active');
    currentSection.classList.remove('active');
    
    // Fetch forecast data when user clicks (only if not already loaded)
    const forecastData = document.getElementById('forecast-data');
    if (forecastData.querySelector('.loading')) {
        fetchForecast();
    }
});

// ============================================
// Initialize App - Load Current Weather
// ============================================
console.log('Weather app initialized!');
fetchCurrentWeather();