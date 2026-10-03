/**
 * Page Content Builder – Visual block-based editor for custom pages
 * Generates HTML/CSS code from structured content blocks.
 * Block types: hero, cards, textBlock, featureList, stats, testimonials, cta, imageText
 */
import { h } from '../dom.js';
import { touch } from '../state.js';
import { renderImageWidget } from '../fields.js';

// ─── Code Generator ──────────────────────────────────────────────────────────

function generateBlockCode(block) {
  switch (block.type) {
    case 'hero': return genHero(block);
    case 'cards': return genCards(block);
    case 'textBlock': return genTextBlock(block);
    case 'featureList': return genFeatureList(block);
    case 'stats': return genStats(block);
    case 'testimonials': return genTestimonials(block);
    case 'cta': return genCta(block);
    case 'imageText': return genImageText(block);
    default: return '';
  }
}

function genHero(b) {
  return `<!-- Hero Section: ${b.title || 'Hero'} -->
<section class="pcb-hero-sec">
  <div class="wrap pcb-hero-inner">
    ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
    <h1 class="pcb-hero-h">${b.title || 'Page Title'}</h1>
    ${b.subtitle ? `<p class="pcb-hero-sub">${b.subtitle}</p>` : ''}
    ${b.ctaText ? `<div class="pcb-hero-ctas">
      <a href="${b.ctaHref || '#contact'}" class="btn">${b.ctaText}</a>
      ${b.cta2Text ? `<a href="${b.cta2Href || '#'}" class="btn-out">${b.cta2Text}</a>` : ''}
    </div>` : ''}
    ${b.image ? `<div class="pcb-hero-img-wrap"><img src="${b.image}" alt="${b.title || ''}" class="pcb-hero-img" /></div>` : ''}
  </div>
</section>
<style>
.pcb-hero-sec{background:radial-gradient(circle at 50% 20%,rgba(24,160,65,.16) 0%,transparent 68%);padding:clamp(80px,12vh,160px) 0 clamp(40px,6vh,80px)}
.pcb-hero-inner{text-align:center}
.pcb-hero-h{font:700 clamp(36px,5vw,64px)/1.1 Inter,sans-serif;letter-spacing:-2.5px;color:var(--cream);margin:16px 0 20px}
.pcb-hero-sub{font-size:clamp(15px,1.4vw,20px);line-height:1.7;max-width:760px;margin:0 auto 36px;opacity:.85;color:var(--cream)}
.pcb-hero-ctas{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:40px}
.pcb-hero-img-wrap{border-radius:20px;overflow:hidden;max-width:900px;margin:0 auto}
.pcb-hero-img{width:100%;height:auto;display:block}
</style>`;
}

function genCards(b) {
  const cards = b.cards || [];
  const cols = b.columns || 3;
  const cardsHtml = cards.map((c, i) => `    <div class="pcb-card" tabindex="0">
      ${c.badge ? `<span class="pcb-card-badge">${c.badge}</span>` : ''}
      ${c.icon ? `<div class="pcb-card-icon">${c.icon}</div>` : ''}
      ${c.image ? `<img src="${c.image}" alt="${c.title || ''}" class="pcb-card-img" />` : ''}
      <h3 class="pcb-card-title">${c.title || `Card ${i + 1}`}</h3>
      ${c.text ? `<p class="pcb-card-text">${c.text}</p>` : ''}
      ${c.ctaText ? `<a href="${c.ctaHref || '#'}" class="pcb-card-cta">${c.ctaText} \u2192</a>` : ''}
    </div>`).join('\n');

  return `<!-- Cards Section: ${b.heading || 'Cards'} -->
<section class="wrap pcb-cards-sec">
  ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
  ${b.heading ? `<h2 class="pcb-sec-h">${b.heading}</h2>` : ''}
  ${b.subheading ? `<p class="pcb-sec-sub">${b.subheading}</p>` : ''}
  <div class="pcb-cards-grid" style="--pcb-cols:${cols}">
${cardsHtml}
  </div>
</section>
<style>
.pcb-cards-sec{padding:clamp(48px,7vh,100px) var(--pad)}
.pcb-sec-h{font:700 clamp(26px,3.2vw,44px)/1.15 Inter,sans-serif;letter-spacing:-1.5px;color:var(--cream);margin:12px 0 16px;text-align:center}
.pcb-sec-sub{font-size:clamp(14px,1.2vw,17px);line-height:1.7;opacity:.8;text-align:center;max-width:680px;margin:0 auto 40px;color:var(--cream)}
.pcb-cards-grid{display:grid;grid-template-columns:repeat(var(--pcb-cols,3),1fr);gap:clamp(16px,2vw,28px)}
@media(max-width:900px){.pcb-cards-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.pcb-cards-grid{grid-template-columns:1fr}}
.pcb-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:clamp(20px,2.5vw,36px) clamp(16px,2vw,28px);transition:transform .3s,border-color .3s,background .3s;cursor:default}
.pcb-card:hover,.pcb-card:focus{transform:translateY(-5px);border-color:var(--lime);background:rgba(255,255,255,.08);outline:none}
.pcb-card-badge{display:inline-block;font:700 11px/1 'Red Hat Mono',monospace;color:var(--lime);background:rgba(228,254,123,.12);padding:5px 11px;border-radius:20px;margin-bottom:14px}
.pcb-card-icon{font-size:32px;margin-bottom:12px}
.pcb-card-img{width:100%;border-radius:12px;margin-bottom:14px;height:160px;object-fit:cover}
.pcb-card-title{font-size:clamp(17px,1.5vw,22px);font-weight:700;color:var(--cream);margin-bottom:10px}
.pcb-card-text{font-size:clamp(13px,1vw,15px);line-height:1.65;opacity:.8;color:var(--cream)}
.pcb-card-cta{display:inline-block;margin-top:14px;font-size:13px;font-weight:700;color:var(--lime);text-decoration:none}
.pcb-card-cta:hover{text-decoration:underline}
</style>`;
}

