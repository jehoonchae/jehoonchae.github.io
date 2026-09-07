(function () {
  'use strict';

  var locations = [
    { lat: 43.061936, lng: 141.3542924, name: 'Sapporo, Japan' },
    { lat: 43.1906806, lng: 140.9946021, name: 'Otaru, Japan' },
    { lat: 42.923809, lng: 143.1966324, name: 'Obihiro, Japan' },
    { lat: 45.178379, lng: 141.2305018, name: 'Rishiri-to, Japan' },
    { lat: 45.4158108, lng: 141.6730309, name: 'Wakkanai, Japan' },
    { lat: 44.0206027, lng: 144.2732035, name: 'Abashiri, Japan' },
    { lat: 44.1757706, lng: 145.2214961, name: 'Shiretoko, Japan' },
    { lat: 42.9849503, lng: 144.3820491, name: 'Kushiro, Japan' },
    { lat: 26.3343738, lng: 127.8056597, name: 'Okinawa, Japan' },
    { lat: 22.2793278, lng: 114.1628131, name: 'Hong Kong, China' },
    { lat: 13.7544238, lng: 100.4930399, name: 'Bangkok, Thailand' },
    { lat: 43.1150678, lng: 131.8855768, name: 'Vladivostok, Russia' },
    { lat: 48.481403, lng: 135.076935, name: 'Khabarovsk, Russia' },
    { lat: 52.033409, lng: 113.500893, name: 'Chita, Russia' },
    { lat: 52.289597, lng: 104.280586, name: 'Irkutsk, Russia' },
    { lat: 53.1310477, lng: 107.3319654, name: 'Olhon, Russia' },
    { lat: 56.0090968, lng: 92.8725147, name: 'Krasnoyarsk, Russia' },
    { lat: 55.7504461, lng: 37.6174943, name: 'Moscow, Russia' },
    { lat: 59.938732, lng: 30.316229, name: 'Saint Petersburg, Russia' },
    { lat: 68.970665, lng: 33.07497, name: 'Murmansk, Russia' },
    { lat: 69.7271478, lng: 30.0448971, name: 'Kirkenes, Norway' },
    { lat: 70.0496276, lng: 23.0825401, name: 'Alta, Norway' },
    { lat: 69.649208, lng: 18.9543434, name: 'Troms\u00f8, Norway' },
    { lat: 68.2898839, lng: 17.0865387, name: 'Narvik, Norway' },
    { lat: 63.4305658, lng: 10.3951929, name: 'Trondheim, Norway' },
    { lat: 59.9133301, lng: 10.7389701, name: 'Oslo, Norway' },
    { lat: 66.4976214, lng: 25.7192101, name: 'Rovaniemi, Finland' },
    { lat: 65.0118734, lng: 25.4716809, name: 'Oulu, Finland' },
    { lat: 62.8241424, lng: 27.5945615, name: 'Kuopio, Finland' },
    { lat: 60.1674881, lng: 24.9427473, name: 'Helsinki, Finland' },
    { lat: 55.9533456, lng: -3.1883749, name: 'Edinburgh, United Kingdom' },
    { lat: 78.2231558, lng: 15.6463656, name: 'Longyearbyen, Norway' },
    { lat: 51.5073219, lng: -0.1276474, name: 'London, United Kingdom' },
    { lat: 64.145981, lng: -21.9422367, name: 'Reykjavik, Iceland' },
    { lat: 64.5383337, lng: -21.920208, name: 'Borgarnes, Iceland' },
    { lat: 64.2100527, lng: -20.7005841, name: 'Laugarvatn, Iceland' },
    { lat: 64.327316, lng: -20.1191026, name: 'Gullfoss, Iceland' },
    { lat: 64.0066500, lng: -19.1724130, name: 'Fjallabak, Iceland' },
    { lat: 63.6866761, lng: -19.5209964, name: '\u00de\u00f3rsm\u00f6rk, Iceland' },
    { lat: 63.4944482, lng: -19.0178276, name: 'M\u00fdrdalshreppur, Iceland' },
    { lat: 63.4564164, lng: -18.5062905, name: 'M\u00fdrdalssandur, Iceland' },
    { lat: 64.0164548, lng: -16.966458, name: 'Skaftafell, Iceland' },
    { lat: 64.0766956, lng: -16.2298265, name: 'Glacier Lagoon, Iceland' },
    { lat: 64.2919604, lng: -15.43819, name: 'Brunnhóll, Iceland' },
    { lat: 64.2532647, lng: -15.2080441, name: 'H\u00f6fn, Iceland' },
    { lat: 64.655775, lng: -14.2820953, name: 'Dj\u00fapivogur, Iceland' },
    { lat: 64.8174479, lng: -14.3807589, name: 'Fl\u00f6gufoss, Iceland' },
    { lat: 65.1730103, lng: -15.5945028, name: 'Flj\u00f3tsdalshr\u00e9ra\u00f0, Iceland' },
    { lat: 65.5269612, lng: -13.8161009, name: 'Bakkager\u00f0i, Iceland' },
    { lat: 66.0728193, lng: -15.2695629, name: 'Langanesbygg\u00f0, Iceland' },
    { lat: 65.5871038, lng: -20.325866, name: 'Skinnasta\u00f0ir, Iceland' },
    { lat: 65.8143387, lng: -16.3844308, name: 'Dettifoss, Iceland' },
    { lat: 65.6839036, lng: -18.1121756, name: 'Akureyri, Iceland' },
    { lat: 65.6601344, lng: -20.280998, name: 'Bl\u00f6ndu\u00f3sb\u00e6r, Iceland' },
    { lat: 50.1106444, lng: 8.6820917, name: 'Frankfurt, Germany' },
    { lat: 52.3727598, lng: 4.8936041, name: 'Amsterdam, Netherlands' },
    { lat: 52.3837058, lng: 4.6435597, name: 'Haarlem, Netherlands' },
    { lat: 52.7036282, lng: 5.2901222, name: 'Enkhuizen, Netherlands' },
    { lat: 53.1752103, lng: 5.4141998, name: 'Harlingen, Netherlands' },
    { lat: 39.4697065, lng: -0.3763353, name: 'Valencia, Spain' },
    { lat: 37.6267868, lng: -1.0006184, name: 'Cartagena, Spain' },
    { lat: 36.9399641, lng: -3.3615455, name: 'Pampaneira, Spain' },
    { lat: 36.9004942, lng: -3.4238759, name: '\u00d3rgiva, Spain' },
    { lat: 36.7468565, lng: -3.8790164, name: 'Nerja, Spain' },
    { lat: 36.7213028, lng: -4.4216366, name: 'M\u00e1laga, Spain' },
    { lat: 37.183054, lng: -3.6021928, name: 'Granada, Spain' },
    { lat: 37.9923795, lng: -1.1305431, name: 'Murcia, Spain' },
    { lat: 36.7421339, lng: -5.1665916, name: 'Ronda, Spain' },
    { lat: 36.8408744, lng: -5.3919341, name: 'Zahara de la Sierra, Spain' },
    { lat: 36.140807, lng: -5.3541295, name: 'Gibraltar' },
    { lat: -36.852095, lng: 172.7631803, name: 'Auckland, New Zealand' },
    { lat: -43.530955, lng: 172.6366455, name: 'Christchurch, New Zealand' },
    { lat: -43.904707, lng: 171.745897, name: 'Ashburton, New Zealand' },
    { lat: -43.8934482, lng: 170.5240212, name: 'Lake Tekapo, New Zealand' },
    { lat: -44.257483, lng: 170.0994145, name: 'Twizel, New Zealand' },
    { lat: -45.0321923, lng: 168.661, name: 'Queenstown, New Zealand' },
    { lat: -44.67184, lng: 167.9254592, name: 'Milford Sound, New Zealand' },
    { lat: -45.41449, lng: 167.717489, name: 'Te Anau, New Zealand' },
    { lat: 38.8949924, lng: -77.0365581, name: 'Washington, D.C.' },
    { lat: 40.7127281, lng: -74.0060152, name: 'New York, USA' },
    { lat: 37.5666791, lng: 126.9782914, name: 'Seoul, South Korea', home: true },
    { lat: 36.0189315, lng: 129.3429384, name: 'Pohang, South Korea' },
    { lat: 33.3939924, lng: 126.5626653, name: 'Jeju, South Korea' },
    { lat: 39.7392358, lng: -104.990251, name: 'Denver, USA' },
    { lat: 41.8781136, lng: -87.6297982, name: 'Chicago, USA' },
    { lat: 40.1105875, lng: -88.2072697, name: 'Urbana, USA' },
    { lat: 42.3600825, lng: -71.0588801, name: 'Boston, USA' },
    { lat: 34.052235, lng: -118.243683, name: 'Los Angeles, USA', home: true },
    { lat: 43.653225, lng: -79.383186, name: 'Toronto, Canada' },
    { lat: 42.2406, lng: -8.7207, name: 'Vigo, Spain' },
    { lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain' },
    { lat: 41.7151, lng: 44.8271, name: 'Tbilisi, Georgia' },
    { lat: 41.1579, lng: -8.6291, name: 'Porto, Portugal' },
    { lat: 36.1699, lng: -115.1398, name: 'Las Vegas, USA' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
    { lat: -28.0167, lng: 153.4000, name: 'Gold Coast, Australia' },
    { lat: 29.9511, lng: -90.0715, name: 'New Orleans, USA' },
    { lat: 32.7504, lng: -85.1802, name: 'Auburn, USA' },
    { lat: 44.0678, lng: 12.5695, name: 'Rimini, Italy' },
    { lat: 44.4949, lng: 11.3426, name: 'Bologna, Italy' },
    { lat: 43.7696, lng: 11.2558, name: 'Florence, Italy' }
  ];

  // Ring data for home locations
  var homeLocations = locations.filter(function (l) { return l.home; });

  var el = document.getElementById('travel-globe');

  function getGlobeSize() {
    var parent = el.parentElement;
    var parentWidth = parent.offsetWidth;
    var maxSize = 560;
    return Math.min(maxSize, parentWidth);
  }

  var size = getGlobeSize();

  var myGlobe = Globe()
    (el)
    .width(size)
    .height(size)
    .backgroundColor('rgba(0,0,0,0)')
    .showGlobe(true)
    .showAtmosphere(true)
    .atmosphereColor('rgba(100, 170, 255, 0.4)')
    .atmosphereAltitude(0.2)
    // Points layer
    .pointsData(locations)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor(function (d) { return d.home ? '#ff6b6b' : '#ffd700'; })
    .pointAltitude(function (d) { return d.home ? 0.04 : 0.015; })
    .pointRadius(function (d) { return d.home ? 0.45 : 0.28; })
    .pointLabel(function (d) {
      return '<div style="'
        + 'background:rgba(10,25,47,0.92);'
        + 'backdrop-filter:blur(10px);'
        + '-webkit-backdrop-filter:blur(10px);'
        + 'color:#e6f1ff;'
        + 'padding:8px 14px;'
        + 'border-radius:6px;'
        + 'font-family:Lato,sans-serif;'
        + 'font-size:13px;'
        + 'font-weight:400;'
        + 'letter-spacing:0.3px;'
        + 'border:1px solid rgba(100,180,255,0.15);'
        + 'box-shadow:0 4px 20px rgba(0,0,0,0.4);'
        + 'pointer-events:none;'
        + 'white-space:nowrap;'
        + '">'
        + (d.home ? '<span style="color:#ff6b6b;margin-right:4px">&#9679;</span>' : '')
        + d.name
        + '</div>';
    })
    .onPointHover(function (point) {
      el.style.cursor = point ? 'pointer' : 'grab';
    })
    // Pulsing rings at home locations
    .ringsData(homeLocations)
    .ringLat('lat')
    .ringLng('lng')
    .ringColor(function () {
      return function (t) { return 'rgba(255, 107, 107, ' + (0.6 * (1 - t)) + ')'; };
    })
    .ringMaxRadius(4)
    .ringPropagationSpeed(2)
    .ringRepeatPeriod(2500);

  // Custom globe material — dark navy ocean
  var globeMaterial = myGlobe.globeMaterial();
  globeMaterial.color.set('#06101e');
  globeMaterial.emissive.set('#040c16');
  globeMaterial.emissiveIntensity = 0.05;
  globeMaterial.shininess = 0.8;

  // Fetch and render country polygons
  fetch('//unpkg.com/world-atlas@2/countries-110m.json')
    .then(function (res) { return res.json(); })
    .then(function (worldData) {
      var countries = topojson.feature(worldData, worldData.objects.countries);
      myGlobe
        .polygonsData(countries.features)
        .polygonCapColor(function () { return 'rgba(40, 80, 140, 0.55)'; })
        .polygonSideColor(function () { return 'rgba(25, 55, 100, 0.2)'; })
        .polygonStrokeColor(function () { return 'rgba(80, 150, 220, 0.15)'; })
        .polygonAltitude(0.005);
    });

  // Initial view: centered on Seoul
  myGlobe.pointOfView({ lat: 37, lng: 127, altitude: 1.8 }, 0);

  // Auto-rotate
  var controls = myGlobe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.enableZoom = false;

  // Scene lighting adjustments
  var scene = myGlobe.scene();
  scene.children.forEach(function (child) {
    if (child.type === 'DirectionalLight') {
      child.intensity = 0.6;
    }
    if (child.type === 'AmbientLight') {
      child.intensity = 0.8;
    }
  });

  // Responsive resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newSize = getGlobeSize();
      myGlobe.width(newSize).height(newSize);
    }, 200);
  });
})();
