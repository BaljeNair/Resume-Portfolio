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
  { keys: ['where has balje worked', 'where has he worked', 'employers', 'previous companies'], answer: 'Balje worked at <strong>NCS via Jobster</strong> as an Infrastructure Engineer from January 2021 to March 2023; <strong>HCL for British Petroleum</strong> as a Specialist E2 from March 2023 to August 2024; and <strong>Capgemini</strong> as a Consultant from February to May 2025.' },
  { keys: ['how many years', 'years of experience', 'how much experience'], answer: 'Balje has <strong>4+ years of enterprise IT experience</strong> covering January 2021 to May 2025 across NCS, HCL / British Petroleum, and Capgemini.' },
  { keys: ['roles looking', 'target roles', 'what roles', 'looking for'], answer: 'He is targeting <strong>Senior IT Support, Endpoint Engineering, and Infrastructure / Service Delivery</strong> roles in Singapore.' },
  { keys: ['what did he do at capgemini', 'capgemini role', 'capgemini experience'], answer: 'At Capgemini, Balje supported about <strong>80–100 users</strong> in the Singapore office and handled roughly <strong>30–40 ServiceNow tickets per week</strong> alongside Microsoft 365 support. He also deputised for the APAC IT Manager, led cross-regional support calls, and liaised with Directors and VPs on escalations.' },
  { keys: ['what did he do at hcl', 'hcl bp', 'british petroleum', 'bp role'], answer: 'At HCL supporting British Petroleum, Balje provided first-line desktop support for <strong>300+ users</strong> across multiple locations, including endpoint imaging, BitLocker, MFA, device management, procurement, audits, and Bloomberg / Refinitiv trading-terminal support.' },
  { keys: ['strongest skills', 'best skills', 'core skills'], answer: 'His strongest skills include Microsoft 365, Entra ID / Active Directory, Intune / Autopilot, SCCM, ServiceNow, Windows 10/11, macOS, BitLocker, MFA and Conditional Access, desktop break-fix, and Teams / Zoom Rooms AV support.' },
  { keys: ['macos experience', 'mac experience', 'apple business manager', 'abm experience'], answer: 'Yes. Balje has macOS and Apple Business Manager experience, including iPhone / mobile device management. He is also currently brushing up on macOS and ABM administration.' },
  { keys: ['av experience', 'meeting room', 'teams rooms', 'zoom rooms', 'polycom', 'logitech'], answer: 'Yes. He performed daily Teams / Zoom Rooms checks at BP and Capgemini, worked with Polycom and Logitech equipment, and supported high-profile leadership events.' },
  { keys: ['okta', 'jamf'], answer: 'Balje is currently learning Okta and Jamf. His hands-on production experience is with Entra ID / Active Directory and Intune / Autopilot / Apple Business Manager.' },
  { keys: ['datacenter', 'data center', 'multi-cloud', 'multicloud', 'cloud experience'], answer: 'Balje does not have datacenter or multi-cloud experience. His background is focused on endpoint and desktop support, Microsoft 365, and Entra ID.' },
  { keys: ['operations lab', 'endpoint readiness', 'jml', 'joiner mover leaver', 'knowledge assistant'], answer: 'The <a href="projects/endpoint-readiness/">Endpoint Refresh Readiness Checker</a>, <a href="projects/jml-workflow/">Joiner–Mover–Leaver Workflow Simulator</a>, and <a href="projects/it-support-assistant/">IT Support Knowledge Assistant</a> are the three Operations Lab projects. All use synthetic or anonymised demo data and do not connect to production systems.' },
  { keys: ['what are his projects', 'projects on the site', 'projects does he have'], answer: 'There are three Operations Lab projects: the <a href="projects/endpoint-readiness/">Endpoint Refresh Readiness Checker</a>, the <a href="projects/jml-workflow/">Joiner–Mover–Leaver Workflow Simulator</a>, and the <a href="projects/it-support-assistant/">IT Support Knowledge Assistant</a>. They use synthetic or anonymised demo data.' },
  { keys: ['ncs case study', 'windows case study', 'what is the ncs case study'], answer: 'The <a href="case-studies/windows-baseline.html">NCS case study</a> covers a self-started project building a Windows 10 Enterprise baseline from scratch on one machine, using Group Policy for password and removable-media controls, with fast USB imaging from a vanilla image.' },
  { keys: ['capgemini case study', 'what is the capgemini case study'], answer: 'The <a href="case-studies/apac-service-delivery.html">Capgemini case study</a> covers service delivery and escalation handling: roughly 30–40 tickets per week for 80–100 Singapore users, deputising for the APAC IT Manager, and handling C-level communications.' },
  { keys: ['case stud', 'case-study', 'windows baseline', 'apac service', 'service delivery'], answer: 'There are two professional case studies: <a href="case-studies/windows-baseline.html">Windows enterprise baseline</a> covers a one-machine endpoint engineering mini-project, while <a href="case-studies/apac-service-delivery.html">APAC service delivery</a> covers ticket volume, escalation ownership, and executive stakeholder coordination.' },
  { keys: ['skill', 'tool', 'technical', 'good at'], answer: 'Balje works across endpoint support, identity and device management, ITSM, AV readiness, and practical scripting. His core tools include ServiceNow, Entra ID, Intune, SCCM, ABM, Microsoft 365, Python, and JavaScript.' },
  { keys: ['worked', 'experience', 'company', 'role'], answer: 'Balje has 4+ years of enterprise IT experience (Jan 2021 – May 2025) across NCS, HCL / British Petroleum, and Capgemini. He is currently open to work; his most recent role was Consultant at Capgemini (February–May 2025).' },
  { keys: ['project', 'built', 'achievement'], answer: 'Selected work includes a Windows enterprise baseline mini-project at NCS, APAC escalation leadership at Capgemini, executive AV readiness at BP and Capgemini, and ServiceNow-led onboarding and offboarding workflows.' },
  { keys: ['open', 'available', 'hire', 'work'], answer: 'Yes — Balje is open to work and immediately available in Singapore. He is a Singaporean citizen and is targeting senior IT support, endpoint engineering, and infrastructure / service delivery roles.' },
  { keys: ['education', 'study', 'degree'], answer: 'Balje holds a Diploma in InfoComm Technology from PSB Academy and studied Mechatronics at Temasek Polytechnic. His BSc (Hons) Computing Science at Coventry University via PSB Academy is in progress and expected in August 2027.' },
  { keys: ['certification', 'certifications', 'itil', 'google ai', 'ai essentials', 'agentic ai', 'course'], answer: 'Balje completed Agentic Artificial Intelligence for Business Processes at Republic Polytechnic on 24–25 October 2026 and Google AI Essentials in October 2025. ITIL 4 Foundation status is to be confirmed; it should not be presented as completed.' },
  { keys: ['language'], answer: 'English and Tamil are fluent. Mandarin and Tagalog are elementary.' },
  { keys: ['contact', 'email', 'linkedin', 'github'], answer: 'You can contact Balje at <a href="mailto:BaljeNair@gmail.com">BaljeNair@gmail.com</a>, or through <a href="https://www.linkedin.com/in/balje-nair-5735191b9" target="_blank" rel="noopener">LinkedIn</a> and <a href="https://github.com/BaljeNair" target="_blank" rel="noopener">GitHub</a>.' },
  { keys: ['salary', 'salary expectation', 'expected salary', 'pay'], answer: 'Balje prefers to discuss salary directly depending on the role. Please contact him at <a href="mailto:BaljeNair@gmail.com">BaljeNair@gmail.com</a> to discuss it.' }
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
  const paragraph = document.createElement('p');
  if (role === 'bot') paragraph.innerHTML = text;
  else paragraph.textContent = text;
  item.appendChild(paragraph);
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
