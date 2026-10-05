/**
 * Secondary Top Bar — Pages Editor
 * Lets users create/manage pages that appear as links in the secondary (top) navbar.
 * Each page has: label, URL slug, custom HTML/CSS/JS code editor, live preview link.
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';

const BLANK_CODE = `<!-- Custom Page Content -->
<section class="wrap" style="padding:140px var(--pad) 100px">
  <div style="max-width:820px;margin:auto;text-align:center">
    <span class="tag">Page</span>
    <h1 style="font-size:48px;color:var(--cream);margin:20px 0 16px">Page Heading</h1>
    <p style="font-size:18px;line-height:1.75;opacity:.8;max-width:600px;margin:0 auto 36px">
      Add your custom HTML content here. Use &lt;style&gt; tags for CSS and &lt;script&gt; tags for JavaScript.
    </p>
    <a href="#contact" class="btn" style="height:50px;padding:0 32px">Get in Touch</a>
  </div>
</section>`;

export function renderTopNavPagesEditor(onRender) {
  const data = getData();
  data.navTop  = data.navTop  || [];
  data.pages   = data.pages   || [];

  const navTop = data.navTop;
  const pages  = data.pages;

  const wrap = h('div', { class: 'pages-editor-wrap' });

  const redraw = () => wrap.replaceWith(renderTopNavPagesEditor(onRender));

  // ── helpers ────────────────────────────────────────────────────────
  const getLinkedPage = (item) =>
    pages.find(p => `/p/${p.slug || p.id}` === (item.href || '').trim());

  const moveItem = (arr, from, to) => {
    if (to < 0 || to >= arr.length) return;
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    touch(); redraw();
  };

  // ── "Create New Page" action ────────────────────────────────────────
  const createPage = () => {
    const title = prompt('Enter a name for the new top-bar page (e.g. "Careers", "Partners"):');
    if (!title || !title.trim()) return;
    const cleanTitle = title.trim();
    const slug = cleanTitle.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      + '-' + Math.floor(Math.random() * 9000 + 1000);
    const pageUrl = `/p/${slug}`;
    const newId   = 'tnp_' + Date.now().toString(36);

    const newPage = {
      id: newId, title: cleanTitle, slug,
      dropdownCategory: 'topbar', parentId: '',
      template: 'custom',
      customCode: BLANK_CODE.replace('Page Heading', cleanTitle),
      hero: { eyebrow: '', title: cleanTitle, description: '', badge: '', ctaText: 'Get in Touch', ctaHref: '#contact', image: '' },
      subsections: [], activeSections: [],
      showInNav: true, navBadge: '', standaloneNavLink: true
    };

    pages.push(newPage);
    navTop.push({ label: cleanTitle, href: pageUrl });
    touch(); redraw();
  };

  // ── top bar entries managed here (those that point to /p/… pages) ──
  // We show ALL navTop entries but display the code editor only for those
  // that actually have a linked page object.

  // ── render ──────────────────────────────────────────────────────────
  wrap.append(
    h('h2', {}, '🔗 Secondary Top Bar — Pages Manager'),
    h('p', { style: 'color:var(--muted);margin-bottom:8px;font-size:13px;line-height:1.6' },
      'Create and manage pages that appear as links in the small top bar. ' +
      'Each page has its own URL, and you edit its content with custom HTML/CSS/JS code below.'
    ),
    h('p', { style: 'color:var(--muted);margin-bottom:24px;font-size:12px;font-style:italic' },
      'Tip: Links without a managed page (plain anchors like #contact) can still be managed from the "Header Nav & Dropdowns" tab.'
    ),

    // ── Actions ────────────────────────────────────────────────────────
    h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px' },
      h('button', {
        type: 'button', class: 'p',
        style: 'padding:10px 22px;font-size:13px;background:var(--accent)',
        onclick: createPage
      }, '📄 Create New Page & Add to Top Bar'),
      h('button', {
        type: 'button',
        style: 'padding:10px 20px;font-size:13px',
        onclick: () => { navTop.push({ label: 'New Link', href: '#' }); touch(); redraw(); }
      }, '＋ Add Plain Link (no page)')
    ),

    // ── Entries ────────────────────────────────────────────────────────
    navTop.length === 0
      ? h('div', { style: 'text-align:center;padding:60px 20px;color:var(--muted);font-size:15px;background:var(--card);border-radius:16px;border:1px dashed var(--ln)' },
          'No top bar links yet. Click "Create New Page & Add to Top Bar" to get started.'
        )
      : h('div', {},
          ...navTop.map((item, idx) => {
            const linkedPage = getLinkedPage(item);
            const pageId = linkedPage ? (linkedPage.slug || linkedPage.id) : `link_${idx}`;
            const previewUrl = item.href || '#';
            const isManaged = !!linkedPage;

            // ── Card ─────────────────────────────────────────────────
            const card = h('div', {
              style: `margin-bottom:28px;border-radius:16px;overflow:hidden;border:1.5px solid ${isManaged ? 'rgba(24,160,65,.35)' : 'var(--ln)'};background:var(--card)`
            });

            // Card header bar
            const headerBar = h('div', {
              style: `display:flex;align-items:center;gap:12px;padding:14px 20px;background:${isManaged ? 'rgba(24,160,65,.07)' : 'rgba(255,255,255,.03)'};border-bottom:1px solid var(--ln);flex-wrap:wrap`
            },
              h('div', { style: 'display:flex;gap:6px' },
                h('button', { type: 'button', style: 'padding:4px 9px;font-size:11px', onclick: () => moveItem(navTop, idx, idx - 1) }, '↑'),
                h('button', { type: 'button', style: 'padding:4px 9px;font-size:11px', onclick: () => moveItem(navTop, idx, idx + 1) }, '↓')
              ),
              h('span', {
                style: `font-size:11px;font-weight:800;letter-spacing:.06em;padding:3px 10px;border-radius:20px;background:${isManaged ? 'rgba(24,160,65,.18);color:var(--green)' : 'rgba(255,255,255,.07);color:var(--muted)'}`
              }, isManaged ? '📄 MANAGED PAGE' : '🔗 PLAIN LINK'),
              h('strong', { style: 'font-size:15px;flex:1' }, item.label || '—'),
              isManaged ? h('a', {
                href: previewUrl, target: '_blank',
                style: 'font-size:12px;font-weight:700;color:#fff;background:var(--green);padding:5px 14px;border-radius:8px;text-decoration:none'
              }, '↗ Open Page') : null,
              h('button', {
                type: 'button', class: 'danger',
                style: 'font-size:11px;padding:4px 10px;margin-left:auto',
                onclick: () => {
                  const msg = isManaged
                    ? `Delete "${item.label}" from the top bar AND delete the page?`
                    : `Remove "${item.label}" link from the top bar?`;
                  if (!confirm(msg)) return;
                  if (isManaged) {
                    const pi = pages.indexOf(linkedPage);
                    if (pi !== -1) pages.splice(pi, 1);
                  }
                  navTop.splice(idx, 1);
                  touch(); redraw();
                }
              }, '✕ Remove')
            );

            // Card body
            const body = h('div', { style: 'padding:20px' });

            // Meta row (label + href always visible)
            const metaRow = h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px' },
              h('div', {},
                h('label', { style: 'font-weight:700' }, 'Top Bar Label:'),
                h('input', {
                  type: 'text', value: item.label || '', placeholder: 'e.g. Careers',
                  oninput: e => {
                    item.label = e.target.value;
                    if (linkedPage) linkedPage.title = e.target.value;
                    touch();
                  }
                })
              ),
              h('div', {},
                h('label', { style: 'font-weight:700' }, isManaged ? 'Page URL (/p/...):' : 'Link URL / Anchor:'),
                h('div', { style: 'display:flex;gap:6px' },
                  h('input', {
                    type: 'text', value: item.href || '', style: 'flex:1',
                    placeholder: isManaged ? '' : '#contact or https://...',
                    oninput: e => {
                      item.href = e.target.value;
                      if (linkedPage) {
                        const raw = e.target.value.replace(/^\/p\//, '');
                        linkedPage.slug = raw;
                      }
                      touch();
                    }
                  }),
                  // "Link existing page" picker for plain links
                  !isManaged && pages.length > 0 ? h('select', {
                    style: 'width:130px;font-size:11.5px',
                    onchange: e => {
                      if (!e.target.value) return;
                      const p = pages.find(x => x.id === e.target.value);
                      if (p) {
                        item.href = `/p/${p.slug || p.id}`;
                        if (!item.label || item.label === 'New Link') item.label = p.title;
                        touch(); redraw();
                      }
                      e.target.value = '';
                    }
                  },
                    h('option', { value: '' }, '🔗 Link existing page...'),
                    ...pages.map(p => h('option', { value: p.id }, p.title))
                  ) : null
                )
              )
            );
            body.append(metaRow);

            // Code editor — only for managed pages
            if (isManaged) {
              const slugRow = h('div', { style: 'margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap' },
                h('span', { style: 'font-size:12px;color:var(--green);font-weight:700' }, '🌐 Live URL:'),
                h('code', {
                  class: `live-url-tnp-${pageId}`,
                  style: 'background:rgba(24,160,65,.1);border:1px solid rgba(24,160,65,.25);padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;color:var(--green)'
                }, previewUrl)
              );
              body.append(slugRow);

              const codeSection = h('div', {
                style: 'background:rgba(0,0,0,.04);border:1px solid var(--ln);border-radius:12px;padding:16px;margin-top:4px'
              },
                h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px' },
                  h('span', { style: 'font-weight:700;font-size:13px' }, '</> Custom Code (HTML / CSS / JS)'),
                  h('div', { style: 'display:flex;gap:6px' },
                    h('span', { style: 'font-size:11px;opacity:.6;align-self:center' }, 'Load preset:'),
                    h('button', {
                      type: 'button', style: 'font-size:11px;padding:3px 8px',
                      onclick: () => {
                        if (confirm('Replace editor content with blank template?')) {
                          linkedPage.customCode = BLANK_CODE.replace('Page Heading', linkedPage.title || 'Page Heading');
                          touch(); redraw();
                        }
                      }
                    }, 'Blank'),
                    h('button', {
                      type: 'button', style: 'font-size:11px;padding:3px 8px',
                      onclick: () => {
                        if (confirm('Replace with a grid-card layout?')) {
                          linkedPage.customCode = `<!-- ${linkedPage.title || 'Page'} -->
<section class="wrap" style="padding:140px var(--pad) 60px;text-align:center">
  <span class="tag">${linkedPage.title || 'Section'}</span>
  <h1 style="font:600 48px/56px Inter;color:var(--cream);margin:16px 0 20px">${linkedPage.title || 'Headline'}</h1>
  <p style="font-size:18px;line-height:1.7;max-width:640px;margin:0 auto 36px;opacity:.8">Describe this section here.</p>
</section>
<section class="wrap" style="padding:0 var(--pad) 100px">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px 26px">
      <h3 style="color:var(--cream);margin-bottom:12px">Card Title One</h3>
      <p style="opacity:.75;line-height:1.7">Description for the first card goes here.</p>
    </div>
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px 26px">
      <h3 style="color:var(--cream);margin-bottom:12px">Card Title Two</h3>
      <p style="opacity:.75;line-height:1.7">Description for the second card goes here.</p>
    </div>
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px 26px">
      <h3 style="color:var(--cream);margin-bottom:12px">Card Title Three</h3>
      <p style="opacity:.75;line-height:1.7">Description for the third card goes here.</p>
    </div>
  </div>
</section>`;
                          touch(); redraw();
                        }
                      }
                    }, 'Cards Grid')
                  )
                ),
                h('textarea', {
                  style: 'font-family:"Red Hat Mono",monospace;font-size:12.5px;line-height:1.5;min-height:320px;width:100%;background:#0a1a0d;color:#e4fe7b;border:1px solid #2a4a2a;border-radius:8px;padding:14px;resize:vertical',
                  rows: 16,
                  placeholder: '<!-- Enter your custom HTML, <style> CSS, and <script> JS here -->',
                  oninput: e => { linkedPage.customCode = e.target.value; touch(); }
                }, linkedPage.customCode || ''),
                h('p', { style: 'font-size:11.5px;color:var(--muted);margin-top:8px' },
                  '💡 You can write any valid HTML. Use <style>…</style> for CSS and <script>…</script> for JavaScript. Changes save when you click "Save Changes" in the sidebar.'
                )
              );
              body.append(codeSection);
            }

            card.append(headerBar, body);
            return card;
          })
        )
  );

  return wrap;
}
