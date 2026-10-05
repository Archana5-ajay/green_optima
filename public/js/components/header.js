/**
 * Header Navigation Component
 * Supports single-row and dual-row (top bar + main bar) navbar modes.
 * ALL appearance properties are driven by content.navbarSettings (set from admin panel).
 */
import { h, media, btn } from '../lib/dom.js';

export default content => {
  const navItems = content.nav || [];
  const navTop   = content.navTop || [];
  const ns       = content.navbarSettings || {};

  // ── Resolve ALL settings with defaults ──────────────────────────
  const isDual        = ns.dualNavbar   === true;
  const mainHeight    = ns.mainHeight   || 70;
  const topHeight     = ns.topHeight    || 38;
  const mainBg        = ns.mainBg       || 'rgba(8,14,10,0.88)';
  const mainColor     = ns.mainColor    || '#ffffff';
  const topBg         = ns.topBg        || 'rgba(5,8,6,0.97)';
  const topColor      = ns.topColor     || 'rgba(180,220,190,0.82)';
  const maxWidth      = ns.maxWidth     || 1340;
  const padding       = (ns.padding     !== undefined) ? ns.padding   : 32;
  const borderRadius  = ns.borderRadius || 0;
  const topOffset     = ns.topOffset    || 0;
  const leftOffset    = ns.leftOffset   || 0;
  const rightOffset   = ns.rightOffset  || 0;
  const mainFontSize  = ns.mainFontSize || 14;
  const topFontSize   = ns.topFontSize  || 12;
  const backdropBlur  = (ns.backdropBlur !== undefined) ? ns.backdropBlur : 18;
  const borderColor   = ns.borderColor  || 'rgba(255,255,255,0.07)';
  const logoMaxHeight = ns.logoMaxHeight|| 38;

  // ── Subpage-aware anchor helper ─────────────────────────────────
  const isSubpage = typeof window !== 'undefined'
    && window.location.pathname !== '/'
    && window.location.pathname !== '';
  const resolveHref = href => {
    if (!href) return '#';
    if (href.startsWith('#') && isSubpage) return '/' + href;
    return href;
  };

  // ── Apply ALL CSS variables to :root ────────────────────────────
  const applyVars = () => {
    const r = document.documentElement;
    const totalH = isDual ? mainHeight + topHeight : mainHeight;
    r.style.setProperty('--hd-main-bg',       mainBg);
    r.style.setProperty('--hd-main-color',     mainColor);
    r.style.setProperty('--hd-main-height',    mainHeight + 'px');
    r.style.setProperty('--hd-max-width',      maxWidth + 'px');
    r.style.setProperty('--hd-padding',        padding + 'px');
    r.style.setProperty('--hd-border-radius',  borderRadius + 'px');
    r.style.setProperty('--hd-border-color',   borderColor);
    r.style.setProperty('--hd-blur',           backdropBlur + 'px');
    r.style.setProperty('--hd-total',          totalH + 'px');
    r.style.setProperty('--hd-top',            topOffset + 'px');
    r.style.setProperty('--hd-left',           leftOffset + 'px');
    r.style.setProperty('--hd-right',          rightOffset + 'px');
    if (isDual) {
      r.style.setProperty('--hd-top-bg',       topBg);
      r.style.setProperty('--hd-top-color',    topColor);
      r.style.setProperty('--hd-top-height',   topHeight + 'px');
    }
  };
  if (typeof document !== 'undefined') applyVars();

  // ── Mobile hamburger ────────────────────────────────────────────
  const hb = h('button', {
    id: 'hb',
    'aria-label': 'Menu',
    onclick: () => { hb.classList.toggle('o'); mm.classList.toggle('o'); }
  }, h('span'), h('span'));

  // ── Mobile menu links ───────────────────────────────────────────
  const mobileNavLinks = navItems.map(item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (!hasChildren) {
      return h('a', {
        href: resolveHref(item.href),
        onclick: () => { hb.classList.remove('o'); mm.classList.remove('o'); }
      }, item.label);
    }
    const subList = h('div', { class: 'mm-sub-list' },
      item.href
        ? h('a', { class: 'mm-sub-item', href: resolveHref(item.href), style: 'font-weight:700',
            onclick: () => { hb.classList.remove('o'); mm.classList.remove('o'); } }, 'Overview: ' + item.label)
        : null,
      ...item.children.map(sub =>
        h('a', { class: 'mm-sub-item', href: resolveHref(sub.href),
          onclick: () => { hb.classList.remove('o'); mm.classList.remove('o'); } }, sub.label)
      )
    );
    return h('div', { class: 'mm-dropdown' },
      h('div', { class: 'mm-dropdown-header', onclick: () => subList.classList.toggle('open') },
        item.label, h('span', { style: 'font-size:18px;opacity:.6' }, '▾')
      ),
      subList
    );
  });

  const mm = h('div', { id: 'mm' }, ...mobileNavLinks);

  // ── Desktop nav links ───────────────────────────────────────────
  const desktopNavLinks = navItems.map(item => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (!hasChildren) {
      return h('a', { class: 'nl', href: resolveHref(item.href),
        style: `font-size:${mainFontSize}px` }, item.label);
    }
    const trigger = h('a', {
      class: 'nl nav-dropdown-trigger',
      href: resolveHref(item.href) || 'javascript:void(0)',
      style: `font-size:${mainFontSize}px`
    }, item.label, h('span', { class: 'nav-dropdown-chevron' }, '▾'));

    const menu = h('div', { class: 'nav-dropdown-menu' },
      ...item.children.map(sub =>
        h('a', { class: 'nav-dropdown-item', href: resolveHref(sub.href) },
          h('span', { style: 'font-weight:600' }, sub.label),
          sub.badge
            ? h('span', { class: 'tag', style: 'margin:0 0 0 auto;font-size:10px;padding:2px 8px' }, sub.badge)
            : null
        )
      )
    );
    return h('div', { class: 'nav-dropdown' }, trigger, menu);
  });

  // ── Logo ────────────────────────────────────────────────────────
  const logoUrl = content.site?.logo;
  const logoImg = logoUrl 
    ? h('img', { src: logoUrl, style: `height:100%;max-height:${logoMaxHeight}px;width:auto;object-fit:contain;display:block` })
    : h('span', { style: 'font-weight:800;font-size:24px' }, '[ LOGO ]');

  const logoEl = h('a', {
    href: '/',
    style: `display:block;height:${logoMaxHeight}px;transition:opacity .2s`
  }, logoImg);

  const ctaBtn = btn(content.site?.cta || 'Get in touch', '#contact');

  // ── Top bar (dual mode) ─────────────────────────────────────────
  const topBarLinks = [];
  navTop.forEach((item, idx) => {
    if (idx > 0) topBarLinks.push(h('span', { class: 'hd-top-sep' }));
    topBarLinks.push(h('a', { href: resolveHref(item.href),
      style: `font-size:${topFontSize}px` }, item.label));
  });

  // If no custom navTop links configured, use defaults matching reference site
  if (topBarLinks.length === 0 && isDual) {
    const defaults = [
      { label: 'Partners', href: '#' },
      { label: 'News',     href: '#' },
      { label: 'Events',   href: '#' },
      { label: 'Green Optima Insights', href: '#' },
      { label: 'Careers',  href: '#' },
      { label: 'Contact',  href: '#contact' }
    ];
    defaults.forEach((item, idx) => {
      if (idx > 0) topBarLinks.push(h('span', { class: 'hd-top-sep' }));
      topBarLinks.push(h('a', { href: item.href, style: `font-size:${topFontSize}px` }, item.label));
    });
  }

  const topBar = h('div', { id: 'hd-top' },
    h('div', { class: 'hd-top-inner' }, ...topBarLinks)
  );

  // ── Main bar ────────────────────────────────────────────────────
  const mainBar = h('div', { id: 'hd-main' },
    h('div', { class: 'hd-inner' },
      logoEl,
      h('nav', {}, ...desktopNavLinks),
      ctaBtn,
      hb
    )
  );

  // ── Outer header wrapper ─────────────────────────────────────────
  const headerEl = h('header', {
    id: 'hd',
    class: isDual ? 'dual' : ''
  }, topBar, mainBar);

  return [headerEl, mm];
};
