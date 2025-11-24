// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const viewResumeBtn = document.getElementById('viewResumeBtn');
const closeResumeBtn = document.getElementById('closeResumeBtn');
const resumeSection = document.getElementById('resumeSection');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize theme on page load
function initializeTheme() {
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        body.classList.remove('light-theme');
        updateThemeIcon('dark');
    }
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Toggle theme function
function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        body.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        currentTheme = 'dark';
        body.classList.remove('light-theme');
        updateThemeIcon('dark');
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', currentTheme);
    
    // Add smooth transition effect
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// Resume Management
function showResume() {
    resumeSection.classList.add('active');
    
    // Smooth scroll to resume section
    resumeSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Update button text
    viewResumeBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Resume';
    viewResumeBtn.onclick = hideResume;
}

function hideResume() {
    resumeSection.classList.remove('active');
    
    // Smooth scroll back to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Update button text
    viewResumeBtn.innerHTML = '<i class="fas fa-file-alt"></i> View Resume';
    viewResumeBtn.onclick = showResume;
}

// Modal Management
function showContactModal() {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
function handleModalClick(event) {
    if (event.target === contactModal) {
        hideContactModal();
    }
}

// Keyboard navigation
function handleKeyboard(event) {
    if (event.key === 'Escape') {
        if (contactModal.classList.contains('active')) {
            hideContactModal();
        }
        if (resumeSection.classList.contains('active')) {
            hideResume();
        }
    }
}

// Smooth scroll for navigation
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add loading animation
function addLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation';
    loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Loading...</p>
    `;
    document.body.appendChild(loadingDiv);
    
    // Remove loading animation after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingDiv.remove();
        }, 500);
    });
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe resume section items
    const resumeItems = document.querySelectorAll('.resume-section-item');
    resumeItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize all functionality
function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Entry overlay loader
    const entryOverlay = document.getElementById('entryOverlay');
    const entryCircle = document.getElementById('entryCircle');
    const entryCircleLabel = document.getElementById('entryCircleLabel');
    const enterNoSoundBtn = document.getElementById('enterNoSoundBtn');
    if (entryOverlay && entryCircle && entryCircleLabel && enterNoSoundBtn) {
        const durationMs = 2200;
        const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 1, 3) / 2);
        const start = performance.now();

        function animate(now) {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / durationMs);
            const eased = easeInOutCubic(t);
            let percent = Math.round(eased * 100);
            if (percent > 100) percent = 100;
            entryCircleLabel.textContent = percent + '%';
            let deg = Math.round(eased * 360);
            if (deg > 360) deg = 360;
            entryCircle.style.background = `conic-gradient(var(--accent-primary) ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)`;

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                enterNoSoundBtn.classList.add('enabled');
                enterNoSoundBtn.removeAttribute('disabled');
                entryCircle.style.cursor = 'pointer';
                entryCircle.tabIndex = 0;
            }
        }

        requestAnimationFrame(animate);

        const closeOverlay = (withSound = true) => {
            entryOverlay.style.opacity = '0';
            entryOverlay.style.transition = 'opacity .5s ease';
            setTimeout(() => entryOverlay.remove(), 500);
            if (withSound) {
                const audio = document.getElementById('bgNatureAudio');
                if (audio) {
                    const targetVol = 0.15;
                    audio.volume = 0;
                    // Ensure source readiness
                    const tryPlay = () => audio.play().then(() => {
                        // Smooth volume fade-in
                        const durationMs = 2000;
                        const start = performance.now();
                        function fade(now){
                            const t = Math.min(1, (now - start) / durationMs);
                            audio.volume = targetVol * t;
                            if (t < 1) requestAnimationFrame(fade);
                        }
                        requestAnimationFrame(fade);
                    }).catch(() => {
                        // Retry once after slight delay
                        setTimeout(() => {
                            audio.play().catch(() => {});
                        }, 300);
                    });
                    // Prefer using current src if present
                    if (audio.readyState < 2) audio.load();
                    tryPlay();
                }
            }
        };

        // Click the circle to enter
        entryCircle.addEventListener('click', () => closeOverlay(true));
        entryCircle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') closeOverlay(true);
        });
        enterNoSoundBtn.addEventListener('click', () => closeOverlay(false));
    }

    // Add loading animation
    addLoadingAnimation();
    
    // Add scroll animations
    addScrollAnimations();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    viewResumeBtn.addEventListener('click', showResume);
    closeResumeBtn.addEventListener('click', hideResume);
    // Contact button now scrolls to Let's Connect section
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const connect = document.getElementById('connectSection');
        if (connect) {
            connect.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback to modal if section missing
            showContactModal();
        }
    });
    document.addEventListener('keydown', handleKeyboard);
    
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add smooth reveal animation for hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Add some additional CSS for loading animation
function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-primary);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: var(--text-primary);
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-animation p {
            font-size: 1.2rem;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
}

// Add loading styles
addLoadingStyles();

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Add some performance optimizations
window.addEventListener('load', () => {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-src]');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
    
    // Add intersection observer for lazy loading if needed
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            smoothScrollTo(targetElement);
        }
    }
});

// Add some additional interactive features
function addInteractiveFeatures() {
    // Add typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add particle effect background (optional enhancement)
    addParticleEffect();
}

// Minimal leaf cursor trail
let lastTrailAt = 0;
const trailThrottleMs = 120;
document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastTrailAt < trailThrottleMs) return;
    lastTrailAt = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.textContent = '🍃';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    const rot = (Math.random() * 20) - 10;
    trail.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 900);
});

// Simple particle effect for background
function addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.appendChild(canvas);
        hero.style.position = 'relative';
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// Initialize interactive features after a delay
setTimeout(addInteractiveFeatures, 1000);

