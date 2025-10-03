// Ultimate Media Player JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        const appContainer = document.getElementById('app-container');
        
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            appContainer.style.display = 'flex';
            appContainer.style.animation = 'fadeInUp 0.8s ease-out';
            initializeApp();
        }, 500);
    }, 3000);
});

let mediaLibrary = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', type: 'music', genre: 'Rock' },
    { id: 2, title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration: '3:07', type: 'music', genre: 'Pop' },
    { id: 3, title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30', type: 'music', genre: 'Rock' },
    { id: 4, title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration: '4:54', type: 'music', genre: 'Pop' },
    { id: 5, title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration: '8:02', type: 'music', genre: 'Rock' },
    { id: 6, title: 'The Godfather', artist: 'Francis Ford Coppola', album: 'Classic Movies', duration: '175:00', type: 'videos', genre: 'Drama' },
    { id: 7, title: 'Inception', artist: 'Christopher Nolan', album: 'Sci-Fi Collection', duration: '148:00', type: 'videos', genre: 'Sci-Fi' },
    { id: 8, title: 'Tech Talk Daily', artist: 'Tech Podcast Network', album: 'Technology', duration: '45:30', type: 'podcasts', genre: 'Technology' },
    { id: 9, title: 'History Mysteries', artist: 'History Channel', album: 'Educational', duration: '38:15', type: 'podcasts', genre: 'History' }
];

let playlists = [
    { id: 'favorites', name: 'Favorites', tracks: [1, 3, 5] },
    { id: 'recent', name: 'Recently Played', tracks: [2, 4, 6] }
];

let currentTrack = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let volume = 0.7;
let isMuted = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all
let currentCategory = 'all';
let currentPlaylist = null;

function initializeApp() {
    initializeEventListeners();
    renderMediaGrid();
    updateCounts();
    initializePlayer();
}

function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.dataset.category) {
                selectCategory(this.dataset.category);
            } else if (this.dataset.playlist) {
                selectPlaylist(this.dataset.playlist);
            }
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Sort
    document.getElementById('sortSelect').addEventListener('change', renderMediaGrid);

    // Player controls
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('playerPlayPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('prevBtn').addEventListener('click', previousTrack);
    document.getElementById('playerPrevBtn').addEventListener('click', previousTrack);
    document.getElementById('nextBtn').addEventListener('click', nextTrack);
    document.getElementById('playerNextBtn').addEventListener('click', nextTrack);

    // Player modal
    document.getElementById('closePlayerBtn').addEventListener('click', closePlayer);

    // Playlist modal
    document.getElementById('addPlaylistBtn').addEventListener('click', openPlaylistModal);
    document.getElementById('playlistForm').addEventListener('submit', handlePlaylistSubmit);

    // Settings and controls
    document.getElementById('settingsBtn').addEventListener('click', toggleEqualizer);
    document.getElementById('closeEqBtn').addEventListener('click', closeEqualizer);
    document.getElementById('shuffleBtn').addEventListener('click', toggleShuffle);
    document.getElementById('repeatBtn').addEventListener('click', toggleRepeat);
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);

    // Progress bar
    document.getElementById('progressBar').addEventListener('click', seekTrack);

    // Volume control
    document.querySelector('.volume-bar').addEventListener('click', setVolume);

    // Equalizer presets
    document.querySelectorAll('.eq-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            document.querySelectorAll('.eq-preset').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            applyEQPreset(this.dataset.preset);
        });
    });

    // Modal close
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function selectCategory(category) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    currentCategory = category;
    currentPlaylist = null;
    
    const titles = {
        all: 'All Media',
        music: 'Music Library',
        videos: 'Video Library',
        podcasts: 'Podcast Library'
    };
    
    document.getElementById('sectionTitle').textContent = titles[category];
    renderMediaGrid();
}

