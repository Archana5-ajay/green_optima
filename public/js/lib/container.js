/**
 * Container settings, sizing, and custom container rendering
 */
import { h, isDark } from './ui.js';

// Check if a section/container is active for Homepage
export function isHomeActive(cfg) {
  if (!cfg) return true;
  if (cfg.showOnHome !== undefined) return Boolean(cfg.showOnHome);
  if (cfg.activeHome !== undefined) return Boolean(cfg.activeHome);
  return cfg.active !== false;
}

// Check if a section/container is active for Subpages
export function isSubpageActive(cfg) {
  if (!cfg) return false;
  if (cfg.showOnSubpage !== undefined) return Boolean(cfg.showOnSubpage);
  if (cfg.activeSubpage !== undefined) return Boolean(cfg.activeSubpage);
  return false;
}

// Apply container settings (padding, minHeight/length, card sizing, background color)
export function applySectionSettings(el, key, sectionSettings = {}, sectionColors = {}) {
  const cfg = sectionSettings[key] || {};
  if (cfg.paddingTop != null) el.style.paddingTop = cfg.paddingTop + 'px';
  if (cfg.paddingBottom != null) el.style.paddingBottom = cfg.paddingBottom + 'px';

  if (cfg.minHeight != null && cfg.minHeight > 0) {
    el.style.minHeight = cfg.minHeight + 'px';
    el.style.setProperty('--container-min-height', cfg.minHeight + 'px');
  }
  if (cfg.cardHeight != null && cfg.cardHeight > 0) {
    el.style.setProperty('--card-height', cfg.cardHeight + 'px');
  }
  if (cfg.cardWidth != null && cfg.cardWidth > 0) {
    el.style.setProperty('--card-width', cfg.cardWidth + 'px');
  }

  const bgCol = sectionColors[key];
  if (bgCol) {
    el.style.backgroundColor = bgCol;
    if (isDark(bgCol)) el.style.color = '#fff';
  }
}

// Render a single custom container element
export function renderCustomContainer(ct) {
  const dark = isDark(ct.bgColor);
  const bg = ct.bgColor ? `background:${ct.bgColor};` : '';
  const col = dark ? 'color:#fff;' : '';
  const minH = (ct.minHeight && ct.minHeight > 0) ? `min-height:${ct.minHeight}px;--container-min-height:${ct.minHeight}px;` : '';
  const cardH = (ct.cardHeight && ct.cardHeight > 0) ? `--card-height:${ct.cardHeight}px;` : '';
  const cardW = (ct.cardWidth && ct.cardWidth > 0) ? `--card-width:${ct.cardWidth}px;` : '';

  return h('section', { class: 'sec', style: `padding-top:${ct.paddingTop || 80}px;padding-bottom:${ct.paddingBottom || 80}px;${minH}${cardH}${cardW}${bg}${col}` },
    h('div', { class: 'in' },
      ct.tag ? h('span', { class: 'tag' }, ct.tag) : null,
      ct.title ? h('h2', { style: 'margin-bottom:30px;' + (dark ? 'color:#fff;' : '') }, ct.title) : null,
      ct.text ? h('p', { style: 'opacity:.75;max-width:720px;margin-bottom:40px;' + (dark ? 'color:rgba(255,255,255,.85);' : '') }, ct.text) : null,
      (ct.cards || []).length
        ? h('div', { class: 'custom-cards' },
            (ct.cards || []).map(card => {
              const cardCustomH = card.cardHeight ? `min-height:${card.cardHeight}px;` : '';
              return h('div', { class: 'custom-card', style: (dark ? 'background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff;' : '') + cardCustomH },
                card.image
                  ? h('div', { style: 'margin-bottom:16px;border-radius:14px;overflow:hidden;aspect-ratio:16/9;background:#111' },
                      h('img', { src: card.image, alt: card.title || '', style: 'width:100%;height:100%;object-fit:cover;display:block' })
                    )
                  : null,
                card.title ? h('h3', { style: dark ? 'color:#fff;' : '' }, card.title) : null,
                card.text ? h('p', { style: dark ? 'color:rgba(255,255,255,.8);' : '' }, card.text) : null
              );
            })
          )
        : null
    )
  );
}
