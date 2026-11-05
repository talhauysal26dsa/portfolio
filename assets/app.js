(() => {
const D = window.PORTFOLIO;
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs = {}, html = '') => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') e.className = v; else e.setAttribute(k, v === true ? '' : v);
  }
  if (html) e.innerHTML = html;
  return e;
};

/* ---------- hero ---------- */
$('#name').textContent = D.name;
document.title = `${D.name} — ${D.role}`;
$('#role').textContent = D.role;
$('#intro').innerHTML = D.intro;
/* floating collage in the hero */
const col = $('#collage');
(D.collage || []).forEach((src, i) => {
  const isV = /\.(mp4|webm)$/.test(src);
  const card = h('div', { class: `fc fc${i}` });
  card.append(isV ? h('video', { src, muted: true, loop: true, autoplay: true, playsinline: true }) : h('img', { src, alt: '' }));
  col.append(card);
});
addEventListener('pointermove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  col.style.setProperty('--mx', x); col.style.setProperty('--my', y);
});

const rot = $('#rot');
let ri = 0;
setInterval(() => {
  ri = (ri + 1) % D.rotate.length;
  rot.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-20px)' }], { duration: 300, fill: 'forwards' })
    .onfinish = () => {
      rot.textContent = D.rotate[ri];
      rot.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 400, fill: 'forwards' });
    };
}, 2600);
rot.textContent = D.rotate[0];

/* marquee */
const mq = $('#mq');
const mqItems = [...D.marquee, ...D.marquee];
mqItems.forEach(src => {
  const isV = /\.(mp4|webm)$/.test(src);
  mq.append(isV ? h('video', { src, muted: true, loop: true, autoplay: true, playsinline: true, preload: 'metadata' })
               : h('img', { src, loading: 'lazy', alt: '' }));
});

const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) {
    if (!v.src) { v.src = v.dataset.src; }
    v.play().catch(() => {});
  } else if (v.src) v.pause();
}), { rootMargin: '200px' });

/* ---------- renderers ---------- */
const lazyVideo = (src, extra = {}) => h('video', { 'data-src': src, muted: true, loop: true, playsinline: true, preload: 'none', ...extra });

