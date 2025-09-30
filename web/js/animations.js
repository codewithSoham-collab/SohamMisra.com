// Weather Animation Engine
class WeatherAnimations {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.clouds = [];
        this.lightning = [];
        this.animationId = null;
        this.currentWeather = 'clear';
        
        this.setupCanvas();
        this.initializeParticles();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    initializeParticles() {
        this.particles = [];
        this.clouds = [];
        this.lightning = [];
        
        // Initialize clouds
        for (let i = 0; i < 3; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 100 + 20,
                size: Math.random() * 60 + 40,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.3 + 0.7
            });
        }
    }

    // Start animation loop
    start() {
        if (this.animationId) return;
        
        const animate = () => {
            this.clear();
            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Stop animation
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // Clear canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Update particles and effects
    update() {
        switch (this.currentWeather) {
            case 'clear':
                this.updateSunny();
                break;
            case 'clouds':
                this.updateCloudy();
                break;
            case 'rain':
                this.updateRainy();
                break;
            case 'thunderstorm':
                this.updateStormy();
                break;
            case 'snow':
                this.updateSnowy();
                break;
            case 'mist':
                this.updateMisty();
                break;
        }
    }

    // Draw all elements
    draw() {
        switch (this.currentWeather) {
            case 'clear':
                this.drawSunny();
                break;
            case 'clouds':
                this.drawCloudy();
                break;
            case 'rain':
                this.drawRainy();
                break;
            case 'thunderstorm':
                this.drawStormy();
                break;
            case 'snow':
                this.drawSnowy();
                break;
            case 'mist':
                this.drawMisty();
                break;
        }
    }

    // Sunny weather animation
    updateSunny() {
        // Update floating particles
        this.particles.forEach(particle => {
            particle.y += particle.speed;
            particle.x += Math.sin(particle.y * 0.01) * 0.5;
            
            if (particle.y > this.canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * this.canvas.width;
            }
        });
        
        // Add particles if needed
        while (this.particles.length < 20) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 0.5 + 0.2,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawSunny() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sun
        const sunX = this.canvas.width - 100;
        const sunY = 80;
        const time = Date.now() * 0.001;
        
        // Sun rays
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 + time * 20) * Math.PI / 180;
            const startX = sunX + Math.cos(angle) * 40;
            const startY = sunY + Math.sin(angle) * 40;
            const endX = sunX + Math.cos(angle) * 60;
            const endY = sunY + Math.sin(angle) * 60;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        
        // Sun body
        const sunGradient = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 35);
        sunGradient.addColorStop(0, '#FFD700');
        sunGradient.addColorStop(1, '#FFA500');
        this.ctx.fillStyle = sunGradient;
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw floating particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(255, 250, 205, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Cloudy weather animation
    updateCloudy() {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + 100) {
                cloud.x = -100;
                cloud.y = Math.random() * 100 + 20;
            }
        });
    }

    drawCloudy() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#a0aec0');
        gradient.addColorStop(1, '#718096');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.size, `rgba(255, 255, 255, ${cloud.opacity})`);
        });
    }

    // Rainy weather animation
    updateRainy() {
        // Update rain particles
        this.particles.forEach(particle => {
            particle.y += particle.speed;
            particle.x += particle.wind;
            
            if (particle.y > this.canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * this.canvas.width;
            }
        });
        
        // Add rain particles
        while (this.particles.length < 100) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 8 + 5,
                wind: Math.random() * 2 - 1,
                length: Math.random() * 15 + 10
            });
        }
        
        // Update clouds
        this.updateCloudy();
    }

    drawRainy() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4a5568');
        gradient.addColorStop(1, '#2d3748');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.size, 'rgba(105, 105, 105, 0.8)');
        });
        
        // Draw rain
        this.ctx.strokeStyle = '#4299e1';
        this.ctx.lineWidth = 2;
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x, particle.y + particle.length);
            this.ctx.stroke();
        });
        
        // Draw puddles
        this.drawPuddles();
    }

    // Stormy weather animation
    updateStormy() {
        this.updateRainy();
        
        // Update lightning
        if (Math.random() < 0.02) {
            this.lightning.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                segments: this.generateLightning(),
                life: 10,
                maxLife: 10
            });
        }
        
        this.lightning = this.lightning.filter(bolt => {
            bolt.life--;
            return bolt.life > 0;
        });
    }

    drawStormy() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2d3748');
        gradient.addColorStop(1, '#1a202c');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw storm clouds
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.size, 'rgba(64, 64, 64, 0.9)');
        });
        
        // Draw heavy rain
        this.ctx.strokeStyle = '#4682B4';
        this.ctx.lineWidth = 3;
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x, particle.y + particle.length * 1.5);
            this.ctx.stroke();
        });
        
        // Draw lightning
        this.lightning.forEach(bolt => {
            const opacity = bolt.life / bolt.maxLife;
            this.ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            bolt.segments.forEach((segment, index) => {
                if (index === 0) {
                    this.ctx.moveTo(bolt.x + segment.x, segment.y);
                } else {
                    this.ctx.lineTo(bolt.x + segment.x, segment.y);
                }
            });
            this.ctx.stroke();
            
            this.ctx.shadowBlur = 0;
        });
    }

    // Snowy weather animation
    updateSnowy() {
        this.particles.forEach(particle => {
            particle.y += particle.speed;
            particle.x += Math.sin(particle.y * 0.01 + particle.offset) * 0.5;
            
            if (particle.y > this.canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * this.canvas.width;
            }
        });
        
        // Add snow particles
        while (this.particles.length < 50) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1,
                size: Math.random() * 4 + 2,
                offset: Math.random() * Math.PI * 2
            });
        }
    }

    drawSnowy() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e2e8f0');
        gradient.addColorStop(1, '#cbd5e0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snowflakes
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.y * 0.01);
            
            // Draw snowflake
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                this.ctx.rotate(Math.PI / 3);
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(0, -particle.size);
                this.ctx.moveTo(0, -particle.size * 0.6);
                this.ctx.lineTo(-particle.size * 0.3, -particle.size * 0.8);
                this.ctx.moveTo(0, -particle.size * 0.6);
                this.ctx.lineTo(particle.size * 0.3, -particle.size * 0.8);
            }
            this.ctx.stroke();
            this.ctx.restore();
        });
    }

    // Misty weather animation
    updateMisty() {
        this.particles.forEach(particle => {
            particle.x += particle.speed;
            particle.opacity = 0.3 + Math.sin(particle.x * 0.01) * 0.2;
            
            if (particle.x > this.canvas.width + 100) {
                particle.x = -100;
            }
        });
        
        // Add mist particles
        while (this.particles.length < 30) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 0.5 + 0.1,
                size: Math.random() * 50 + 30,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    drawMisty() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#a0aec0');
        gradient.addColorStop(1, '#718096');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw mist
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Helper methods
    drawCloud(x, y, size, color) {
        this.ctx.fillStyle = color;
        
        // Main cloud body
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + size * 0.1, y - size * 0.3, size * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPuddles() {
        const puddleCount = 5;
        this.ctx.fillStyle = 'rgba(66, 153, 225, 0.6)';
        
        for (let i = 0; i < puddleCount; i++) {
            const x = (i + 1) * (this.canvas.width / (puddleCount + 1));
            const width = Math.random() * 60 + 40;
            const height = Math.random() * 8 + 5;
            
            this.ctx.beginPath();
            this.ctx.ellipse(x, this.canvas.height - 10, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    generateLightning() {
        const segments = [];
        let currentY = 0;
        let currentX = 0;
        
        while (currentY < this.canvas.height) {
            currentY += Math.random() * 30 + 20;
            currentX += (Math.random() - 0.5) * 60;
            segments.push({ x: currentX, y: currentY });
        }
        
        return segments;
    }

    // Change weather type
    setWeatherType(weatherType) {
        if (this.currentWeather !== weatherType) {
            this.currentWeather = weatherType;
            this.particles = [];
            this.lightning = [];
            
            // Reinitialize particles based on weather type
            if (weatherType === 'rain' || weatherType === 'thunderstorm') {
                this.particles = [];
            } else if (weatherType === 'snow') {
                this.particles = [];
            } else if (weatherType === 'clear') {
                this.particles = [];
            }
        }
    }

    // Resize canvas
    resize() {
        this.setupCanvas();
    }

    // Destroy animation
    destroy() {
        this.stop();
        this.particles = [];
        this.clouds = [];
        this.lightning = [];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherAnimations;
} else {
    window.WeatherAnimations = WeatherAnimations;
}