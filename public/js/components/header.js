/**
 * Header Navigation Component with Dropdown Menus & Mobile Accordion
 */
import { h, media, btn } from '../lib/dom.js';

export default content => {
  const navItems = content.nav || [];

  // Hamburger button
  const hb = h('button', {
    id: 'hb',
    'aria-label': 'Menu',
    onclick: () => {
      hb.classList.toggle('o');
      mm.classList.toggle('o');
    }
  }, h('span'), h('span'));

  // Helper: Format anchor links so that on subpages, '#section' routes to '/#section'
  const isSubpage = typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '';
  const resolveNavHref = (href) => {
    if (!href) return '#';
    if (href.startsWith('#') && isSubpage) {
      return '/' + href;
    }
    return href;
  };

  // Mobile menu links (with accordion for dropdowns)
  const mobileNavLinks = navItems.map(item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (!hasChildren) {
      return h('a', {
        href: resolveNavHref(item.href),
        onclick: () => {
          hb.classList.remove('o');
          mm.classList.remove('o');
        }
      }, item.label);
    }

    // Accordion for mobile
    const subList = h('div', { class: 'mm-sub-list' },
      item.href ? h('a', { class: 'mm-sub-item', href: resolveNavHref(item.href), style: 'font-weight:700', onclick: () => { hb.classList.remove('o'); mm.classList.remove('o'); } }, 'Overview: ' + item.label) : null,
      ...item.children.map(sub =>
        h('a', {
          class: 'mm-sub-item',
          href: resolveNavHref(sub.href),
          onclick: () => {
            hb.classList.remove('o');
            mm.classList.remove('o');
          }
        }, sub.label)
      )
    );

    return h('div', { class: 'mm-dropdown' },
      h('div', { class: 'mm-dropdown-header', onclick: () => subList.classList.toggle('open') },
        item.label,
        h('span', { style: 'font-size:18px;opacity:.6' }, '▾')
      ),
      subList
    );
  });

  const mm = h('div', { id: 'mm' }, ...mobileNavLinks);

  // Desktop Navbar Links & Dropdowns
  const desktopNavLinks = navItems.map(item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (!hasChildren) {
      return h('a', { class: 'nl', href: resolveNavHref(item.href) }, item.label);
    }

    // Dropdown container
    const trigger = h('a', {
      class: 'nl nav-dropdown-trigger',
      href: resolveNavHref(item.href) || 'javascript:void(0)'
    },
      item.label,
      h('span', { class: 'nav-dropdown-chevron' }, '▾')
    );

    const menu = h('div', { class: 'nav-dropdown-menu' },
      ...item.children.map(sub =>
        h('a', { class: 'nav-dropdown-item', href: resolveNavHref(sub.href) },
          h('span', { style: 'font-weight:600' }, sub.label),
          sub.badge ? h('span', { class: 'tag', style: 'margin:0 0 0 auto;font-size:10px;padding:2px 8px' }, sub.badge) : null
        )
      )
    );

    return h('div', { class: 'nav-dropdown' }, trigger, menu);
  });

  const logoHref = '/';
  const logoEl = h('a', {
    href: logoHref,
    style: 'display:block;width:auto;max-width:120px;height:auto;max-height:30px;transition:opacity .2s'
  },
    media(content.site?.logo, 'LOGO', 'height:100%;max-height:28px;background:none')
  );

  const ctaBtn = btn(content.site?.cta || 'Get in touch', '#contact');

  const headerEl = h('header', { id: 'hd' },
    logoEl,
    h('nav', {}, ...desktopNavLinks),
    ctaBtn,
    hb
  );

  return [headerEl, mm];
};
