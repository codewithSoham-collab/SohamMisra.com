// Configuration for Weather App
const CONFIG = {
    // API Configuration
    API_KEY: '9a3f05dd0fd53e5150f49f54f67cd927', // Add your OpenWeatherMap API key here
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    
    // App Settings
    DEFAULT_CITY: 'London',
    DEFAULT_UNITS: 'metric', // metric, imperial
    REFRESH_INTERVAL: 300000, // 5 minutes in milliseconds
    
    // Animation Settings
    ANIMATION_SPEED: 1,
    PARTICLE_COUNT: {
        rain: 100,
        snow: 50,
        clouds: 3
    },
    
    // UI Settings
    TOAST_DURATION: 3000,
    SEARCH_DELAY: 300,
    FORECAST_DAYS: 7,
    HOURLY_HOURS: 24,
    
    // Demo Cities for Autocomplete
    DEMO_CITIES: [
        'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
        'Moscow', 'Berlin', 'Mumbai', 'Cairo', 'Toronto',
        'Rio de Janeiro', 'Bangkok', 'Dubai', 'Singapore',
        'Los Angeles', 'Chicago', 'Miami', 'Barcelona',
        'Rome', 'Amsterdam', 'Stockholm', 'Oslo'
    ],
    
    // Weather Icons Mapping
    WEATHER_ICONS: {
        '01d': 'fas fa-sun',           // clear sky day
        '01n': 'fas fa-moon',          // clear sky night
        '02d': 'fas fa-cloud-sun',     // few clouds day
        '02n': 'fas fa-cloud-moon',    // few clouds night
        '03d': 'fas fa-cloud',         // scattered clouds
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-clouds',        // broken clouds
        '04n': 'fas fa-clouds',
        '09d': 'fas fa-cloud-rain',    // shower rain
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain', // rain day
        '10n': 'fas fa-cloud-moon-rain', // rain night
        '11d': 'fas fa-bolt',          // thunderstorm
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',     // snow
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',          // mist
        '50n': 'fas fa-smog'
    },
    
    // Weather Conditions for Animation
    WEATHER_TYPES: {
        'clear': ['01d', '01n'],
        'clouds': ['02d', '02n', '03d', '03n', '04d', '04n'],
        'rain': ['09d', '09n', '10d', '10n'],
        'thunderstorm': ['11d', '11n'],
        'snow': ['13d', '13n'],
        'mist': ['50d', '50n']
    },
    
    // Color Themes
    WEATHER_COLORS: {
        clear: {
            primary: '#87CEEB',
            secondary: '#98D8E8',
            accent: '#FFD700'
        },
        clouds: {
            primary: '#a0aec0',
            secondary: '#718096',
            accent: '#ffffff'
        },
        rain: {
            primary: '#4a5568',
            secondary: '#2d3748',
            accent: '#4299e1'
        },
        thunderstorm: {
            primary: '#2d3748',
            secondary: '#1a202c',
            accent: '#ffd700'
        },
        snow: {
            primary: '#e2e8f0',
            secondary: '#cbd5e0',
            accent: '#ffffff'
        },
        mist: {
            primary: '#a0aec0',
            secondary: '#718096',
            accent: '#e2e8f0'
        }
    },
    
    // Error Messages
    MESSAGES: {
        CITY_NOT_FOUND: 'City not found. Please check the spelling.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        API_ERROR: 'Weather service unavailable. Please try again later.',
        LOCATION_ERROR: 'Unable to get your location.',
        SUCCESS: 'Weather data updated successfully!',
        LOADING: 'Loading weather data...'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        THEME: 'weather_app_theme',
        UNITS: 'weather_app_units',
        LAST_CITY: 'weather_app_last_city',
        FAVORITES: 'weather_app_favorites'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}