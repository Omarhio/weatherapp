// Configuration et variables globales
let config = null;
let API_KEY = '';

// Chargement de la clé API depuis le fichier .env
async function loadApiKey() {
    try {
        const response = await fetch('.env');
        const text = await response.text();
        const envVars = Object.fromEntries(
            text.split('\n')
                .filter(line => line && !line.startsWith('#'))
                .map(line => line.split('='))
        );
        API_KEY = envVars.API_KEY;
    } catch (error) {
        console.error('Erreur lors du chargement de la clé API:', error);
    }
}

// Chargement de la configuration
async function loadConfig() {
    try {
        const response = await fetch('conf.json');
        config = await response.json();
        return config;
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
    }
}

// Récupération des données météo
async function getWeatherData() {
    if (!config || !API_KEY) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${config.city},${config.country}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
    }
}

// Mise à jour de l'interface
function updateUI(data) {
    // Mise à jour de la température
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    
    // Mise à jour de la description
    document.querySelector('.weather-description').textContent = data.weather[0].description;
    
    // Mise à jour de la localisation
    document.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
    
    // Mise à jour des détails
    document.querySelector('.feels-like-temp').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.querySelector('.humidity-value').textContent = `${data.main.humidity}%`;
    
    // Mise à jour de l'icône en fonction de la météo
    const weatherIcon = document.querySelector('.weather-icon .material-icons');
    const weatherCode = data.weather[0].id;
    
    if (weatherCode >= 200 && weatherCode < 300) {
        weatherIcon.textContent = 'thunderstorm';
    } else if (weatherCode >= 300 && weatherCode < 500) {
        weatherIcon.textContent = 'water_drop';
    } else if (weatherCode >= 500 && weatherCode < 600) {
        weatherIcon.textContent = 'rainy';
    } else if (weatherCode >= 600 && weatherCode < 700) {
        weatherIcon.textContent = 'ac_unit';
    } else if (weatherCode >= 700 && weatherCode < 800) {
        weatherIcon.textContent = 'foggy';
    } else if (weatherCode === 800) {
        weatherIcon.textContent = 'wb_sunny';
    } else {
        weatherIcon.textContent = 'cloud';
    }
}

// Initialisation
async function init() {
    await loadApiKey();
    await loadConfig();
    await getWeatherData();
    
    // Mise à jour périodique
    setInterval(getWeatherData, config.updateInterval);
}

// Démarrage de l'application
init(); 