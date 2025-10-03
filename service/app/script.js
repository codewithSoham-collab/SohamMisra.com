// Preloader functionality
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            mainContent.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }, 500);
    }, 3000);
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(13, 20, 33, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 188, 212, 0.1)';
    } else {
        header.style.background = 'rgba(13, 20, 33, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// App download functionality
const apps = {
    notification: {
        name: 'Notification Manager Pro',
        android: 'notification-manager-pro.apk',
        ios: 'notification-manager-pro.ipa',
        windows: 'notification-manager-pro.exe'
    },
    task: {
        name: 'Smart Task Manager',
        android: 'smart-task-manager.apk',
        ios: 'smart-task-manager.ipa',
        windows: 'smart-task-manager.exe'
    },
    media: {
        name: 'Ultimate Media Player',
        android: 'ultimate-media-player.apk',
        ios: 'ultimate-media-player.ipa',
        windows: 'ultimate-media-player.exe'
    }
};

function downloadApp(appType, platform) {
    const app = apps[appType];
    const fileName = app[platform];
    const appName = app.name;
    
    let content, mimeType;
    
    if (platform === 'windows') {
        // Generate executable content for Windows
        content = generateExeContent(appType, appName);
        mimeType = 'application/octet-stream';
    } else if (platform === 'android') {
        // Generate APK content for Android
        content = generateApkContent(appType, appName);
        mimeType = 'application/vnd.android.package-archive';
    } else {
        // Generate IPA content for iOS
        content = generateIpaContent(appType, appName);
        mimeType = 'application/octet-stream';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = fileName;
    a.click();
    
    URL.revokeObjectURL(url);
    
    alert(`${appName} for ${platform} downloaded successfully!`);
}

function generateExeContent(appType, appName) {
    return `MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00\xB8\x00\x00\x00\x00\x00\x00\x00\x40\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x0E\x1F\xBA\x0E\x00\xB4\x09\xCD\x21\xB8\x01\x4C\xCD\x21This program cannot be run in DOS mode.\r\r\n$\x00\x00\x00\x00\x00\x00\x00${appName} - Developed by Soham Misra\x00\x00\x00`;
}

function generateApkContent(appType, appName) {
    return `PK\x03\x04\x14\x00\x08\x08\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00AndroidManifest.xml<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    package="com.sohammisra.${appType}"\n    android:versionCode="1"\n    android:versionName="1.0">\n    <application\n        android:label="${appName}"\n        android:icon="@mipmap/ic_launcher">\n        <activity\n            android:name=".MainActivity"\n            android:exported="true">\n            <intent-filter>\n                <action android:name="android.intent.action.MAIN" />\n                <category android:name="android.intent.category.LAUNCHER" />\n            </intent-filter>\n        </activity>\n    </application>\n</manifest>PK\x07\x08\x00\x00\x00\x00\x00\x00\x00\x00PK\x01\x02\x14\x00\x14\x00\x08\x08\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x01\x00\x00\x00\x00AndroidManifest.xmlPK\x05\x06\x00\x00\x00\x00\x01\x00\x01\x00A\x00\x00\x00\x00\x00\x00\x00\x00\x00`;
}

function generateIpaContent(appType, appName) {
    return `${appName} - iOS Application\nDeveloped by Soham Misra\n\nThis is a demo IPA file for portfolio purposes.\nActual iOS apps would be distributed through the App Store.\n\nApp Type: ${appType}\nPlatform: iOS\nDeveloper: Soham Misra\nVersion: 1.0.0`;
}



// Modal close functionality
const modal = document.getElementById('downloadModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.app-card, .feature-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 188, 212, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }
}

// Initialize particles after content loads
setTimeout(createParticles, 4000);

// Dynamic typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Add hover effects to app cards
document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn, .download-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);