function genTextBlock(b) {
  return `<!-- Text Block: ${b.heading || 'Section'} -->
<section class="wrap pcb-text-sec" style="text-align:${b.align || 'center'}">
  ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
  ${b.heading ? `<h2 class="pcb-sec-h" style="text-align:${b.align||'center'}">${b.heading}</h2>` : ''}
  ${b.body ? `<div class="pcb-text-body">${b.body.replace(/\n/g, '<br/>')}</div>` : ''}
</section>
<style>
.pcb-text-sec{padding:clamp(40px,6vh,90px) var(--pad)}
.pcb-text-body{font-size:clamp(14px,1.2vw,18px);line-height:1.8;opacity:.85;color:var(--cream);max-width:820px;margin:0 auto}
</style>`;
}

function genFeatureList(b) {
  const items = b.items || [];
  const cols = b.columns || 2;
  const itemsHtml = items.map(it => `    <div class="pcb-feat-item">
      <span class="pcb-feat-check">${it.icon || '\u2713'}</span>
      <div>
        <strong class="pcb-feat-title">${it.title || 'Feature'}</strong>
        ${it.text ? `<p class="pcb-feat-text">${it.text}</p>` : ''}
      </div>
    </div>`).join('\n');

  return `<!-- Feature List: ${b.heading || 'Features'} -->
<section class="wrap pcb-feat-sec">
  ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
  ${b.heading ? `<h2 class="pcb-sec-h">${b.heading}</h2>` : ''}
  ${b.subheading ? `<p class="pcb-sec-sub">${b.subheading}</p>` : ''}
  <div class="pcb-feat-grid" style="--pcb-fcols:${cols}">
${itemsHtml}
  </div>
</section>
<style>
.pcb-feat-sec{padding:clamp(48px,7vh,100px) var(--pad)}
.pcb-feat-grid{display:grid;grid-template-columns:repeat(var(--pcb-fcols,2),1fr);gap:clamp(14px,2vw,24px)}
@media(max-width:700px){.pcb-feat-grid{grid-template-columns:1fr}}
.pcb-feat-item{display:flex;gap:14px;align-items:flex-start;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:20px 22px}
.pcb-feat-check{width:32px;height:32px;min-width:32px;background:var(--green);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
.pcb-feat-title{font-size:15px;font-weight:700;color:var(--cream);display:block;margin-bottom:4px}
.pcb-feat-text{font-size:13px;line-height:1.6;opacity:.8;color:var(--cream);margin:0}
</style>`;
}

function genStats(b) {
  const items = b.stats || [];
  const statsHtml = items.map(s => `    <div class="pcb-stat-item">
      <span class="pcb-stat-num">${s.value || '0'}</span>
      <span class="pcb-stat-label">${s.label || 'Metric'}</span>
      ${s.sub ? `<span class="pcb-stat-sub">${s.sub}</span>` : ''}
    </div>`).join('\n');

  return `<!-- Stats Section: ${b.heading || 'Stats'} -->
<section class="pcb-stats-sec">
  <div class="wrap">
    ${b.heading ? `<h2 class="pcb-sec-h">${b.heading}</h2>` : ''}
    ${b.subheading ? `<p class="pcb-sec-sub">${b.subheading}</p>` : ''}
    <div class="pcb-stats-grid">
${statsHtml}
    </div>
  </div>
</section>
<style>
.pcb-stats-sec{padding:clamp(40px,6vh,80px) 0;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07)}
.pcb-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:clamp(16px,3vw,40px);margin-top:32px}
.pcb-stat-item{text-align:center;padding:clamp(16px,2.5vw,32px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px}
.pcb-stat-num{display:block;font:800 clamp(32px,4vw,52px)/1 Inter,sans-serif;color:var(--lime);margin-bottom:8px}
.pcb-stat-label{display:block;font-size:clamp(12px,1vw,15px);font-weight:700;color:var(--cream);opacity:.9;text-transform:uppercase;letter-spacing:.06em}
.pcb-stat-sub{display:block;font-size:11px;color:var(--muted);margin-top:4px}
</style>`;
}

