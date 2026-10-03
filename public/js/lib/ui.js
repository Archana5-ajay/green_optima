/**
 * UI components, element helpers, and animations
 */
import { h } from './dom.js';

export { h, media, video, btn, tag, icon, iconOrImg, embed } from './dom.js';

// Helper: check if a hex color is dark
export function isDark(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  let col = hex.slice(1);
  if (col.length === 3) col = col.split('').map(x => x + x).join('');
  const r = parseInt(col.substr(0, 2), 16);
  const g = parseInt(col.substr(2, 2), 16);
  const b = parseInt(col.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 145;
}

// Back button component
export function backButton(text = '← Back', href = '/#services') {
  return h('a', { href, class: 'back-btn' }, text);
}

// Global scroll reveal observer
export function initScrollReveal() {
  const selector = 'section h2, section .tag, section .sq, .ind-c, .svc, .cs-card, .cs-side, .ab-c, .ab-big, .vals > div, .sw, .cmp .r, .bc, .custom-card, .ab-vid-sec, .tt';
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    if (el.parentElement) {
      const parent = el.parentElement;
      if (
        parent.classList.contains('ind-g') ||
        parent.classList.contains('custom-cards') ||
        parent.classList.contains('bl') ||
        parent.classList.contains('ab-r')
      ) {
        const idx = Array.from(parent.children).indexOf(el);
        el.style.transitionDelay = `${(idx % 6) * 0.08}s`;
      }
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
