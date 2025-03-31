 document.addEventListener('DOMContentLoaded', function() {
            // Animation for elements when page loads
            const animatedElements = document.querySelectorAll('.animated-element');
            
            function animateElements() {
                animatedElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 200 * index);
                });
            }
            
            // Start animation after a short delay
            setTimeout(animateElements, 300);
            
            // Add click event for topic cards
            const topicCards = document.querySelectorAll('.topic-card');
            topicCards.forEach(card => {
                card.addEventListener('click', function() {
                    const linkElement = this.querySelector('.btn-start');
                    if (linkElement) {
                        linkElement.click();
                    }
                });
            });
            
            // Help button functionality
            const helpBtn = document.querySelector('.floating-help-btn');
            helpBtn.addEventListener('click', function() {
                alert('สวัสดีครับ/ค่ะ! หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาถามคุณครูได้เลยนะครับ/คะ');
            });
        });