function genTestimonials(b) {
  const items = b.items || [];
  const itemsHtml = items.map(t => `    <div class="pcb-test-card">
      <div class="pcb-test-stars">${'\u2605'.repeat(t.rating || 5)}</div>
      <p class="pcb-test-quote">"${t.quote || 'Great product!'}"</p>
      <div class="pcb-test-author">
        ${t.avatar ? `<img src="${t.avatar}" alt="${t.name||''}" class="pcb-test-av"/>` : `<div class="pcb-test-av-placeholder">${(t.name||'A')[0]}</div>`}
        <div>
          <strong class="pcb-test-name">${t.name || 'Customer'}</strong>
          ${t.role ? `<span class="pcb-test-role">${t.role}</span>` : ''}
        </div>
      </div>
    </div>`).join('\n');

  return `<!-- Testimonials: ${b.heading || 'Reviews'} -->
<section class="wrap pcb-test-sec">
  ${b.heading ? `<h2 class="pcb-sec-h">${b.heading}</h2>` : ''}
  ${b.subheading ? `<p class="pcb-sec-sub">${b.subheading}</p>` : ''}
  <div class="pcb-test-grid">
${itemsHtml}
  </div>
</section>
<style>
.pcb-test-sec{padding:clamp(48px,7vh,100px) var(--pad)}
.pcb-test-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(14px,2vw,24px)}
.pcb-test-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:clamp(20px,2.5vw,32px)}
.pcb-test-stars{color:#f59e0b;font-size:16px;margin-bottom:12px}
.pcb-test-quote{font-size:clamp(14px,1.1vw,16px);line-height:1.7;color:var(--cream);opacity:.9;margin-bottom:20px;font-style:italic}
.pcb-test-author{display:flex;align-items:center;gap:12px}
.pcb-test-av{width:40px;height:40px;border-radius:50%;object-fit:cover}
.pcb-test-av-placeholder{width:40px;height:40px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:16px}
.pcb-test-name{display:block;font-weight:700;font-size:14px;color:var(--cream)}
.pcb-test-role{display:block;font-size:12px;color:var(--muted);margin-top:2px}
</style>`;
}

function genCta(b) {
  return `<!-- CTA Section: ${b.heading || 'Call to Action'} -->
<section class="pcb-cta-sec">
  <div class="wrap pcb-cta-inner">
    ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
    <h2 class="pcb-cta-h">${b.heading || 'Ready to get started?'}</h2>
    ${b.subheading ? `<p class="pcb-cta-sub">${b.subheading}</p>` : ''}
    <div class="pcb-cta-btns">
      ${b.ctaText ? `<a href="${b.ctaHref || '#contact'}" class="btn">${b.ctaText}</a>` : ''}
      ${b.cta2Text ? `<a href="${b.cta2Href || '#'}" class="btn-out">${b.cta2Text}</a>` : ''}
    </div>
  </div>
</section>
<style>
.pcb-cta-sec{padding:clamp(60px,9vh,120px) 0;background:radial-gradient(circle at 50% 50%,rgba(24,160,65,.14) 0%,transparent 70%)}
.pcb-cta-inner{text-align:center}
.pcb-cta-h{font:700 clamp(28px,3.5vw,48px)/1.15 Inter,sans-serif;color:var(--cream);letter-spacing:-1.5px;margin:12px 0 16px}
.pcb-cta-sub{font-size:clamp(14px,1.2vw,18px);line-height:1.7;opacity:.8;color:var(--cream);max-width:680px;margin:0 auto 32px}
.pcb-cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
</style>`;
}

function genImageText(b) {
  const flip = b.flip ? 'row-reverse' : 'row';
  const pointsHtml = (b.points || []).map(pt => `<li>${pt}</li>`).join('');
  return `<!-- Image + Text Section: ${b.heading || 'Section'} -->
<section class="wrap pcb-imgtext-sec" style="--pcb-dir:${flip}">
  <div class="pcb-imgtext-grid">
    <div class="pcb-imgtext-media">
      ${b.image ? `<img src="${b.image}" alt="${b.heading||''}" class="pcb-imgtext-img"/>` : '<div class="pcb-imgtext-placeholder">\ud83d\udcf7 Add an image</div>'}
    </div>
    <div class="pcb-imgtext-content">
      ${b.tag ? `<span class="tag">${b.tag}</span>` : ''}
      <h2 class="pcb-imgtext-h">${b.heading || 'Section Heading'}</h2>
      ${b.body ? `<p class="pcb-imgtext-body">${b.body}</p>` : ''}
      ${pointsHtml ? `<ul class="pcb-imgtext-list">${pointsHtml}</ul>` : ''}
      ${b.ctaText ? `<a href="${b.ctaHref||'#contact'}" class="btn" style="margin-top:24px;display:inline-block">${b.ctaText}</a>` : ''}
    </div>
  </div>
</section>
<style>
.pcb-imgtext-sec{padding:clamp(48px,7vh,100px) var(--pad)}
.pcb-imgtext-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,80px);align-items:center}
@media(max-width:860px){.pcb-imgtext-grid{grid-template-columns:1fr}}
.pcb-imgtext-img{width:100%;border-radius:20px;object-fit:cover;height:340px}
.pcb-imgtext-placeholder{height:300px;background:rgba(255,255,255,.05);border:2px dashed rgba(255,255,255,.18);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;opacity:.5}
.pcb-imgtext-h{font:700 clamp(24px,2.8vw,40px)/1.15 Inter,sans-serif;color:var(--cream);letter-spacing:-1px;margin:12px 0 16px}
.pcb-imgtext-body{font-size:clamp(14px,1.1vw,16px);line-height:1.75;opacity:.85;color:var(--cream);margin-bottom:16px}
.pcb-imgtext-list{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.pcb-imgtext-list li{font-size:14px;color:var(--cream);opacity:.85;padding-left:24px;position:relative}
.pcb-imgtext-list li::before{content:"\u2713";position:absolute;left:0;color:var(--lime);font-weight:800}
</style>`;
}

// ─── Generate full page code from all blocks ─────────────────────────────────

export function generatePageCode(blocks) {
  if (!blocks || blocks.length === 0) return '';
  return blocks.map(generateBlockCode).join('\n\n');
}

