document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    menuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
            // Here you would typically filter videos or redirect to search results
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Video card click functionality
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('.video-title').textContent;
            alert(`Playing: ${videoTitle}`);
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            const section = this.textContent.trim();
            alert(`Navigating to: ${section}`);
        });
    });

    // Channel items
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const channelName = this.textContent.trim();
            alert(`Visiting channel: ${channelName}`);
        });
    });

    // Header buttons functionality
    const createBtn = document.querySelector('.create-btn');
    const notificationsBtn = document.querySelector('.notifications-btn');
    const profileBtn = document.querySelector('.profile-btn');
    
    createBtn.addEventListener('click', function() {
        alert('Create new video');
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
    
    notificationsBtn.addEventListener('click', function() {
        alert('Notifications panel');
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
    
    profileBtn.addEventListener('click', function() {
        alert('User profile menu');
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });

    // Video hover effects
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.thumbnail-placeholder');
        
        card.addEventListener('mouseenter', function() {
            thumbnail.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            thumbnail.style.transform = 'scale(1)';
        });
    });

    // Simulate video loading
    function simulateVideoLoad() {
        const thumbnails = document.querySelectorAll('.thumbnail-placeholder');
        
        thumbnails.forEach((thumbnail, index) => {
            setTimeout(() => {
                thumbnail.style.opacity = '0.8';
                setTimeout(() => {
                    thumbnail.style.opacity = '1';
                }, 200);
            }, index * 100);
        });
    }
    
    // Run simulation after page load
    setTimeout(simulateVideoLoad, 500);

    // Responsive sidebar for mobile
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});