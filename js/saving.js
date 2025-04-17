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

// ในส่วนของ Quiz functionality ให้แทนที่ด้วยโค้ดนี้:

// Quiz Game functionality
const quizQuestions = [
    {
        question: "การออมทรัพย์มีประโยชน์อย่างไร?",
        options: [
            { text: "ทำให้ไม่มีเงินใช้", correct: false },
            { text: "มีเงินไว้ใช้ยามฉุกเฉิน", correct: true },
            { text: "ทำให้เงินหาย", correct: false },
            { text: "ทำให้เป็นหนี้", correct: false }
        ],
        explanation: "การออมทรัพย์ช่วยให้เรามีเงินสำรองไว้ใช้เมื่อจำเป็น เช่น เมื่อเจ็บป่วยหรือมีของใช้ชำรุด"
    },
    {
        question: "สมาชิกสหกรณ์ออมทรัพย์ควรทำอย่างไร?",
        options: [
            { text: "ฝากเงินทุกวัน", correct: false },
            { text: "ฝากเงินเมื่อได้รับเงิน", correct: true },
            { text: "ไม่ต้องฝากเงินเลย", correct: false },
            { text: "ฝากเงินเฉพาะวันเกิด", correct: false }
        ],
        explanation: "เราควรฝากเงินเมื่อมีเงินได้มา เช่น เมื่อได้รับเงินค่าขนมหรือเงินรางวัล เพื่อฝึกนิสัยการออม"
    },
    {
        question: "ข้อใดคือประโยชน์ของการออมในสหกรณ์นักเรียน?",
        options: [
            { text: "ได้ดอกเบี้ยจากเงินออม", correct: true },
            { text: "ได้เงินฟรีทุกเดือน", correct: false },
            { text: "ไม่ต้องทำงาน", correct: false },
            { text: "ได้ของเล่นฟรี", correct: false }
        ],
        explanation: "การออมในสหกรณ์นักเรียนทำให้เราได้ดอกเบี้ยจากเงินออม และยังได้เรียนรู้การบริหารเงิน"
    },
    {
        question: "เมื่อต้องการถอนเงินจากสหกรณ์นักเรียนควรทำอย่างไร?",
        options: [
            { text: "แจ้งกับครูที่ดูแลสหกรณ์", correct: true },
            { text: "เปิดตู้เซฟเอาเงินเอง", correct: false },
            { text: "ขอยืมเงินจากเพื่อน", correct: false },
            { text: "รอให้ครูให้เงิน", correct: false }
        ],
        explanation: "เมื่อต้องการถอนเงิน ควรแจ้งกับครูที่ดูแลสหกรณ์เพื่อบันทึกการถอนเงินในสมุดบัญชี"
    },
    {
        question: "ข้อใดไม่ใช่วิธีการออมเงิน?",
        options: [
            { text: "นำเงินไปฝากธนาคาร", correct: false },
            { text: "ใช้เงินทั้งหมดที่ได้รับ", correct: true },
            { text: "เก็บเงินในกระปุกออมสิน", correct: false },
            { text: "ฝากเงินกับสหกรณ์", correct: false }
        ],
        explanation: "การใช้เงินทั้งหมดที่ได้รับไม่ใช่วิธีการออมเงิน แต่เป็นการใช้เงินจนหมด"
    }
];

