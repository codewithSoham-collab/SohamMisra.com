document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animation to cards
    const cards = document.querySelectorAll('.website-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Add click sound effect (optional)
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Parallax effect for floating elements
    document.addEventListener('mousemove', function(e) {
        const bubbles = document.querySelectorAll('.bubble');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        bubbles.forEach((bubble, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = (x - 0.5) * speed * 20;
            const yPos = (y - 0.5) * speed * 20;
            
            bubble.style.transform += ` translate(${xPos}px, ${yPos}px)`;
        });
    });
});