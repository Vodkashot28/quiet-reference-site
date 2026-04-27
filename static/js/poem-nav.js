// Poem navigation: prev/next + reading time
(function () {
  var POEMS = [
    { slug: 'i-dont-owe-your-trust',                  title: 'I Don\'t Owe You Trust' },
    { slug: 'i-forgive-me',                            title: 'I Forgive Me' },
    { slug: 'im-not-the-villain-you-needed-me-to-be', title: 'I\'m Not the Villain You Needed Me to Be' },
    { slug: 'not-to-win-but-to-witness',               title: 'Not to Win, But to Witness' },
    { slug: 'what-i-want-myself-to-remember',          title: 'What I Want Myself to Remember' },
    { slug: 'what-i-want-you-to-know',                 title: 'What I Want You to Know' },
    { slug: 'what-ill-never-carry-again',              title: 'What I\'ll Never Carry Again' },
    { slug: 'i-choose-my-own-ending',                  title: 'I Choose My Own Ending' },
    { slug: 'i-refuse-silence',                        title: 'I Refuse Silence' },
    { slug: 'i-carry-my-own-light',                    title: 'I Carry My Own Light' },
    { slug: 'i-am-more-than-what-broke-me',            title: 'I Am More Than What Broke Me' },
    { slug: 'i-refuse-to-disappear',                   title: 'I Refuse to Disappear' },
    { slug: 'i-am-not-your-story',                     title: 'I Am Not Your Story' },
    { slug: 'i-hold-my-own-name',                      title: 'I Hold My Own Name' },
    { slug: 'i-am-the-quiet-rebuild',                  title: 'I Am the Quiet Rebuild' },
    { slug: 'i-refuse-the-weight-of-lies',             title: 'I Refuse the Weight of Lies' },
    { slug: 'i-am-the-keeper-of-boundaries',           title: 'I Am the Keeper of Boundaries' },
    { slug: 'i-refuse-to-be-defined-by-silence',       title: 'I Refuse to Be Defined by Silence' },
    { slug: 'i-am-the-continuance',                    title: 'I Am the Continuance' },
    { slug: 'i-refuse-to-inherit-shame',               title: 'I Refuse to Inherit Shame' },
    { slug: 'i-am-the-witness-of-repair',              title: 'I Am the Witness of Repair' },
    { slug: 'i-refuse-to-be-reduced',                  title: 'I Refuse to Be Reduced' },
    { slug: 'i-am-the-quiet-legacy',                   title: 'I Am the Quiet Legacy' },
  ];

  var current = window.location.pathname.replace(/\/$/, '').split('/').pop().replace('.html', '');
  var idx = POEMS.findIndex(function (p) { return p.slug === current; });
  if (idx === -1) return;

  // Reading time
  var section = document.querySelector('[aria-label="Poem text"]');
  if (section) {
    var words = section.innerText.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 200));
    var rt = document.createElement('p');
    rt.className = 'reading-time';
    rt.setAttribute('aria-label', 'Estimated reading time');
    rt.textContent = mins + ' min read';
    var h1 = document.querySelector('article h1');
    if (h1 && h1.nextSibling) h1.parentNode.insertBefore(rt, h1.nextSibling);
    else if (h1) h1.parentNode.appendChild(rt);
  }

  // Prev/Next nav
  var prev = idx > 0 ? POEMS[idx - 1] : null;
  var next = idx < POEMS.length - 1 ? POEMS[idx + 1] : null;
  if (!prev && !next) return;

  var root = (window.location.pathname.indexOf('/poems/') !== -1) ? '' : 'poems/';
  var nav = document.createElement('nav');
  nav.className = 'poem-nav';
  nav.setAttribute('aria-label', 'Poem navigation');
  nav.innerHTML =
    (prev ? '<a class="poem-nav-prev" href="' + root + prev.slug + '.html">← ' + prev.title + '</a>' : '<span></span>') +
    (next ? '<a class="poem-nav-next" href="' + root + next.slug + '.html">' + next.title + ' →</a>' : '<span></span>');

  var article = document.querySelector('article');
  if (article) article.appendChild(nav);
})();
