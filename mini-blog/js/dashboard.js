// Dashboard Module
class DashboardManager {
    constructor() {
        this.charts = {};
        this.refreshInterval = null;
        this.autoRefresh = false;
    }

    // Initialize dashboard
    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        
        if (this.autoRefresh) {
            this.startAutoRefresh();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                this.toggleAutoRefresh(e.target.checked);
            });
        }

        // Date range selector
        const dateRangeSelect = document.getElementById('dateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.updateChartsForDateRange(e.target.value);
            });
        }
    }

    // Load dashboard data
    loadDashboardData() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        const users = JSON.parse(localStorage.getItem('blogUsers')) || [];
        
        this.updateStatCards(posts, comments, users);
        this.renderCharts(posts, comments);
        this.renderRecentActivity(posts, comments);
        this.renderTopPosts(posts);
        this.renderUserEngagement(posts, comments);
    }

    // Update statistics cards
    updateStatCards(posts, comments, users) {
        // Total posts
        const totalPosts = posts.length;
        this.updateStatCard('totalPosts', totalPosts, this.calculateGrowth(posts, 'createdAt'));

        // Total comments
        const totalComments = comments.length;
        this.updateStatCard('totalComments', totalComments, this.calculateGrowth(comments, 'createdAt'));

        // Total likes
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
        this.updateStatCard('totalLikes', totalLikes);

        // Total views
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        this.updateStatCard('totalViews', totalViews);

        // Active users (users who posted or commented in last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const activeUsers = new Set();
        
        posts.forEach(post => {
            if (new Date(post.createdAt) >= thirtyDaysAgo) {
                activeUsers.add(post.authorId);
            }
        });
        
        comments.forEach(comment => {
            if (new Date(comment.createdAt) >= thirtyDaysAgo) {
                activeUsers.add(comment.authorId);
            }
        });

        this.updateStatCard('activeUsers', activeUsers.size);

        // Average engagement rate
        const avgEngagement = posts.length > 0 
            ? ((totalLikes + totalComments) / posts.length).toFixed(1)
            : 0;
        this.updateStatCard('avgEngagement', avgEngagement);
    }

    // Update individual stat card
    updateStatCard(cardId, value, growth = null) {
        const card = document.getElementById(cardId);
        if (!card) return;

        const valueElement = card.querySelector('.stat-value');
        const growthElement = card.querySelector('.stat-growth');

        if (valueElement) {
            // Animate number change
            this.animateNumber(valueElement, parseInt(valueElement.textContent) || 0, value);
        }

        if (growthElement && growth !== null) {
            growthElement.textContent = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
            growthElement.className = `stat-growth ${growth >= 0 ? 'positive' : 'negative'}`;
        }
    }

    // Animate number changes
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Calculate growth percentage
    calculateGrowth(items, dateField) {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

        const thisMonth = items.filter(item => 
            new Date(item[dateField]) >= lastMonth
        ).length;

        const previousMonth = items.filter(item => {
            const date = new Date(item[dateField]);
            return date >= twoMonthsAgo && date < lastMonth;
        }).length;

        if (previousMonth === 0) return thisMonth > 0 ? 100 : 0;
        return ((thisMonth - previousMonth) / previousMonth) * 100;
    }

    // Render charts
    renderCharts(posts, comments) {
        this.renderPostsChart(posts);
        this.renderEngagementChart(posts, comments);
        this.renderTagDistributionChart(posts);
        this.renderActivityHeatmap(posts, comments);
    }

    // Render posts over time chart
    renderPostsChart(posts) {
        const ctx = document.getElementById('postsChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.posts) {
            this.charts.posts.destroy();
        }

        // Prepare data for last 30 days
        const last30Days = this.getLast30Days();
        const postsByDay = this.groupItemsByDay(posts, 'createdAt', last30Days);

        this.charts.posts = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days.map(date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Posts Created',
                    data: postsByDay,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Posts Created Over Time',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    // Render engagement chart
    renderEngagementChart(posts, comments) {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;

        if (this.charts.engagement) {
            this.charts.engagement.destroy();
        }

        const last7Days = this.getLast7Days();
        const likesByDay = this.groupItemsByDay(posts, 'createdAt', last7Days, 'likes');
        const commentsByDay = this.groupItemsByDay(comments, 'createdAt', last7Days);

        this.charts.engagement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [
                    {
                        label: 'Likes',
                        data: likesByDay,
                        backgroundColor: '#f093fb',
                        borderRadius: 4
                    },
                    {
                        label: 'Comments',
                        data: commentsByDay,
                        backgroundColor: '#764ba2',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Engagement',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Render tag distribution chart
    renderTagDistributionChart(posts) {
        const ctx = document.getElementById('tagChart');
        if (!ctx) return;

        if (this.charts.tags) {
            this.charts.tags.destroy();
        }

        const tagCounts = {};
        posts.forEach(post => {
            tagCounts[post.tag] = (tagCounts[post.tag] || 0) + 1;
        });

        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        
        this.charts.tags = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(tagCounts),
                datasets: [{
                    data: Object.values(tagCounts),
                    backgroundColor: colors.slice(0, Object.keys(tagCounts).length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Posts by Category',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Render activity heatmap
    renderActivityHeatmap(posts, comments) {
        const heatmapContainer = document.getElementById('activityHeatmap');
        if (!heatmapContainer) return;

        const last30Days = this.getLast30Days();
        const activityData = last30Days.map(date => {
            const dayPosts = posts.filter(post => 
                new Date(post.createdAt).toDateString() === date.toDateString()
            ).length;
            
            const dayComments = comments.filter(comment => 
                new Date(comment.createdAt).toDateString() === date.toDateString()
            ).length;

            return {
                date: date,
                activity: dayPosts + dayComments
            };
        });

        const maxActivity = Math.max(...activityData.map(d => d.activity));
        
        heatmapContainer.innerHTML = activityData.map(data => {
            const intensity = maxActivity > 0 ? data.activity / maxActivity : 0;
            const opacity = Math.max(0.1, intensity);
            
            return `
                <div class="heatmap-cell" 
                     style="background-color: rgba(102, 126, 234, ${opacity})"
                     title="${data.date.toLocaleDateString()}: ${data.activity} activities">
                </div>
            `;
        }).join('');
    }

    // Render recent activity
    renderRecentActivity(posts, comments) {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const allActivity = [
            ...posts.map(post => ({
                type: 'post',
                title: post.title,
                author: post.author,
                date: post.createdAt,
                id: post.id
            })),
            ...comments.map(comment => ({
                type: 'comment',
                title: `Comment on "${this.getPostTitle(comment.postId, posts)}"`,
                author: comment.author,
                date: comment.createdAt,
                id: comment.id
            }))
        ];

        allActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentActivity = allActivity.slice(0, 10);

        container.innerHTML = recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.type === 'post' ? 'file-alt' : 'comment'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-meta">
                        by ${activity.author} • ${this.formatRelativeTime(activity.date)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render top posts
    renderTopPosts(posts) {
        const container = document.getElementById('topPosts');
        if (!container) return;

        const topPosts = posts
            .sort((a, b) => (b.likes + b.views + (b.comments || 0)) - (a.likes + a.views + (a.comments || 0)))
            .slice(0, 5);

        container.innerHTML = topPosts.map(post => `
            <div class="top-post-item">
                <div class="post-title">${post.title}</div>
                <div class="post-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span><i class="fas fa-eye"></i> ${post.views}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments || 0}</span>
                </div>
            </div>
        `).join('');
    }

    // Render user engagement metrics
    renderUserEngagement(posts, comments) {
        const container = document.getElementById('userEngagement');
        if (!container) return;

        const userStats = {};
        
        posts.forEach(post => {
            if (!userStats[post.author]) {
                userStats[post.author] = { posts: 0, likes: 0, comments: 0 };
            }
            userStats[post.author].posts++;
            userStats[post.author].likes += post.likes || 0;
        });

        comments.forEach(comment => {
            if (!userStats[comment.author]) {
                userStats[comment.author] = { posts: 0, likes: 0, comments: 0 };
            }
            userStats[comment.author].comments++;
        });

        const topUsers = Object.entries(userStats)
            .sort(([,a], [,b]) => (b.posts + b.comments) - (a.posts + a.comments))
            .slice(0, 5);

        container.innerHTML = topUsers.map(([username, stats]) => `
            <div class="user-engagement-item">
                <div class="user-avatar">
                    ${username.charAt(0).toUpperCase()}
                </div>
                <div class="user-info">
                    <div class="username">${username}</div>
                    <div class="user-stats">
                        ${stats.posts} posts • ${stats.comments} comments • ${stats.likes} likes received
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Helper methods
    getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }

    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }

    groupItemsByDay(items, dateField, days, valueField = null) {
        return days.map(day => {
            const dayItems = items.filter(item => 
                new Date(item[dateField]).toDateString() === day.toDateString()
            );
            
            if (valueField) {
                return dayItems.reduce((sum, item) => sum + (item[valueField] || 0), 0);
            }
            
            return dayItems.length;
        });
    }

    getPostTitle(postId, posts) {
        const post = posts.find(p => p.id === postId);
        return post ? post.title : 'Unknown Post';
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }

    // Refresh dashboard
    refreshDashboard() {
        this.loadDashboardData();
        this.showToast('Dashboard refreshed!', 'success');
    }

    // Toggle auto-refresh
    toggleAutoRefresh(enabled) {
        this.autoRefresh = enabled;
        
        if (enabled) {
            this.startAutoRefresh();
        } else {
            this.stopAutoRefresh();
        }
    }

    // Start auto-refresh
    startAutoRefresh(interval = 30000) { // 30 seconds
        this.stopAutoRefresh(); // Clear existing interval
        
        this.refreshInterval = setInterval(() => {
            this.loadDashboardData();
        }, interval);
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Update charts for different date ranges
    updateChartsForDateRange(range) {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        
        let filteredPosts, filteredComments;
        const now = new Date();
        
        switch (range) {
            case '7days':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredPosts = posts.filter(p => new Date(p.createdAt) >= weekAgo);
                filteredComments = comments.filter(c => new Date(c.createdAt) >= weekAgo);
                break;
            case '30days':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredPosts = posts.filter(p => new Date(p.createdAt) >= monthAgo);
                filteredComments = comments.filter(c => new Date(c.createdAt) >= monthAgo);
                break;
            case '90days':
                const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                filteredPosts = posts.filter(p => new Date(p.createdAt) >= quarterAgo);
                filteredComments = comments.filter(c => new Date(c.createdAt) >= quarterAgo);
                break;
            default:
                filteredPosts = posts;
                filteredComments = comments;
        }
        
        this.renderCharts(filteredPosts, filteredComments);
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // This would typically call the main app's toast function
        if (window.app && window.app.showToast) {
            window.app.showToast(message, type);
        }
    }

    // Export dashboard data
    exportDashboardData() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        
        const dashboardData = {
            exportDate: new Date().toISOString(),
            summary: {
                totalPosts: posts.length,
                totalComments: comments.length,
                totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
                totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0)
            },
            posts: posts,
            comments: comments
        };
        
        const dataStr = JSON.stringify(dashboardData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `blog-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Cleanup
    destroy() {
        this.stopAutoRefresh();
        
        // Destroy all charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
} else {
    window.DashboardManager = DashboardManager;
}