// ─── Block Type Configs (for UI) ─────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: 'hero', label: '\ud83e\uddb8 Hero Section', icon: '\ud83e\uddb8', desc: 'Full-width hero with headline, subtitle, and CTA buttons' },
  { type: 'cards', label: '\ud83c\udccf Cards Grid', icon: '\ud83c\udccf', desc: 'Grid of cards with icons, badges, images, and links' },
  { type: 'textBlock', label: '\ud83d\udcdd Text Block', icon: '\ud83d\udcdd', desc: 'Rich text section with heading and body copy' },
  { type: 'featureList', label: '\u2705 Feature List', icon: '\u2705', desc: 'Grid of features with icons and descriptions' },
  { type: 'stats', label: '\ud83d\udcca Stats / Metrics', icon: '\ud83d\udcca', desc: 'Row of key numbers and metrics' },
  { type: 'imageText', label: '\ud83d\uddbc Image + Text', icon: '\ud83d\uddbc', desc: 'Side-by-side image and text layout' },
  { type: 'testimonials', label: '\u2b50 Testimonials', icon: '\u2b50', desc: 'Customer review cards' },
  { type: 'cta', label: '\ud83c\udfaf CTA Banner', icon: '\ud83c\udfaf', desc: 'Call-to-action section with headline and buttons' },
];

function defaultBlock(type) {
  switch (type) {
    case 'hero': return { type, tag: '', title: 'Page Headline', subtitle: 'Describe your solution here.', ctaText: 'Get Started', ctaHref: '#contact', cta2Text: 'Learn More', cta2Href: '#', image: '', _open: true };
    case 'cards': return { type, tag: '', heading: 'Our Features', subheading: '', columns: 3, cards: [{ title: 'Card 1', text: 'Description', badge: 'Feature', icon: '\u26a1', image: '', ctaText: '', ctaHref: '' }], _open: true };
    case 'textBlock': return { type, tag: '', heading: 'Section Heading', body: 'Write your section content here.', align: 'center', _open: true };
    case 'featureList': return { type, tag: '', heading: 'Key Capabilities', subheading: '', columns: 2, items: [{ title: 'Feature One', text: 'Feature description.', icon: '\u2713' }], _open: true };
    case 'stats': return { type, heading: 'Impact at a Glance', subheading: '', stats: [{ value: '99%', label: 'Uptime', sub: '' }, { value: '500+', label: 'Clients', sub: '' }, { value: '24/7', label: 'Support', sub: '' }], _open: true };
    case 'testimonials': return { type, heading: 'What Our Clients Say', subheading: '', items: [{ name: 'John Doe', role: 'CEO, Company', quote: 'Excellent product!', rating: 5, avatar: '' }], _open: true };
    case 'cta': return { type, tag: '', heading: 'Ready to Get Started?', subheading: 'Contact us today to learn how we can help.', ctaText: 'Schedule a Demo', ctaHref: '#contact', cta2Text: 'View Case Studies', cta2Href: '#cases', _open: true };
    case 'imageText': return { type, tag: '', heading: 'Section Heading', body: 'Add your content here.', image: '', ctaText: '', ctaHref: '#contact', points: ['Key benefit one', 'Key benefit two'], flip: false, _open: true };
    default: return { type, _open: true };
  }
}

// ─── Helper UI utilities ─────────────────────────────────────────────────────

function inp(obj, key, onChange, placeholder) {
  return h('input', {
    type: 'text', value: obj[key] || '', placeholder: placeholder || '',
    oninput: e => { obj[key] = e.target.value; onChange(); }
  });
}

function ta(obj, key, onChange, placeholder, rows) {
  return h('textarea', {
    rows: rows || 3, placeholder: placeholder || '',
    oninput: e => { obj[key] = e.target.value; onChange(); }
  }, obj[key] || '');
}

function fld(label, el) {
  return h('div', { style: 'display:flex;flex-direction:column;gap:4px' },
    h('label', { style: 'font-size:12px;font-weight:700;color:var(--ink)' }, label),
    el
  );
}

function row2(...children) {
  return h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px' }, ...children);
}

