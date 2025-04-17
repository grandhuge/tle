// main.js - JavaScript หลักสำหรับทุกหน้า
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
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            alert('สวัสดีครับ/ค่ะ! หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาถามคุณครูได้เลยนะครับ/คะ');
        });
    }
    
    // ควบคุมเสียง background
    const audio = document.querySelector('audio');
    const toggleSoundBtn = document.getElementById('toggleSound');
    
    if (audio && toggleSoundBtn) {
        const soundIcon = toggleSoundBtn.querySelector('.sound-icon');
        
        // เก็บสถานะเสียงใน localStorage
        function loadSoundSetting() {
            const soundState = localStorage.getItem('soundEnabled');
            // ถ้าไม่เคยตั้งค่า หรือตั้งค่าเป็น true ให้เปิดเสียง
            if (soundState === null || soundState === 'true') {
                isSoundOn = true;
                soundIcon.textContent = '🔊';
                // ไม่ play เลยเพราะบราวเซอร์ส่วนใหญ่ป้องกัน autoplay จนกว่าจะมีการ interact
            } else {
                isSoundOn = false;
                soundIcon.textContent = '🔇';
                audio.pause();
            }
        }
        
        function updateSoundSetting() {
            localStorage.setItem('soundEnabled', isSoundOn);
        }
        
        // ตรวจสอบสถานะเสียงเริ่มต้น
        let isSoundOn = true;
        
        // ฟังก์ชันสลับสถานะเสียง
        function toggleSound() {
            if (isSoundOn) {
                audio.pause();
                soundIcon.textContent = '🔇'; // ไอคอนปิดเสียง
                toggleSoundBtn.classList.add('muted');
                isSoundOn = false;
            } else {
                // เล่นเพลงเมื่อมีการกดปุ่มเปิดเสียง
                const playPromise = audio.play();
                
                // จัดการกรณีที่ play() คืนค่าเป็น Promise (สำหรับบราวเซอร์ใหม่)
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // การเล่นเริ่มต้นแล้ว
                        soundIcon.textContent = '🔊'; // ไอคอนเปิดเสียง
                        toggleSoundBtn.classList.remove('muted');
                        isSoundOn = true;
                    })
                    .catch(error => {
                        // การเล่นล้มเหลว อาจเป็นเพราะนโยบายของบราวเซอร์
                        console.error('การเล่นเสียงล้มเหลว:', error);
                        alert('ไม่สามารถเล่นเสียงอัตโนมัติได้ กรุณากดเล่นอีกครั้ง');
                    });
                } else {
                    // สำหรับบราวเซอร์เก่าที่ไม่รองรับ Promise จาก play()
                    soundIcon.textContent = '🔊';
                    toggleSoundBtn.classList.remove('muted');
                    isSoundOn = true;
                }
            }
            
            // อัปเดตการตั้งค่าใน localStorage
            updateSoundSetting();
        }
        
        // เพิ่ม Event Listener ให้ปุ่ม
        toggleSoundBtn.addEventListener('click', toggleSound);
        
        // โหลดการตั้งค่าเมื่อหน้าเว็บโหลด
        loadSoundSetting();
        
        // พยายามเล่นเสียงอัตโนมัติเมื่อผู้ใช้มีการโต้ตอบกับหน้าเว็บ
        document.addEventListener('click', function initAudio() {
            if (isSoundOn && audio.paused) {
                audio.play().catch(e => console.log('ไม่สามารถเล่นเสียงอัตโนมัติ:', e));
                // ลบ listener นี้หลังจากทำงานครั้งแรก
                document.removeEventListener('click', initAudio);
            }
        });
    }
});