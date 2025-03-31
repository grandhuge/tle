// saving.js - JavaScript เฉพาะหน้า saving.html

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
    
    // Help button functionality
    const helpBtn = document.querySelector('.floating-help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            alert('สวัสดีครับ/ค่ะ! หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาถามคุณครูได้เลยนะครับ/คะ');
        });
    }
    
    // Slide navigation
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('lessonProgress');
    let currentSlide = 0;
    
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update buttons
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
        
        // Update progress bar
        const progress = ((currentSlide + 1) / slides.length) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateSlide();
            }
        });
    }
    
    // Audio player functionality
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            
            // Stop all other audio
            document.querySelectorAll('.narration').forEach(a => {
                if (a.id !== audioId) {
                    a.pause();
                    a.currentTime = 0;
                }
            });
            
            // Play/pause current audio
            if (audio.paused) {
                audio.play();
                this.innerHTML = '<i class="pause-icon"></i> หยุดเสียง';
            } else {
                audio.pause();
                this.innerHTML = '<i class="play-icon"></i> ฟังคำอธิบาย';
            }
            
            // Reset button text when audio ends
            audio.onended = function() {
                button.innerHTML = '<i class="play-icon"></i> ฟังคำอธิบาย';
            };
        });
    });
    
    // Saving game functionality
    const coins = document.querySelectorAll('.coin');
    const totalSavingsDisplay = document.getElementById('totalSavings');
    const daysCountDisplay = document.getElementById('daysCount');
    const nextDayBtn = document.getElementById('nextDay');
    const savingsResult = document.getElementById('savingsResult');
    
    if (coins.length && totalSavingsDisplay && daysCountDisplay && nextDayBtn && savingsResult) {
        let totalSavings = 0;
        let daysCount = 0;
        
        coins.forEach(coin => {
            coin.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                totalSavings += value;
                totalSavingsDisplay.textContent = totalSavings;
                
                // Animation for coin
                const coinClone = this.cloneNode(true);
                document.querySelector('.piggy-bank').appendChild(coinClone);
                coinClone.style.position = 'absolute';
                coinClone.style.zIndex = '100';
                
                const rect = document.querySelector('.coin-slot').getBoundingClientRect();
                const startRect = this.getBoundingClientRect();
                
                const xStart = startRect.left - rect.left;
                const yStart = startRect.top - rect.top;
                
                coinClone.style.transform = `translate(${xStart}px, ${yStart}px)`;
                
                setTimeout(() => {
                    coinClone.style.transition = 'all 0.5s ease-in';
                    coinClone.style.transform = 'translate(0, 0)';
                    coinClone.style.opacity = '0';
                    
                    setTimeout(() => {
                        coinClone.remove();
                    }, 500);
                }, 10);
                
                updateSavingsResult();
            });
        });
        
        nextDayBtn.addEventListener('click', function() {
            daysCount++;
            daysCountDisplay.textContent = daysCount;
            updateSavingsResult();
        });
        
        function updateSavingsResult() {
            if (totalSavings > 0) {
                let message = '';
                if (daysCount === 0) {
                    message = `เริ่มต้นดีมาก! คุณฝากเงินไปแล้ว ${totalSavings} บาท`;
                } else if (daysCount > 0 && daysCount < 7) {
                    message = `ดีมาก! คุณฝากเงินไปแล้ว ${daysCount} วัน เป็นจำนวน ${totalSavings} บาท`;
                } else if (daysCount >= 7 && daysCount < 30) {
                    message = `ยอดเยี่ยม! คุณฝากเงินมาเกือบ ${Math.floor(daysCount/7)} สัปดาห์แล้ว เงินออมคุณเติบโตเป็น ${totalSavings} บาท`;
                } else {
                    message = `น่าทึ่งมาก! คุณฝากเงินมาเกือบ ${Math.floor(daysCount/30)} เดือนแล้ว มีเงินออมถึง ${totalSavings} บาท คุณเป็นนักออมตัวจริง!`;
                }
                savingsResult.innerHTML = `<p>${message}</p>`;
            }
        }
    }
    
    // Quiz functionality
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const quizResult = document.getElementById('quizResult');
    
    if (checkAnswersBtn && quizResult) {
        checkAnswersBtn.addEventListener('click', function() {
            const q1Answer = document.querySelector('input[name="q1"]:checked')?.value;
            const q2Answer = document.querySelector('input[name="q2"]:checked')?.value;
            
            if (!q1Answer || !q2Answer) {
                quizResult.innerHTML = '<p class="error">กรุณาตอบคำถามทุกข้อ</p>';
                return;
            }
            
            let correctCount = 0;
            if (q1Answer === 'b') correctCount++;
            if (q2Answer === 'b') correctCount++;
            
            const percentage = (correctCount / 2) * 100;
            
            let resultMessage = '';
            if (percentage === 100) {
                resultMessage = '<p class="success">ยอดเยี่ยม! คุณตอบถูกทั้งหมด</p>';
            } else if (percentage === 50) {
                resultMessage = '<p class="partial">ดี! คุณตอบถูก 1 ข้อ</p>';
            } else {
                resultMessage = '<p class="error">ลองใหม่อีกครั้ง ยังไม่มีข้อถูกเลย</p>';
            }
            
            quizResult.innerHTML = resultMessage;
        });
    }
    
    // Initialize slide state
    updateSlide();
});