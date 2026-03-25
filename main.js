import { handleMessageLogic } from './firebase.js';

// --- EMOJİ YAĞMURU ---
const emojis = ['🌸', '💖', '🧁', '🍫', '✨', '🌹', '🍩', '🍬'];

function createEmoji() {
    if (!document.body) return;
    const el = document.createElement('div');
    el.className = 'flower';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    
    const duration = Math.random() * 5 + 7; // 7-12 saniye arası düşüş
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (Math.random() * 1 + 1) + 'rem';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
}

// --- KARANLIK MOD ---
const toggleBtn = document.getElementById('dark-mode-toggle');
if (toggleBtn) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }
    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    });
}

// Başlatıcılar
setInterval(createEmoji, 1000); // Emojileri başlat
handleMessageLogic(); // Firebase mantığını başlat