function row3(...children) {
  return h('div', { style: 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:10px' }, ...children);
}

// ─── Block Editors ────────────────────────────────────────────────────────────

function renderHeroEditor(block, onChange) {
  return h('div', { style: 'display:grid;gap:0' },
    row2(fld('Tag / Eyebrow', inp(block, 'tag', onChange, 'e.g. Enterprise Solution')), fld('Hero Headline', inp(block, 'title', onChange, 'e.g. Smart Integration Platform'))),
    h('div', { style: 'margin-top:10px' }, fld('Subtitle / Description', ta(block, 'subtitle', onChange, 'Describe your value proposition...'))),
    row2(fld('Primary CTA Label', inp(block, 'ctaText', onChange, 'e.g. Get Started')), fld('Primary CTA Link', inp(block, 'ctaHref', onChange, '#contact'))),
    row2(fld('Secondary CTA Label', inp(block, 'cta2Text', onChange, 'e.g. Learn More')), fld('Secondary CTA Link', inp(block, 'cta2Href', onChange, '#'))),
    h('div', { style: 'margin-top:10px' }, renderImageWidget(block, 'image', 'Hero Background Image (Optional)'))
  );
}

function renderCardsEditor(block, onChange) {
  block.cards = block.cards || [];
  const wrap = h('div', {});
  const redraw = () => wrap.replaceWith(renderCardsEditor(block, onChange));

  wrap.append(
    row2(fld('Section Tag', inp(block, 'tag', onChange, 'e.g. Features')), fld('Section Heading', inp(block, 'heading', onChange, 'e.g. Our Features'))),
    h('div', { style: 'margin-top:10px' }, fld('Section Subheading', inp(block, 'subheading', onChange, 'Optional supporting text'))),
    h('div', { style: 'margin-top:10px' }, fld('Columns (1-4)',
      h('select', { onchange: e => { block.columns = parseInt(e.target.value); onChange(); } },
        ...[1, 2, 3, 4].map(n => {
          const opt = h('option', { value: n }, n + ' Column' + (n > 1 ? 's' : ''));
          if ((block.columns || 3) === n) opt.selected = true;
          return opt;
        })
      )
    )),
    h('div', { style: 'margin-top:16px;font-weight:700;font-size:12px;color:var(--ink);letter-spacing:.04em;text-transform:uppercase;padding-bottom:6px;border-bottom:1px solid var(--ln)' }, 'Cards (' + block.cards.length + ')'),
    ...block.cards.map((card, ci) => h('div', { class: 'it', style: 'margin-top:10px;padding:14px;border-radius:10px;border:1px solid var(--ln);background:rgba(0,0,0,.02)' },
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px' },
        h('span', { style: 'font-weight:700;font-size:12px;text-transform:uppercase;color:var(--muted)' }, 'Card #' + (ci + 1)),
        h('button', {
          type: 'button', class: 'danger', style: 'font-size:11px;padding:3px 8px',
          onclick: () => { block.cards.splice(ci, 1); onChange(); redraw(); }
        }, '\u2715 Remove')
      ),
      row2(fld('Card Title', inp(card, 'title', onChange, 'Card Title')), fld('Badge', inp(card, 'badge', onChange, 'e.g. NEW, POPULAR'))),
      row2(fld('Icon (emoji)', inp(card, 'icon', onChange, 'e.g. \u26a1 \ud83d\udd12 \ud83d\udcca')), fld('CTA Label', inp(card, 'ctaText', onChange, 'e.g. Learn More'))),
      h('div', { style: 'margin-top:10px' }, fld('CTA Link', inp(card, 'ctaHref', onChange, '#'))),
      h('div', { style: 'margin-top:10px' }, fld('Card Description', ta(card, 'text', onChange, 'Brief description'))),
      h('div', { style: 'margin-top:8px' }, renderImageWidget(card, 'image', 'Card Image (Optional)'))
    )),
    h('button', {
      type: 'button', class: 'p', style: 'font-size:12px;padding:7px 16px;margin-top:10px',
      onclick: () => { block.cards.push({ title: 'Card ' + (block.cards.length + 1), text: '', badge: '', icon: '', image: '', ctaText: '', ctaHref: '' }); onChange(); redraw(); }
    }, '\uff0b Add Card')
  );
  return wrap;
}

function renderTextBlockEditor(block, onChange) {
  return h('div', { style: 'display:grid;gap:0' },
    row2(
      fld('Tag / Eyebrow', inp(block, 'tag', onChange, 'e.g. About Us')),
      fld('Text Alignment',
        h('select', { onchange: e => { block.align = e.target.value; onChange(); } },
          ['left', 'center', 'right'].map(a => {
            const opt = h('option', { value: a }, a.charAt(0).toUpperCase() + a.slice(1));
            if ((block.align || 'center') === a) opt.selected = true;
            return opt;
          })
        )
      )
    ),
    h('div', { style: 'margin-top:10px' }, fld('Section Heading', inp(block, 'heading', onChange, 'Heading text'))),
    h('div', { style: 'margin-top:10px' }, fld('Body Text', ta(block, 'body', onChange, 'Your section content...', 5)))
  );
}

function renderFeatureListEditor(block, onChange) {
  block.items = block.items || [];
  const wrap = h('div', {});
  const redraw = () => wrap.replaceWith(renderFeatureListEditor(block, onChange));

  wrap.append(
    row2(
      fld('Section Tag', inp(block, 'tag', onChange, 'e.g. Capabilities')),
      fld('Columns',
        h('select', { onchange: e => { block.columns = parseInt(e.target.value); onChange(); } },
          [1, 2, 3].map(n => {
            const opt = h('option', { value: n }, n + ' Col');
            if ((block.columns || 2) === n) opt.selected = true;
            return opt;
          })
        )
      )
    ),
    row2(fld('Section Heading', inp(block, 'heading', onChange, 'e.g. Key Capabilities')), fld('Subheading', inp(block, 'subheading', onChange, ''))),
    h('div', { style: 'margin-top:16px;font-weight:700;font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.04em;padding-bottom:6px;border-bottom:1px solid var(--ln)' }, 'Features (' + block.items.length + ')'),
    ...block.items.map((item, ii) => h('div', { class: 'it', style: 'margin-top:8px;padding:12px;border-radius:10px;border:1px solid var(--ln);background:rgba(0,0,0,.02)' },
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' },
        h('span', { style: 'font-weight:700;font-size:12px;color:var(--muted)' }, 'Feature #' + (ii + 1)),
        h('button', { type: 'button', class: 'danger', style: 'font-size:11px;padding:3px 8px', onclick: () => { block.items.splice(ii, 1); onChange(); redraw(); } }, '\u2715')
      ),
      row2(fld('Icon / Emoji', inp(item, 'icon', onChange, '\u2713 or emoji')), fld('Feature Title', inp(item, 'title', onChange, 'Feature name'))),
      h('div', { style: 'margin-top:8px' }, fld('Feature Description', ta(item, 'text', onChange, 'Describe this feature...', 2)))
    )),
    h('button', {
      type: 'button', class: 'p', style: 'font-size:12px;padding:7px 16px;margin-top:8px',
      onclick: () => { block.items.push({ title: 'New Feature', text: '', icon: '\u2713' }); onChange(); redraw(); }
    }, '\uff0b Add Feature')
  );
  return wrap;
}

