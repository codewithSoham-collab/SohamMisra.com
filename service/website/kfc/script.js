document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;
            
            // Add to cart
            cart.push({ name: itemName, price: itemPrice });
            
            // Visual feedback
            this.innerHTML = '✓ Added!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.background = '#d62300';
            }, 1500);
            
            // Update cart count (if you had a cart counter)
            console.log('Cart:', cart);
        });
    });

    // Deal claim functionality
    const claimButtons = document.querySelectorAll('.claim-deal');
    
    claimButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dealCard = this.closest('.deal-card');
            const dealTitle = dealCard.querySelector('h3').textContent;
            
            this.innerHTML = '✓ Claimed!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.innerHTML = 'Claim Deal';
                this.style.background = '#d62300';
            }, 2000);
            
            console.log('Deal claimed:', dealTitle);
        });
    });

    // Order now button functionality
    const orderBtn = document.querySelector('.order-btn');
    const ctaBtn = document.querySelector('.cta-btn');
    
    [orderBtn, ctaBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                this.innerHTML = 'Processing...';
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.innerHTML = this === orderBtn ? 'Order Now' : 'Order Online';
                    this.style.transform = 'scale(1)';
                    alert('Redirecting to order page...');
                }, 1000);
            });
        }
    });

    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const image = this.querySelector('.item-image');
            image.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.item-image');
            image.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});