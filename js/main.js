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
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.querySelector('audio');
    const toggleSoundBtn = document.getElementById('toggleSound');
    const soundIcon = toggleSoundBtn.querySelector('.sound-icon');
    
    // ตรวจสอบสถานะเสียงเริ่มต้น (เปิดอยู่)
    let isSoundOn = true;
    
    // ฟังก์ชันสลับสถานะเสียง
    function toggleSound() {
        if (isSoundOn) {
            audio.pause();
            soundIcon.textContent = '🔇'; // ไอคอนปิดเสียง
            isSoundOn = false;
        } else {
            audio.play();
            soundIcon.textContent = '🔊'; // ไอคอนเปิดเสียง
            isSoundOn = true;
        }
    }
    
    // เพิ่ม Event Listener ให้ปุ่ม
    toggleSoundBtn.addEventListener('click', toggleSound);
    
    // พยายามเล่นเสียงอัตโนมัติเมื่อโหลดหน้า (เพื่อแก้ไขนโยบาย autoplay ของบราวเซอร์)
    document.body.addEventListener('click', function() {
        if (isSoundOn && audio.paused) {
            audio.play().catch(e => console.log('ไม่สามารถเล่นเสียงอัตโนมัติ:', e));
        }
    }, { once: true });
});
    
    // โหลดการตั้งค่าเมื่อหน้าเว็บโหลด
    loadSoundSetting();
    
    // อัปเดตการตั้งค่าเมื่อมีการเปลี่ยนแปลง
    toggleSoundBtn.addEventListener('click', function() {
        toggleSound();
        updateSoundSetting();
    });
}
