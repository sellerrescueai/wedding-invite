document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initPetals();
    initAudio();
    initCountdown();
    initRsvp();
    initStaggeredText();
});

// Scroll Reveal using Intersection Observer
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}

// Floating Petals Animation
function initPetals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = document.getElementById('petals-container');
    if (!container) return;

    const petalCount = 20; // Lightweight, not too many
    const colors = ['#E8C7C8', '#D4AF37', '#FFF8F0'];

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize properties
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10; // 10-20s
        const delay = Math.random() * 10;
        
        const bgColor = colors[Math.floor(Math.random() * colors.length)];

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}vw`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `-${delay}s`; // Start off-screen
        
        // Simple shape styling to mimic a petal
        petal.style.backgroundColor = bgColor;
        petal.style.borderRadius = '50% 0 50% 50%';
        petal.style.opacity = '0.6';
        petal.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

        container.appendChild(petal);
    }
}

// Audio Player Logic
function initAudio() {
    const audioPlayer = document.getElementById('audio-player');
    const audio = document.getElementById('bg-music');
    if (!audioPlayer || !audio) return;

    let isPlaying = false;

    audioPlayer.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            audioPlayer.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`; // Play Icon
        } else {
            audio.play().catch(e => console.log('Audio play failed', e));
            audioPlayer.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`; // Pause Icon
        }
        isPlaying = !isPlaying;
    });
}

// Countdown Logic
function initCountdown() {
    if (!appConfig || !appConfig.weddingDate) return;

    const targetDate = new Date(appConfig.weddingDate).getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl) return;

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? '0'+days : days;
        hoursEl.innerText = hours < 10 ? '0'+hours : hours;
        minutesEl.innerText = minutes < 10 ? '0'+minutes : minutes;
        secondsEl.innerText = seconds < 10 ? '0'+seconds : seconds;
    }

    update();
    setInterval(update, 1000);
}

// WhatsApp RSVP Logic
function initRsvp() {
    const rsvpBtn = document.getElementById('rsvp-btn');
    if (!rsvpBtn || !appConfig) return;

    // We can allow users to fill out their names via prompt or just leave a placeholder
    rsvpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const number = appConfig.whatsappNumber;
        const msg = encodeURIComponent(appConfig.rsvpMessage);
        const url = `https://wa.me/${number}?text=${msg}`;
        window.open(url, '_blank');
    });
}

// Staggered Text Reveal
function initStaggeredText() {
    const staggers = document.querySelectorAll('.stagger-text');
    staggers.forEach(stagger => {
        const text = stagger.innerText;
        stagger.innerText = '';
        
        let delay = 0;
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char; // Preserve spaces
            span.style.animationDelay = `${delay}s`;
            stagger.appendChild(span);
            delay += 0.05;
        });
    });
}
