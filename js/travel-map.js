// Travel map rendered with D3 (Natural Earth projection, coastline style).
// Nearby places merge into one larger dot (area proportional to count) whose
// tooltip lists every place; clicking a merged dot zooms into that area.
// Zoom: pinch or ctrl/cmd + scroll, drag to pan, double-click to reset.
(function () {
  const container = document.getElementById('travel-map');
  const width = 960;
  const height = 500;
  const CLUSTER_PX = 14;      // merge dots closer than this (screen px)
  const BASE_R = 3;

  container.style.position = 'relative';

  const svg = d3.select(container).append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('display', 'block')
    .style('width', '100%')
    .style('height', 'auto');

  const tooltip = d3.select(container).append('div')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('visibility', 'hidden')
    .style('background', '#ffffff')
    .style('color', '#444444')
    .style('font-size', '13px')
    .style('line-height', '1.45')
    .style('padding', '5px 9px')
    .style('border', '1px solid #c3cfd8')
    .style('border-radius', '3px')
    .style('box-shadow', '0 1px 4px rgba(0,0,0,0.12)')
    .style('white-space', 'nowrap');

  const hint = d3.select(container).append('div')
    .style('text-align', 'right')
    .style('font-size', '11px')
    .style('color', '#a5a5a5')
    .style('margin-top', '2px')
    .text('Click a larger dot to zoom in · pinch or ctrl+scroll to zoom · double-click to reset');

  const projection = d3.geoNaturalEarth1()
    .rotate([-11, 0])
    .fitExtent([[2, 2], [width - 2, height - 2]], { type: 'Sphere' });
  const path = d3.geoPath(projection);

  const gMap = svg.append('g');
  const gDots = svg.append('g');

  const places = TRAVEL_PLACES.map(function (d) {
    return { name: d.name, p: projection([d.lon, d.lat]) };
  });

  let transform = d3.zoomIdentity;
  let sphereSel, borderSel, coastSel;

  function clusterize(t) {
    const clusters = [];
    places.forEach(function (d) {
      const x = t.applyX(d.p[0]);
      const y = t.applyY(d.p[1]);
      let hit = null;
      for (const c of clusters) {
        if (Math.hypot(c.x - x, c.y - y) < CLUSTER_PX) { hit = c; break; }
      }
      if (hit) {
        hit.items.push(d);
        hit.x += (x - hit.x) / hit.items.length;
        hit.y += (y - hit.y) / hit.items.length;
      } else {
        clusters.push({ x: x, y: y, items: [d] });
      }
    });
    // Dots grow gently as you zoom in (sqrt of zoom, so they never swallow the map)
    const boost = Math.sqrt(t.k);
    clusters.forEach(function (c) {
      c.r = Math.min(BASE_R * Math.sqrt(c.items.length), 13) * boost;
    });
    return clusters;
  }

  function tooltipHtml(c) {
    const names = c.items.map(function (d) { return d.name; });
    let shown = names.slice(0, 12);
    let html = shown.join('<br>');
    if (names.length > 12) html += '<br><em>+ ' + (names.length - 12) + ' more - click to zoom</em>';
    return html;
  }

  function zoomToCluster(c) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    c.items.forEach(function (d) {
      x0 = Math.min(x0, d.p[0]); y0 = Math.min(y0, d.p[1]);
      x1 = Math.max(x1, d.p[0]); y1 = Math.max(y1, d.p[1]);
    });
    const spanX = Math.max(x1 - x0, 1e-6);
    const spanY = Math.max(y1 - y0, 1e-6);
    let k = 0.35 / Math.max(spanX / width, spanY / height);
    k = Math.max(Math.min(k, 8), Math.min(transform.k * 2.5, 8));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const t = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(k)
      .translate(-cx, -cy);
    svg.transition().duration(600).call(zoom.transform, t);
  }

  function renderDots() {
    const data = clusterize(transform);
    gDots.selectAll('g.dot').remove();
    const g = gDots.selectAll('g.dot').data(data).join('g')
      .attr('class', 'dot')
      .attr('transform', function (c) { return 'translate(' + c.x + ',' + c.y + ')'; })
      .style('cursor', function (c) { return c.items.length > 1 ? 'pointer' : 'default'; });

    g.append('circle')
      .attr('r', function (c) { return c.r; })
      .attr('fill', '#2774ae')
      .attr('fill-opacity', function (c) { return c.items.length > 1 ? 0.88 : 1; })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1);

    g.filter(function (c) { return c.items.length > 2; })
      .append('text')
      .text(function (c) { return c.items.length; })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', function (c) { return Math.min(c.r * 1.1, 11 * Math.sqrt(transform.k)) + 'px'; })
      .attr('font-family', 'Archivo, Helvetica, Arial, sans-serif')
      .style('pointer-events', 'none');

    g.on('mouseenter', function (e, c) {
        d3.select(this).select('circle').transition().duration(100).attr('r', c.r * 1.25);
        tooltip.html(tooltipHtml(c)).style('visibility', 'visible');
      })
      .on('mousemove', function (e) {
        const pos = d3.pointer(e, container);
        tooltip.style('left', (pos[0] + 14) + 'px').style('top', (pos[1] - 24) + 'px');
      })
      .on('mouseleave', function (e, c) {
        d3.select(this).select('circle').transition().duration(100).attr('r', c.r);
        tooltip.style('visibility', 'hidden');
      })
      .on('click', function (e, c) {
        if (c.items.length > 1) { tooltip.style('visibility', 'hidden'); zoomToCluster(c); }
      });
  }

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .filter(function (e) {
      if (e.type === 'wheel') return e.ctrlKey || e.metaKey;
      return !e.button;
    })
    .on('zoom', function (e) {
      tooltip.style('visibility', 'hidden');
      transform = e.transform;
      const k = transform.k;
      gMap.attr('transform', transform);
      sphereSel.attr('stroke-width', 1 / k);
      coastSel.attr('stroke-width', 0.7 / k);
      borderSel.attr('stroke-width', 0.5 / k);
      renderDots();
    });

  svg.call(zoom)
    .on('dblclick.zoom', null)
    .on('dblclick', function () {
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
    });

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function (world) {
    const notAntarctica = function (d) { return d.properties.name !== 'Antarctica'; };
    const countries = topojson.feature(world, world.objects.countries).features.filter(notAntarctica);
    const borders = topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; });
    const coast = topojson.mesh(world, world.objects.countries, function (a, b) { return a === b && notAntarctica(a); });

    sphereSel = gMap.append('path')
      .attr('d', path({ type: 'Sphere' }))
      .attr('fill', '#eef4f8')
      .attr('stroke', '#dbe4ea')
      .attr('stroke-width', 1);

    gMap.append('g').selectAll('path')
      .data(countries).join('path')
      .attr('d', path)
      .attr('fill', '#ffffff');

    borderSel = gMap.append('path').datum(borders)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#e2e9ee')
      .attr('stroke-width', 0.5);

    coastSel = gMap.append('path').datum(coast)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#c3cfd8')
      .attr('stroke-width', 0.7);

    renderDots();
  });
})();
