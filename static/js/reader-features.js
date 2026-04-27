(function () {
  var STORAGE_KEY = 'qr_bookmarks';
  var btn = document.getElementById('btn-bookmark');
  var countEl = document.getElementById('bookmark-count');
  if (!btn) return;

  var slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
  var title = document.querySelector('article h1')?.textContent || slug;

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function setBookmarks(bookmarks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }

  function showNotification(message) {
    var notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(function () { notif.remove(); }, 3000);
  }

  function render(bookmarks) {
    var saved = bookmarks.some(function (b) { return b.slug === slug; });
    btn.querySelector('.bookmark-icon').textContent = saved ? '♥' : '♡';
    btn.querySelector('.bookmark-text').textContent = saved ? 'Saved' : 'Add to Favorites';
    btn.setAttribute('aria-pressed', String(saved));
    if (countEl) {
      countEl.textContent = bookmarks.length ? bookmarks.length + ' saved' : '';
      countEl.style.display = bookmarks.length ? '' : 'none';
    }
  }

  render(getBookmarks());

  btn.addEventListener('click', function () {
    var bookmarks = getBookmarks();
    var idx = bookmarks.findIndex(function (b) { return b.slug === slug; });
    if (idx === -1) {
      bookmarks.push({ slug: slug, title: title, url: window.location.pathname, dateAdded: new Date().toISOString() });
      showNotification('Added to favorites ♥');
    } else {
      bookmarks.splice(idx, 1);
      showNotification('Removed from favorites');
    }
    setBookmarks(bookmarks);
    render(bookmarks);
  });
})();
