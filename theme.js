(() => {
  const body = document.body;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  const storageKey = 'portfolio-theme';
  const update = () => {
    const light = body.classList.contains('light-theme');
    toggles.forEach(toggle => {
      toggle.textContent = light ? '☼' : '◐';
      toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      toggle.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
  };
  if (localStorage.getItem(storageKey) === 'light') body.classList.add('light-theme');
  toggles.forEach(toggle => toggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    localStorage.setItem(storageKey, body.classList.contains('light-theme') ? 'light' : 'dark');
    update();
  }));
  update();
})();
