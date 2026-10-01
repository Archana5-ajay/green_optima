import { h, iconOrImg } from '../lib/dom.js';

const safe = u => (typeof u === 'string' && /^(\/uploads\/|https?:\/\/)/.test(u) ? u : '');

function createCard(k, i) {
  const bg = safe(k.image)
    ? h('div', { class: 'pl-c-img' }, h('img', { src: k.image, alt: k.title || '', loading: 'lazy' }))
    : null;
  return h(
    'div',
    { class: 'pl-c' + (bg ? ' pl-c-hasbg' : '') },
    bg,
    h('span', { class: 'pl-n' }, String(i + 1).padStart(2, '0')),
    h('span', { class: 'pl-i' }, iconOrImg(k.icon)),
    h('h3', {}, k.title),
    h('p', {}, k.text)
  );
}

export default c => {
  const p = c.pillars || {};
  const items = p.items || [];

  // Repeat cards so each half has enough cards for widescreen displays
  const fullSet = [];
  const repeatCount = Math.max(2, Math.ceil(8 / Math.max(1, items.length)));
  for (let r = 0; r < repeatCount; r++) {
    items.forEach((it, idx) => fullSet.push({ it, idx }));
  }

  const row1 = h('div', { class: 'pl-row' }, fullSet.map(({ it, idx }) => createCard(it, idx)));
  const row2 = h('div', { class: 'pl-row', 'aria-hidden': 'true' }, fullSet.map(({ it, idx }) => createCard(it, idx)));

  const track = h('div', { class: 'pl-t' }, row1, row2);
  const marquee = h('div', { class: 'pl-marquee' }, track);

  const sec = h(
    'section',
    { class: 'cr sec pl', id: 'pillars' },
    h(
      'div',
      { class: 'in pl-h' },
      h('span', { class: 'q' }, '"'),
      h('h2', {}, p.title || 'What makes us different'),
      h('span', { class: 'q' }, '"'),
      h('p', { class: 'sq' }, p.sub || '')
    ),
    marquee
  );

  return sec;
};