function renderStatsEditor(block, onChange) {
  block.stats = block.stats || [];
  const wrap = h('div', {});
  const redraw = () => wrap.replaceWith(renderStatsEditor(block, onChange));

  wrap.append(
    row2(fld('Section Heading', inp(block, 'heading', onChange, 'e.g. Impact at a Glance')), fld('Subheading', inp(block, 'subheading', onChange, ''))),
    h('div', { style: 'margin-top:16px;font-weight:700;font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.04em;padding-bottom:6px;border-bottom:1px solid var(--ln)' }, 'Stats (' + block.stats.length + ')'),
    ...block.stats.map((stat, si) => h('div', { class: 'it', style: 'margin-top:8px;padding:12px;border-radius:10px;border:1px solid var(--ln);background:rgba(0,0,0,.02)' },
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' },
        h('span', { style: 'font-weight:700;font-size:12px;color:var(--muted)' }, 'Stat #' + (si + 1)),
        h('button', { type: 'button', class: 'danger', style: 'font-size:11px;padding:3px 8px', onclick: () => { block.stats.splice(si, 1); onChange(); redraw(); } }, '\u2715')
      ),
      row3(fld('Value', inp(stat, 'value', onChange, 'e.g. 99%')), fld('Label', inp(stat, 'label', onChange, 'e.g. Uptime')), fld('Subtitle', inp(stat, 'sub', onChange, 'Optional note')))
    )),
    h('button', {
      type: 'button', class: 'p', style: 'font-size:12px;padding:7px 16px;margin-top:8px',
      onclick: () => { block.stats.push({ value: '100+', label: 'New Metric', sub: '' }); onChange(); redraw(); }
    }, '\uff0b Add Stat')
  );
  return wrap;
}

function renderTestimonialsEditor(block, onChange) {
  block.items = block.items || [];
  const wrap = h('div', {});
  const redraw = () => wrap.replaceWith(renderTestimonialsEditor(block, onChange));

  wrap.append(
    row2(fld('Section Heading', inp(block, 'heading', onChange, 'What Our Clients Say')), fld('Subheading', inp(block, 'subheading', onChange, ''))),
    h('div', { style: 'margin-top:16px;font-weight:700;font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.04em;padding-bottom:6px;border-bottom:1px solid var(--ln)' }, 'Testimonials (' + block.items.length + ')'),
    ...block.items.map((t, ti) => h('div', { class: 'it', style: 'margin-top:8px;padding:12px;border-radius:10px;border:1px solid var(--ln);background:rgba(0,0,0,.02)' },
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' },
        h('span', { style: 'font-weight:700;font-size:12px;color:var(--muted)' }, 'Review #' + (ti + 1)),
        h('button', { type: 'button', class: 'danger', style: 'font-size:11px;padding:3px 8px', onclick: () => { block.items.splice(ti, 1); onChange(); redraw(); } }, '\u2715')
      ),
      row2(fld('Name', inp(t, 'name', onChange, 'Customer Name')), fld('Role / Company', inp(t, 'role', onChange, 'CEO, Company Ltd'))),
      h('div', { style: 'margin-top:8px' }, fld('Quote', ta(t, 'quote', onChange, 'Their testimonial...', 2))),
      row2(
        fld('Rating (1-5)', h('input', { type: 'number', min: 1, max: 5, value: t.rating || 5, oninput: e => { t.rating = parseInt(e.target.value); onChange(); } })),
        fld('Avatar URL', inp(t, 'avatar', onChange, '/uploads/...'))
      )
    )),
    h('button', {
      type: 'button', class: 'p', style: 'font-size:12px;padding:7px 16px;margin-top:8px',
      onclick: () => { block.items.push({ name: 'Customer Name', role: 'CEO, Company', quote: 'Great experience!', rating: 5, avatar: '' }); onChange(); redraw(); }
    }, '\uff0b Add Testimonial')
  );
  return wrap;
}

function renderCtaEditor(block, onChange) {
  return h('div', { style: 'display:grid;gap:0' },
    row2(fld('Tag / Eyebrow', inp(block, 'tag', onChange, 'e.g. Get Started')), fld('CTA Heading', inp(block, 'heading', onChange, 'Ready to Begin?'))),
    h('div', { style: 'margin-top:10px' }, fld('Subheading', ta(block, 'subheading', onChange, 'Supporting line under the heading', 2))),
    row2(fld('Primary CTA Label', inp(block, 'ctaText', onChange, 'e.g. Book a Demo')), fld('Primary CTA Link', inp(block, 'ctaHref', onChange, '#contact'))),
    row2(fld('Secondary CTA Label', inp(block, 'cta2Text', onChange, 'e.g. Read Case Studies')), fld('Secondary CTA Link', inp(block, 'cta2Href', onChange, '#')))
  );
}

