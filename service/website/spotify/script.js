document.addEventListener('DOMContentLoaded', function() {
    // Play/Pause functionality
    const playPauseBtn = document.querySelector('.play-pause');
    let isPlaying = false;
    
    playPauseBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? '⏸' : '▶';
        
        if (isPlaying) {
            startProgressAnimation();
        }
    });

    // Progress bar animation
    function startProgressAnimation() {
        const progressFill = document.querySelector('.progress-fill');
        let width = 30;
        
        const interval = setInterval(() => {
            if (!isPlaying || width >= 100) {
                clearInterval(interval);
                return;
            }
            width += 0.5;
            progressFill.style.width = width + '%';
        }, 100);
    }

    // Play buttons on playlist cards
    const playBtns = document.querySelectorAll('.play-btn');
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Reset all other play buttons
            playBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.textContent = '▶';
                }
            });
            
            // Toggle this button
            const isCurrentlyPlaying = this.textContent === '⏸';
            this.textContent = isCurrentlyPlaying ? '▶' : '⏸';
            
            // Update main play button
            playPauseBtn.textContent = isCurrentlyPlaying ? '▶' : '⏸';
            isPlaying = !isCurrentlyPlaying;
            
            if (isPlaying) {
                startProgressAnimation();
            }
        });
    });

    // Like button functionality
    const likeBtn = document.querySelector('.like-btn');
    
    likeBtn.addEventListener('click', function() {
        const isLiked = this.textContent === '♥';
        this.textContent = isLiked ? '♡' : '♥';
        this.style.color = isLiked ? '#b3b3b3' : '#1db954';
    });

    // Volume control
    const volumeBar = document.querySelector('.volume-bar');
    const volumeFill = document.querySelector('.volume-fill');
    
    volumeBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width * 100;
        volumeFill.style.width = percent + '%';
    });

    // Progress bar control
    const progressBar = document.querySelector('.progress');
    const progressFill = document.querySelector('.progress-fill');
    
    progressBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width * 100;
        progressFill.style.width = percent + '%';
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
        });
    });

    // Playlist items hover effect
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update now playing info
            const trackName = document.querySelector('.track-name');
            const artistName = document.querySelector('.artist-name');
            
            trackName.textContent = this.textContent.split(' ').slice(1).join(' ');
            artistName.textContent = 'Various Artists';
        });
    });

    // Quick pick items
    const quickPickItems = document.querySelectorAll('.quick-pick-item');
    
    quickPickItems.forEach(item => {
        item.addEventListener('click', function() {
            const span = this.querySelector('span');
            const trackName = document.querySelector('.track-name');
            const artistName = document.querySelector('.artist-name');
            
            trackName.textContent = span.textContent;
            artistName.textContent = 'Spotify';
            
            // Start playing
            playPauseBtn.textContent = '⏸';
            isPlaying = true;
            startProgressAnimation();
        });
    });
});