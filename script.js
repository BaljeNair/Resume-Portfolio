const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const resumeSection = document.getElementById('resumeSection');
const viewResumeBtn = document.getElementById('viewResumeBtn');
const closeResumeBtn = document.getElementById('closeResumeBtn');
const profileBot = document.getElementById('profileBot');
const profileBotOverlay = document.getElementById('profileBotOverlay');
const messages = document.getElementById('profileBotMessages');
const botInput = document.getElementById('profileBotInput');

const profileAnswers = [
  { keys: ['skill', 'tool', 'technical', 'good at'], answer: 'Balje works across endpoint support, identity and device management, ITSM, AV readiness, and practical scripting. His core tools include ServiceNow, Entra ID, Intune, SCCM, ABM, Microsoft 365, Python, and JavaScript.' },
  { keys: ['worked', 'experience', 'company', 'role'], answer: 'Balje is currently open to work. His most recent role was Consultant at Capgemini (February–May 2025). Previously, he was a Specialist E2 supporting British Petroleum through HCL, and an Infrastructure / Technical Refresh Engineer at NCS via Jobster.' },
  { keys: ['project', 'built', 'achievement'], answer: 'Selected work includes a hardened Windows enterprise baseline at NCS, APAC escalation leadership at Capgemini, executive AV readiness at BP and Capgemini, and ServiceNow-led onboarding and offboarding workflows.' },
  { keys: ['open', 'available', 'hire', 'work'], answer: 'Yes. Balje is open to remote or hybrid opportunities, especially roles involving senior IT support, infrastructure, service delivery, or team leadership. His most recent role was Consultant at Capgemini from February to May 2025.' },
  { keys: ['education', 'study', 'degree', 'certification', 'itil', 'ai', 'artificial intelligence', 'course'], answer: 'He is pursuing a BSc (Hons) in Computing Science through Coventry University / PSB Academy, expected in August 2027. He also completed Agentic Artificial Intelligence (AI) for Business Processes at Republic Polytechnic in October 2026. ITIL 4 Foundation is listed with AXELOS; the current certification status is to be confirmed.' },
  { keys: ['language'], answer: 'English and Tamil are fluent. Mandarin and Tagalog are listed at elementary level in the current profile.' }
];

function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') body.classList.add('light-theme');
  updateThemeIcon();
}
function updateThemeIcon() {
  const icon = themeToggle?.querySelector('i');
  if (icon) icon.className = body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
}
function toggleTheme() {
  body.classList.toggle('light-theme');
  localStorage.setItem('portfolio-theme', body.classList.contains('light-theme') ? 'light' : 'dark');
  updateThemeIcon();
}
function openResume() {
  resumeSection.classList.add('active');
  resumeSection.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeResume() {
  resumeSection.classList.remove('active');
  resumeSection.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function openBot() {
  profileBot.classList.add('active');
  profileBotOverlay.classList.add('active');
  botInput?.focus();
}
function closeBot() {
  profileBot.classList.remove('active');
  profileBotOverlay.classList.remove('active');
}
function appendMessage(text, role) {
  const item = document.createElement('div');
  item.className = `bot-msg ${role}`;
  item.innerHTML = `<p>${text}</p>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
function answerQuestion(question) {
  const normalized = question.toLowerCase();
  const match = profileAnswers.find(entry => entry.keys.some(key => normalized.includes(key)));
  return match?.answer || 'I can help with Balje’s professional profile — try asking about his skills, experience, projects, education, or availability.';
}
function setAssistantWorking(isWorking) {
  document.querySelectorAll('.assistant-avatar').forEach(avatar => {
    avatar.classList.toggle('assistant-working', isWorking);
    avatar.setAttribute('aria-busy', isWorking ? 'true' : 'false');
  });
}
function sendBotMessage(text) {
  const question = (text || botInput.value).trim();
  if (!question) return;
  botInput.value = '';
  appendMessage(question, 'user');
  setAssistantWorking(true);
  window.setTimeout(() => {
    appendMessage(answerQuestion(question), 'bot');
    setAssistantWorking(false);
  }, 760);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (viewResumeBtn) viewResumeBtn.addEventListener('click', openResume);
if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
if (document.getElementById('wantToKnowBtn')) document.getElementById('wantToKnowBtn').addEventListener('click', openBot);
if (document.getElementById('closeBotBtn')) document.getElementById('closeBotBtn').addEventListener('click', closeBot);
if (profileBotOverlay) profileBotOverlay.addEventListener('click', closeBot);
if (document.getElementById('sendBotBtn')) document.getElementById('sendBotBtn').addEventListener('click', () => sendBotMessage());
if (botInput) botInput.addEventListener('keydown', event => { if (event.key === 'Enter') sendBotMessage(); });
document.querySelectorAll('.bot-suggestions button').forEach(button => button.addEventListener('click', () => sendBotMessage(button.textContent)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeResume(); closeBot(); } });

const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const page = document.documentElement;
  const ratio = page.scrollHeight - page.clientHeight;
  if (progress) progress.style.width = `${ratio ? (page.scrollTop / ratio) * 100 : 0}%`;
}, { passive: true });

const revealTargets = document.querySelectorAll('.project-card, .toolkit-card, .timeline-item, .status-card');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), { threshold: 0.08 });
revealTargets.forEach(item => { item.classList.add('reveal'); observer.observe(item); });
initTheme();
