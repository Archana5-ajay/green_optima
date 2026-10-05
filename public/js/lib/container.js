/**
 * Container settings, sizing, and custom container rendering
 */
import { isDark } from './ui.js';
import { h } from './dom.js';


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
  if (cfg.paddingTop    != null) el.style.paddingTop    = cfg.paddingTop    + 'px';
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

  // ── RAW HTML MODE — full width, zero wrapper ─────────────────────
  if (ct.mode === 'html') {
    if (!ct.htmlCode || !ct.htmlCode.trim()) return null; // nothing to show
    const wrapper = document.createElement('div');
    wrapper.className = 'ct-raw-html';
    let style = 'width:100%;display:block;';
    if (ct.minHeight && ct.minHeight > 0) {
      style += `min-height:${ct.minHeight}px;`;
    }
    wrapper.style.cssText = style;
    wrapper.innerHTML = ct.htmlCode;
    return wrapper;
  }

  // ── VIDEO MODE — padded video with controls ─────────────────────
  if (ct.mode === 'video') {
    if (!ct.videoUrl) return null;
    const minH = (ct.minHeight && ct.minHeight > 0) ? `height:${ct.minHeight}px;` : 'height:auto;';
    return h('section', {
      class: 'sec ct-video-sec',
      style: 'padding:clamp(40px,6vh,80px) 0'
    },
      h('div', { class: 'in', style: 'max-width:1340px;margin:0 auto;padding:0 var(--pad)' },
        ct.title ? h('h2', { style: 'margin-bottom:24px;text-align:center;font-size:clamp(24px,3vw,36px)' }, ct.title) : null,
        h('video', {
          src: ct.videoUrl,
          controls: '',
          playsinline: '',
          style: `width:100%;${minH}border-radius:20px;object-fit:cover;box-shadow:0 16px 40px rgba(0,0,0,.15);display:block`
        })
      )
    );
  }

  // ── TEMPLATE MODE — classic section with .in wrapper ─────────────
  const dark  = isDark(ct.bgColor);
  const bg    = ct.bgColor ? `background:${ct.bgColor};` : '';
  const col   = dark ? 'color:#fff;' : '';
  const minH  = (ct.minHeight  && ct.minHeight  > 0) ? `min-height:${ct.minHeight}px;--container-min-height:${ct.minHeight}px;` : '';
  const cardH = (ct.cardHeight && ct.cardHeight > 0) ? `--card-height:${ct.cardHeight}px;` : '';
  const cardW = (ct.cardWidth  && ct.cardWidth  > 0) ? `--card-width:${ct.cardWidth}px;`   : '';

  // Raw HTML snippet (optional, appended after cards in template mode)
  let htmlBlock = null;
  if (ct.htmlCode && ct.htmlCode.trim()) {
    htmlBlock = document.createElement('div');
    htmlBlock.className = 'ct-html-block';
    htmlBlock.style.cssText = 'margin-top:clamp(16px,2.5vh,28px)';
    htmlBlock.innerHTML = ct.htmlCode;
  }

  const cardEls = (ct.cards || []).map(card => {
    const cardCustomH = card.cardHeight ? `min-height:${card.cardHeight}px;` : '';
    return h('div', {
      class: 'custom-card',
      style: (dark ? 'background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff;' : '') + cardCustomH
    },
      card.image
        ? h('div', { style: 'margin-bottom:16px;border-radius:14px;overflow:hidden;aspect-ratio:16/9;background:#111' },
            h('img', { src: card.image, alt: card.title || '', style: 'width:100%;height:100%;object-fit:cover;display:block' })
          )
        : null,
      card.title ? h('h3', { style: dark ? 'color:#fff;' : '' }, card.title) : null,
      card.text  ? h('p',  { style: dark ? 'color:rgba(255,255,255,.8);' : '' }, card.text)  : null
    );
  });

  const inner = h('div', { class: 'in' },
    ct.tag   ? h('span', { class: 'tag' }, ct.tag) : null,
    ct.title ? h('h2', {
      style: 'margin-bottom:clamp(10px,1.5vh,20px);' + (dark ? 'color:#fff;' : '')
    }, ct.title) : null,
    ct.text  ? h('p', {
      style: 'opacity:.75;max-width:720px;margin-bottom:clamp(16px,2.5vh,32px);line-height:1.55;' + (dark ? 'color:rgba(255,255,255,.85);' : '')
    }, ct.text) : null,
    cardEls.length ? h('div', { class: 'custom-cards' }, ...cardEls) : null,
    htmlBlock
  );

  return h('section', {
    class: 'sec',
    style: `padding-top:${ct.paddingTop || 80}px;padding-bottom:${ct.paddingBottom || 80}px;${minH}${cardH}${cardW}${bg}${col}`
  }, inner);
}

