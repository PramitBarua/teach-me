/* Reusable traffic-flow map renderer – AWS SAA-C03 reference pages.

   Draws an architecture diagram as inline SVG from a declarative spec, then
   adds a numbered walkthrough and two study controls:
     - "Step through": highlights one hop of the flow at a time
     - "Hide service names": turns every box into "?" (click a box to reveal) —
       retrieval practice: name the service from its position in the flow.

   Usage:
     <div class="flow-map" id="m1"></div>
     <script src="../assets/flow-map.js"></script>
     <script>FlowMap.render(document.getElementById('m1'), spec);</script>

   spec = {
     title,                       // aria-label for the SVG
     width: 960, height,          // viewBox size (px)
     zones: [{x, y, w, h, label, kind}],   // region|vpc|az|public|private|onprem|edge|group|account
     nodes: [{id, x, y, label, sub, kind, w, href}],  // x/y = centre; kind sets colour:
            // user|edge|network|compute|storage|db|integration|security|analytics|onprem
     edges: [{from, to, step, label, style, via:[[x,y]], at, lpos, both}],
            // style: req (default) | async | repl | ctrl | alt | deny
            // at: 0–1 position of badge/label along the path (default 0.5)
            // lpos: above (default) | below | left | right
     steps: [{k, t}]              // k matches edge.step; t is the walkthrough text (HTML allowed)
   } */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const NODE_W = 128;
  const NODE_H = 46;
  const ARROW_STYLES = ['req', 'async', 'repl', 'ctrl', 'alt', 'deny'];

  function svgEl(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function text(parent, x, y, str, cls) {
    const t = svgEl('text', { x: x, y: y, class: cls, 'text-anchor': 'middle' }, parent);
    t.textContent = str;
    return t;
  }

  // Point where the segment from a box's centre towards (tx, ty) leaves the box.
  function clip(n, tx, ty) {
    const dx = tx - n.x;
    const dy = ty - n.y;
    if (!dx && !dy) return [n.x, n.y];
    const sx = dx ? (n.w / 2 + 3) / Math.abs(dx) : Infinity;
    const sy = dy ? (NODE_H / 2 + 3) / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return [n.x + dx * s, n.y + dy * s];
  }

  function pointAt(pts, frac) {
    const segs = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const len = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      segs.push(len);
      total += len;
    }
    let target = total * frac;
    for (let i = 0; i < segs.length; i++) {
      if (target <= segs[i] || i === segs.length - 1) {
        const r = segs[i] ? Math.min(target / segs[i], 1) : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
      }
      target -= segs[i];
    }
    return pts[0];
  }

  function defs(svg, uid) {
    const d = svgEl('defs', {}, svg);
    ARROW_STYLES.forEach(function (s) {
      const m = svgEl('marker', {
        id: uid + '-arrow-' + s, viewBox: '0 0 10 10', refX: 9, refY: 5,
        markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse'
      }, d);
      svgEl('path', { d: 'M0,0 L10,5 L0,10 z', class: 'arrow-' + s }, m);
    });
  }

  function render(container, spec) {
    const W = spec.width || 960;
    const H = spec.height || 400;
    const uid = container.id || ('fm' + Math.random().toString(36).slice(2, 8));
    container.classList.add('flow-map');

    const controls = document.createElement('div');
    controls.className = 'flow-controls';
    container.appendChild(controls);

    const scroller = document.createElement('div');
    scroller.className = 'flow-scroll';
    container.appendChild(scroller);

    const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': spec.title || 'Architecture map' }, scroller);
    defs(svg, uid);

    (spec.zones || []).forEach(function (z) {
      const g = svgEl('g', { class: 'zone zone-' + (z.kind || 'group') }, svg);
      svgEl('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 8 }, g);
      const t = svgEl('text', { x: z.x + 8, y: z.y + 14, class: 'zone-label' }, g);
      t.textContent = z.label || '';
    });

    const nodes = {};
    (spec.nodes || []).forEach(function (n) {
      nodes[n.id] = Object.assign({ w: NODE_W }, n);
    });

    const edgeLayer = svgEl('g', { class: 'edges' }, svg);
    const badgeLayer = svgEl('g', { class: 'badges' });
    const edgeEls = [];

    (spec.edges || []).forEach(function (e) {
      const a = nodes[e.from];
      const b = nodes[e.to];
      if (!a || !b) { console.warn('flow-map: unknown node in edge', e); return; }
      const style = e.style || 'req';
      const via = e.via || [];
      const first = via.length ? via[0] : [b.x, b.y];
      const last = via.length ? via[via.length - 1] : [a.x, a.y];
      const pts = [clip(a, first[0], first[1])].concat(via, [clip(b, last[0], last[1])]);

      const g = svgEl('g', { class: 'edge edge-' + style }, edgeLayer);
      g.dataset.step = e.step != null ? String(e.step) : '';
      g.dataset.from = e.from;
      g.dataset.to = e.to;
      const attrs = {
        d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L'),
        class: 'edge-line'
      };
      if (style !== 'deny') attrs['marker-end'] = 'url(#' + uid + '-arrow-' + style + ')';
      if (e.both) attrs['marker-start'] = 'url(#' + uid + '-arrow-' + style + ')';
      svgEl('path', attrs, g);

      const p = pointAt(pts, e.at != null ? e.at : 0.5);
      const bg = svgEl('g', { class: 'badge-group edge-' + style }, badgeLayer);
      bg.dataset.step = g.dataset.step;
      let r = 0;
      if (style === 'deny') {
        r = 9;
        svgEl('circle', { cx: p[0], cy: p[1], r: r, class: 'deny-badge' }, bg);
        text(bg, p[0], p[1] + 4, '✕', 'deny-x');
      } else if (e.step != null) {
        r = 10;
        svgEl('circle', { cx: p[0], cy: p[1], r: r, class: 'step-badge' }, bg);
        text(bg, p[0], p[1] + 4, String(e.step), 'step-num');
      }
      if (e.label) {
        const pos = e.lpos || 'above';
        const off = r + 5;
        let lx = p[0], ly = p[1] - off - 1, anchor = 'middle';
        if (pos === 'below') ly = p[1] + off + 9;
        if (pos === 'left') { lx = p[0] - off; ly = p[1] + 4; anchor = 'end'; }
        if (pos === 'right') { lx = p[0] + off; ly = p[1] + 4; anchor = 'start'; }
        const t = svgEl('text', { x: lx, y: ly, class: 'edge-label', 'text-anchor': anchor }, bg);
        t.textContent = e.label;
      }
      edgeEls.push(g, bg);
    });

    const nodeLayer = svgEl('g', { class: 'nodes' }, svg);
    const nodeEls = {};
    Object.keys(nodes).forEach(function (id) {
      const n = nodes[id];
      let parent = nodeLayer;
      if (n.href) parent = svgEl('a', { href: n.href }, nodeLayer);
      const g = svgEl('g', { class: 'node node-' + (n.kind || 'compute'), tabindex: n.href ? -1 : 0 }, parent);
      g.dataset.id = id;
      svgEl('rect', { x: n.x - n.w / 2, y: n.y - NODE_H / 2, width: n.w, height: NODE_H, rx: 6 }, g);
      if (n.sub) {
        text(g, n.x, n.y - 3, n.label, 'nm');
        text(g, n.x, n.y + 12, n.sub, 'sb');
      } else {
        text(g, n.x, n.y + 4, n.label, 'nm');
      }
      text(g, n.x, n.y + 6, '?', 'q');
      g.addEventListener('click', function () {
        if (container.classList.contains('quiz')) g.classList.toggle('revealed');
      });
      g.addEventListener('keydown', function (ev) {
        if ((ev.key === 'Enter' || ev.key === ' ') && container.classList.contains('quiz')) {
          ev.preventDefault();
          g.classList.toggle('revealed');
        }
      });
      nodeEls[id] = g;
    });

    // Badges sit above nodes so numbers are never hidden behind a box.
    svg.appendChild(badgeLayer);

    // ── Walkthrough list + highlighting ──
    const steps = spec.steps || [];
    const list = document.createElement('ol');
    list.className = 'flow-steps';
    steps.forEach(function (s) {
      const li = document.createElement('li');
      li.dataset.step = String(s.k);
      li.tabIndex = 0;
      li.innerHTML = '<span class="flow-k">' + s.k + '</span><span class="flow-t">' + s.t + '</span>';
      li.addEventListener('mouseenter', function () { focus(String(s.k)); });
      li.addEventListener('mouseleave', function () { if (cursor < 0) focus(null); });
      li.addEventListener('focus', function () { focus(String(s.k)); });
      li.addEventListener('blur', function () { if (cursor < 0) focus(null); });
      list.appendChild(li);
    });
    container.appendChild(list);

    function focus(k) {
      container.classList.toggle('focusing', k !== null);
      Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.remove('on'); });
      edgeEls.forEach(function (el) {
        const on = k !== null && el.dataset.step === k;
        el.classList.toggle('on', on);
        if (on && el.dataset.from) {
          nodeEls[el.dataset.from].classList.add('on');
          nodeEls[el.dataset.to].classList.add('on');
        }
      });
      list.querySelectorAll('li').forEach(function (li) { li.classList.toggle('on', li.dataset.step === k); });
    }

    let cursor = -1;
    if (steps.length) {
      const stepBtn = document.createElement('button');
      stepBtn.type = 'button';
      stepBtn.textContent = '▶ Step through';
      stepBtn.addEventListener('click', function () {
        cursor++;
        if (cursor >= steps.length) {
          cursor = -1;
          focus(null);
          stepBtn.textContent = '▶ Step through';
          return;
        }
        focus(String(steps[cursor].k));
        stepBtn.textContent = '▶ Next (' + (cursor + 1) + '/' + steps.length + ')';
      });
      controls.appendChild(stepBtn);
    }

    const quizBtn = document.createElement('button');
    quizBtn.type = 'button';
    quizBtn.textContent = 'Hide service names';
    quizBtn.addEventListener('click', function () {
      const on = container.classList.toggle('quiz');
      Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.remove('revealed'); });
      quizBtn.textContent = on ? 'Show all names' : 'Hide service names';
    });
    controls.appendChild(quizBtn);
  }

  window.FlowMap = { render: render };
})();
