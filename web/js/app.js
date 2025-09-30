// Main Weather App Controller
class WeatherApp {
    constructor() {
        this.weatherAPI = new WeatherAPI();
        this.animations = null;
        this.currentUnits = 'metric';
        this.currentTheme = 'dark';
        this.searchTimeout = null;
        
        this.init();
    }

    async init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadSettings();
        this.initializeAnimations();
        await this.loadDefaultWeather();
        this.updateDateTime();
        this.startPeriodicUpdates();
    }

    setupElements() {
        // Get DOM elements
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            suggestions: document.getElementById('suggestions'),
            locationName: document.getElementById('locationName'),
            dateTime: document.getElementById('dateTime'),
            temperature: document.getElementById('temperature'),
            weatherDesc: document.getElementById('weatherDesc'),
            weatherIcon: document.getElementById('weatherIcon'),
            feelsLike: document.getElementById('feelsLike'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            visibility: document.getElementById('visibility'),
            pressure: document.getElementById('pressure'),
            forecastContainer: document.getElementById('forecastContainer'),
            hourlyContainer: document.getElementById('hourlyContainer'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            toastContainer: document.getElementById('toastContainer'),
            themeToggle: document.getElementById('themeToggle'),
            unitToggle: document.getElementById('unitToggle'),
            weatherCard: document.getElementById('weatherCard'),
            canvas: document.getElementById('weatherCanvas')
        };
    }

    setupEventListeners() {
        // Search functionality
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Unit toggle
        this.elements.unitToggle.addEventListener('click', () => {
            this.toggleUnits();
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }

    initializeAnimations() {
        if (this.elements.canvas) {
            this.animations = new WeatherAnimations(this.elements.canvas);
            this.animations.start();
        }
    }

    async loadDefaultWeather() {
        const lastCity = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CITY) || CONFIG.DEFAULT_CITY;
        await this.loadWeather(lastCity);
    }

    async handleSearchInput(query) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(async () => {
            if (query.length >= 2) {
                const suggestions = await this.weatherAPI.searchCities(query);
                this.showSuggestions(suggestions);
            } else {
                this.hideSuggestions();
            }
        }, CONFIG.SEARCH_DELAY);
    }

    showSuggestions(suggestions) {
        const suggestionsEl = this.elements.suggestions;
        suggestionsEl.innerHTML = '';

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestions.forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${city.name}, ${city.country}`;
            item.addEventListener('click', () => {
                this.elements.searchInput.value = city.name;
                this.hideSuggestions();
                this.loadWeather(city.name);
            });
            suggestionsEl.appendChild(item);
        });

        suggestionsEl.style.display = 'block';
    }

    hideSuggestions() {
        this.elements.suggestions.style.display = 'none';
    }

    async handleSearch() {
        const query = this.elements.searchInput.value.trim();
        if (query) {
            await this.loadWeather(query);
            this.hideSuggestions();
        }
    }

    async loadWeather(city) {
        this.showLoading();
        
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.weatherAPI.getCurrentWeather(city),
                this.weatherAPI.getForecast(city)
            ]);

            this.updateWeatherDisplay(currentWeather);
            this.updateForecastDisplay(forecast);
            this.updateAnimations(currentWeather);
            
            // Save last searched city
            localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CITY, city);
            
            this.showToast(CONFIG.MESSAGES.SUCCESS, 'success');
        } catch (error) {
            console.error('Weather loading error:', error);
            this.showToast(CONFIG.MESSAGES.API_ERROR, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async loadWeatherByCoords(lat, lon) {
        this.showLoading();
        
        try {
            const currentWeather = await this.weatherAPI.getWeatherByCoords(lat, lon);
            this.updateWeatherDisplay(currentWeather);
            this.updateAnimations(currentWeather);
            this.showToast('Location weather loaded', 'success');
        } catch (error) {
            console.error('Geolocation weather error:', error);
            this.showToast('Unable to load location weather', 'error');
        } finally {
            this.hideLoading();
        }
    }

    updateWeatherDisplay(data) {
        // Update location
        this.elements.locationName.textContent = `${data.name}, ${data.sys?.country || ''}`;
        
        // Update temperature
        const temp = this.convertTemperature(data.main.temp);
        const feelsLike = this.convertTemperature(data.main.feels_like);
        const unit = this.currentUnits === 'metric' ? '°C' : '°F';
        
        this.elements.temperature.textContent = `${Math.round(temp)}°`;
        this.elements.feelsLike.textContent = `${Math.round(feelsLike)}${unit}`;
        
        // Update weather description and icon
        this.elements.weatherDesc.textContent = data.weather[0].description;
        const iconClass = CONFIG.WEATHER_ICONS[data.weather[0].icon] || 'fas fa-sun';
        this.elements.weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
        
        // Update weather details
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.elements.visibility.textContent = `${Math.round(data.visibility / 1000)} km`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        
        // Add animation classes
        this.elements.weatherCard.classList.add('fade-in');
    }

    updateForecastDisplay(data) {
        this.updateDailyForecast(data);
        this.updateHourlyForecast(data);
    }

    updateDailyForecast(data) {
        const dailyData = this.processDailyForecast(data.list);
        const container = this.elements.forecastContainer;
        container.innerHTML = '';

        dailyData.slice(0, CONFIG.FORECAST_DAYS).forEach((day, index) => {
            const card = this.createForecastCard(day, index);
            container.appendChild(card);
        });
    }

    updateHourlyForecast(data) {
        const container = this.elements.hourlyContainer;
        container.innerHTML = '';

        data.list.slice(0, 8).forEach((hour, index) => {
            const card = this.createHourlyCard(hour, index);
            container.appendChild(card);
        });
    }

    processDailyForecast(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyData[date]) {
                dailyData[date] = {
                    date: date,
                    temps: [],
                    weather: item.weather[0],
                    humidity: item.main.humidity,
                    wind: item.wind.speed
                };
            }
            
            dailyData[date].temps.push(item.main.temp);
        });
        
        return Object.values(dailyData).map(day => ({
            ...day,
            tempMin: Math.min(...day.temps),
            tempMax: Math.max(...day.temps)
        }));
    }

    createForecastCard(day, index) {
        const card = document.createElement('div');
        card.className = 'forecast-card stagger-item hover-lift';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' });
        
        const tempMin = this.convertTemperature(day.tempMin);
        const tempMax = this.convertTemperature(day.tempMax);
        const unit = this.currentUnits === 'metric' ? '°' : '°';
        
        const iconClass = CONFIG.WEATHER_ICONS[day.weather.icon] || 'fas fa-sun';
        
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon"><i class="${iconClass}"></i></div>
            <div class="forecast-temp">${Math.round(tempMax)}°/${Math.round(tempMin)}°</div>
            <div class="forecast-desc">${day.weather.description}</div>
        `;
        
        return card;
    }

    createHourlyCard(hour, index) {
        const card = document.createElement('div');
        card.className = 'hourly-card stagger-item hover-lift';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const date = new Date(hour.dt * 1000);
        const time = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
        
        const temp = this.convertTemperature(hour.main.temp);
        const iconClass = CONFIG.WEATHER_ICONS[hour.weather[0].icon] || 'fas fa-sun';
        
        card.innerHTML = `
            <div class="hourly-time">${time}</div>
            <div class="hourly-icon"><i class="${iconClass}"></i></div>
            <div class="hourly-temp">${Math.round(temp)}°</div>
            <div class="hourly-desc">${hour.weather[0].description}</div>
        `;
        
        return card;
    }

    updateAnimations(weatherData) {
        if (!this.animations) return;
        
        const weatherType = this.getWeatherType(weatherData.weather[0].icon);
        this.animations.setWeatherType(weatherType);
        
        // Update canvas background colors
        const colors = CONFIG.WEATHER_COLORS[weatherType];
        if (colors) {
            const canvas = this.elements.canvas;
            canvas.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
        }
    }

    getWeatherType(icon) {
        for (const [type, icons] of Object.entries(CONFIG.WEATHER_TYPES)) {
            if (icons.includes(icon)) {
                return type;
            }
        }
        return 'clear';
    }

    convertTemperature(temp) {
        if (this.currentUnits === 'imperial') {
            return this.weatherAPI.convertTemperature(temp, 'celsius', 'fahrenheit');
        }
        return temp;
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
        this.showToast(`${this.currentTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'info');
    }

    toggleUnits() {
        this.currentUnits = this.currentUnits === 'metric' ? 'imperial' : 'metric';
        this.elements.unitToggle.textContent = this.currentUnits === 'metric' ? '°C' : '°F';
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.UNITS, this.currentUnits);
        
        // Refresh display with new units
        const currentCity = this.elements.locationName.textContent.split(',')[0];
        if (currentCity && currentCity !== 'Loading...') {
            this.loadWeather(currentCity);
        }
        
        this.showToast(`Units changed to ${this.currentUnits === 'metric' ? 'Celsius' : 'Fahrenheit'}`, 'info');
    }

    loadSettings() {
        // Load theme
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = this.elements.themeToggle.querySelector('i');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Load units
        const savedUnits = localStorage.getItem(CONFIG.STORAGE_KEYS.UNITS) || 'metric';
        this.currentUnits = savedUnits;
        this.elements.unitToggle.textContent = savedUnits === 'metric' ? '°C' : '°F';
    }

    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        this.elements.dateTime.textContent = now.toLocaleDateString('en-US', options);
        
        // Update every minute
        setTimeout(() => this.updateDateTime(), 60000);
    }

    startPeriodicUpdates() {
        setInterval(() => {
            const currentCity = this.elements.locationName.textContent.split(',')[0];
            if (currentCity && currentCity !== 'Loading...') {
                this.loadWeather(currentCity);
            }
        }, CONFIG.REFRESH_INTERVAL);
    }

    showLoading() {
        this.elements.loadingOverlay.classList.add('active');
    }

    hideLoading() {
        this.elements.loadingOverlay.classList.remove('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="${iconMap[type]}"></i>
            <span>${message}</span>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    }

    // Cleanup method
    destroy() {
        if (this.animations) {
            this.animations.destroy();
        }
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        if (window.weatherApp && window.weatherApp.animations) {
            window.weatherApp.animations.stop();
        }
    } else {
        // Resume animations when tab becomes visible
        if (window.weatherApp && window.weatherApp.animations) {
            window.weatherApp.animations.start();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.weatherApp && window.weatherApp.animations) {
        window.weatherApp.animations.resize();
    }
});