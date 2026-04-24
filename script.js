// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const viewResumeBtn = document.getElementById('viewResumeBtn');
const closeResumeBtn = document.getElementById('closeResumeBtn');
const resumeSection = document.getElementById('resumeSection');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// ── Theme Management ─────────────────────────────────────────────────────────
let currentTheme = localStorage.getItem('theme') || 'dark';

function initializeTheme() {
  if (currentTheme === 'light') {
    body.classList.add('light-theme');
    updateThemeIcon('light');
  } else {
    body.classList.remove('light-theme');
    updateThemeIcon('dark');
  }
}

function updateThemeIcon(theme) {
  const icon = themeToggle ? themeToggle.querySelector('i') : null;
  if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
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
  // Re-draw chart with correct theme colors if visible
  if (skillChartInstance) initSkillChart();
}

// ── Animated Skill Bars ──────────────────────────────────────────────────────
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach(bar => {
    bar.style.width = bar.getAttribute('data-pct') + '%';
  });
}

// ── Skills Radar Chart ───────────────────────────────────────────────────────
let skillChartInstance = null;

function initSkillChart() {
  const canvas = document.getElementById('skillChart');
  if (!canvas) return;
  if (skillChartInstance) { skillChartInstance.destroy(); skillChartInstance = null; }
  const isDark = !body.classList.contains('light-theme');
  const accent     = isDark ? '#80cfff' : '#0077b6';
  const accentFill = isDark ? 'rgba(128,207,255,0.18)' : 'rgba(0,119,182,0.15)';
  const gridColor  = isDark ? 'rgba(128,207,255,0.18)' : 'rgba(0,119,182,0.15)';
  const labelColor = isDark ? '#c2e9fb' : '#0d1f2d';
  const tickColor  = isDark ? '#80cfff' : '#0077b6';
  const pointBorder = isDark ? '#183059' : '#eaf3fb';
  const tooltipBg  = isDark ? 'rgba(24,48,89,0.96)' : 'rgba(234,243,251,0.98)';
  const tooltipText = isDark ? '#c2e9fb' : '#0d1f2d';

  skillChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Python', 'SQL', 'JavaScript', 'ServiceNow', 'Azure AD', 'ABM'],
      datasets: [{
        label: 'Proficiency',
        data: [75, 60, 65, 95, 90, 90],
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

// ── Resume Management ────────────────────────────────────────────────────────
function showResume() {
  resumeSection.classList.add('active');
  resumeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  viewResumeBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Resume';
  const structured = document.getElementById('resumeStructured');
  if (structured) structured.style.display = '';
  setTimeout(initSkillChart, 350);
  setTimeout(animateSkillBars, 500);

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

// ── App Initialization ───────────────────────────────────────────────────────
function initializeApp() {
  initializeTheme();

  closeModalBtn.addEventListener('click', hideContactModal);
  contactModal.addEventListener('click', handleModalClick);

  themeToggle.addEventListener('click', toggleTheme);

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
  }

  contactBtn.addEventListener('click', e => {
    e.preventDefault();
    const connect = document.getElementById('connectSection');
    if (connect) connect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else showContactModal();
  });

  document.addEventListener('keydown', handleKeyboard);

  // Button hover + ripple effects
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

  // Hero fade-in on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }

  // Logo fallback
  (function initHeaderLogo() {
    const img = document.querySelector('.logo-img');
    if (!img) return;
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => {
      const h1 = img.closest('.logo');
      if (h1) h1.innerHTML = '<span class="logo-text">Balje Nair</span>';
    }, { once: true });
  })();

  // Scroll progress bar
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    const onScroll = () => {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const sh = h.scrollHeight - h.clientHeight;
      sp.style.width = (sh === 0 ? 0 : (st / sh) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href) ||
                       document.getElementById(href.slice(1));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight active nav link on scroll
  const navSections = ['hero', 'about', 'skills', 'experience', 'certifications', 'connectSection'];
  const navLinks = document.querySelectorAll('.nav-link');
  const onNavScroll = () => {
    let current = '';
    navSections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('nav-link-active', href === current);
    });
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Card tilt effect (subtle, professional)
  document.querySelectorAll('.resume-section-item').forEach(card => {
    const glow = document.createElement('div'); glow.className = 'tilt-glow'; card.appendChild(glow);
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.style.transform = `rotateX(${((e.clientY - rect.top) - rect.height / 2) / 30}deg) rotateY(${(-(e.clientX - rect.left) + rect.width / 2) / 30}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  addScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}