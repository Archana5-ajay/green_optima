/**
 * Service detail subpage component
 */
import { h, iconOrImg, backButton } from '../lib/ui.js';

const safe = u => (typeof u === 'string' && /^(\/uploads\/|https?:\/\/)/.test(u) ? u : '');

export default (content, serviceSlug) => {
  const service = (content.services?.items || []).find(s => {
    const slug = (s.title || '').toLowerCase().replace(/\s+/g, '-');
    return slug === serviceSlug;
  });

  if (!service) {
    return h('div', { class: 'svc-detail' },
      h('div', { class: 'in', style: 'text-align:center;padding:100px 0' },
        h('h1', { style: 'margin-bottom:16px' }, 'Service Not Found'),
        h('p', { style: 'opacity:.7;margin-bottom:30px' }, 'Could not find the requested service: ' + serviceSlug),
        h('a', { href: '/#services', class: 'btn' }, '← Back to All Services')
      )
    );
  }

  const iconEl = h('span', { class: 'pl-i', style: 'display:inline-flex' }, iconOrImg(service.icon));
  const tagEl = h('span', { class: 'tag' }, content.services?.tag || 'Our Services');
  const titleEl = h('h1', {}, service.title);
  const textEl = h('p', {}, service.text);

  const subsEl = (service.subs && service.subs.length)
    ? h('ol', { class: 'svc-subs-detail' },
      ...service.subs.map((sub, n) =>
        h('li', {},
          h('b', {}, String(n + 1).padStart(2, '0')),
          sub
        )
      )
    )
    : null;

  const ctaBtn = h('a', {
    href: '/#contact',
    class: 'btn',
    style: 'display:inline-flex'
  }, 'Get in Touch');

  const leftCol = h('div', { class: 'svc-detail-left' },
    backButton('← Back to Services', '/#services'),
    tagEl,
    iconEl,
    titleEl,
    textEl,
    subsEl,
    ctaBtn
  );

  const rightCol = h('div', { id: 'svc-img-col' },
    safe(service.image)
      ? h('img', { src: service.image, alt: service.title, class: 'svc-detail-img' })
      : h('div', { class: 'ph svc-detail-img' }, '[ SERVICE IMAGE ]')
  );

  return h('div', { class: 'svc-detail' },
    h('div', { class: 'svc-detail-grid' }, leftCol, rightCol)
  );
};
