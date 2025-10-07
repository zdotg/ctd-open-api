// Latitude and Longitude for Durham, NC
const latitude = 35.9940;
const longitude = -78.8986;

// API URL with parameters
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;

console.log('Fetching weather data...');

fetch(apiUrl)
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Weather data:', data);
        
        // Access the data points (minimum 2 required)
        const temperature = data.current.temperature_2m;
        const weatherCode = data.current.weather_code;
        const windSpeed = data.current.wind_speed_10m;
        
        console.log('Temperature:', temperature + '°F');
        console.log('Weather Code:', weatherCode);
        console.log('Wind Speed:', windSpeed + ' mph');
        
        // Later you'll display this on the page!
        // For now, just console.log to verify it works
    })
    .catch(error => {
        console.error('Error fetching weather:', error);
    });