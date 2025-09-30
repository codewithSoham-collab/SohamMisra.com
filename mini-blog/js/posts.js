// Posts Management Module
class PostsManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        this.tags = ['tech', 'lifestyle', 'travel', 'food', 'health', 'business', 'education'];
        this.postsPerPage = 6;
        this.currentPage = 1;
    }

    // Create a new post
    createPost(postData, authorId) {
        const { title, content, tag, imageUrl } = postData;
        
        // Validation
        if (!title || !content || !tag) {
            throw new Error('Title, content, and tag are required');
        }
        
        if (title.length > 200) {
            throw new Error('Title must be less than 200 characters');
        }
        
        if (!this.tags.includes(tag)) {
            throw new Error('Invalid tag selected');
        }
        
        const post = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            excerpt: this.generateExcerpt(content),
            tag: tag,
            imageUrl: imageUrl || null,
            authorId: authorId,
            author: this.getAuthorName(authorId),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            views: 0,
            status: 'published',
            featured: false,
            readTime: this.calculateReadTime(content)
        };
        
        this.posts.unshift(post);
        this.savePosts();
        
        return post;
    }

    // Update existing post
    updatePost(postId, postData, authorId) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            throw new Error('Post not found');
        }
        
        const post = this.posts[postIndex];
        
        // Check if user owns the post
        if (post.authorId !== authorId) {
            throw new Error('You can only edit your own posts');
        }
        
        const { title, content, tag, imageUrl } = postData;
        
        // Validation
        if (title && title.length > 200) {
            throw new Error('Title must be less than 200 characters');
        }
        
        if (tag && !this.tags.includes(tag)) {
            throw new Error('Invalid tag selected');
        }
        
        // Update post
        this.posts[postIndex] = {
            ...post,
            title: title ? title.trim() : post.title,
            content: content ? content.trim() : post.content,
            excerpt: content ? this.generateExcerpt(content) : post.excerpt,
            tag: tag || post.tag,
            imageUrl: imageUrl !== undefined ? imageUrl : post.imageUrl,
            updatedAt: new Date().toISOString(),
            readTime: content ? this.calculateReadTime(content) : post.readTime
        };
        
        this.savePosts();
        return this.posts[postIndex];
    }

    // Delete post
    deletePost(postId, authorId) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            throw new Error('Post not found');
        }
        
        const post = this.posts[postIndex];
        
        // Check if user owns the post
        if (post.authorId !== authorId) {
            throw new Error('You can only delete your own posts');
        }
        
        // Remove post
        this.posts.splice(postIndex, 1);
        
        // Remove associated comments
        this.comments = this.comments.filter(c => c.postId !== postId);
        this.saveComments();
        
        this.savePosts();
        return true;
    }

    // Get post by ID
    getPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        // Increment view count
        post.views++;
        this.savePosts();
        
        return post;
    }

    // Get all posts with pagination and filtering
    getPosts(options = {}) {
        const {
            page = 1,
            limit = this.postsPerPage,
            tag = null,
            author = null,
            search = null,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            featured = null
        } = options;
        
        let filteredPosts = [...this.posts];
        
        // Filter by tag
        if (tag && tag !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.tag === tag);
        }
        
        // Filter by author
        if (author) {
            filteredPosts = filteredPosts.filter(post => 
                post.author.toLowerCase().includes(author.toLowerCase())
            );
        }
        
        // Filter by search query
        if (search) {
            const query = search.toLowerCase();
            filteredPosts = filteredPosts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query)
            );
        }
        
        // Filter by featured status
        if (featured !== null) {
            filteredPosts = filteredPosts.filter(post => post.featured === featured);
        }
        
        // Sort posts
        filteredPosts.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        
        return {
            posts: paginatedPosts,
            totalPosts: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / limit),
            currentPage: page,
            hasNextPage: endIndex < filteredPosts.length,
            hasPrevPage: page > 1
        };
    }

    // Get posts by author
    getPostsByAuthor(authorId, options = {}) {
        return this.getPosts({ ...options, author: this.getAuthorName(authorId) });
    }

    // Like/unlike post
    toggleLike(postId, userId) {
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        const likedIndex = post.likedBy.indexOf(userId);
        
        if (likedIndex > -1) {
            // Unlike
            post.likedBy.splice(likedIndex, 1);
            post.likes--;
        } else {
            // Like
            post.likedBy.push(userId);
            post.likes++;
        }
        
        this.savePosts();
        return {
            liked: likedIndex === -1,
            likes: post.likes
        };
    }

    // Check if user liked post
    isPostLiked(postId, userId) {
        const post = this.posts.find(p => p.id === postId);
        return post ? post.likedBy.includes(userId) : false;
    }

    // Add comment to post
    addComment(postId, commentData, authorId) {
        const { content, parentId = null } = commentData;
        
        if (!content || content.trim().length === 0) {
            throw new Error('Comment content is required');
        }
        
        if (content.length > 1000) {
            throw new Error('Comment must be less than 1000 characters');
        }
        
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            throw new Error('Post not found');
        }
        
        const comment = {
            id: Date.now(),
            postId: postId,
            content: content.trim(),
            authorId: authorId,
            author: this.getAuthorName(authorId),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            parentId: parentId,
            likes: 0,
            likedBy: []
        };
        
        this.comments.push(comment);
        this.saveComments();
        
        return comment;
    }

    // Get comments for post
    getPostComments(postId) {
        const postComments = this.comments.filter(c => c.postId === postId);
        
        // Organize comments in a tree structure (replies)
        const commentMap = new Map();
        const rootComments = [];
        
        // First pass: create comment objects with replies array
        postComments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });
        
        // Second pass: organize into tree structure
        postComments.forEach(comment => {
            const commentObj = commentMap.get(comment.id);
            
            if (comment.parentId) {
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies.push(commentObj);
                }
            } else {
                rootComments.push(commentObj);
            }
        });
        
        // Sort by creation date
        rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return rootComments;
    }

    // Delete comment
    deleteComment(commentId, authorId) {
        const commentIndex = this.comments.findIndex(c => c.id === commentId);
        
        if (commentIndex === -1) {
            throw new Error('Comment not found');
        }
        
        const comment = this.comments[commentIndex];
        
        if (comment.authorId !== authorId) {
            throw new Error('You can only delete your own comments');
        }
        
        // Remove comment and its replies
        this.removeCommentAndReplies(commentId);
        this.saveComments();
        
        return true;
    }

    // Remove comment and all its replies
    removeCommentAndReplies(commentId) {
        // Find all replies to this comment
        const replies = this.comments.filter(c => c.parentId === commentId);
        
        // Recursively remove replies
        replies.forEach(reply => {
            this.removeCommentAndReplies(reply.id);
        });
        
        // Remove the comment itself
        this.comments = this.comments.filter(c => c.id !== commentId);
    }

    // Get trending posts
    getTrendingPosts(limit = 5) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Get posts from last week
        const recentPosts = this.posts.filter(post => 
            new Date(post.createdAt) >= weekAgo
        );
        
        // Sort by engagement (likes + views + comments)
        recentPosts.sort((a, b) => {
            const aEngagement = a.likes + a.views + this.getPostComments(a.id).length;
            const bEngagement = b.likes + b.views + this.getPostComments(b.id).length;
            return bEngagement - aEngagement;
        });
        
        return recentPosts.slice(0, limit);
    }

    // Get related posts
    getRelatedPosts(postId, limit = 3) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return [];
        
        // Find posts with same tag, excluding current post
        const relatedPosts = this.posts.filter(p => 
            p.id !== postId && p.tag === post.tag
        );
        
        // Sort by creation date
        relatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return relatedPosts.slice(0, limit);
    }

    // Get post statistics
    getPostStats(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return null;
        
        const comments = this.getPostComments(postId);
        const totalComments = this.countAllComments(comments);
        
        return {
            views: post.views,
            likes: post.likes,
            comments: totalComments,
            readTime: post.readTime,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };
    }

    // Count all comments including replies
    countAllComments(comments) {
        let count = comments.length;
        comments.forEach(comment => {
            count += this.countAllComments(comment.replies || []);
        });
        return count;
    }

    // Generate excerpt from content
    generateExcerpt(content, maxLength = 150) {
        const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    }

    // Calculate reading time
    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return readTime;
    }

    // Get author name by ID
    getAuthorName(authorId) {
        const users = JSON.parse(localStorage.getItem('blogUsers')) || [];
        const user = users.find(u => u.id === authorId);
        return user ? user.username : 'Unknown Author';
    }

    // Get available tags
    getTags() {
        return this.tags;
    }

    // Add new tag
    addTag(tag) {
        if (!tag || typeof tag !== 'string') {
            throw new Error('Invalid tag');
        }
        
        const normalizedTag = tag.toLowerCase().trim();
        
        if (this.tags.includes(normalizedTag)) {
            throw new Error('Tag already exists');
        }
        
        this.tags.push(normalizedTag);
        return this.tags;
    }

    // Toggle featured status
    toggleFeatured(postId, authorId) {
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        if (post.authorId !== authorId) {
            throw new Error('You can only feature your own posts');
        }
        
        post.featured = !post.featured;
        this.savePosts();
        
        return post.featured;
    }

    // Get user's draft posts
    getDrafts(authorId) {
        return this.posts.filter(post => 
            post.authorId === authorId && post.status === 'draft'
        );
    }

    // Save post as draft
    saveDraft(postData, authorId) {
        const draftPost = {
            ...postData,
            id: postData.id || Date.now(),
            authorId: authorId,
            author: this.getAuthorName(authorId),
            status: 'draft',
            createdAt: postData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const existingIndex = this.posts.findIndex(p => p.id === draftPost.id);
        
        if (existingIndex > -1) {
            this.posts[existingIndex] = draftPost;
        } else {
            this.posts.push(draftPost);
        }
        
        this.savePosts();
        return draftPost;
    }

    // Publish draft
    publishDraft(postId, authorId) {
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        if (post.authorId !== authorId) {
            throw new Error('You can only publish your own posts');
        }
        
        post.status = 'published';
        post.updatedAt = new Date().toISOString();
        
        this.savePosts();
        return post;
    }

    // Save posts to localStorage
    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    // Save comments to localStorage
    saveComments() {
        localStorage.setItem('blogComments', JSON.stringify(this.comments));
    }

    // Import posts from JSON
    importPosts(postsData) {
        if (!Array.isArray(postsData)) {
            throw new Error('Posts data must be an array');
        }
        
        const importedPosts = postsData.map(postData => ({
            ...postData,
            id: Date.now() + Math.random(),
            createdAt: postData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
        
        this.posts = [...this.posts, ...importedPosts];
        this.savePosts();
        
        return importedPosts.length;
    }

    // Export posts to JSON
    exportPosts(authorId = null) {
        let postsToExport = this.posts;
        
        if (authorId) {
            postsToExport = this.posts.filter(post => post.authorId === authorId);
        }
        
        return JSON.stringify(postsToExport, null, 2);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostsManager;
} else {
    window.PostsManager = PostsManager;
}