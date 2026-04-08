// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const viewResumeBtn = document.getElementById('viewResumeBtn');
const closeResumeBtn = document.getElementById('closeResumeBtn');
const resumeSection = document.getElementById('resumeSection');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Theme Management — always default to dark, ignore stale localStorage
let currentTheme = 'dark';

function initializeTheme() {
  if (currentTheme === 'light') {
    body.classList.add('light-theme');
    updateThemeIcon('light');
  } else {
    body.classList.remove('light-theme');
    updateThemeIcon('dark');
  }
  const entryIcon = document.querySelector('#entryThemeToggle i');
  if (entryIcon) entryIcon.className = currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

function updateThemeIcon(theme) {
  const icon = themeToggle ? themeToggle.querySelector('i') : null;
  if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
  const entryIcon = document.querySelector('#entryThemeToggle i');
  if (entryIcon) entryIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

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
  localStorage.setItem('theme', currentTheme);
  body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// ── Skills Radar Chart ──────────────────────────────────────────────────────
let skillChartInstance = null;

function initSkillChart() {
  const canvas = document.getElementById('skillChart');
  if (!canvas) return;
  if (skillChartInstance) { skillChartInstance.destroy(); skillChartInstance = null; }
  const isDark = !body.classList.contains('light-theme');
  const accent      = isDark ? '#80cfff' : '#16a34a';
  const accentFill  = isDark ? 'rgba(128,207,255,0.18)' : 'rgba(22,163,74,0.15)';
  const gridColor   = isDark ? 'rgba(128,207,255,0.18)' : 'rgba(0,0,0,0.10)';
  const labelColor  = isDark ? '#c2e9fb' : '#5a6a62';
  const tickColor   = isDark ? '#80cfff' : '#1b211b';
  const pointBorder = isDark ? '#183059' : '#f7faf7';
  const tooltipBg   = isDark ? 'rgba(24,48,89,0.96)' : 'rgba(255,255,255,0.96)';
  const tooltipText = isDark ? '#c2e9fb' : '#1b211b';
  skillChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Python', 'SQL', 'Azure AD', 'ServiceNow', 'JavaScript', 'ABM'],
      datasets: [{
        label: 'Proficiency',
        data: [80, 64, 90, 85, 68, 80],
        backgroundColor: accentFill, borderColor: accent, borderWidth: 2,
        pointBackgroundColor: accent, pointBorderColor: pointBorder, pointBorderWidth: 2,
        pointRadius: 4, pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff', pointHoverBorderColor: accent
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      animation: { duration: 900, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg, titleColor: accent, bodyColor: tooltipText,
          borderColor: accent, borderWidth: 1, padding: 10,
          callbacks: { label: ctx => ` ${ctx.raw}%` }
        }
      },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 25, color: tickColor, backdropColor: 'transparent', font: { size: 10 } },
          grid: { color: gridColor }, angleLines: { color: gridColor },
          pointLabels: { color: labelColor, font: { size: 11, weight: '600' } }
        }
      }
    }
  });
}

// ── Resume Management ───────────────────────────────────────────────────────
function showResume() {
  resumeSection.classList.add('active');
  resumeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Label only — click is handled by toggleResume()
  viewResumeBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Resume';
  const structured = document.getElementById('resumeStructured');
  if (structured) structured.style.display = '';
  setTimeout(initSkillChart, 350);
  fetch('assets/resume.json', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      if (!data) return;
      const summaryEl = document.getElementById('summaryText');
      if (summaryEl && data.professionalSummary) summaryEl.textContent = data.professionalSummary;
      const expList = document.getElementById('experienceList');
      if (expList && Array.isArray(data.experience)) {
        expList.innerHTML = '';
        data.experience.forEach((item, idx) => {
          const div = document.createElement('div'); div.className = 'experience-item';
          const h4 = document.createElement('h4'); h4.textContent = item.title || `Experience ${idx + 1}`;
          const p = document.createElement('p'); p.className = 'date'; p.textContent = item.dates || '';
          const ul = document.createElement('ul');
          (item.bullets || []).forEach(b => { const li = document.createElement('li'); li.textContent = b; ul.appendChild(li); });
          div.appendChild(h4);
          if (p.textContent) div.appendChild(p);
          if (ul.children.length) div.appendChild(ul);
          expList.appendChild(div);
        });
      }
      const eduList = document.getElementById('educationList');
      if (eduList && Array.isArray(data.education)) {
        eduList.innerHTML = '';
        data.education.forEach((edu, idx) => {
          const wrap = document.createElement('div'); wrap.className = 'education-item';
          const h4 = document.createElement('h4'); h4.textContent = edu.degree || `Education ${idx + 1}`;
          const pInst = document.createElement('p'); pInst.textContent = edu.institution || '';
          const pDate = document.createElement('p'); pDate.className = 'date'; pDate.textContent = edu.date || '';
          const pNotes = document.createElement('p'); pNotes.textContent = edu.notes || '';
          wrap.appendChild(h4);
          if (pInst.textContent) wrap.appendChild(pInst);
          if (pDate.textContent) wrap.appendChild(pDate);
          if (pNotes.textContent) wrap.appendChild(pNotes);
          eduList.appendChild(wrap);
        });
      }
    })
    .catch(() => {});
}

