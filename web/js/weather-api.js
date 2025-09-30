// Weather API Handler
class WeatherAPI {
    constructor() {
        this.apiKey = CONFIG.API_KEY;
        this.baseUrl = CONFIG.BASE_URL;
        this.geoUrl = CONFIG.GEO_URL;
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
    }

    // Get current weather data
    async getCurrentWeather(city) {
        const cacheKey = `current_${city}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            let data;
            if (this.apiKey) {
                data = await this.fetchRealWeather(city);
            } else {
                data = this.generateMockWeather(city);
            }
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Weather API Error:', error);
            return this.generateMockWeather(city);
        }
    }

    // Get forecast data
    async getForecast(city) {
        const cacheKey = `forecast_${city}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            let data;
            if (this.apiKey) {
                data = await this.fetchRealForecast(city);
            } else {
                data = this.generateMockForecast(city);
            }
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Forecast API Error:', error);
            return this.generateMockForecast(city);
        }
    }

    // Fetch real weather data
    async fetchRealWeather(city) {
        const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${CONFIG.DEFAULT_UNITS}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Fetch real forecast data
    async fetchRealForecast(city) {
        const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${CONFIG.DEFAULT_UNITS}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Generate mock weather data
    generateMockWeather(city) {
        const weatherConditions = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        const descriptions = {
            '01d': 'clear sky',
            '02d': 'few clouds',
            '03d': 'scattered clouds',
            '04d': 'broken clouds',
            '09d': 'shower rain',
            '10d': 'rain',
            '11d': 'thunderstorm',
            '13d': 'snow',
            '50d': 'mist'
        };

        const baseTemp = 20 + (Math.random() - 0.5) * 30;
        
        return {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            main: {
                temp: Math.round(baseTemp),
                feels_like: Math.round(baseTemp + (Math.random() - 0.5) * 5),
                temp_min: Math.round(baseTemp - 3),
                temp_max: Math.round(baseTemp + 3),
                pressure: Math.round(1000 + Math.random() * 50),
                humidity: Math.round(30 + Math.random() * 60)
            },
            weather: [{
                id: Math.floor(Math.random() * 800) + 200,
                main: this.getWeatherMain(condition),
                description: descriptions[condition],
                icon: condition
            }],
            wind: {
                speed: Math.round(Math.random() * 15),
                deg: Math.round(Math.random() * 360)
            },
            visibility: Math.round(5000 + Math.random() * 5000),
            sys: {
                country: 'XX',
                sunrise: Date.now() / 1000 - 3600,
                sunset: Date.now() / 1000 + 3600
            },
            dt: Math.floor(Date.now() / 1000),
            coord: {
                lat: (Math.random() - 0.5) * 180,
                lon: (Math.random() - 0.5) * 360
            }
        };
    }

    // Generate mock forecast data
    generateMockForecast(city) {
        const forecasts = [];
        const baseTemp = 20 + (Math.random() - 0.5) * 30;
        
        // Generate 40 forecast items (5 days * 8 times per day)
        for (let i = 0; i < 40; i++) {
            const date = new Date();
            date.setHours(date.getHours() + i * 3);
            
            const tempVariation = Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 5;
            const temp = baseTemp + tempVariation;
            
            const weatherConditions = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
            const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            
            forecasts.push({
                dt: Math.floor(date.getTime() / 1000),
                main: {
                    temp: Math.round(temp),
                    feels_like: Math.round(temp + (Math.random() - 0.5) * 3),
                    temp_min: Math.round(temp - 2),
                    temp_max: Math.round(temp + 2),
                    pressure: Math.round(1000 + Math.random() * 50),
                    humidity: Math.round(30 + Math.random() * 60)
                },
                weather: [{
                    id: Math.floor(Math.random() * 800) + 200,
                    main: this.getWeatherMain(condition),
                    description: this.getWeatherDescription(condition),
                    icon: condition
                }],
                wind: {
                    speed: Math.round(Math.random() * 15),
                    deg: Math.round(Math.random() * 360)
                },
                visibility: Math.round(5000 + Math.random() * 5000),
                pop: Math.random(),
                dt_txt: date.toISOString().replace('T', ' ').substring(0, 19)
            });
        }
        
        return {
            cod: '200',
            message: 0,
            cnt: forecasts.length,
            list: forecasts,
            city: {
                id: Math.floor(Math.random() * 1000000),
                name: city.charAt(0).toUpperCase() + city.slice(1),
                coord: {
                    lat: (Math.random() - 0.5) * 180,
                    lon: (Math.random() - 0.5) * 360
                },
                country: 'XX',
                population: Math.floor(Math.random() * 10000000),
                timezone: Math.floor((Math.random() - 0.5) * 86400),
                sunrise: Math.floor(Date.now() / 1000) - 3600,
                sunset: Math.floor(Date.now() / 1000) + 3600
            }
        };
    }

    // Get weather main category from icon
    getWeatherMain(icon) {
        const mainMap = {
            '01d': 'Clear', '01n': 'Clear',
            '02d': 'Clouds', '02n': 'Clouds',
            '03d': 'Clouds', '03n': 'Clouds',
            '04d': 'Clouds', '04n': 'Clouds',
            '09d': 'Rain', '09n': 'Rain',
            '10d': 'Rain', '10n': 'Rain',
            '11d': 'Thunderstorm', '11n': 'Thunderstorm',
            '13d': 'Snow', '13n': 'Snow',
            '50d': 'Mist', '50n': 'Mist'
        };
        return mainMap[icon] || 'Clear';
    }

    // Get weather description from icon
    getWeatherDescription(icon) {
        const descMap = {
            '01d': 'clear sky', '01n': 'clear sky',
            '02d': 'few clouds', '02n': 'few clouds',
            '03d': 'scattered clouds', '03n': 'scattered clouds',
            '04d': 'broken clouds', '04n': 'broken clouds',
            '09d': 'shower rain', '09n': 'shower rain',
            '10d': 'rain', '10n': 'rain',
            '11d': 'thunderstorm', '11n': 'thunderstorm',
            '13d': 'snow', '13n': 'snow',
            '50d': 'mist', '50n': 'mist'
        };
        return descMap[icon] || 'clear sky';
    }

    // Search cities for autocomplete
    async searchCities(query) {
        if (!query || query.length < 2) return [];
        
        // Use demo cities for autocomplete
        const matches = CONFIG.DEMO_CITIES.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        return matches.map(city => ({
            name: city,
            country: 'Demo',
            lat: 0,
            lon: 0
        }));
    }

    // Get weather by coordinates
    async getWeatherByCoords(lat, lon) {
        try {
            if (this.apiKey) {
                const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${CONFIG.DEFAULT_UNITS}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } else {
                return this.generateMockWeather('Current Location');
            }
        } catch (error) {
            console.error('Geolocation Weather Error:', error);
            return this.generateMockWeather('Current Location');
        }
    }

    // Convert temperature units
    convertTemperature(temp, fromUnit, toUnit) {
        if (fromUnit === toUnit) return temp;
        
        if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            return (temp * 9/5) + 32;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            return (temp - 32) * 5/9;
        }
        
        return temp;
    }

    // Convert wind speed units
    convertWindSpeed(speed, fromUnit, toUnit) {
        // Convert from m/s to km/h or mph
        if (fromUnit === 'mps') {
            if (toUnit === 'kmh') {
                return speed * 3.6;
            } else if (toUnit === 'mph') {
                return speed * 2.237;
            }
        }
        return speed;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Check if API key is configured
    hasApiKey() {
        return !!this.apiKey;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherAPI;
} else {
    window.WeatherAPI = WeatherAPI;
}