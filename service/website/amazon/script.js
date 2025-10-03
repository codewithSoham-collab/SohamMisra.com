document.addEventListener('DOMContentLoaded', function() {
    // Shopping cart functionality
    let cart = [];
    let cartCount = 0;
    
    const cartElement = document.querySelector('.cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Add to cart
            cart.push({ name: productName, price: productPrice });
            cartCount++;
            
            // Update cart display
            cartElement.textContent = `🛒 Cart (${cartCount})`;
            
            // Visual feedback
            this.innerHTML = '✓ Added!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.background = '#ff9900';
            }, 1500);
            
            // Animate cart
            cartElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartElement.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Deal buttons functionality
    const dealButtons = document.querySelectorAll('.deal-btn');
    
    dealButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dealCard = this.closest('.deal-card');
            const dealName = dealCard.querySelector('h3').textContent;
            
            this.innerHTML = '✓ Deal Claimed!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.innerHTML = 'Get Deal';
                this.style.background = '#e74c3c';
            }, 2000);
            
            console.log('Deal claimed:', dealName);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
            // Here you would typically filter products or redirect to search results
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            alert(`Browsing ${categoryName} category`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.product-image');
            image.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.product-image');
            image.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Shop now button
    const shopNowBtn = document.querySelector('.shop-now-btn');
    
    shopNowBtn.addEventListener('click', function() {
        this.innerHTML = 'Loading...';
        this.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.innerHTML = 'Shop Now';
            this.style.transform = 'scale(1)';
            
            // Scroll to products section
            document.querySelector('.featured-products').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    });

    // Account and cart hover effects
    const account = document.querySelector('.account');
    const cart = document.querySelector('.cart');
    
    [account, cart].forEach(element => {
        element.addEventListener('click', function() {
            alert(`${this.textContent} clicked!`);
        });
    });

    // Sub navigation
    const subNavLinks = document.querySelectorAll('.sub-nav a');
    
    subNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent;
            alert(`Browsing ${category} section`);
        });
    });
});