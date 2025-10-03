document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    
    searchToggle.addEventListener('click', function() {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchBox.focus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchBox.classList.remove('active');
        }
    });

    // Movie slider functionality
    const sliders = document.querySelectorAll('.movie-slider');
    const prevBtns = document.querySelectorAll('.slider-btn.prev');
    const nextBtns = document.querySelectorAll('.slider-btn.next');
    
    let currentSlide = {};
    
    sliders.forEach((slider, index) => {
        currentSlide[index] = 0;
    });
    
    prevBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const slider = sliders[index];
            const cardWidth = slider.querySelector('.movie-card').offsetWidth + 4;
            const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
            
            if (currentSlide[index] > 0) {
                currentSlide[index]--;
                slider.style.transform = `translateX(-${currentSlide[index] * cardWidth * visibleCards}px)`;
            }
        });
    });
    
    nextBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const slider = sliders[index];
            const cardWidth = slider.querySelector('.movie-card').offsetWidth + 4;
            const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
            const totalCards = slider.querySelectorAll('.movie-card').length;
            const maxSlides = Math.ceil(totalCards / visibleCards) - 1;
            
            if (currentSlide[index] < maxSlides) {
                currentSlide[index]++;
                slider.style.transform = `translateX(-${currentSlide[index] * cardWidth * visibleCards}px)`;
            }
        });
    });

    // Movie card interactions
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        const actionBtns = card.querySelectorAll('.action-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                alert('Playing video...');
            });
        }
        
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const actions = ['Added to My List', 'Liked', 'Disliked'];
                if (actions[index]) {
                    this.style.background = '#46d369';
                    setTimeout(() => {
                        this.style.background = 'rgba(42,42,42,0.6)';
                    }, 1000);
                }
            });
        });
        
        card.addEventListener('click', function() {
            alert('Opening movie details...');
        });
    });

    // Hero play button
    const heroPlayBtn = document.querySelector('.btn-play');
    const heroInfoBtn = document.querySelector('.btn-info');
    
    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', function() {
            alert('Playing Stranger Things...');
        });
    }
    
    if (heroInfoBtn) {
        heroInfoBtn.addEventListener('click', function() {
            alert('More info about Stranger Things...');
        });
    }

    // Navigation menu
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Profile dropdown simulation
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function() {
            alert('Profile menu opened');
        });
    }

    // Notifications
    const notifications = document.querySelector('.notifications');
    
    if (notifications) {
        notifications.addEventListener('click', function() {
            alert('No new notifications');
        });
    }
});