/**
 * Header Navigation & Dropdowns Visual Editor
 * Allows managing top-level nav links and nested dropdown menus for subpages & sub-sections
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';

export function renderNavEditor(onRender) {
  const data = getData();
  const nav = data.nav || (data.nav = []);
  const navTop = data.navTop || (data.navTop = []);
  const pages = data.pages || [];
  const wrap = h('div', { class: 'nav-editor-wrap' });

  const redraw = () => {
    wrap.replaceWith(renderNavEditor(onRender));
  };

  const moveItem = (arr, from, to) => {
    if (to < 0 || to >= arr.length) return;
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    touch();
    redraw();
  };

  wrap.append(
    h('h2', {}, `Header Navigation & Dropdown Menus (${nav.length})`),
    h('p', { style: 'color:var(--muted);margin-bottom:20px;font-size:13px;line-height:1.6' },
      'Customize top navbar links and create interactive Dropdown Menus. You can link to homepage anchors (#services), custom subpages (/p/slug), or external URLs. Badges (e.g. "NEW") will appear in the dropdown menu.'
    ),
    h('div', { style: 'display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap' },
      h('button', {
        type: 'button',
        class: 'p',
        style: 'padding:9px 18px;font-size:13px',
        onclick: () => {
          nav.push({ label: 'New Link', href: '#' });
          touch();
          redraw();
        }
      }, '＋ Add Simple Nav Link'),
      h('button', {
        type: 'button',
        class: 'p',
        style: 'padding:9px 18px;font-size:13px;background:var(--accent)',
        onclick: () => {
          nav.push({
            label: 'Solutions',
            href: '#services',
            children: [
              { label: 'IBMS Automation', href: '/p/ibms', badge: 'POPULAR' },
              { label: 'Energy Metering', href: '/p/energy', badge: 'NEW' }
            ]
          });
          touch();
          redraw();
        }
      }, '＋ Add Dropdown Menu'),
      pages.length > 0 ? h('button', {
        type: 'button',
        style: 'padding:9px 16px;font-size:13px',
        onclick: () => {
          if (confirm('Create a "Pages" dropdown containing all your custom subpages?')) {
            nav.push({
              label: 'Explore',
              href: 'javascript:void(0)',
              children: pages.map(p => ({
                label: p.title || 'Page',
                href: `/p/${p.slug || p.id}`,
                badge: p.hero?.badge || ''
              }))
            });
            touch();
            redraw();
          }
        }
      }, '⚡ Sync Pages to Dropdown') : null
    ),
    ...nav.map((item, idx) => {
      const isDropdown = Array.isArray(item.children);

      const card = h('div', {
        class: 'it',
        style: `margin-bottom:20px;padding:20px;border-left:4px solid ${isDropdown ? 'var(--lime)' : 'var(--accent)'};background:var(--card)`
      });

      // Top control bar
      const bar = h('div', { class: 'bar', style: 'margin-bottom:12px' },
        h('button', { type: 'button', onclick: () => moveItem(nav, idx, idx - 1) }, '↑'),
        h('button', { type: 'button', onclick: () => moveItem(nav, idx, idx + 1) }, '↓'),
        h('span', {
          style: `font-weight:700;font-size:11px;padding:3px 8px;border-radius:4px;background:${isDropdown ? 'rgba(228,254,123,.2);color:var(--ink)' : 'rgba(24,160,65,.15);color:var(--accent)'}`
        }, isDropdown ? `▾ DROPDOWN MENU (${item.children.length} items)` : 'LINK'),
        h('strong', { style: 'margin-left:8px;font-size:15px' }, item.label || 'Untitled'),
        h('button', {
          type: 'button',
          class: 'danger',
          style: 'margin-left:auto;font-size:11px;padding:3px 8px',
          onclick: () => {
            if (confirm(`Remove "${item.label}" from navigation?`)) {
              nav.splice(idx, 1);
              touch();
              redraw();
            }
          }
        }, '✕ Remove')
      );

      // Top-level Inputs
      const mainInputs = h('div', { style: 'display:grid;grid-template-columns:1fr 1fr auto auto;gap:12px;align-items:end' },
        h('div', {},
          h('label', {}, 'Menu Label'),
          h('input', {
            type: 'text',
            value: item.label || '',
            oninput: e => { item.label = e.target.value; touch(); }
          })
        ),
        h('div', {},
          h('label', {}, 'Destination URL / Anchor'),
          h('div', { style: 'display:flex;gap:8px' },
            h('input', {
              type: 'text',
              value: item.href || '',
              placeholder: '#about, /p/my-page, or https://...',
              style: 'flex:1',
              oninput: e => { item.href = e.target.value; touch(); }
            }),
            pages.length > 0 ? h('select', {
              style: 'width:140px;font-size:12px',
              title: 'Link to a custom page',
              onchange: e => {
                if (!e.target.value) return;
                const p = pages.find(x => x.id === e.target.value || x.slug === e.target.value);
                if (p) {
                  item.href = `/p/${p.slug || p.id}`;
                  if (!item.label || item.label === 'New Link' || item.label === 'Untitled') {
                    item.label = p.title || 'Page';
                  }
                  touch();
                  redraw();
                }
                e.target.value = '';
              }
            },
              h('option', { value: '' }, '🔗 Link Page...'),
              ...pages.map(p => h('option', { value: p.id }, p.title))
            ) : null
          )
        ),
        h('div', {},
          h('button', {
            type: 'button',
            style: 'font-size:12px;padding:9px 12px',
            onclick: () => {
              if (isDropdown) {
                if (confirm('Convert this dropdown back to a single link? Sub-items will be removed.')) {
                  delete item.children;
                  touch();
                  redraw();
                }
              } else {
                item.children = [{ label: 'Sub-item 1', href: '#' }];
                touch();
                redraw();
              }
            }
          }, isDropdown ? 'Convert to Link' : '▾ Convert to Dropdown')
        )
      );

      // Dropdown sub-items container
      let childrenBox = null;
      if (isDropdown) {
        childrenBox = h('div', { style: 'margin-top:16px;padding:14px;background:rgba(0,0,0,.04);border-radius:12px;border:1px solid var(--ln)' },
          h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px' },
            h('span', { style: 'font-weight:700;font-size:12.5px' }, `Dropdown Sub-Items (${item.children.length})`),
            pages.length > 0 ? h('select', {
              style: 'font-size:11.5px;padding:4px 8px',
              onchange: e => {
                const selectedPage = pages.find(p => p.id === e.target.value || p.slug === e.target.value);
                if (selectedPage) {
                  item.children.push({
                    label: selectedPage.title,
                    href: `/p/${selectedPage.slug || selectedPage.id}`,
                    badge: selectedPage.hero?.badge || ''
                  });
                  e.target.value = '';
                  touch();
                  redraw();
                }
              }
            },
              h('option', { value: '' }, '＋ Quick-Add Page to Dropdown…'),
              ...pages.map(p => h('option', { value: p.id }, `Page: ${p.title} (/p/${p.slug})`))
            ) : null
          ),
          ...item.children.map((sub, subIdx) => {
            return h('div', {
              style: 'display:grid;grid-template-columns:1fr 1fr 100px auto auto;gap:8px;align-items:center;margin-bottom:8px'
            },
              h('input', {
                type: 'text',
                value: sub.label || '',
                placeholder: 'Sub-link Title',
                oninput: e => { sub.label = e.target.value; touch(); }
              }),
              h('input', {
                type: 'text',
                value: sub.href || '',
                placeholder: '/p/slug or #section',
                oninput: e => { sub.href = e.target.value; touch(); }
              }),
              h('input', {
                type: 'text',
                value: sub.badge || '',
                placeholder: 'Badge (NEW)',
                oninput: e => { sub.badge = e.target.value; touch(); }
              }),
              h('div', { style: 'display:flex;gap:3px' },
                h('button', { type: 'button', style: 'padding:4px 7px;font-size:10px', onclick: () => moveItem(item.children, subIdx, subIdx - 1) }, '↑'),
                h('button', { type: 'button', style: 'padding:4px 7px;font-size:10px', onclick: () => moveItem(item.children, subIdx, subIdx + 1) }, '↓')
              ),
              h('button', {
                type: 'button',
                class: 'danger',
                style: 'padding:4px 8px;font-size:11px',
                onclick: () => {
                  item.children.splice(subIdx, 1);
                  touch();
                  redraw();
                }
              }, '✕')
            );
          }),
          h('button', {
            type: 'button',
            class: 'p',
            style: 'font-size:11.5px;padding:5px 12px;margin-top:6px',
            onclick: () => {
              item.children.push({ label: 'New Sub-Item', href: '#', badge: '' });
              touch();
              redraw();
            }
          }, '＋ Add Sub-Item')
        );
      }

      card.append(bar, mainInputs, childrenBox);
      return card;
    }),

    // ─────────────────────────────────────────────────────────────────
    // SECONDARY TOP BAR — Full Page Manager
    // ─────────────────────────────────────────────────────────────────
    h('div', { style: 'margin-top:48px;padding-top:28px;border-top:2px dashed var(--ln)' },
      h('h2', {}, `🔗 Secondary Top Bar — Pages & Links (${navTop.length})`),
      h('p', { style: 'color:var(--muted);margin-bottom:20px;font-size:13px;line-height:1.6' },
        'Links shown in the small top bar when Dual Navbar is enabled. You can add plain links, link to existing pages, or create brand-new pages with custom HTML code that appear directly in the top bar.'
      ),

      // Action buttons
      h('div', { style: 'display:flex;gap:10px;margin-bottom:28px;flex-wrap:wrap' },
        h('button', {
          type: 'button',
          class: 'p',
          style: 'padding:9px 18px;font-size:13px',
          onclick: () => {
            navTop.push({ label: 'New Link', href: '#' });
            touch();
            redraw();
          }
        }, '＋ Add Link'),

        h('button', {
          type: 'button',
          class: 'p',
          style: 'padding:9px 18px;font-size:13px;background:var(--accent)',
          onclick: () => {
            // Create a new page and auto-link it into the top bar
            const title = prompt('Enter a title for the new page (e.g. "Careers", "Partners"):');
            if (!title || !title.trim()) return;
            const cleanTitle = title.trim();
            const newId = 'toppage_' + Date.now().toString(36);
            const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 1000);
            const pageUrl = `/p/${slug}`;

            const defaultCode = `<!-- ${cleanTitle} Page -->
<section class="wrap" style="padding:140px var(--pad) 100px">
  <div style="max-width:800px;margin:auto;text-align:center">
    <span class="tag">Top Bar Page</span>
    <h1 style="font-size:48px;color:var(--cream);margin:20px 0">${cleanTitle}</h1>
    <p style="font-size:18px;line-height:1.7;opacity:.8">
      Add your custom HTML content here. Use &lt;style&gt; for CSS and &lt;script&gt; for JavaScript.
    </p>
  </div>
</section>`;

            const newPage = {
              id: newId,
              title: cleanTitle,
              slug,
              dropdownCategory: 'topbar',
              parentId: '',
              template: 'custom',
              customCode: defaultCode,
              hero: {
                eyebrow: '',
                title: cleanTitle,
                description: '',
                badge: '',
                ctaText: 'Get in Touch',
                ctaHref: '#contact',
                image: ''
              },
              subsections: [],
              activeSections: [],
              showInNav: true,
              navBadge: '',
              standaloneNavLink: true
            };

            data.pages = data.pages || [];
            data.pages.push(newPage);

            // Auto-link into navTop
            navTop.push({ label: cleanTitle, href: pageUrl });
            touch();
            redraw();
          }
        }, '📄 Create New Page & Link'),

        pages.length > 0 ? h('button', {
          type: 'button',
          style: 'padding:9px 16px;font-size:13px',
          onclick: () => {
            // Quick-pick from all existing pages
          }
        }, null) : null
      ),

      // Existing top bar entries list
      ...navTop.map((item, idx) => {
        // Find if this link points to a managed page
        const linkedPage = data.pages && data.pages.find(p => {
          const pUrl = `/p/${p.slug || p.id}`;
          return pUrl === item.href;
        });

        const codeEditor = linkedPage ? h('div', {
          style: 'margin-top:14px;padding:14px;background:rgba(0,0,0,.08);border-radius:10px;border:1px solid var(--ln)'
        },
          h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' },
            h('label', { style: 'font-weight:700;font-size:12px;margin:0' }, `📝 Page Code — "${linkedPage.title}"`),
            h('a', {
              href: item.href,
              target: '_blank',
              style: 'font-size:11px;color:var(--lime);text-decoration:none'
            }, `↗ Preview /p/${linkedPage.slug}`)
          ),
          h('div', { style: 'margin-bottom:8px;font-size:11.5px;color:var(--muted)' },
            'Paste your custom HTML/CSS/JS below. Changes are saved with the main Save button.'
          ),
          h('textarea', {
            rows: 12,
            style: 'width:100%;font-family:monospace;font-size:12px;resize:vertical;border-radius:6px;padding:10px;background:#0d1a10;color:#b8e9b8;border:1px solid rgba(255,255,255,.1)',
            value: linkedPage.customCode || '',
            oninput: e => { linkedPage.customCode = e.target.value; touch(); }
          }),
          h('div', { style: 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap' },
            h('div', {},
              h('label', { style: 'font-size:11px;margin-bottom:4px;display:block' }, 'Page Title'),
              h('input', {
                type: 'text',
                value: linkedPage.title || '',
                style: 'font-size:12px;padding:5px 8px',
                oninput: e => { linkedPage.title = e.target.value; item.label = e.target.value; touch(); }
              })
            ),
            h('div', {},
              h('label', { style: 'font-size:11px;margin-bottom:4px;display:block' }, 'Page Slug (/p/…)'),
              h('input', {
                type: 'text',
                value: linkedPage.slug || '',
                style: 'font-size:12px;padding:5px 8px',
                oninput: e => {
                  const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  linkedPage.slug = newSlug;
                  item.href = `/p/${newSlug}`;
                  touch();
                }
              })
            )
          )
        ) : null;

        return h('div', {
          class: 'it',
          style: `margin-bottom:16px;padding:16px 20px;background:var(--card);border-left:4px solid ${linkedPage ? 'var(--lime)' : 'var(--accent)'}`
        },
          // Row: label + url + link-page selector + controls
          h('div', { style: 'display:grid;grid-template-columns:1fr 1fr auto auto;gap:12px;align-items:end' },
            h('div', {},
              h('label', {}, 'Top Bar Label'),
              h('input', {
                type: 'text',
                value: item.label || '',
                oninput: e => {
                  item.label = e.target.value;
                  if (linkedPage) linkedPage.title = e.target.value;
                  touch();
                }
              })
            ),
            h('div', {},
              h('label', {}, 'URL / Anchor'),
              h('div', { style: 'display:flex;gap:6px' },
                h('input', {
                  type: 'text',
                  value: item.href || '',
                  style: 'flex:1',
                  oninput: e => { item.href = e.target.value; touch(); }
                }),
                pages.length > 0 ? h('select', {
                  style: 'width:120px;font-size:11.5px',
                  title: 'Link to existing page',
                  onchange: e => {
                    if (!e.target.value) return;
                    const p = pages.find(x => x.id === e.target.value || x.slug === e.target.value);
                    if (p) {
                      item.href = `/p/${p.slug || p.id}`;
                      if (!item.label || item.label === 'New Link') item.label = p.title || 'Page';
                      touch();
                      redraw();
                    }
                    e.target.value = '';
                  }
                },
                  h('option', { value: '' }, '🔗 Link Page...'),
                  ...pages.map(p => h('option', { value: p.id }, p.title))
                ) : null
              )
            ),
            h('div', { style: 'display:flex;gap:4px;margin-bottom:2px' },
              h('button', { type: 'button', style: 'padding:6px 10px', onclick: () => moveItem(navTop, idx, idx - 1) }, '↑'),
              h('button', { type: 'button', style: 'padding:6px 10px', onclick: () => moveItem(navTop, idx, idx + 1) }, '↓')
            ),
            h('button', {
              type: 'button',
              class: 'danger',
              style: 'padding:6px 10px;margin-bottom:2px',
              onclick: () => {
                const pageToRemove = linkedPage;
                if (pageToRemove && confirm(`Also delete the linked page "${pageToRemove.title}"?`)) {
                  const pi = data.pages.indexOf(pageToRemove);
                  if (pi !== -1) data.pages.splice(pi, 1);
                }
                navTop.splice(idx, 1);
                touch();
                redraw();
              }
            }, '✕')
          ),
          // Code editor panel (only for managed pages)
          codeEditor
        );
      })
    )
  );

  return wrap;
}

