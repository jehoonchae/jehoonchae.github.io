(function () {
  const link = document.getElementById('name-pronunciation');
  const audio = document.getElementById('name-audio');
  const status = document.getElementById('pronunciation-status');
  if (!link || !audio || !status) return;

  link.addEventListener('click', function (event) {
    // Preserve opening the recording in another tab, and the no-JavaScript link.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    status.textContent = '';
    audio.currentTime = 0;
    audio.play().catch(function (error) {
      if (error.name === 'AbortError') return;
      status.textContent = 'Audio could not play. Try opening the pronunciation link in a new tab.';
    });
  });

  audio.addEventListener('playing', function () {
    link.classList.add('is-playing');
  });
  ['ended', 'pause', 'error'].forEach(function (event) {
    audio.addEventListener(event, function () {
      link.classList.remove('is-playing');
    });
  });
})();
