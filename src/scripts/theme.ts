const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle');

if (toggle) {
  const updateButton = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', `Use ${dark ? 'light' : 'dark'} theme`);
  };

  toggle.hidden = false;
  updateButton();
  toggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    updateButton();
    try {
      localStorage.setItem('ph_theme', theme);
    } catch {
      // Theme still changes for this visit when storage is unavailable.
    }
  });
}