const R = {
  /* driving ↔ output video wipe, with clickable reference cards */
  swap(it) {
    const box = h('div', { class: 'swap' });
    const stage = h('div', { class: 'frame stage' });
    stage.style.aspectRatio = it.ar || '9/16';
    const [aw, ah] = (it.ar || '9/16').split('/').map(Number);
    stage.style.width = `min(100%, calc(76vh * ${aw / ah}))`;
    stage.style.setProperty('--p', '50%');
    const drv = lazyVideo(it.driving);
    const out = lazyVideo(it.options[0].out);
    const top = h('div', { class: 'after' }); top.append(out);
    stage.append(drv, top, h('div', { class: 'handle' }),
      h('span', { class: 'label l' }, it.lb || 'Driving'), h('span', { class: 'label r' }, it.la || 'Output'));
    const badge = h('div', { class: 'refbadge' });
    stage.append(badge);
    const set = x => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--p', Math.max(0, Math.min(100, (x - r.left) / r.width * 100)) + '%');
    };
    let drag = false, idle = true;
    stage.addEventListener('pointerdown', e => { drag = true; idle = false; set(e.clientX); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', e => { if (drag || e.pointerType === 'mouse') { idle = false; set(e.clientX); } });
    stage.addEventListener('pointerup', () => drag = false);
    stage.addEventListener('pointerleave', () => { drag = false; idle = true; t0 = performance.now(); });
    // gentle auto-sweep while nobody touches it
    let t0 = performance.now();
    const sweep = now => {
      if (idle && stage.isConnected) stage.style.setProperty('--p', ((it.center ?? 50) + (it.amp ?? 32) * Math.sin((now - t0) / 1400)) + '%');
      requestAnimationFrame(sweep);
    };
    requestAnimationFrame(sweep);
    const sync = () => { if (drv.duration && Math.abs(out.currentTime - drv.currentTime) > 0.12) out.currentTime = drv.currentTime; };
    drv.addEventListener('timeupdate', sync);
    drv.addEventListener('play', () => out.play().catch(() => {}));
    drv.addEventListener('pause', () => out.pause());

    const cards = h('div', { class: 'refs' });
    const pick = i => {
      const o = it.options[i];
      [...cards.children].forEach((c, j) => c.classList.toggle('on', i === j));
      badge.innerHTML = o.ref ? `<img src="${o.ref}" alt=""><span>${o.name}</span>` : '';
      const wantDrv = o.driving || it.driving;
      const drvChanged = drv.dataset.src !== wantDrv;
      if (drvChanged) {
        drv.dataset.src = wantDrv;
        if (drv.src) { drv.src = wantDrv; drv.play().catch(() => {}); }
      }
      if (drvChanged || out.dataset.src !== o.out || !out.src) {
        out.dataset.src = o.out;
        if (drv.src) { out.src = o.out; out.addEventListener('loadeddata', () => { out.currentTime = drv.currentTime; out.play().catch(() => {}); }, { once: true }); }
        else vio.observe(out);
      }
      stage.animate([{ filter: 'brightness(1.6) saturate(1.4)' }, { filter: 'none' }], { duration: 500 });
    };
    if (it.options.length > 1 || it.options[0].ref) {
      it.options.forEach((o, i) => {
        const c = h('button', { class: 'refcard' }, `<img src="${o.thumb || o.ref}" alt=""><span><b>${o.name}</b>${o.note ? `<i>${o.note}</i>` : ''}</span>`);
        c.onclick = () => pick(i);
        cards.append(c);
      });
    }
    if (it.sound) {
      const snd = h('button', { class: 'sound' }, '🔇 sound');
      snd.onclick = e => {
        e.stopPropagation();
        out.muted = !out.muted;
        if (!out.muted) document.querySelectorAll('video').forEach(v => { if (v !== out) v.muted = true; });
        snd.textContent = out.muted ? '🔇 sound' : '🔊 sound';
      };
      snd.addEventListener('pointerdown', e => e.stopPropagation());
      stage.append(snd);
    }
    pick(0);
    box.append(stage, cards);
    return box;
  },
  ba(it) {
    const wrap = h('div', { class: 'frame ba' });
    wrap.style.setProperty('--p', '50%');
    wrap.innerHTML = `<img src="${it.before}" loading="lazy" alt="">
      <div class="after"><img src="${it.after}" loading="lazy" alt=""></div>
      <div class="handle"></div>
      <span class="label l">${it.lb || 'Input'}</span><span class="label r">${it.la || 'Output'}</span>`;
    const set = x => {
      const r = wrap.getBoundingClientRect();
      wrap.style.setProperty('--p', Math.max(0, Math.min(100, (x - r.left) / r.width * 100)) + '%');
    };
    let drag = false;
    wrap.addEventListener('pointerdown', e => { drag = true; set(e.clientX); wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', e => { if (drag || e.pointerType === 'mouse') set(e.clientX); });
    wrap.addEventListener('pointerup', () => drag = false);
    wrap.addEventListener('pointerleave', () => { if (!drag) wrap.style.setProperty('--p', '50%'); });
    return wrap;
  },
  grid(it) {
    const g = h('div', { class: `grid c${it.cols || 3}` });
    it.cells.forEach(c => {
      const cell = h('div', { class: 'cell' });
      if (c.ar) cell.style.aspectRatio = c.ar;
      else if (it.ar) cell.style.aspectRatio = it.ar;
      const isV = /\.(mp4|webm)$/.test(c.src);
      const m = isV ? lazyVideo(c.src, { autoplay: true }) : h('img', { src: c.src, loading: 'lazy', alt: c.label || '' });
      cell.append(m);
      if (c.label) cell.append(h('span', { class: 'label' }, c.label));
      cell.addEventListener('click', () => openLB(c.src));
      g.append(cell);
    });
    return g;
  },
  vrow(it) {
    const box = h('div', { class: 'showcase' });
    const row = h('div', { class: 'vrow' });
    row.style.gridTemplateColumns = it.cols || `repeat(${it.cells.length},1fr)`;
    row.style.setProperty('--ar', it.ar || '9/16');
    const vids = [];
    it.cells.forEach(c => {
      const f = h('div', { class: 'frame' });
      if (c.ar) f.style.aspectRatio = c.ar;
      const isV = /\.(mp4|webm)$/.test(c.src);
      const m = isV ? lazyVideo(c.src) : h('img', { src: c.src, loading: 'lazy', alt: '' });
      if (isV) vids.push(m);
      if (!isV) m.style.objectFit = c.fit || 'cover';
      f.append(m, h('span', { class: `label ${c.right ? 'r' : 'l'}` }, c.label || ''));
      if (c.hot) f.style.boxShadow = '0 0 0 1px var(--a1), 0 20px 80px -20px var(--a1)';
      row.append(f);
    });
    box.append(row);
    if (vids.length > 1) {
      const ctl = h('div', { class: 'vctl' });
      const btn = h('button', {}, '❚❚ pause');
      const rng = h('input', { type: 'range', min: 0, max: 1000, value: 0 });
      ctl.append(btn, rng, h('span', {}, 'synced'));
      const lead = vids[0];
      let playing = true;
      btn.onclick = () => {
        playing = !playing;
        vids.forEach(v => playing ? v.play() : v.pause());
        btn.textContent = playing ? '❚❚ pause' : '▶ play';
      };
      rng.oninput = () => {
        const t = rng.value / 1000 * (lead.duration || 0);
        vids.forEach(v => v.currentTime = Math.min(t, (v.duration || t) - 0.05));
      };
      lead.addEventListener('timeupdate', () => {
        if (lead.duration) rng.value = lead.currentTime / lead.duration * 1000;
        vids.slice(1).forEach(v => { if (Math.abs(v.currentTime - lead.currentTime) > 0.25 && v.duration > lead.currentTime) v.currentTime = lead.currentTime; });
      });
      lead.addEventListener('seeked', () => {});
      box._vids = vids;
      box.append(ctl);
    }
    box._sync = vids;
    return box;
  },
  flow(it) {
    const f = h('div', { class: 'flow' });
    it.nodes.forEach((n, i) => {
      if (i) f.append(h('div', { class: 'arrow' }, '→'));
      f.append(h('div', { class: `node${n.hot ? ' hot' : ''}` }, `<b>${n.t}</b><span>${n.s || ''}</span>`));
    });
    return f;
  },
  routes(it) {
    const g = h('div', { class: 'routes' });
    it.items.forEach(r => g.append(h('div', { class: 'route' }, `<code>${r.code}</code><p>${r.p}</p>`)));
    return g;
  },
  html(it) { return h('div', { class: 'caption' }, it.html); }
};

const renderItem = it => {
  const wrap = h('div', { class: 'showcase' });
  wrap.append(R[it.type](it));
  if (it.caption) wrap.append(h('div', { class: 'caption' }, it.caption));
  return wrap;
};

/* ---------- groups + projects ---------- */
const main = $('#work');
let pn = 0;
const only = new URLSearchParams(location.search).get('only');
D.groups.forEach((g, gi) => {
  if (only && g.id !== only) return;
  const sec = h('section', { id: g.id });
  const head = h('div', { class: 'group-head rv' });
  head.append(h('div', {}, `<div class="eyebrow">${g.eyebrow}</div><h2 class="sec">${g.title}</h2><p class="lead">${g.lead}</p>`),
              h('div', { class: 'count' }, String(gi + 1).padStart(2, '0')));
  sec.append(head);

  g.projects.forEach(p => {
    pn++;
    const pr = h('article', { class: 'project rv', id: p.id });
    const meta = h('div', { class: 'meta' });
    meta.innerHTML = `<div class="num">${String(pn).padStart(2, '0')} / ${p.kind || ''}</div>
      <h3>${p.title}</h3><div class="tl">${p.tagline || ''}</div>
      <div class="desc">${(p.desc || []).map(x => `<p>${x}</p>`).join('')}</div>
      ${p.kpis ? `<div class="kpis">${p.kpis.map(k => `<div class="kpi"><b>${k.v}</b><span>${k.k}</span></div>`).join('')}</div>` : ''}
      <div class="chips">${(p.stack || []).map(s => `<span class="chip">${s}</span>`).join('')}</div>`;
    const show = h('div', { class: 'showcase' });
    if (p.tabs) {
      const tabs = h('div', { class: 'tabs' });
      const body = h('div', { class: 'showcase' });
      const panes = p.tabs.map(t => {
        const pane = h('div', { class: 'showcase' });
        t.items.forEach(it => pane.append(renderItem(it)));
        return pane;
      });
      const pick = i => {
        [...tabs.children].forEach((b, j) => b.classList.toggle('on', i === j));
        body.replaceChildren(panes[i]);
        activateVideos(panes[i]);
      };
      p.tabs.forEach((t, i) => {
        const b = h('button', { class: t.thumb ? 'thumb' : '' }, t.thumb ? `<img src="${t.thumb}" loading="lazy" alt=""><span>${t.name}</span>` : t.name);
        b.onclick = () => pick(i); tabs.append(b);
      });
      if (p.tabs.some(t => t.thumb)) tabs.classList.add('strip');
      tabs.classList.contains('strip') ? show.append(body, tabs) : show.append(tabs, body);
      pick(0);
    }
    (p.items || []).forEach(it => show.append(renderItem(it)));
    pr.append(meta, show);
    sec.append(pr);
  });
  main.append(sec);
});

/* stack */
const sg = $('#stackgrid');
D.stack.forEach(s => sg.append(h('div', { class: 'sg rv' }, `<h4>${s.t}</h4><ul>${s.i.map(x => `<li>${x}</li>`).join('')}</ul>`)));

/* contact */
$('#mail').href = `mailto:${D.email}`;
$('#mail').textContent = D.cta;
const links = $('#links');
D.links.forEach(l => links.append(h('a', { class: 'btn', href: l.href, target: '_blank', rel: 'noopener' }, l.t + ' ↗')));
$('#year').textContent = `© ${new Date().getFullYear()} ${D.name}`;

/* nav */
const nav = $('#nav');
D.groups.forEach(g => nav.append(h('a', { href: `#${g.id}` }, g.nav)));
nav.append(h('a', { href: '#stack' }, 'Stack'), h('a', { href: '#contact', class: 'keep' }, 'Contact'));

/* ---------- behaviours ---------- */
function activateVideos(root) {
  root.querySelectorAll('video[data-src]').forEach(v => vio.observe(v));
}
activateVideos(document);

const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .08 });
document.querySelectorAll('.rv').forEach(e => rio.observe(e));

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => sio.observe(s));

const cur = $('#cursor');
addEventListener('pointermove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });

/* lightbox */
const lb = $('#lb');
function openLB(src) {
  const isV = /\.(mp4|webm)$/.test(src);
  lb.replaceChildren(isV ? h('video', { src, autoplay: true, loop: true, muted: true, controls: true, playsinline: true }) : h('img', { src, alt: '' }));
  lb.classList.add('on');
}
lb.onclick = e => { if (e.target === lb || e.target.tagName === 'IMG') lb.classList.remove('on'); };
addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
})();
