// Configuration et variables globales
const API_KEY = '77d2b2dad1f7762ad7e8ada5f4dfbdd7';
let config = null;

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
    if (!config) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${config.city},${config.country}&units=metric&appid=${API_KEY}&lang=fr`);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
    }
}

// Mise à jour de l'interface
function updateUI(data) {
    document.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.weather-description').textContent = data.weather[0].description;
    document.querySelector('.humidity').textContent = `Humidité: ${data.main.humidity}%`;
    document.querySelector('.wind').textContent = `Vent: ${Math.round(data.wind.speed * 3.6)} km/h`;
}

// Initialisation
async function init() {
    await loadConfig();
    await getWeatherData();
    // Mise à jour périodique
    setInterval(getWeatherData, config.updateInterval);
}

// Démarrage de l'application
init(); 