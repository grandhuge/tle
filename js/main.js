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
		
		// ปุ่มปิดเสียงเพลงในไฟล์ main.js เพิ่มโค้ดนี้ในส่วน DOMContentLoaded

// ควบคุมเสียง background
const toggleSoundBtn = document.getElementById('toggleSound');
const backgroundMusic = document.querySelector('audio');

if (toggleSoundBtn && backgroundMusic) {
    // ตรวจสอบสถานะเสียงเริ่มต้น
    let isMuted = false;
    
    // ฟังก์ชันสลับปุ่มเสียง
    function toggleSound() {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        
        if (isMuted) {
            toggleSoundBtn.classList.add('muted');
            toggleSoundBtn.innerHTML = '<i class="sound-icon">🔇</i>';
        } else {
            toggleSoundBtn.classList.remove('muted');
            toggleSoundBtn.innerHTML = '<i class="sound-icon">🔊</i>';
        }
    }
    
    // ตั้งค่าเริ่มต้นให้ปุ่ม
    toggleSoundBtn.innerHTML = '<i class="sound-icon">🔊</i>';
    
    // การคลิกปุ่ม
    toggleSoundBtn.addEventListener('click', toggleSound);
    
    // ปรับปรุง: บันทึกการตั้งค่าเสียงใน localStorage
    function updateSoundSetting() {
        localStorage.setItem('backgroundMusicMuted', isMuted);
    }
    
    function loadSoundSetting() {
        const savedSetting = localStorage.getItem('backgroundMusicMuted');
        if (savedSetting === 'true') {
            isMuted = true;
            backgroundMusic.muted = true;
            toggleSoundBtn.innerHTML = '<i class="sound-icon">🔇</i>';
            toggleSoundBtn.classList.add('muted');
        }
    }
    
    // โหลดการตั้งค่าเมื่อหน้าเว็บโหลด
    loadSoundSetting();
    
    // อัปเดตการตั้งค่าเมื่อมีการเปลี่ยนแปลง
    toggleSoundBtn.addEventListener('click', function() {
        toggleSound();
        updateSoundSetting();
    });
}