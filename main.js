import { handleMessageLogic } from './firebase.js';

// emoji efekti
const emojis = ['🌸','💖','✨','🌹'];

function createEmoji() {
    const el = document.createElement('div');
    el.className = 'flower';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 5 + 5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
}

setInterval(createEmoji, 1000);

// dark mode
const btn = document.getElementById("dark-mode-toggle");
if (btn) {
    btn.onclick = () => {
        document.body.classList.toggle("dark-mode");
    };
}

// firebase mesaj
handleMessageLogic();