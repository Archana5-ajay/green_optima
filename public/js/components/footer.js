import { h } from '../lib/dom.js';

export default function renderFooter(c) {
  const f = c.footer || {};
  const s = c.site || {};
  const nav = (c.nav || []).filter(function(n) { return n.label && n.href && !n.children; });

  const linkedInHref = ((f.socials || []).find(function(x) { return /linkedin/i.test(x.label); }) || {}).href || '#';
  const emailAddr = s.email || 'bms@greenoptima.ae';
  const phone = s.phone || '+971 45667544';
  const address = s.address || 'Office 1201, Tower B, Prime Business Centre, JVC, P. O. Box 115858, Dubai, UAE';
  const siteName = s.name || 'Green Optima';

  // ── Left column ─────────────────────────────────────────────
  const logoEl = s.logo
    ? h('img', { src: s.logo, alt: siteName, class: 'ft-logo-img' })
    : h('div', { class: 'ft-logo-fallback' },
        h('span', { class: 'ft-brand-name' }, siteName)
      );

  const leftCol = h('div', { class: 'ft-left' },
    h('div', { class: 'ft-logo-block' },
      logoEl,
      h('p', { class: 'ft-tagline' }, s.tagline || 'The Future is Integrated')
    ),
    h('div', { class: 'ft-socials' },
      h('a', { href: linkedInHref, class: 'ft-social-icon', title: 'LinkedIn', target: '_blank', rel: 'noopener' }, 'in'),
      h('a', { href: 'mailto:' + emailAddr, class: 'ft-social-icon ft-social-email', title: 'Email' }, '\u2709')
    ),
    h('div', { class: 'ft-legal' },
      h('a', { href: '/privacy', class: 'ft-policy-link' }, 'Privacy Policy'),
      h('p', { class: 'ft-copyright' }, '\u00a9 ' + new Date().getFullYear() + ' ' + siteName)
    )
  );

  // ── Center column: Nav links ─────────────────────────────────
  const centerCol = h('div', { class: 'ft-center' },
    h('nav', { 'aria-label': 'Footer navigation' },
      ...nav.map(function(item) {
        return h('a', { href: item.href, class: 'ft-nav-link' }, item.label);
      })
    )
  );

  // ── Right column: Contact + Map ──────────────────────────────
  const mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.9637523467793!2d55.18748!3d25.0657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6c4f3ca5cd87%3A0x1a2b3c4d5e6f7a8b!2sPrime%20Business%20Centre%20JVC!5e0!3m2!1sen!2sae!4v1600000000000!5m2!1sen!2sae';

  const iframe = document.createElement('iframe');
  iframe.src = mapSrc;
  iframe.width = '100%';
  iframe.height = '180';
  iframe.style.cssText = 'border:0;border-radius:8px;display:block;width:100%';
  iframe.setAttribute('allowfullscreen', '');
  iframe.loading = 'lazy';
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.title = siteName + ' Location';

  const rightCol = h('div', { class: 'ft-right' },
    h('p', { class: 'ft-co-name' }, siteName),
    h('p', { class: 'ft-address' }, address),
    h('p', { class: 'ft-contact-row' },
      'T:\u00a0' + phone + '\u00a0\u00a0\u00a0E:\u00a0',
      h('a', { href: 'mailto:' + emailAddr, class: 'ft-email-link' }, emailAddr)
    ),
    h('div', { class: 'ft-map-wrap' }, iframe)
  );

  return h('footer', { id: 'contact', class: 'ft-root' },
    h('div', { class: 'ft-inner' },
      leftCol,
      centerCol,
      rightCol
    )
  );
}
