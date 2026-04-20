// Dark mode toggle
(function () {
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  if (btn) {
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
    btn.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '☀' : '☾';
    });
  }
})();
