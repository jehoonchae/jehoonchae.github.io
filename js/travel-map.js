// A small, responsive atlas. Markers stay the same physical size as the map zooms.
(function () {
  const container = document.getElementById('travel-map');
  if (!container) return;
  const placeholder = container.querySelector('.map-placeholder');
  if (placeholder) placeholder.remove();
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined' || typeof TRAVEL_PLACES === 'undefined') {
    const message = document.createElement('p');
    message.className = 'map-status';
    message.textContent = 'The travel map is temporarily unavailable.';
    container.appendChild(message);
    return;
  }

  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
  const maxZoom = 24;
  const clusterDistance = 23;
  const instruction = 'Select a dot to see the place. Drag to explore.';
  const places = TRAVEL_PLACES.map(function (place, id) {
    const parts = place.name.match(/^(.*) \(([^)]+)\)$/);
    return { ...place, id, city: parts ? parts[1] : place.name, country: parts ? parts[2] : '', point: [0, 0] };
  });
  const regions = [
    { name: 'World', includes: function () { return true; } },
    { name: 'Europe', includes: function (p) { return p.lon >= -30 && p.lon <= 45 && p.lat > 34; } },
    { name: 'Asia', includes: function (p) { return p.lon > 45 && p.lat >= 0; } },
    { name: 'Americas', includes: function (p) { return p.lon < -30; } },
    { name: 'Oceania', includes: function (p) { return p.lon > 90 && p.lat < 0; } }
  ];
  let width = 0;
  let height = 0;
  let ready = false;
  let currentRegion = 'World';
  let selectedId = null;
  let transform = d3.zoomIdentity;
  let worldFeatures;

  container.setAttribute('role', 'region');
  container.setAttribute('aria-busy', 'true');

  const toolbar = d3.select(container).append('div').attr('class', 'map-toolbar');
  const regionNav = toolbar.append('div').attr('class', 'map-regions')
    .attr('role', 'group').attr('aria-label', 'Map regions');
  const regionButtons = regionNav.selectAll('button').data(regions).join('button')
    .attr('type', 'button').attr('disabled', true)
    .attr('aria-pressed', function (r) { return r.name === currentRegion; })
    .text(function (r) { return r.name; })
    .on('click', function (event, region) { showRegion(region); });
  const zoomControls = toolbar.append('div').attr('class', 'map-zoom-controls')
    .attr('role', 'group').attr('aria-label', 'Map zoom');
  const zoomOut = zoomControls.append('button').attr('type', 'button').attr('disabled', true)
    .attr('aria-label', 'Zoom out').attr('title', 'Zoom out').text('−')
    .on('click', function () { changeZoom(1 / 1.6); });
  const zoomIn = zoomControls.append('button').attr('type', 'button').attr('disabled', true)
    .attr('aria-label', 'Zoom in').attr('title', 'Zoom in').text('+')
    .on('click', function () { changeZoom(1.6); });

  const stage = d3.select(container).append('div').attr('class', 'map-stage');
  const svg = stage.append('svg').attr('class', 'map-canvas')
    .attr('role', 'group').attr('tabindex', 0)
    .attr('aria-label', 'Travel map. Use arrow keys to pan, plus and minus to zoom, and Home for the world view.');
  const gMap = svg.append('g').attr('class', 'map-geography').attr('aria-hidden', 'true');
  const gDots = svg.append('g').attr('class', 'map-places');
  const tooltip = stage.append('div').attr('class', 'map-tooltip').attr('aria-hidden', 'true').attr('hidden', true);
  let hideTooltipTimer;
  function hideTooltip() {
    window.clearTimeout(hideTooltipTimer);
    tooltip.attr('hidden', true);
  }
  function delayHideTooltip() {
    window.clearTimeout(hideTooltipTimer);
    hideTooltipTimer = window.setTimeout(hideTooltip, 180);
  }
  tooltip.on('mouseenter', function () { window.clearTimeout(hideTooltipTimer); })
    .on('mouseleave', delayHideTooltip);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') hideTooltip();
  });
  const readout = d3.select(container).append('p').attr('class', 'map-readout')
    .attr('role', 'status').attr('aria-live', 'polite').attr('aria-atomic', true)
    .text('Loading map…');
  const projection = d3.geoNaturalEarth1().rotate([-11, 0]);
  const path = d3.geoPath(projection);

  function updateControls() {
    regionButtons.attr('disabled', ready ? null : true)
      .attr('aria-pressed', function (r) { return r.name === currentRegion; });
    zoomOut.attr('disabled', !ready || transform.k <= 1.001 ? true : null);
    zoomIn.attr('disabled', !ready || transform.k >= maxZoom - 0.001 ? true : null);
  }

  function clearSelection() {
    selectedId = null;
    readout.text(instruction);
    gDots.selectAll('.map-dot').classed('is-selected', false);
  }

  function describe(cluster) {
    readout.text('');
    if (cluster.items.length === 1) {
      const place = cluster.items[0];
      readout.append('span').attr('class', 'map-place-name').text(place.city);
      readout.append('span').text(' · ' + place.country);
    } else {
      const countries = Array.from(new Set(cluster.items.map(function (p) { return p.country; })));
      readout.append('span').attr('class', 'map-place-name').text(cluster.items.length + ' places');
      readout.append('span').text(' · ' + countries.join(', '));
      if (transform.k >= maxZoom - 0.001) {
        readout.append('span').attr('class', 'map-place-list')
          .text(cluster.items.map(function (p) { return p.city; }).join(', '));
      }
    }
  }

  function clusterize() {
    const clusters = [];
    places.forEach(function (place) {
      const x = transform.applyX(place.point[0]);
      const y = transform.applyY(place.point[1]);
      const hit = clusters.find(function (c) { return Math.hypot(c.x - x, c.y - y) < clusterDistance; });
      if (hit) {
        hit.items.push(place);
        hit.x += (x - hit.x) / hit.items.length;
        hit.y += (y - hit.y) / hit.items.length;
      } else {
        clusters.push({ x, y, items: [place] });
      }
    });
    function radius(c) {
      return c.items.length > 1 ? Math.min(10 + Math.log2(c.items.length), 14) : 3.5;
    }
    // A moving cluster center can approach a neighbor; merge again until badges
    // have enough room. This keeps dense regions readable at every zoom level.
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < clusters.length && !merged; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const a = clusters[i], b = clusters[j];
          if (Math.hypot(a.x - b.x, a.y - b.y) < radius(a) + radius(b) + 4) {
            const count = a.items.length + b.items.length;
            a.x = (a.x * a.items.length + b.x * b.items.length) / count;
            a.y = (a.y * a.items.length + b.y * b.items.length) / count;
            a.items.push(...b.items);
            clusters.splice(j, 1);
            merged = true;
            break;
          }
        }
      }
    }
    return clusters.map(function (c) {
      c.key = c.items.map(function (p) { return p.id; }).sort(function (a, b) { return a - b; }).join('-');
      c.radius = radius(c);
      return c;
    }).filter(function (c) {
      return c.x >= 0 && c.x <= width && c.y >= 0 && c.y <= height;
    });
  }

  function positionTooltip(event, cluster) {
    const pointer = [cluster.x, cluster.y];
    const tooltipNode = tooltip.node();
    const left = Math.max(0, Math.min(pointer[0] + 14, width - tooltipNode.offsetWidth));
    const above = pointer[1] - tooltipNode.offsetHeight - 12;
    const top = Math.max(0, Math.min(above > 0 ? above : pointer[1] + 16, height - tooltipNode.offsetHeight));
    tooltip.style('left', left + 'px').style('top', top + 'px');
  }

  function showTooltip(event, cluster) {
    window.clearTimeout(hideTooltipTimer);
    tooltip.text('');
    if (cluster.items.length === 1) {
      tooltip.append('span').attr('class', 'map-place-name').text(cluster.items[0].city);
      tooltip.append('span').text(cluster.items[0].country);
    } else {
      tooltip.append('span').attr('class', 'map-place-name').text(cluster.items.length + ' places');
      tooltip.append('span').text(cluster.items.slice(0, 6).map(function (p) { return p.city; }).join(', ') + (cluster.items.length > 6 ? ', …' : ''));
    }
    tooltip.attr('hidden', null);
    positionTooltip(event, cluster);
  }

  function targetFor(items, minimumZoom) {
    const xExtent = d3.extent(items, function (p) { return p.point[0]; });
    const yExtent = d3.extent(items, function (p) { return p.point[1]; });
    const padding = Math.min(width, height) * 0.17;
    const scale = Math.min(maxZoom, Math.max(minimumZoom || 1, Math.min(
      (width - padding * 2) / Math.max(xExtent[1] - xExtent[0], 1),
      (height - padding * 2) / Math.max(yExtent[1] - yExtent[0], 1)
    )));
    return d3.zoomIdentity.translate(width / 2, height / 2).scale(scale)
      .translate(-(xExtent[0] + xExtent[1]) / 2, -(yExtent[0] + yExtent[1]) / 2);
  }

  function moveTo(target, animate) {
    const constrained = zoom.constrain()(target, [[0, 0], [width, height]], zoom.translateExtent());
    svg.interrupt();
    if (animate && duration) svg.transition().duration(duration).call(zoom.transform, constrained);
    else svg.call(zoom.transform, constrained);
  }

  function activate(event, cluster) {
    hideTooltip();
    if (cluster.items.length === 1) {
      selectedId = cluster.items[0].id;
      describe(cluster);
      renderDots();
      return;
    }
    selectedId = null;
    currentRegion = null;
    describe(cluster);
    // Keep keyboard focus on a stable element while the cluster separates.
    if (event.type === 'keydown') svg.node().focus({ preventScroll: true });
    moveTo(targetFor(cluster.items, Math.min(transform.k * 1.8, maxZoom)), true);
  }

  function renderDots() {
    const dots = gDots.selectAll('.map-dot').data(clusterize(), function (c) { return c.key; }).join(
      function (enter) {
        const group = enter.append('g').attr('class', 'map-dot').attr('role', 'button').attr('tabindex', 0);
        group.append('circle').attr('class', 'map-hit-area').attr('r', 14);
        group.append('circle').attr('class', 'map-marker');
        group.append('text').attr('class', 'map-count').attr('text-anchor', 'middle').attr('dy', '0.35em');
        group.append('text').attr('class', 'map-city-label').attr('aria-hidden', 'true').attr('dy', '0.35em');
        return group;
      }
    );
    dots.attr('transform', function (c) { return 'translate(' + c.x + ',' + c.y + ')'; })
      .attr('aria-label', function (c) {
        if (c.items.length === 1) return c.items[0].name;
        const countries = Array.from(new Set(c.items.map(function (p) { return p.country; })));
        return c.items.length + ' places in ' + countries.join(', ') + '. Select to explore.';
      })
      .classed('is-selected', function (c) { return c.items.length === 1 && c.items[0].id === selectedId; });
    dots.select('.map-marker').attr('r', function (c) { return c.radius; });
    dots.select('.map-count').text(function (c) { return c.items.length > 1 ? c.items.length : ''; });
    // City names appear only when there is room, never over another marker.
    const labelBoxes = [];
    const markerBoxes = [];
    dots.each(function (c) {
      markerBoxes.push({ x: c.x - c.radius - 3, y: c.y - c.radius - 3, w: (c.radius + 3) * 2, h: (c.radius + 3) * 2 });
    });
    dots.each(function (c) {
      const label = d3.select(this).select('.map-city-label').text('');
      if (transform.k < 4.5 || c.items.length !== 1) return;
      label.text(c.items[0].city);
      const labelWidth = label.node().getComputedTextLength();
      const candidates = [
        { x: c.x + 9, y: c.y - 8, w: labelWidth, h: 16, anchor: 'start', offset: 9 },
        { x: c.x - 9 - labelWidth, y: c.y - 8, w: labelWidth, h: 16, anchor: 'end', offset: -9 }
      ];
      const box = candidates.find(function (candidate) {
        return candidate.x >= 4 && candidate.x + candidate.w <= width - 4 && candidate.y >= 0 && candidate.y + candidate.h <= height &&
          !markerBoxes.concat(labelBoxes).some(function (other) {
            return candidate.x < other.x + other.w && candidate.x + candidate.w > other.x && candidate.y < other.y + other.h && candidate.y + candidate.h > other.y;
          });
      });
      if (box) {
        label.attr('text-anchor', box.anchor).attr('x', box.offset);
        labelBoxes.push(box);
      } else label.text('');
    });
    dots.on('mouseenter', showTooltip)
      .on('mouseleave', delayHideTooltip)
      .on('focus', function (event, c) { showTooltip(event, c); })
      .on('blur', hideTooltip)
      .on('click', function (event, c) { event.stopPropagation(); activate(event, c); })
      .on('keydown', function (event, c) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          activate(event, c);
        } else if (event.key === 'Escape') {
          hideTooltip();
          clearSelection();
        }
      });
  }

  const zoom = d3.zoom().scaleExtent([1, maxZoom]).clickDistance(4)
    .extent(function () { return [[0, 0], [width, height]]; })
    .filter(function (event) {
      if (!ready) return false;
      if (event.type === 'wheel') return event.ctrlKey || event.metaKey;
      return !event.button;
    })
    .on('start', function (event) {
      hideTooltip();
      if (event.sourceEvent) currentRegion = null;
    })
    .on('zoom', function (event) {
      transform = event.transform;
      gMap.attr('transform', transform);
      renderDots();
      updateControls();
    });

  function showRegion(region) {
    if (!ready) return;
    currentRegion = region.name;
    clearSelection();
    moveTo(region.name === 'World' ? d3.zoomIdentity : targetFor(places.filter(region.includes)), true);
  }

  function changeZoom(factor) {
    if (!ready) return;
    currentRegion = null;
    hideTooltip();
    svg.interrupt().transition().duration(duration).call(zoom.scaleBy, factor);
  }

  svg.call(zoom).on('dblclick.zoom', null)
    .on('dblclick', function () { showRegion(regions[0]); })
    .on('click', function () { clearSelection(); hideTooltip(); })
    .on('keydown', function (event) {
      if (!ready || event.target !== svg.node()) return;
      const offsets = { ArrowLeft: [48, 0], ArrowRight: [-48, 0], ArrowUp: [0, 48], ArrowDown: [0, -48] };
      if (offsets[event.key]) {
        event.preventDefault();
        currentRegion = null;
        svg.interrupt().call(zoom.translateBy, offsets[event.key][0] / transform.k, offsets[event.key][1] / transform.k);
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault(); changeZoom(1.6);
      } else if (event.key === '-') {
        event.preventDefault(); changeZoom(1 / 1.6);
      } else if (event.key === 'Home') {
        event.preventDefault(); showRegion(regions[0]);
      } else if (event.key === 'Escape') {
        clearSelection(); hideTooltip();
      }
    });

  function resize() {
    const nextWidth = Math.round(container.clientWidth);
    if (!ready || !nextWidth || nextWidth === width) return;
    const oldCenter = width ? projection.invert(transform.invert([width / 2, height / 2])) : null;
    const oldScale = transform.k;
    width = nextWidth;
    height = Math.round(width * (width < 480 ? 0.8 : 0.54));
    svg.attr('viewBox', [0, 0, width, height]);
    projection.fitExtent([[12, 12], [width - 12, height - 12]], worldFeatures);
    places.forEach(function (p) { p.point = projection([p.lon, p.lat]); });
    gMap.selectAll('path').attr('d', path);
    zoom.translateExtent([[-width * 0.1, -height * 0.1], [width * 1.1, height * 1.1]]);
    const region = regions.find(function (r) { return r.name === currentRegion; });
    let target = d3.zoomIdentity;
    if (region && region.name !== 'World') target = targetFor(places.filter(region.includes));
    else if (!region && oldCenter) {
      const center = projection(oldCenter);
      target = d3.zoomIdentity.translate(width / 2, height / 2).scale(oldScale).translate(-center[0], -center[1]);
    }
    moveTo(target, false);
  }

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
    .catch(function () { return d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'); })
    .then(function (world) {
      const countries = topojson.feature(world, world.objects.countries).features
        .filter(function (d) { return d.properties.name !== 'Antarctica'; });
      worldFeatures = { type: 'FeatureCollection', features: countries };
      gMap.selectAll('path').data(countries).join('path').attr('class', 'map-country')
        .attr('vector-effect', 'non-scaling-stroke');
      ready = true;
      container.setAttribute('aria-busy', 'false');
      clearSelection();
      resize();
      new ResizeObserver(resize).observe(container);
    }).catch(function () {
      ready = false;
      toolbar.remove();
      stage.remove();
      container.setAttribute('aria-busy', 'false');
      readout.attr('class', 'map-status').text('The map is unavailable. You can still browse the places below.');
    });
})();
