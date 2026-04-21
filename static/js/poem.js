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

// Stanza scroll-reveal via Intersection Observer
(function () {
  const section = document.querySelector('[aria-label="Poem text"]');
  if (!section) return;

  section.querySelectorAll('p').forEach(function (p) {
    const raw = p.innerHTML;
    const blocks = raw.split(/\n\s*\n/);
    if (blocks.length < 2) {
      const span = document.createElement('span');
      span.className = 'stanza';
      span.innerHTML = raw;
      p.innerHTML = '';
      p.appendChild(span);
      return;
    }
    p.innerHTML = blocks.map(function (b) {
      return '<span class="stanza">' + b.trim() + '</span>';
    }).join('\n\n');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  section.querySelectorAll('.stanza').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.12) + 's';
    observer.observe(el);
  });
})();

// Text-to-speech
(function () {
  const btn = document.getElementById('btn-tts');
  if (!btn || !window.speechSynthesis) return;

  const section = document.querySelector('[aria-label="Poem text"]');
  if (!section) return;

  let utterance = null;

  btn.addEventListener('click', function () {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      btn.textContent = '▶ Listen';
      return;
    }
    utterance = new SpeechSynthesisUtterance(section.innerText);
    utterance.rate = 0.85;
    utterance.onend = function () { btn.textContent = '▶ Listen'; };
    speechSynthesis.speak(utterance);
    btn.textContent = '■ Stop';
  });
})();

// Share: copy link
(function () {
  const btn = document.getElementById('btn-copy');
  if (!btn) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(location.href).then(function () {
      btn.textContent = '✓ Copied!';
      setTimeout(function () { btn.textContent = '🔗 Copy link'; }, 2000);
    });
  });
})();

// Share: Twitter / X
(function () {
  const btn = document.getElementById('btn-twitter');
  if (!btn) return;
  const text = encodeURIComponent(document.title + ' — ' + location.href);
  btn.href = 'https://twitter.com/intent/tweet?text=' + text;
})();

// Share: native (mobile)
(function () {
  const btn = document.getElementById('btn-share');
  if (!btn) return;
  if (!navigator.share) { btn.style.display = 'none'; return; }
  btn.addEventListener('click', function () {
    navigator.share({ title: document.title, url: location.href });
  });
})();
