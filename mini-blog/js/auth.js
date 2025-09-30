// Authentication Module
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('blogUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Register new user
    register(userData) {
        const { username, email, password } = userData;
        
        // Validation
        if (!this.validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        if (this.users.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }
        
        if (this.users.find(user => user.username === username)) {
            throw new Error('Username already taken');
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            profile: {
                bio: '',
                avatar: this.generateAvatar(username),
                joinDate: new Date().toISOString()
            },
            preferences: {
                theme: 'light',
                notifications: true
            }
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return this.createUserSession(newUser);
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email.toLowerCase().trim());
        
        if (!user) {
            throw new Error('User not found');
        }
        
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }
        
        return this.createUserSession(user);
    }

    // Create user session
    createUserSession(user) {
        const sessionUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            profile: user.profile,
            preferences: user.preferences,
            sessionStart: Date.now()
        };
        
        this.currentUser = sessionUser;
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        
        return sessionUser;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Clear any sensitive data
        this.clearSessionData();
    }

    // Check if user is authenticated
    isAuthenticated() {
        if (!this.currentUser) {
            return false;
        }
        
        // Check session timeout
        const sessionAge = Date.now() - this.currentUser.sessionStart;
        if (sessionAge > this.sessionTimeout) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // Get current user
    getCurrentUser() {
        return this.isAuthenticated() ? this.currentUser : null;
    }

    // Update user profile
    updateProfile(profileData) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        // Update user data
        this.users[userIndex].profile = {
            ...this.users[userIndex].profile,
            ...profileData
        };
        
        // Update current session
        this.currentUser.profile = this.users[userIndex].profile;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.saveUsers();
        return this.currentUser;
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (!this.verifyPassword(currentPassword, user.password)) {
            throw new Error('Current password is incorrect');
        }
        
        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
        }
        
        user.password = this.hashPassword(newPassword);
        this.saveUsers();
        
        return true;
    }

    // Reset password (mock implementation)
    resetPassword(email) {
        const user = this.users.find(u => u.email === email.toLowerCase().trim());
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // In a real app, this would send an email
        // For demo purposes, we'll generate a temporary password
        const tempPassword = this.generateTempPassword();
        user.password = this.hashPassword(tempPassword);
        this.saveUsers();
        
        // Return temp password for demo (don't do this in production!)
        return tempPassword;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simple password hashing (use proper hashing in production)
    hashPassword(password) {
        // This is a simple hash for demo purposes
        // Use bcrypt or similar in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Verify password
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Generate avatar URL
    generateAvatar(username) {
        // Using a service like Gravatar or generating initials
        const initials = username.substring(0, 2).toUpperCase();
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const color = colors[username.length % colors.length];
        
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="${color}"/>
                <text x="50" y="50" font-family="Arial" font-size="40" fill="white" 
                      text-anchor="middle" dominant-baseline="middle">${initials}</text>
            </svg>
        `)}`;
    }

    // Generate temporary password
    generateTempPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('blogUsers', JSON.stringify(this.users));
    }

    // Clear session data
    clearSessionData() {
        // Clear any cached data that should not persist after logout
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('draftPosts');
    }

    // Get user statistics
    getUserStats(userId = null) {
        const targetUserId = userId || (this.currentUser ? this.currentUser.id : null);
        if (!targetUserId) return null;
        
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        
        const userPosts = posts.filter(post => post.authorId === targetUserId);
        const userComments = comments.filter(comment => comment.authorId === targetUserId);
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        return {
            postsCount: userPosts.length,
            commentsCount: userComments.length,
            likesReceived: totalLikes,
            joinDate: this.users.find(u => u.id === targetUserId)?.createdAt
        };
    }

    // Check if username is available
    isUsernameAvailable(username) {
        return !this.users.find(user => 
            user.username.toLowerCase() === username.toLowerCase().trim()
        );
    }

    // Check if email is available
    isEmailAvailable(email) {
        return !this.users.find(user => 
            user.email === email.toLowerCase().trim()
        );
    }

    // Get all users (admin function)
    getAllUsers() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        // Return users without sensitive data
        return this.users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            profile: user.profile
        }));
    }

    // Delete user account
    deleteAccount(password) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Password is incorrect');
        }
        
        // Remove user from users array
        this.users = this.users.filter(u => u.id !== this.currentUser.id);
        this.saveUsers();
        
        // Remove user's posts and comments
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        
        const filteredPosts = posts.filter(post => post.authorId !== this.currentUser.id);
        const filteredComments = comments.filter(comment => comment.authorId !== this.currentUser.id);
        
        localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
        localStorage.setItem('blogComments', JSON.stringify(filteredComments));
        
        // Logout user
        this.logout();
        
        return true;
    }

    // Update user preferences
    updatePreferences(preferences) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        this.users[userIndex].preferences = {
            ...this.users[userIndex].preferences,
            ...preferences
        };
        
        this.currentUser.preferences = this.users[userIndex].preferences;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.saveUsers();
        return this.currentUser.preferences;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} else {
    window.AuthManager = AuthManager;
}