function initQuizGame() {
    const quizOptions = document.getElementById('quizOptions');
    const questionText = document.getElementById('questionText');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const gameScore = document.getElementById('gameScore');
    const gameLives = document.getElementById('gameLives');
    const quizProgress = document.getElementById('quizProgress');
    const currentQuestion = document.getElementById('currentQuestion');
    const gameResult = document.getElementById('gameResult');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let lives = 3;
    let selectedOption = null;
    
    // Load first question
    loadQuestion(currentQuestionIndex);
    
    function loadQuestion(index) {
        if (index >= quizQuestions.length) {
            endGame();
            return;
        }
        
        const question = quizQuestions[index];
        questionText.textContent = question.question;
        quizOptions.innerHTML = '';
        
        // Shuffle options
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = `${String.fromCharCode(65 + i)}. ${option.text}`;
            optionElement.dataset.correct = option.correct;
            optionElement.addEventListener('click', selectOption);
            quizOptions.appendChild(optionElement);
        });
        
        // Update progress
        currentQuestion.textContent = index + 1;
        quizProgress.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
        
        // Reset UI for new question
        feedbackContainer.innerHTML = '';
        feedbackContainer.className = 'feedback-container';
        nextQuestionBtn.style.display = 'none';
        selectedOption = null;
    }
    
    function selectOption(e) {
        if (selectedOption) return; // Prevent changing answer
        
        const selected = e.target;
        selectedOption = selected;
        
        // Highlight selected option
        selected.classList.add('selected');
        
        // Check if correct
        const isCorrect = selected.dataset.correct === 'true';
        
        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (opt === selected && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
        
        // Show feedback
        const question = quizQuestions[currentQuestionIndex];
        const feedback = document.createElement('div');
        
        if (isCorrect) {
            feedbackContainer.className = 'feedback-container feedback-correct';
            feedback.innerHTML = `<p>ถูกต้อง! 🎉 ${question.explanation}</p>`;
            score += 10;
            gameScore.textContent = score;
            
            // Add coin animation
            const coin = document.createElement('span');
            coin.className = 'coin-reward';
            coin.textContent = '💰';
            feedback.appendChild(coin);
        } else {
            feedbackContainer.className = 'feedback-container feedback-incorrect';
            feedback.innerHTML = `<p>ยังไม่ถูกต้อง 😢 ${question.explanation}</p>`;
            lives--;
            gameLives.textContent = '❤️'.repeat(lives);
        }
        
        feedbackContainer.appendChild(feedback);
        nextQuestionBtn.style.display = 'block';
        
        // Check if game over
        if (lives <= 0) {
            setTimeout(endGame, 1500);
        }
    }
    
    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    });
    
    function endGame() {
        quizOptions.innerHTML = '';
        questionText.style.display = 'none';
        nextQuestionBtn.style.display = 'none';
        feedbackContainer.style.display = 'none';
        
        gameResult.style.display = 'block';
        
        if (lives > 0) {
            // Player won
            const percentage = Math.round((score / (quizQuestions.length * 10)) * 100);
            gameResult.className = 'game-result game-success';
            gameResult.innerHTML = `
                <h3>ยินดีด้วย! 🎉</h3>
                <p>คุณตอบถูก ${score / 10} จาก ${quizQuestions.length} คำถาม</p>
                <p>ได้คะแนน ${percentage}%</p>
                <p>คุณได้รับเงินออม ${score} บาท!</p>
                <div class="celebration">🎊🥳🎊</div>
                <button id="playAgainBtn" class="next-question-btn">เล่นอีกครั้ง</button>
            `;
        } else {
            // Player lost
            gameResult.className = 'game-result game-failure';
            gameResult.innerHTML = `
                <h3>เกมจบแล้ว! 😢</h3>
                <p>คุณตอบถูก ${score / 10} จาก ${quizQuestions.length} คำถาม</p>
                <p>ได้คะแนน ${Math.round((score / (quizQuestions.length * 10)) * 100)}%</p>
                <p>คุณได้รับเงินออม ${score} บาท</p>
                <p>ลองใหม่อีกครั้งนะ!</p>
                <button id="playAgainBtn" class="next-question-btn">เล่นอีกครั้ง</button>
            `;
        }
        
        document.getElementById('playAgainBtn').addEventListener('click', resetGame);
    }
    
    function resetGame() {
        currentQuestionIndex = 0;
        score = 0;
        lives = 3;
        
        gameScore.textContent = score;
        gameLives.textContent = '❤️❤️❤️';
        questionText.style.display = 'block';
        feedbackContainer.style.display = 'block';
        feedbackContainer.style.display = 'flex';
        gameResult.style.display = 'none';
        
        loadQuestion(currentQuestionIndex);
    }
}

// Initialize quiz game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... โค้ดเดิม ...
    
    // Initialize quiz game
    if (document.getElementById('quizOptions')) {
        initQuizGame();
    }
    
    // ... โค้ดเดิม ...
});