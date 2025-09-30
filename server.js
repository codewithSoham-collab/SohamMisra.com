const express = require('express');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const app = express();

// Middleware to set security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Main route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sample API endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Express API!', status: 'success' });
});

// Helper function to send 404 response
const send404 = (res) => {
    const notFoundPath = path.join(__dirname, '404.html');
    if (fs.existsSync(notFoundPath)) {
        res.status(404).sendFile(notFoundPath);
    } else {
        res.status(404).send('<h1>404 - Page Not Found</h1>');
    }
};

// Serve static files with security checks
app.get('/:filename(*)', (req, res) => {
    const filename = req.params.filename;

    // Security check to prevent directory traversal
    if (filename.includes('..') || filename.startsWith('/')) {
        send404(res);
        return;
    }

    const filePath = path.join(__dirname, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath) && !path.isAbsolute(filename)) {
        const mimetype = mime.lookup(filename) || 'application/octet-stream';
        res.setHeader('Content-Type', mimetype);
        res.sendFile(filePath);
    } else {
        send404(res);
    }
});

// Error handlers
app.use((req, res) => {
    send404(res);
});

app.use((err, req, res, next) => {
    send404(res);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});