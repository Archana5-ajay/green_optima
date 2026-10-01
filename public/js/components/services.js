import { h, media, tag, iconOrImg } from '../lib/dom.js';

const safe = u => (typeof u === 'string' && /^(\/uploads\/|https?:\/\/)/.test(u) ? u : '');

export default c => {
  const s = c.services;

  return h('section', { class: 'sec cr', id: 'services' },
    h('div', { class: 'in' },
      tag(s.tag),
      h('h2', { style: 'max-width:900px;margin-bottom:60px' }, s.title),
      ...s.items.map((v, idx) =>
        h('div', { class: 'svc', style: `z-index:${s.items.length - idx}` },
          // Left column: icon, title, text, sub-services
          h('div', { class: 'svc-left' },
            h('span', { class: 'pl-i svc-icon' }, iconOrImg(v.icon)),
            h('h3', { class: 'svc-title' }, v.title),
            h('p', { class: 'svc-text' }, v.text),
            (v.subs && v.subs.length)
              ? h('ol', { class: 'svc-subs' },
                  ...v.subs.map((sub, n) =>
                    h('li', {},
                      h('b', {}, String(n + 1).padStart(2, '0')),
                      sub
                    )
                  )
                )
              : null,
            h('a', {
              class: 'svc-cta',
              href: `/service/${encodeURIComponent((v.title || 'service').toLowerCase().replace(/\s+/g, '-'))}`,
            }, 'View Service →')
          ),
          // Right column: big image fills right side
          h('div', { class: 'svc-right' },
            safe(v.image)
              ? h('img', { src: v.image, alt: v.title || '', class: 'svc-img' })
              : h('div', { class: 'ph svc-img' }, '[ SERVICE IMAGE ]')
          ),
          h('span', { class: 'ln' })
        )
      )
    )
  );
};