function renderImageTextEditor(block, onChange) {
  block.points = block.points || [];
  const wrap = h('div', { style: 'display:grid;gap:0' });
  const redraw = () => wrap.replaceWith(renderImageTextEditor(block, onChange));

  wrap.append(
    row2(
      fld('Tag / Eyebrow', inp(block, 'tag', onChange, '')),
      fld('Layout Direction',
        h('select', { onchange: e => { block.flip = e.target.value === '1'; onChange(); } },
          (() => {
            const o1 = h('option', { value: '0' }, 'Image Left, Text Right');
            const o2 = h('option', { value: '1' }, 'Text Left, Image Right');
            if (block.flip) o2.selected = true; else o1.selected = true;
            return [o1, o2];
          })()
        )
      )
    ),
    h('div', { style: 'margin-top:10px' }, fld('Section Heading', inp(block, 'heading', onChange, 'Heading...'))),
    h('div', { style: 'margin-top:10px' }, fld('Body Text', ta(block, 'body', onChange, 'Section body copy...', 3))),
    h('div', { style: 'margin-top:10px' }, renderImageWidget(block, 'image', 'Section Image')),
    row2(fld('CTA Label', inp(block, 'ctaText', onChange, 'e.g. Learn More')), fld('CTA Link', inp(block, 'ctaHref', onChange, '#contact'))),
    h('div', { style: 'margin-top:14px;font-weight:700;font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.04em;padding-bottom:6px;border-bottom:1px solid var(--ln)' }, 'Bullet Points (' + block.points.length + ')'),
    ...block.points.map((pt, pi) => h('div', { style: 'display:flex;gap:8px;margin-top:6px' },
      h('input', { type: 'text', value: pt, style: 'flex:1', oninput: e => { block.points[pi] = e.target.value; onChange(); } }),
      h('button', { type: 'button', class: 'danger', style: 'padding:4px 10px;font-size:11px', onclick: () => { block.points.splice(pi, 1); onChange(); redraw(); } }, '\u2715')
    )),
    h('button', {
      type: 'button', style: 'font-size:12px;padding:6px 14px;margin-top:8px',
      onclick: () => { block.points.push('New bullet point'); onChange(); redraw(); }
    }, '\uff0b Add Bullet Point')
  );
  return wrap;
}

function renderBlockEditor(block, onChange) {
  switch (block.type) {
    case 'hero': return renderHeroEditor(block, onChange);
    case 'cards': return renderCardsEditor(block, onChange);
    case 'textBlock': return renderTextBlockEditor(block, onChange);
    case 'featureList': return renderFeatureListEditor(block, onChange);
    case 'stats': return renderStatsEditor(block, onChange);
    case 'testimonials': return renderTestimonialsEditor(block, onChange);
    case 'cta': return renderCtaEditor(block, onChange);
    case 'imageText': return renderImageTextEditor(block, onChange);
    default: return h('p', {}, 'Unknown block type: ' + block.type);
  }
}

// ─── Block Palette Picker ─────────────────────────────────────────────────────

function renderBlockPalette(onAdd) {
  return h('div', {
    style: 'background:var(--card);border:1px solid var(--ln);border-radius:16px;padding:20px;margin-top:14px'
  },
    h('p', { style: 'font-weight:700;font-size:13px;margin-bottom:14px;color:var(--ink)' }, 'Choose a content block type to add:'),
    h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px' },
      ...BLOCK_TYPES.map(bt => h('button', {
        type: 'button',
        style: 'text-align:left;padding:14px 16px;border:1px solid var(--ln);border-radius:12px;background:rgba(255,255,255,.03);cursor:pointer;transition:all .2s',
        onmouseover: e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = 'rgba(24,160,65,.07)'; },
        onmouseout: e => { e.currentTarget.style.borderColor = 'var(--ln)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; },
        onclick: () => onAdd(bt.type)
      },
        h('div', { style: 'font-size:22px;margin-bottom:6px' }, bt.icon),
        h('div', { style: 'font-weight:700;font-size:13px;color:var(--ink)' }, bt.label.replace(/^\S+\s/, '')),
        h('div', { style: 'font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4' }, bt.desc)
      ))
    )
  );
}

// ─── Main Visual Builder Export ───────────────────────────────────────────────

/**
 * Renders the visual content builder for a page.
 * @param {object} page - The page object (mutated in place)
 * @param {function} onCodeChange - Called with the new generated code string whenever content changes
 * @param {object} state - { showPalette } - internal state object to survive redraws
 */
