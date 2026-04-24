// card-export.js — render poem as a shareable image card
(function () {
  var btn = document.getElementById('btn-save-img');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var section = document.querySelector('[aria-label="Poem text"]');
    var titleEl = document.querySelector('article h1');
    if (!section) return;

    var title = titleEl ? titleEl.textContent.trim() : 'quiet reference';
    var lines = (section.innerText || section.textContent || '')
      .split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    var W = 900, H = 1200;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    // Background — dark gradient
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0e0c18');
    bg.addColorStop(1, '#1a1228');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grain overlay via noise pattern
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (var i = 0; i < 8000; i++) {
      var x = Math.random() * W;
      var y = Math.random() * H;
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();

    // Accent line top
    ctx.fillStyle = '#c49a6c';
    ctx.fillRect(60, 60, 120, 2);

    // Title
    ctx.fillStyle = '#e8e4de';
    ctx.font = 'italic 32px Georgia, serif';
    ctx.fillText(title, 60, 110);

    // Poem lines
    ctx.fillStyle = 'rgba(232, 228, 222, 0.88)';
    ctx.font = '22px Georgia, serif';
    var lineH = 38;
    var startY = 170;
    var maxLines = Math.floor((H - startY - 120) / lineH);
    var displayLines = lines.slice(0, maxLines);

    displayLines.forEach(function (line, i) {
      // Blank line between stanzas (empty string already filtered, but keep spacing)
      ctx.globalAlpha = 1 - (i / displayLines.length) * 0.15;
      ctx.fillText(line, 60, startY + i * lineH);
    });

    if (lines.length > maxLines) {
      ctx.globalAlpha = 0.4;
      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillText('…', 60, startY + maxLines * lineH);
    }

    // Footer
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#c49a6c';
    ctx.font = '15px Georgia, serif';
    ctx.fillText('quietreference.xyz', 60, H - 55);

    // Accent line bottom
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#c49a6c';
    ctx.fillRect(60, H - 40, 120, 1);

    // Download
    var slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var link = document.createElement('a');
    link.download = 'poem-' + slug + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
})();