function selectPlaylist(playlistId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-playlist="${playlistId}"]`).classList.add('active');
    
    currentPlaylist = playlistId;
    currentCategory = null;
    
    const playlist = playlists.find(p => p.id === playlistId);
    document.getElementById('sectionTitle').textContent = playlist.name;
    renderMediaGrid();
}

function renderMediaGrid() {
    const mediaGrid = document.getElementById('mediaGrid');
    let filteredMedia = mediaLibrary;
    
    if (currentCategory && currentCategory !== 'all') {
        filteredMedia = mediaLibrary.filter(item => item.type === currentCategory);
    } else if (currentPlaylist) {
        const playlist = playlists.find(p => p.id === currentPlaylist);
        filteredMedia = mediaLibrary.filter(item => playlist.tracks.includes(item.id));
    }
    
    const sortBy = document.getElementById('sortSelect').value;
    filteredMedia.sort((a, b) => {
        switch(sortBy) {
            case 'name': return a.title.localeCompare(b.title);
            case 'artist': return a.artist.localeCompare(b.artist);
            case 'duration': return parseDuration(a.duration) - parseDuration(b.duration);
            default: return 0;
        }
    });
    
    mediaGrid.innerHTML = filteredMedia.map(item => `
        <div class="media-item" onclick="playMedia(${item.id})">
            <div class="media-thumbnail">
                <i class="fas fa-${getMediaIcon(item.type)}"></i>
                <div class="play-overlay">
                    <button class="play-btn">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="media-duration">${item.duration}</div>
            </div>
            <div class="media-info">
                <h3>${item.title}</h3>
                <p>${item.artist}</p>
            </div>
        </div>
    `).join('');
}

function getMediaIcon(type) {
    const icons = {
        music: 'music',
        videos: 'video',
        podcasts: 'podcast'
    };
    return icons[type] || 'file';
}

function parseDuration(duration) {
    const parts = duration.split(':').map(Number);
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

function updateCounts() {
    const counts = {
        all: mediaLibrary.length,
        music: mediaLibrary.filter(item => item.type === 'music').length,
        videos: mediaLibrary.filter(item => item.type === 'videos').length,
        podcasts: mediaLibrary.filter(item => item.type === 'podcasts').length
    };
    
    Object.keys(counts).forEach(category => {
        const element = document.querySelector(`[data-category="${category}"] .count`);
        if (element) {
            element.textContent = counts[category];
        }
    });
    
    playlists.forEach(playlist => {
        const element = document.querySelector(`[data-playlist="${playlist.id}"] .count`);
        if (element) {
            element.textContent = playlist.tracks.length;
        }
    });
}

function playMedia(mediaId) {
    const media = mediaLibrary.find(item => item.id === mediaId);
    if (!media) return;
    
    currentTrack = media;
    duration = parseDuration(media.duration);
    currentTime = 0;
    
    updatePlayerUI();
    showNowPlaying();
    openPlayer();
    
    if (!isPlaying) {
        togglePlayPause();
    }
    
    startProgressSimulation();
}

function updatePlayerUI() {
    if (!currentTrack) return;
    
    // Update player modal
    document.getElementById('playerTrackTitle').textContent = currentTrack.title;
    document.getElementById('playerTrackArtist').textContent = currentTrack.artist;
    document.getElementById('playerTrackAlbum').textContent = currentTrack.album;
    
    // Update now playing banner
    document.querySelector('.now-playing-banner .track-title').textContent = currentTrack.title;
    document.querySelector('.now-playing-banner .track-artist').textContent = currentTrack.artist;
    
    updateTimeDisplay();
}

function showNowPlaying() {
    const banner = document.getElementById('nowPlayingBanner');
    banner.style.display = 'flex';
    banner.style.animation = 'slideInDown 0.3s ease-out';
}

function openPlayer() {
    document.getElementById('playerModal').style.display = 'block';
}

function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    
    const playButtons = document.querySelectorAll('#playPauseBtn i, #playerPlayPauseBtn i');
    playButtons.forEach(btn => {
        btn.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    });
    
    if (isPlaying) {
        startVisualizerAnimation();
    } else {
        stopVisualizerAnimation();
    }
}

function previousTrack() {
    if (!currentTrack) return;
    
    const currentIndex = mediaLibrary.findIndex(item => item.id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : mediaLibrary.length - 1;
    playMedia(mediaLibrary[prevIndex].id);
}

function nextTrack() {
    if (!currentTrack) return;
    
    const currentIndex = mediaLibrary.findIndex(item => item.id === currentTrack.id);
    const nextIndex = currentIndex < mediaLibrary.length - 1 ? currentIndex + 1 : 0;
    playMedia(mediaLibrary[nextIndex].id);
}

function seekTrack(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    currentTime = percentage * duration;
    updateProgress();
    updateTimeDisplay();
}

function setVolume(e) {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    volume = clickX / rect.width;
    
    document.querySelector('.volume-fill').style.width = (volume * 100) + '%';
    
    if (volume === 0) {
        document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (volume < 0.5) {
        document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    
    if (isMuted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        document.querySelector('.volume-fill').style.width = '0%';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        document.querySelector('.volume-fill').style.width = (volume * 100) + '%';
    }
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    const shuffleBtn = document.getElementById('shuffleBtn');
    
    if (isShuffled) {
        shuffleBtn.style.color = 'var(--primary-red)';
        shuffleBtn.style.background = 'rgba(255, 71, 87, 0.2)';
    } else {
        shuffleBtn.style.color = '';
        shuffleBtn.style.background = '';
    }
}

function toggleRepeat() {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    
    const repeatBtn = document.getElementById('repeatBtn');
    const icon = repeatBtn.querySelector('i');
    
    switch(repeatMode) {
        case 'none':
            repeatBtn.style.color = '';
            repeatBtn.style.background = '';
            icon.className = 'fas fa-redo';
            break;
        case 'all':
            repeatBtn.style.color = 'var(--primary-red)';
            repeatBtn.style.background = 'rgba(255, 71, 87, 0.2)';
            icon.className = 'fas fa-redo';
            break;
        case 'one':
            repeatBtn.style.color = 'var(--primary-red)';
            repeatBtn.style.background = 'rgba(255, 71, 87, 0.2)';
            icon.className = 'fas fa-redo-alt';
            break;
    }
}

function toggleFavorite() {
    if (!currentTrack) return;
    
    const favoriteBtn = document.getElementById('favoriteBtn');
    const icon = favoriteBtn.querySelector('i');
    const isFavorite = icon.classList.contains('fas');
    
    if (isFavorite) {
        icon.className = 'far fa-heart';
        favoriteBtn.style.color = '';
        // Remove from favorites playlist
        const favPlaylist = playlists.find(p => p.id === 'favorites');
        favPlaylist.tracks = favPlaylist.tracks.filter(id => id !== currentTrack.id);
    } else {
        icon.className = 'fas fa-heart';
        favoriteBtn.style.color = 'var(--primary-red)';
        // Add to favorites playlist
        const favPlaylist = playlists.find(p => p.id === 'favorites');
        if (!favPlaylist.tracks.includes(currentTrack.id)) {
            favPlaylist.tracks.push(currentTrack.id);
        }
    }
    
    updateCounts();
}

function startProgressSimulation() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
    
    window.progressInterval = setInterval(() => {
        if (isPlaying && currentTime < duration) {
            currentTime += 1;
            updateProgress();
            updateTimeDisplay();
            
            if (currentTime >= duration) {
                handleTrackEnd();
            }
        }
    }, 1000);
}

function handleTrackEnd() {
    switch(repeatMode) {
        case 'one':
            currentTime = 0;
            break;
        case 'all':
            nextTrack();
            break;
        default:
            isPlaying = false;
            togglePlayPause();
            break;
    }
}

function updateProgress() {
    const percentage = (currentTime / duration) * 100;
    document.querySelectorAll('.progress-fill').forEach(fill => {
        fill.style.width = percentage + '%';
    });
    
    const handle = document.getElementById('progressHandle');
    if (handle) {
        handle.style.left = percentage + '%';
    }
}

function updateTimeDisplay() {
    const current = formatTime(currentTime);
    const total = formatTime(duration);
    
    document.querySelectorAll('.time-current, #currentTime').forEach(el => {
        el.textContent = current;
    });
    
    document.querySelectorAll('.time-total, #totalTime').forEach(el => {
        el.textContent = total;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startVisualizerAnimation() {
    document.querySelectorAll('.vis-bar').forEach(bar => {
        bar.style.animationPlayState = 'running';
    });
}

function stopVisualizerAnimation() {
    document.querySelectorAll('.vis-bar').forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });
}

function initializePlayer() {
    // Set initial volume
    document.querySelector('.volume-fill').style.width = (volume * 100) + '%';
    
    // Initialize visualizer
    stopVisualizerAnimation();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const artist = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || artist.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleEqualizer() {
    const panel = document.getElementById('equalizerPanel');
    panel.classList.toggle('active');
}

function closeEqualizer() {
    document.getElementById('equalizerPanel').classList.remove('active');
}

function applyEQPreset(preset) {
    const presets = {
        flat: [0, 0, 0, 0, 0, 0, 0, 0],
        rock: [3, 2, -1, -2, 1, 2, 3, 4],
        pop: [1, 2, 3, 2, 0, -1, -2, -1],
        jazz: [2, 1, 0, 1, 2, 2, 1, 2],
        classical: [3, 2, 1, 0, 0, 1, 2, 3]
    };
    
    const values = presets[preset] || presets.flat;
    const sliders = document.querySelectorAll('.eq-slider .slider');
    
    sliders.forEach((slider, index) => {
        slider.value = values[index];
    });
}

function openPlaylistModal() {
    document.getElementById('playlistModal').style.display = 'block';
}

function closePlaylistModal() {
    document.getElementById('playlistModal').style.display = 'none';
    document.getElementById('playlistForm').reset();
}

function handlePlaylistSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('playlistName').value;
    const description = document.getElementById('playlistDescription').value;
    
    const newPlaylist = {
        id: 'playlist_' + Date.now(),
        name: name,
        description: description,
        tracks: []
    };
    
    playlists.push(newPlaylist);
    
    // Add to sidebar
    const playlistsList = document.getElementById('playlistsList');
    const newItem = document.createElement('li');
    newItem.className = 'nav-item';
    newItem.dataset.playlist = newPlaylist.id;
    newItem.innerHTML = `
        <i class="fas fa-list"></i>
        <span>${name}</span>
        <div class="count">0</div>
    `;
    
    newItem.addEventListener('click', function() {
        selectPlaylist(newPlaylist.id);
    });
    
    playlistsList.appendChild(newItem);
    
    closePlaylistModal();
    showNotification('Playlist created successfully!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : 'var(--primary-red)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow-card);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);