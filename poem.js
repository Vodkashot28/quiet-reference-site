// Reading progress bar
(function () {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '100%';
  });
})();
