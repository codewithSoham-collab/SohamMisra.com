// Notification Manager Pro JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        const appContainer = document.getElementById('app-container');
        
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            preloader.style.display = 'none';
            appContainer.style.display = 'block';
            appContainer.style.opacity = '0';
            appContainer.style.animation = 'fadeInUp 0.8s ease-out forwards';
            
            // Initialize app after preloader
            initializeApp();
        }, 500);
    }, 3000);
});

// App initialization
function initializeApp() {
    initializeNotifications();
    initializeEventListeners();
    startLiveUpdates();
    animateStats();
}

// Sample notification data
const notificationTypes = {
    social: { icon: 'fab fa-facebook', color: '#3b5998', apps: ['Facebook', 'Instagram', 'Twitter', 'WhatsApp'] },
    work: { icon: 'fas fa-briefcase', color: '#0077b5', apps: ['Slack', 'Teams', 'Gmail', 'Outlook'] },
    entertainment: { icon: 'fas fa-play', color: '#e50914', apps: ['Netflix', 'YouTube', 'Spotify', 'Prime Video'] },
    news: { icon: 'fas fa-newspaper', color: '#ff6600', apps: ['BBC News', 'CNN', 'Reuters', 'AP News'] },
    shopping: { icon: 'fas fa-shopping-cart', color: '#ff9900', apps: ['Amazon', 'eBay', 'Flipkart', 'Shopify'] }
};

let notifications = [];
let isLiveUpdatesActive = true;
let currentCategory = 'all';

// Initialize notifications
function initializeNotifications() {
    // Generate initial notifications
    for (let i = 0; i < 15; i++) {
        generateRandomNotification();
    }
    renderNotifications();
}

// Generate random notification
function generateRandomNotification() {
    const categories = Object.keys(notificationTypes);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const typeData = notificationTypes[category];
    const app = typeData.apps[Math.floor(Math.random() * typeData.apps.length)];
    
    const messages = {
        social: [
            'You have a new message',
            'Someone liked your post',
            'New friend request',
            'You were tagged in a photo',
            'New comment on your post'
        ],
        work: [
            'New email received',
            'Meeting reminder in 15 minutes',
            'Task deadline approaching',
            'New message in team chat',
            'Document shared with you'
        ],
        entertainment: [
            'New episode available',
            'Recommended for you',
            'Download completed',
            'New playlist created',
            'Live stream starting'
        ],
        news: [
            'Breaking news alert',
            'Daily news digest',
            'Weather update',
            'Sports score update',
            'Market news'
        ],
        shopping: [
            'Item on sale',
            'Order shipped',
            'Price drop alert',
            'Delivery update',
            'New deals available'
        ]
    };
    
    const categoryMessages = messages[category];
    const message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    
    const notification = {
        id: Date.now() + Math.random(),
        category: category,
        app: app,
        title: app,
        message: message,
        time: new Date(),
        icon: typeData.icon,
        color: typeData.color,
        read: Math.random() > 0.7
    };
    
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
}

// Render notifications
function renderNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const filteredNotifications = currentCategory === 'all' 
        ? notifications 
        : notifications.filter(n => n.category === currentCategory);
    
    notificationsList.innerHTML = '';
    
    filteredNotifications.slice(0, 10).forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        notificationsList.appendChild(notificationElement);
    });
    
    updateCategoryCounts();
}

