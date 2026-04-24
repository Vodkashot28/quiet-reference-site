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

// Text-to-speech — human-like poetry reading
(function () {
  const btn = document.getElementById('btn-tts');
  if (!btn || !window.speechSynthesis) return;

  const section = document.querySelector('[aria-label="Poem text"]');
  if (!section) return;

  // Prefer a natural English voice; fall back to whatever is available.
  function pickVoice () {
    const voices = speechSynthesis.getVoices();
    const preferred = [
      'Samantha', 'Karen', 'Moira',          // macOS / iOS naturals
      'Google UK English Female',
      'Google US English',
      'Microsoft Aria Online',
      'Microsoft Jenny Online',
    ];
    for (const name of preferred) {
      const v = voices.find(function (v) { return v.name === name; });
      if (v) return v;
    }
    // Fall back to first en-* voice, then anything
    return voices.find(function (v) { return /^en/i.test(v.lang); }) || voices[0] || null;
  }

  // Convert raw poem text into SSML-style pauses by inserting silence markers.
  // Web Speech API doesn't support SSML in browsers, so we split into
  // per-line utterances with pauses between them for a natural cadence.
  function speakPoem () {
    const lines = section.innerText
      .split('\n')
      .map(function (l) { return l.trim(); });

    const voice = pickVoice();
    let i = 0;
    let cancelled = false;

    function speakLine () {
      if (cancelled || i >= lines.length) {
        if (!cancelled) btn.textContent = '▶ Listen';
        return;
      }

      const line = lines[i++];
      const u = new SpeechSynthesisUtterance(line || '\u00A0'); // blank line = breath pause
      if (voice) u.voice = voice;
      u.rate  = 0.82;   // slightly slower than natural speech — deliberate, not rushed
      u.pitch = 1.0;
      u.volume = 1.0;

      // Longer pause after blank lines (stanza breaks) and sentence-ending punctuation
      const isBlank     = line === '';
      const isSentence  = /[.!?]$/.test(line);
      const pauseMs     = isBlank ? 700 : isSentence ? 420 : 180;

      u.onend = function () {
        setTimeout(speakLine, pauseMs);
      };

      speechSynthesis.speak(u);
    }

    speakLine();
    btn.textContent = '■ Stop';

    return function cancel () { cancelled = true; };
  }

  let cancelSpeech = null;

  btn.addEventListener('click', function () {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      if (cancelSpeech) { cancelSpeech(); cancelSpeech = null; }
      speechSynthesis.cancel();
      btn.textContent = '▶ Listen';
      return;
    }
    // Voices may not be loaded yet on first interaction
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', function () {
        cancelSpeech = speakPoem();
      }, { once: true });
    } else {
      cancelSpeech = speakPoem();
    }
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

// Share: native (mobile) — pre-fills excerpt + URL
(function () {
  const btn = document.getElementById('btn-share');
  if (!btn) return;
  if (!navigator.share) { btn.style.display = 'none'; return; }
  btn.addEventListener('click', function () {
    const section = document.querySelector('[aria-label="Poem text"]');
    const firstLine = section
      ? section.innerText.split('\n').find(function (l) { return l.trim(); }) || ''
      : '';
    navigator.share({
      title: document.title,
      text: firstLine ? '\u201C' + firstLine.trim() + '\u201D \u2014 Quiet Reference' : document.title,
      url: location.href
    });
  });
})();
