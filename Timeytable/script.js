class TimerApp {
    constructor() {
        this.timers = [];
        this.init();
    }

    init() {
        this.showPreloader();
        this.bindEvents();
    }

    showPreloader() {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
        }, 5000);
    }

    bindEvents() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.showModal());
        document.getElementById('cancelTask').addEventListener('click', () => this.hideModal());
        document.getElementById('startTimer').addEventListener('click', () => this.createTimer());
        
        // Close modal on outside click
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') this.hideModal();
        });
    }

    showModal() {
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskName').focus();
    }

    hideModal() {
        document.getElementById('taskModal').classList.add('hidden');
        this.clearForm();
    }

    clearForm() {
        document.getElementById('taskName').value = '';
        document.getElementById('hours').value = '0';
        document.getElementById('minutes').value = '5';
        document.getElementById('seconds').value = '0';
    }

    createTimer() {
        const name = document.getElementById('taskName').value.trim();
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds <= 0) {
            alert('Please set a valid time');
            return;
        }

        const timer = new Timer(name, totalSeconds, this);
        this.timers.push(timer);
        this.hideModal();
    }

    removeTimer(timer) {
        const index = this.timers.indexOf(timer);
        if (index > -1) {
            this.timers.splice(index, 1);
        }
    }

    playNotification() {
        // Create audio context for notification sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }
}

class Timer {
    constructor(name, totalSeconds, app) {
        this.name = name;
        this.totalSeconds = totalSeconds;
        this.remainingSeconds = totalSeconds;
        this.app = app;
        this.intervalId = null;
        this.isRunning = true;
        this.isPaused = false;
        
        this.createElement();
        this.start();
    }

    createElement() {
        const container = document.getElementById('timersContainer');
        this.element = document.createElement('div');
        this.element.className = 'timer-card';
        this.element.innerHTML = `
            <div class="timer-header">
                <span class="task-name">${this.name}</span>
                <button class="delete-btn" onclick="this.parentElement.parentElement.timerInstance.delete()">×</button>
            </div>
            <div class="timer-display">${this.formatTime(this.remainingSeconds)}</div>
            <div class="timer-controls">
                <button class="pause-btn" onclick="this.parentElement.parentElement.timerInstance.pause()">Pause</button>
                <button class="stop-btn" onclick="this.parentElement.parentElement.timerInstance.stop()">Stop</button>
            </div>
        `;
        this.element.timerInstance = this;
        container.appendChild(this.element);
    }

    start() {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.remainingSeconds--;
                this.updateDisplay();
                
                if (this.remainingSeconds <= 0) {
                    this.complete();
                }
            }
        }, 1000);
    }

    pause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = this.element.querySelector('.pause-btn');
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        pauseBtn.className = this.isPaused ? 'resume-btn' : 'pause-btn';
    }

    stop() {
        this.delete();
    }

    delete() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.element.remove();
        this.app.removeTimer(this);
    }

    complete() {
        clearInterval(this.intervalId);
        this.app.playNotification();
        
        // Show completion message
        this.element.innerHTML = `
            <div class="timer-header">
                <span class="task-name">${this.name}</span>
                <button class="delete-btn" onclick="this.parentElement.parentElement.timerInstance.delete()">×</button>
            </div>
            <div class="timer-display" style="color: #ff4757;">TIME'S UP!</div>
            <div style="text-align: center; margin-top: 10px; color: #666;">
                Task completed successfully
            </div>
        `;
        
        // Send browser notification if permission granted
        if (Notification.permission === 'granted') {
            new Notification('Timeytable - Time\'s Up!', {
                body: `${this.name} timer has finished`,
                icon: 'icon.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Timeytable - Time\'s Up!', {
                        body: `${this.name} timer has finished`,
                        icon: 'icon.png'
                    });
                }
            });
        }
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (this.element.parentNode) {
                this.delete();
            }
        }, 10000);
    }

    updateDisplay() {
        const display = this.element.querySelector('.timer-display');
        display.textContent = this.formatTime(this.remainingSeconds);
        
        // Change color when time is running low
        if (this.remainingSeconds <= 60) {
            display.style.color = '#ff4757';
        } else if (this.remainingSeconds <= 300) {
            display.style.color = '#ffa502';
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});