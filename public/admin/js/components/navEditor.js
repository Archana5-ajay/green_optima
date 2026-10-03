/**
 * Header Navigation & Dropdowns Visual Editor
 * Allows managing top-level nav links and nested dropdown menus for subpages & sub-sections
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';

export function renderNavEditor(onRender) {
  const data = getData();
  const nav = data.nav || (data.nav = []);
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
    })
  );

  return wrap;
}