function hideResume() {
  resumeSection.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Label only — click is handled by toggleResume()
  viewResumeBtn.innerHTML = '<i class="fas fa-file-alt"></i> View Resume';
}

function showContactModal() {
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideContactModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleModalClick(event) {
  if (event.target === contactModal) hideContactModal();
}

function handleKeyboard(event) {
  if (event.key === 'Escape') {
    if (contactModal.classList.contains('active')) hideContactModal();
    if (resumeSection.classList.contains('active')) hideResume();
  }
}

function addLoadingAnimation() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-animation';
  loadingDiv.innerHTML = `<div class="spinner"></div><p>Loading...</p>`;
  document.body.appendChild(loadingDiv);
  window.addEventListener('load', () => { setTimeout(() => loadingDiv.remove(), 500); });
}

function addScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  document.querySelectorAll('.resume-section-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

function initializeApp() {
  initializeTheme();

  closeModalBtn.addEventListener('click', hideContactModal);
  contactModal.addEventListener('click', handleModalClick);

  const entryThemeToggle = document.getElementById('entryThemeToggle');
  if (entryThemeToggle) entryThemeToggle.addEventListener('click', toggleTheme);

  const entryOverlay     = document.getElementById('entryOverlay');
  const entryCircle      = document.getElementById('entryCircle');
  const entryCircleLabel = document.getElementById('entryCircleLabel');
  const enterNoSoundBtn  = document.getElementById('enterNoSoundBtn');

  if (entryOverlay && entryCircle && entryCircleLabel && enterNoSoundBtn) {
    const durationMs = 2200;
    const easeInOutCubic = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    let start = null;

    function animate(now) {
      if (start === null) start = now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeInOutCubic(t);
      entryCircleLabel.textContent = Math.min(100, Math.round(eased * 100));
      const deg = Math.min(360, Math.round(eased * 360));
      entryCircle.style.background = `conic-gradient(var(--accent-primary) 0deg ${deg}deg, rgba(255,255,255,0.06) ${deg}deg 360deg)`;
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

    let windCtx = null;
    function startWindSynth() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        windCtx = new AudioCtx();
        const bufferSize = 2 * windCtx.sampleRate;
        const noiseBuffer = windCtx.createBuffer(1, bufferSize, windCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
        const noise = windCtx.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true;
        const lpf = windCtx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 500; lpf.Q.value = 0.0001;
        const gain = windCtx.createGain(); gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.05, windCtx.currentTime + 2);
        const lfo = windCtx.createOscillator(); lfo.frequency.value = 0.08;
        const lfoGain = windCtx.createGain(); lfoGain.gain.value = 120;
        lfo.connect(lfoGain).connect(lpf.frequency); lfo.start();
        noise.connect(lpf).connect(gain).connect(windCtx.destination); noise.start();
      } catch {}
    }

    const closeOverlay = (withSound = true) => {
      entryOverlay.style.opacity = '0';
      entryOverlay.style.transition = 'opacity .5s ease';
      setTimeout(() => entryOverlay.remove(), 500);
      if (withSound) {
        const cabinAudio = document.getElementById('cabin');
        if (cabinAudio) {
          const targetVol = 0.3;
          cabinAudio.muted = false; cabinAudio.volume = 0;
          const tryPlay = () => cabinAudio.play()
            .then(() => {
              const dMs = 2000; const st = performance.now();
              function fade(now) {
                const t = Math.min(1, (now - st) / dMs);
                cabinAudio.volume = targetVol * t;
                if (t < 1) requestAnimationFrame(fade);
              }
              requestAnimationFrame(fade);
            })
            .catch(err => { console.warn('Audio failed:', err); startWindSynth(); });
          tryPlay();
          if (cabinAudio.readyState < 3) cabinAudio.load();
          cabinAudio.addEventListener('canplaythrough', () => { if (cabinAudio.paused) tryPlay(); }, { once: true });
        } else { startWindSynth(); }
      }
      initInteractivity();
      const fog = document.getElementById('fog');
      if (fog) { fog.style.opacity = '0'; fog.style.transition = 'opacity 2s ease'; requestAnimationFrame(() => { fog.style.opacity = '1'; }); }
    };

    entryCircle.addEventListener('click', () => closeOverlay(true));
    entryCircle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') closeOverlay(true); });
    enterNoSoundBtn.addEventListener('click', () => closeOverlay(false));
  }

  addLoadingAnimation();
  addScrollAnimations();

  themeToggle.addEventListener('click', toggleTheme);

  // ── FIX: single toggle handler — no more .onclick conflict ──
  function toggleResume() {
    if (resumeSection.classList.contains('active')) {
      hideResume();
    } else {
      showResume();
    }
  }
  viewResumeBtn.addEventListener('click', toggleResume);
  closeResumeBtn.addEventListener('click', hideResume);

  const backBtn = document.getElementById('backToTopBtn');
  if (backBtn) {
    viewResumeBtn.addEventListener('click', () => {
      if (resumeSection.classList.contains('active')) backBtn.classList.add('visible');
      else backBtn.classList.remove('visible');
    });
    closeResumeBtn.addEventListener('click', () => backBtn.classList.remove('visible'));
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hideResume();
      backBtn.classList.remove('visible');
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') backBtn.classList.remove('visible'); });
    if (resumeSection.classList.contains('active')) backBtn.classList.add('visible');
  }

  contactBtn.addEventListener('click', e => {
    e.preventDefault();
    const connect = document.getElementById('connectSection');
    if (connect) connect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else showContactModal();
  });

  document.addEventListener('keydown', handleKeyboard);

  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-2px)'; });
    button.addEventListener('mouseleave', function () { this.style.transform = 'translateY(0)'; });
    button.addEventListener('click', function (e) {
      const r = document.createElement('span'); r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.left = e.clientX - rect.left + 'px';
      r.style.top = e.clientY - rect.top + 'px';
      this.appendChild(r); setTimeout(() => r.remove(), 650);
    });
  });

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0'; heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
      heroContent.style.opacity = '1'; heroContent.style.transform = 'translateY(0)';
    }, 300);
  }

  (function initHeaderLogo() {
    const img = document.querySelector('.logo-img');
    if (!img) return;
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => {
      const h1 = img.closest('.logo');
      if (h1) h1.innerHTML = '<span class="logo-text">Balje Nair</span>';
    }, { once: true });
  })();

  addLoadingStyles();
  setTimeout(addInteractiveFeatures, 1000);
}

function addLoadingStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .loading-animation { position:fixed; top:0; left:0; width:100%; height:100%; background-color:var(--bg-primary); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; color:var(--text-primary); }
    .spinner { width:50px; height:50px; border:4px solid var(--border-color); border-top:4px solid var(--accent-primary); border-radius:50%; animation:spin 1s linear infinite; margin-bottom:1rem; }
    @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    .loading-animation p { font-size:1.2rem; color:var(--text-secondary); }
  `;
  document.head.appendChild(style);
}

function addInteractiveFeatures() {
  initInteractivity();
  let lastTrailAt = 0;
  const trailThrottleMs = 120;
  document.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - lastTrailAt < trailThrottleMs) return;
    lastTrailAt = now;
    const trail = document.createElement('div'); trail.className = 'cursor-trail'; trail.textContent = '❄';
    trail.style.left = e.clientX + 'px'; trail.style.top = e.clientY + 'px';
    trail.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`;
    document.body.appendChild(trail); setTimeout(() => trail.remove(), 900);
  });
}

function initInteractivity() {
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    const onScroll = () => {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const sh = h.scrollHeight - h.clientHeight;
      sp.style.width = (sh === 0 ? 0 : (st / sh) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  const par = document.querySelectorAll('.parallax .pl');
  if (par.length) {
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      par.forEach(el => {
        const depth = parseFloat(el.getAttribute('data-depth') || '0.02');
        el.style.transform = `translate3d(${dx * depth * 40}px, ${dy * depth * 40}px, 0)`;
      });
    });
  }
  document.querySelectorAll('.resume-section-item').forEach(card => {
    const glow = document.createElement('div'); glow.className = 'tilt-glow'; card.appendChild(glow);
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`); card.style.setProperty('--my', `${y}%`);
      card.style.transform = `rotateX(${((e.clientY - rect.top) - rect.height / 2) / 30}deg) rotateY(${(-(e.clientX - rect.left) + rect.width / 2) / 30}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  addParticleEffect();
}

function addParticleEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  hero.appendChild(canvas); hero.style.position = 'relative';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2
  }));
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.fillStyle = 'rgba(99,102,241,0.3)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animate);
  })();
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}