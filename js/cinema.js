// cinema.js — cinematic word-by-word poem player
(function () {
  var btn = document.getElementById('btn-watch');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var section = document.querySelector('[aria-label="Poem text"]');
    var title = document.querySelector('article h1');
    if (!section) return;

    // Collect lines from poem text
    var rawText = section.innerText || section.textContent || '';
    var lines = rawText.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    // Build overlay
    var overlay = document.createElement('div');
    overlay.id = 'cinema-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cinematic poem player');

    var closeBtn = document.createElement('button');
    closeBtn.id = 'cinema-close';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close');

    var stage = document.createElement('div');
    stage.id = 'cinema-stage';

    var titleEl = document.createElement('div');
    titleEl.id = 'cinema-title';
    titleEl.textContent = title ? title.textContent : '';

    var lineEl = document.createElement('div');
    lineEl.id = 'cinema-line';

    var progress = document.createElement('div');
    progress.id = 'cinema-progress';
    var progressBar = document.createElement('div');
    progressBar.id = 'cinema-progress-bar';
    progress.appendChild(progressBar);

    stage.appendChild(titleEl);
    stage.appendChild(lineEl);
    overlay.appendChild(closeBtn);
    overlay.appendChild(stage);
    overlay.appendChild(progress);
    document.body.appendChild(overlay);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    var currentLine = 0;
    var timer = null;
    var closed = false;

    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      overlay.classList.add('cinema-fade-out');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
      }, 500);
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });

    function showLine(i) {
      if (closed || i >= lines.length) {
        // End: show title again, then close
        lineEl.style.opacity = '0';
        titleEl.style.opacity = '1';
        timer = setTimeout(close, 2800);
        return;
      }

      var line = lines[i];
      var pct = Math.round((i / lines.length) * 100);
      progressBar.style.width = pct + '%';

      // Fade out current
      lineEl.style.opacity = '0';
      lineEl.style.transform = 'translateY(8px)';

      timer = setTimeout(function () {
        if (closed) return;
        lineEl.textContent = line;
        lineEl.style.opacity = '1';
        lineEl.style.transform = 'translateY(0)';

        // Duration based on word count — ~400ms per word, min 1.2s, max 4s
        var words = line.split(/\s+/).length;
        var dur = Math.min(Math.max(words * 420, 1200), 4000);

        timer = setTimeout(function () { showLine(i + 1); }, dur);
      }, 350);
    }

    // Fade in overlay then start
    requestAnimationFrame(function () {
      overlay.classList.add('cinema-visible');
      titleEl.style.opacity = '1';
      timer = setTimeout(function () {
        titleEl.style.opacity = '0';
        timer = setTimeout(function () { showLine(0); }, 600);
      }, 1800);
    });
  });
})();