// Create notification element
function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = 'notification-item';
    div.style.opacity = '0';
    
    const timeAgo = getTimeAgo(notification.time);
    
    div.innerHTML = `
        <div class="notification-icon" style="background: ${notification.color}">
            <i class="${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${timeAgo}</div>
        </div>
        <div class="notification-actions">
            <button class="action-btn" onclick="markAsRead(${notification.id})">
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn" onclick="dismissNotification(${notification.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Animate in
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateX(0)';
    }, 100);
    
    return div;
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
}

// Update category counts
function updateCategoryCounts() {
    const categoryCounts = {
        all: notifications.length,
        social: notifications.filter(n => n.category === 'social').length,
        work: notifications.filter(n => n.category === 'work').length,
        entertainment: notifications.filter(n => n.category === 'entertainment').length,
        news: notifications.filter(n => n.category === 'news').length,
        shopping: notifications.filter(n => n.category === 'shopping').length
    };
    
    Object.keys(categoryCounts).forEach(category => {
        const categoryCard = document.querySelector(`[data-category="${category}"]`);
        if (categoryCard) {
            const countElement = categoryCard.querySelector('.category-count');
            if (countElement) {
                countElement.textContent = categoryCounts[category];
            }
        }
    });
    
    // Update stats
    document.getElementById('totalNotifications').textContent = notifications.length;
    document.getElementById('filteredNotifications').textContent = 
        Math.floor(notifications.length * 0.36); // Simulated filtered count
    document.getElementById('scheduledNotifications').textContent = 
        Math.floor(notifications.length * 0.05); // Simulated scheduled count
}

// Initialize event listeners
function initializeEventListeners() {
    // Category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderNotifications();
        });
    });
    
    // Control buttons
    document.getElementById('pauseBtn').addEventListener('click', toggleLiveUpdates);
    document.getElementById('clearBtn').addEventListener('click', clearAllNotifications);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('addRuleBtn').addEventListener('click', addNewRule);
    
    // Modal functionality
    const modal = document.getElementById('settingsModal');
    const closeBtn = modal.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.setting-item, .rule-card');
            if (setting) {
                const settingName = setting.querySelector('span').textContent;
                console.log(`${settingName} ${this.checked ? 'enabled' : 'disabled'}`);
                
                // Add visual feedback
                if (this.checked) {
                    setting.style.background = 'rgba(255, 107, 53, 0.1)';
                } else {
                    setting.style.background = '';
                }
                
                setTimeout(() => {
                    setting.style.background = '';
                }, 1000);
            }
        });
    });
}

// Toggle live updates
function toggleLiveUpdates() {
    isLiveUpdatesActive = !isLiveUpdatesActive;
    const pauseBtn = document.getElementById('pauseBtn');
    const icon = pauseBtn.querySelector('i');
    
    if (isLiveUpdatesActive) {
        icon.className = 'fas fa-pause';
        pauseBtn.style.background = 'rgba(255, 107, 53, 0.2)';
    } else {
        icon.className = 'fas fa-play';
        pauseBtn.style.background = 'var(--primary-orange)';
        pauseBtn.style.color = 'white';
    }
}

// Clear all notifications
function clearAllNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const items = notificationsList.querySelectorAll('.notification-item');
    
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                item.remove();
            }, 300);
        }, index * 50);
    });
    
    setTimeout(() => {
        notifications = [];
        updateCategoryCounts();
    }, items.length * 50 + 300);
}

// Mark notification as read
function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        renderNotifications();
    }
}

// Dismiss notification
function dismissNotification(notificationId) {
    const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
    if (notificationElement) {
        notificationElement.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            notifications = notifications.filter(n => n.id !== notificationId);
            renderNotifications();
        }, 300);
    }
}

// Open settings modal
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'block';
}

// Add new rule
function addNewRule() {
    const rulesContainer = document.querySelector('.rules-container');
    const newRule = document.createElement('div');
    newRule.className = 'rule-card';
    newRule.style.opacity = '0';
    newRule.style.transform = 'translateY(20px)';
    
    newRule.innerHTML = `
        <div class="rule-header">
            <i class="fas fa-magic"></i>
            <span>Custom Rule ${document.querySelectorAll('.rule-card').length + 1}</span>
            <label class="toggle-switch">
                <input type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
        <p>Configure your custom notification rule</p>
    `;
    
    rulesContainer.appendChild(newRule);
    
    // Animate in
    setTimeout(() => {
        newRule.style.opacity = '1';
        newRule.style.transform = 'translateY(0)';
        newRule.style.transition = 'all 0.3s ease';
    }, 100);
    
    // Add event listener to new toggle
    const toggle = newRule.querySelector('input[type="checkbox"]');
    toggle.addEventListener('change', function() {
        if (this.checked) {
            newRule.style.background = 'rgba(255, 107, 53, 0.1)';
        } else {
            newRule.style.background = '';
        }
        
        setTimeout(() => {
            newRule.style.background = '';
        }, 1000);
    });
}

// Start live updates
function startLiveUpdates() {
    setInterval(() => {
        if (isLiveUpdatesActive && Math.random() > 0.7) {
            generateRandomNotification();
            renderNotifications();
            
            // Show notification animation
            const notificationsList = document.getElementById('notificationsList');
            const firstItem = notificationsList.querySelector('.notification-item');
            if (firstItem) {
                firstItem.style.background = 'rgba(255, 107, 53, 0.2)';
                setTimeout(() => {
                    firstItem.style.background = '';
                }, 2000);
            }
        }
    }, 3000);
}

// Animate stats on load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 30);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-item {
        transition: all 0.3s ease;
    }
    
    .stat-info h3 {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);