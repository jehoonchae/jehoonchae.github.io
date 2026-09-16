(function () {
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // The text alternative stays available even if the map libraries cannot load.
  const countries = new Map();
  TRAVEL_PLACES.forEach(function (place) {
    const parts = place.name.match(/^(.*) \(([^)]+)\)$/);
    const country = parts ? parts[2] : 'Other places';
    if (!countries.has(country)) countries.set(country, []);
    countries.get(country).push(parts ? parts[1] : place.name);
  });
  const list = document.getElementById('places-list');
  Array.from(countries.keys()).sort().forEach(function (country) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = country;
    description.textContent = countries.get(country).sort().join(', ');
    list.append(term, description);
  });
  document.querySelector('.places-index summary').textContent = 'Browse all ' + TRAVEL_PLACES.length + ' places';

  const container = document.getElementById('travel-map');
  let started = false;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadMap() {
    if (started) return;
    started = true;
    container.setAttribute('aria-busy', 'true');
    container.querySelector('.map-placeholder').textContent = 'Loading map…';
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js')
    ])
      .then(function () { return loadScript('js/travel-map.js?v=7'); })
      .catch(function () {
        container.setAttribute('aria-busy', 'false');
        container.querySelector('.map-placeholder').textContent = 'The map is unavailable. You can still browse the places below.';
      });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        observer.disconnect();
        loadMap();
      }
    }, { rootMargin: '320px' });
    observer.observe(container);
  } else {
    loadMap();
  }
})();