export function renderPageContentBuilder(page, onCodeChange, state) {
  page.contentBlocks = page.contentBlocks || [];
  state = state || { showPalette: false };

  const container = h('div', { class: 'pcb-container' });
  const blocks = page.contentBlocks;

  const syncCode = () => {
    const code = generatePageCode(blocks);
    onCodeChange(code);
    touch();
  };

  const redraw = () => {
    container.replaceWith(renderPageContentBuilder(page, onCodeChange, state));
  };

  // Header toolbar
  const toolbar = h('div', {
    style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px;padding:14px 18px;background:rgba(24,160,65,.06);border:1px solid rgba(24,160,65,.2);border-radius:14px'
  },
    h('div', {},
      h('div', { style: 'font-weight:800;font-size:14px;color:var(--ink)' }, '\ud83e\udde9 Visual Content Builder  \u2013  ' + blocks.length + ' Block' + (blocks.length !== 1 ? 's' : '')),
      h('div', { style: 'font-size:11.5px;color:var(--muted);margin-top:2px' }, 'Add blocks visually. HTML code is auto-generated and synced to the Code Editor below.')
    ),
    h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' },
      h('button', {
        type: 'button',
        style: 'font-size:12px;padding:8px 16px;background:var(--green);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700',
        onclick: () => { state.showPalette = !state.showPalette; redraw(); }
      }, state.showPalette ? '\u2715 Close Block Picker' : '\uff0b Add Content Block'),
      blocks.length > 0 ? h('button', {
        type: 'button',
        style: 'font-size:12px;padding:8px 16px;background:rgba(99,102,241,.12);color:#4338ca;border:1.5px solid #6366f1;border-radius:8px;cursor:pointer;font-weight:700',
        onclick: () => { syncCode(); alert('Code has been synced to the Code Editor below!'); }
      }, '\u27f3 Sync to Code') : null
    )
  );

  container.append(toolbar);

  // Block palette
  if (state.showPalette) {
    const palette = renderBlockPalette((type) => {
      blocks.push(defaultBlock(type));
      syncCode();
      state.showPalette = false;
      redraw();
    });
    container.append(palette);
  }

  // Empty state
  if (blocks.length === 0) {
    container.append(
      h('div', {
        style: 'text-align:center;padding:40px 20px;background:rgba(0,0,0,.02);border:1.5px dashed var(--ln);border-radius:14px;color:var(--muted)'
      },
        h('div', { style: 'font-size:36px;margin-bottom:10px' }, '\ud83e\uddf1'),
        h('div', { style: 'font-weight:700;font-size:15px;color:var(--ink);margin-bottom:6px' }, 'No content blocks yet'),
        h('div', { style: 'font-size:13px' }, 'Click "\uff0b Add Content Block" above to start building your page visually.')
      )
    );
    return container;
  }

  // Render each block card
  blocks.forEach((block, bi) => {
    const blockMeta = BLOCK_TYPES.find(bt => bt.type === block.type) || { label: block.type, icon: '\ud83d\udce6' };
    const isLast = bi === blocks.length - 1;
    const isFirst = bi === 0;

    if (block._open === undefined) block._open = true;

    const headerBg = {
      hero: 'rgba(24,160,65,.08)', cta: 'rgba(99,102,241,.08)',
      stats: 'rgba(245,158,11,.08)', cards: 'rgba(59,130,246,.06)'
    }[block.type] || 'rgba(0,0,0,.03)';

    const blockCard = h('div', {
      style: 'border:1px solid var(--ln);border-radius:14px;margin-bottom:12px;overflow:hidden;background:var(--card)'
    });

    const displayName = block.title || block.heading || blockMeta.label.replace(/^\S+\s/, '');

    const blockHeader = h('div', {
      style: 'display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;background:' + headerBg + ';border-bottom:' + (block._open ? '1px solid var(--ln)' : 'none') + ';user-select:none',
      onclick: () => { block._open = !block._open; redraw(); }
    },
      h('span', { style: 'font-size:18px;min-width:22px' }, blockMeta.icon),
      h('span', { style: 'font-weight:700;font-size:13px;color:var(--ink);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, blockMeta.label.replace(/^\S+\s/, '') + ' \u2014 ' + displayName),
      h('span', { style: 'font-size:10px;font-weight:600;color:var(--muted);background:rgba(0,0,0,.06);padding:2px 7px;border-radius:5px;text-transform:uppercase;white-space:nowrap' }, block.type),
      h('div', { style: 'display:flex;gap:4px;margin-left:8px', onclick: e => e.stopPropagation() },
        !isFirst ? h('button', {
          type: 'button', title: 'Move up',
          style: 'padding:3px 8px;font-size:11px;background:rgba(0,0,0,.07);border:1px solid var(--ln);border-radius:6px;cursor:pointer',
          onclick: () => { [blocks[bi - 1], blocks[bi]] = [blocks[bi], blocks[bi - 1]]; syncCode(); redraw(); }
        }, '\u25b2') : h('span', { style: 'width:28px;display:inline-block' }),
        !isLast ? h('button', {
          type: 'button', title: 'Move down',
          style: 'padding:3px 8px;font-size:11px;background:rgba(0,0,0,.07);border:1px solid var(--ln);border-radius:6px;cursor:pointer',
          onclick: () => { [blocks[bi + 1], blocks[bi]] = [blocks[bi], blocks[bi + 1]]; syncCode(); redraw(); }
        }, '\u25bc') : h('span', { style: 'width:28px;display:inline-block' })
      ),
      h('button', {
        type: 'button', class: 'danger', style: 'font-size:11px;padding:4px 10px;margin-left:4px',
        onclick: e => {
          e.stopPropagation();
          if (confirm('Delete this ' + blockMeta.label.replace(/^\S+\s/, '') + ' block?')) {
            blocks.splice(bi, 1);
            syncCode();
            redraw();
          }
        }
      }, '\u2715'),
      h('span', { style: 'font-size:14px;color:var(--muted);margin-left:4px' }, block._open ? '\u25be' : '\u25b8')
    );

    blockCard.append(blockHeader);

    if (block._open) {
      const editorWrap = h('div', { style: 'padding:16px 18px' });
      editorWrap.append(renderBlockEditor(block, syncCode));
      blockCard.append(editorWrap);
    }

    container.append(blockCard);
  });

  return container;
}
