// Main Application Controller
class BlogApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.posts = [];
        this.comments = [];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupTheme();
        this.renderPosts();
        this.updateStats();
    }

    loadData() {
        // Load from localStorage or initialize with sample data
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || this.getSamplePosts();
        this.comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        if (this.currentUser) {
            this.updateAuthUI(true);
        }
    }

    getSamplePosts() {
        return [
            {
                id: 1,
                title: "Getting Started with Modern Web Development",
                content: "Web development has evolved significantly over the past few years. Modern frameworks and tools have made it easier than ever to build responsive, interactive applications. In this post, we'll explore the latest trends and best practices in web development, including responsive design, progressive web apps, and modern JavaScript frameworks.",
                excerpt: "Explore the latest trends and best practices in modern web development...",
                author: "John Doe",
                date: new Date().toISOString(),
                tag: "tech",
                likes: 15,
                comments: 3
            },
            {
                id: 2,
                title: "The Art of Minimalist Living",
                content: "Minimalism isn't just about having fewer possessions; it's about making room for what matters most. By reducing clutter and focusing on essentials, we can create more meaningful experiences and reduce stress in our daily lives. This lifestyle approach has gained popularity as people seek balance in an increasingly complex world.",
                excerpt: "Discover how minimalism can transform your life and create more meaningful experiences...",
                author: "Jane Smith",
                date: new Date(Date.now() - 86400000).toISOString(),
                tag: "lifestyle",
                likes: 23,
                comments: 7
            },
            {
                id: 3,
                title: "Hidden Gems: Exploring Off-the-Beaten-Path Destinations",
                content: "While popular tourist destinations have their charm, there's something magical about discovering places that haven't been overrun by crowds. From secluded beaches to mountain villages, these hidden gems offer authentic experiences and unforgettable memories. Let's explore some of the world's best-kept travel secrets.",
                excerpt: "Uncover amazing travel destinations that most tourists never discover...",
                author: "Mike Johnson",
                date: new Date(Date.now() - 172800000).toISOString(),
                tag: "travel",
                likes: 31,
                comments: 12
            }
        ];
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.navigateTo(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Auth button
        document.getElementById('authBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.logout();
            } else {
                this.showAuthModal();
            }
        });

        // FAB button
        document.getElementById('fabBtn').addEventListener('click', () => {
            this.navigateTo('create-post');
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchPosts(e.target.value);
        });

        // Tag filtering
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByTag(e.target.dataset.tag);
                document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            this.navigateTo('home');
        });

        // Post form
        document.getElementById('postForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.navigateTo('home');
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup(e);
        });

        // Close modal on outside click
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showToast('Theme changed successfully!', 'success');
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        document.getElementById(page).classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });
        
        this.currentPage = page;
        
        // Page-specific actions
        if (page === 'dashboard') {
            this.updateStats();
            this.renderChart();
        } else if (page === 'profile') {
            this.loadProfile();
        }
    }

    renderPosts(postsToRender = this.posts) {
        const grid = document.getElementById('postsGrid');
        grid.innerHTML = '';
        
        postsToRender.forEach((post, index) => {
            const postElement = this.createPostCard(post);
            postElement.classList.add('stagger-item');
            postElement.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(postElement);
        });
    }

    createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'post-card hover-lift';
        card.innerHTML = `
            <div class="post-header">
                <span class="post-tag">${post.tag}</span>
                <span class="post-date">${this.formatDate(post.date)}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-footer">
                <div class="post-author">
                    <i class="fas fa-user"></i>
                    <span>${post.author}</span>
                </div>
                <div class="post-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.showPostDetail(post.id);
        });
        
        return card;
    }

    showPostDetail(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const content = document.getElementById('postDetailContent');
        content.innerHTML = `
            <div class="post-detail-header">
                <h1 class="post-detail-title">${post.title}</h1>
                <div class="post-detail-meta">
                    <div>
                        <span class="post-tag">${post.tag}</span>
                        <span class="post-author">
                            <i class="fas fa-user"></i> ${post.author}
                        </span>
                    </div>
                    <span class="post-date">${this.formatDate(post.date)}</span>
                </div>
            </div>
            <div class="post-detail-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="app.toggleLike(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes} Likes
                </button>
                <button class="action-btn" onclick="app.sharePost(${post.id})">
                    <i class="fas fa-share"></i> Share
                </button>
                ${this.currentUser && this.currentUser.username === post.author ? 
                    `<button class="action-btn" onclick="app.editPost(${post.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn" onclick="app.deletePost(${post.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : ''
                }
            </div>
            <div class="comments-section">
                <div class="comments-header">
                    <h3>Comments (${this.getPostComments(post.id).length})</h3>
                </div>
                ${this.currentUser ? `
                    <form class="comment-form" onsubmit="app.addComment(event, ${post.id})">
                        <textarea placeholder="Write a comment..." required></textarea>
                        <button type="submit" class="btn-primary">Post Comment</button>
                    </form>
                ` : '<p>Please login to comment.</p>'}
                <div class="comments-list">
                    ${this.renderComments(post.id)}
                </div>
            </div>
        `;
        
        this.navigateTo('post-detail');
    }

    getPostComments(postId) {
        return this.comments.filter(c => c.postId === postId);
    }

    renderComments(postId) {
        const postComments = this.getPostComments(postId);
        return postComments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
    }

    addComment(event, postId) {
        event.preventDefault();
        if (!this.currentUser) {
            this.showToast('Please login to comment', 'error');
            return;
        }
        
        const form = event.target;
        const content = form.querySelector('textarea').value.trim();
        
        if (!content) return;
        
        const comment = {
            id: Date.now(),
            postId: postId,
            content: content,
            author: this.currentUser.username,
            date: new Date().toISOString()
        };
        
        this.comments.push(comment);
        this.saveData();
        
        // Update post comment count
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments++;
        }
        
        form.reset();
        this.showPostDetail(postId);
        this.showToast('Comment added successfully!', 'success');
    }

    toggleLike(postId) {
        if (!this.currentUser) {
            this.showToast('Please login to like posts', 'error');
            return;
        }
        
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (post.liked) {
            post.likes--;
            post.liked = false;
        } else {
            post.likes++;
            post.liked = true;
        }
        
        this.saveData();
        this.showPostDetail(postId);
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!', 'success');
        }
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        // Populate form with existing data
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        document.getElementById('postTag').value = post.tag;
        document.getElementById('formTitle').textContent = 'Edit Post';
        document.getElementById('submitBtn').textContent = 'Update Post';
        
        // Store editing post ID
        document.getElementById('postForm').dataset.editId = postId;
        
        this.navigateTo('create-post');
    }

    deletePost(postId) {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        this.posts = this.posts.filter(p => p.id !== postId);
        this.comments = this.comments.filter(c => c.postId !== postId);
        this.saveData();
        
        this.showToast('Post deleted successfully!', 'success');
        this.navigateTo('home');
        this.renderPosts();
    }

    handlePostSubmit() {
        if (!this.currentUser) {
            this.showToast('Please login to create posts', 'error');
            return;
        }
        
        const form = document.getElementById('postForm');
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const tag = document.getElementById('postTag').value;
        
        if (!title || !content || !tag) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        const editId = form.dataset.editId;
        
        if (editId) {
            // Update existing post
            const post = this.posts.find(p => p.id === parseInt(editId));
            if (post) {
                post.title = title;
                post.content = content;
                post.tag = tag;
                post.excerpt = content.substring(0, 150) + '...';
            }
            delete form.dataset.editId;
            this.showToast('Post updated successfully!', 'success');
        } else {
            // Create new post
            const post = {
                id: Date.now(),
                title: title,
                content: content,
                excerpt: content.substring(0, 150) + '...',
                author: this.currentUser.username,
                date: new Date().toISOString(),
                tag: tag,
                likes: 0,
                comments: 0
            };
            
            this.posts.unshift(post);
            this.showToast('Post created successfully!', 'success');
        }
        
        this.saveData();
        form.reset();
        document.getElementById('formTitle').textContent = 'Create New Post';
        document.getElementById('submitBtn').textContent = 'Publish Post';
        
        this.navigateTo('home');
        this.renderPosts();
    }

    searchPosts(query) {
        if (!query.trim()) {
            this.renderPosts();
            return;
        }
        
        const filtered = this.posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.author.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderPosts(filtered);
    }

    filterByTag(tag) {
        if (tag === 'all') {
            this.renderPosts();
        } else {
            const filtered = this.posts.filter(post => post.tag === tag);
            this.renderPosts(filtered);
        }
    }

    updateStats() {
        document.getElementById('totalPosts').textContent = this.posts.length;
        document.getElementById('totalComments').textContent = this.comments.length;
        document.getElementById('totalLikes').textContent = this.posts.reduce((sum, post) => sum + post.likes, 0);
        
        this.renderRecentPosts();
    }

    renderRecentPosts() {
        const recentPosts = document.getElementById('recentPosts');
        const recent = this.posts.slice(0, 5);
        
        recentPosts.innerHTML = recent.map(post => `
            <div class="activity-item">
                <div class="activity-title">${post.title}</div>
                <div class="activity-meta">
                    ${post.likes} likes • ${post.comments} comments • ${this.formatDate(post.date)}
                </div>
            </div>
        `).join('');
    }

    renderChart() {
        const ctx = document.getElementById('postsChart').getContext('2d');
        
        // Group posts by date
        const postsByDate = {};
        this.posts.forEach(post => {
            const date = new Date(post.date).toDateString();
            postsByDate[date] = (postsByDate[date] || 0) + 1;
        });
        
        const labels = Object.keys(postsByDate).slice(-7);
        const data = labels.map(date => postsByDate[date] || 0);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Posts Created',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Posts Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    showAuthModal() {
        document.getElementById('authModal').classList.add('active');
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.remove('active');
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    handleLogin(event) {
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        // Simple mock authentication
        const user = {
            username: email.split('@')[0],
            email: email
        };
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.updateAuthUI(true);
        this.hideAuthModal();
        this.showToast('Logged in successfully!', 'success');
        form.reset();
    }

    handleSignup(event) {
        const form = event.target;
        const username = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        // Simple mock registration
        const user = {
            username: username,
            email: email
        };
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.updateAuthUI(true);
        this.hideAuthModal();
        this.showToast('Account created successfully!', 'success');
        form.reset();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI(false);
        this.showToast('Logged out successfully!', 'success');
        this.navigateTo('home');
    }

    updateAuthUI(isLoggedIn) {
        const authBtn = document.getElementById('authBtn');
        if (isLoggedIn) {
            authBtn.textContent = 'Logout';
        } else {
            authBtn.textContent = 'Login';
        }
    }

    loadProfile() {
        if (!this.currentUser) {
            this.navigateTo('home');
            return;
        }
        
        document.getElementById('username').value = this.currentUser.username || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('bio').value = this.currentUser.bio || '';
    }

    updateProfile() {
        if (!this.currentUser) return;
        
        this.currentUser.username = document.getElementById('username').value;
        this.currentUser.email = document.getElementById('email').value;
        this.currentUser.bio = document.getElementById('bio').value;
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showToast('Profile updated successfully!', 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    saveData() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        localStorage.setItem('blogComments', JSON.stringify(this.comments));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the app
const app = new BlogApp();

// Add some global utility functions
window.app = app;