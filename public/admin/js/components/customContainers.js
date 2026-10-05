/**
 * Custom Containers Builder Component
 * Default mode: Raw HTML — paste code, renders full-width on site.
 * Advanced mode (toggle): adds title, tag, cards etc.
 */
import { h } from '../dom.js';
import { getData, touch, isHomeActive, isSubpageActive, setHomeActive, setSubpageActive } from '../state.js';
import { renderImageWidget } from '../fields.js';

export function renderCustomContainers(onRender) {
  const data = getData();
  const arr  = data.customContainers || (data.customContainers = []);
  const wrap = h('div', {});

  const redraw = () => {
    wrap.replaceWith(renderCustomContainers(onRender));
  };

  // ── Add button row ────────────────────────────────────────────────
  const addBtn = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px' },
    h('button', {
      type: 'button', class: 'p',
      style: 'padding:10px 22px;font-size:14px',
      onclick: () => {
        arr.push({
          mode: 'html',           // 'html' = raw code, 'template' = title+cards
          title: '',
          tag: '',
          text: '',
          htmlCode: '',
          active: true,
          showOnHome: true,
          showOnSubpage: false,
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 0,
          bgColor: '',
          cards: []
        });
        touch();
        if (onRender) onRender();
        else redraw();
      }
    }, '＋ Add HTML Section'),
    h('button', {
      type: 'button', class: 'quick-preset-btn',
      style: 'padding:10px 22px;font-size:13px',
      onclick: () => {
        arr.push({
          mode: 'template',
          title: 'New Section',
          tag: 'Custom Section',
          text: '',
          htmlCode: '',
          active: true,
          showOnHome: true,
          showOnSubpage: false,
          paddingTop: 80,
          paddingBottom: 80,
          minHeight: 0,
          cardHeight: 0,
          cardWidth: 0,
          bgColor: '',
          cards: []
        });
        touch();
        if (onRender) onRender();
        else redraw();
      }
    }, '＋ Add Template Section'),
    h('button', {
      type: 'button', class: 'quick-preset-btn',
      style: 'padding:10px 22px;font-size:13px',
      onclick: () => {
        arr.push({
          mode: 'video',
          title: 'Video Section',
          tag: '',
          text: '',
          htmlCode: '',
          active: true,
          showOnHome: true,
          showOnSubpage: false,
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 600,
          videoUrl: '',
          cards: []
        });
        touch();
        if (onRender) onRender();
        else redraw();
      }
    }, '＋ Add Video Section')
  );

  wrap.append(
    h('h2', {}, 'Custom Containers (' + arr.length + ')'),
    h('p', { style: 'color:var(--muted);margin-bottom:20px;font-size:13px;line-height:1.6' },
      'Paste HTML into an HTML Section — it renders full-width on the site exactly as you write it. Use ▲ ▼ to reorder sections.'
    ),
    addBtn,
    ...arr.map((ct, idx) => {
      if (!ct.mode) ct.mode = ct.htmlCode ? 'html' : 'template';

      const homeOn      = isHomeActive(ct);
      const subOn       = isSubpageActive(ct);
      const isAnyActive = homeOn || subOn;
      const isFirst     = idx === 0;
      const isLast      = idx === arr.length - 1;

      const box = h('div', {
        class: 'custom-ct-box' + (isAnyActive ? '' : ' inactive')
      });

      // ── Toggle buttons ──────────────────────────────────────────
      const homeToggleBtn = h('button', {
        type: 'button',
        class: 'sec-toggle-btn ' + (homeOn ? 'is-active' : 'is-inactive'),
        onclick: () => { setHomeActive(ct, !homeOn); if (onRender) onRender(); }
      }, homeOn ? '🏠 Home: ON' : '🏠 Home: OFF');

      const subToggleBtn = h('button', {
        type: 'button',
        class: 'sec-toggle-btn ' + (subOn ? 'is-active' : 'is-inactive'),
        onclick: () => { setSubpageActive(ct, !subOn); if (onRender) onRender(); }
      }, subOn ? '📄 Subpage: ON' : '📄 Subpage: OFF');

      const delBtn = h('button', {
        type: 'button', class: 'danger',
        style: 'font-size:12px;padding:6px 14px',
        onclick: () => {
          if (confirm('Delete container #' + (idx + 1) + '?')) {
            arr.splice(idx, 1);
            touch();
            if (onRender) onRender();
            else redraw();
          }
        }
      }, 'Delete');

      // ── Reorder controls ─────────────────────────────────────────
      const moveBtn = (label, title, disabled, moveFn) =>
        h('button', {
          type: 'button',
          class: 'reorder-btn' + (disabled ? ' reorder-btn-disabled' : ''),
          title, disabled: disabled || undefined,
          onclick: () => {
            if (disabled) return;
            moveFn(); touch();
            if (onRender) onRender(); else redraw();
          }
        }, label);

      const positionBadge = h('span', {
        style: 'display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;border-radius:50%;background:var(--ac);color:#fff;font:700 11px monospace;flex-shrink:0'
      }, String(idx + 1));

      const reorderGroup = h('div', {
        style: 'display:inline-flex;align-items:center;gap:3px;background:rgba(0,0,0,.06);border:1px solid var(--ln);border-radius:8px;padding:2px 4px'
      },
        moveBtn('⤒', 'Move to top',    isFirst, () => arr.unshift(arr.splice(idx, 1)[0])),
        moveBtn('▲', 'Move up',         isFirst, () => arr.splice(idx - 1, 0, arr.splice(idx, 1)[0])),
        positionBadge,
        moveBtn('▼', 'Move down',       isLast,  () => arr.splice(idx + 1, 0, arr.splice(idx, 1)[0])),
        moveBtn('⤓', 'Move to bottom',  isLast,  () => arr.push(arr.splice(idx, 1)[0]))
      );

      // ── Mode badge ───────────────────────────────────────────────
      // ── Mode badge ───────────────────────────────────────────────
      let modeColor = 'background:rgba(0,0,0,.12);color:var(--fg)';
      let modeLabel = '☰ Template';
      if (ct.mode === 'html') { modeColor = 'background:#18a041;color:#fff'; modeLabel = '⟨/⟩ HTML'; }
      if (ct.mode === 'video') { modeColor = 'background:#d92d20;color:#fff'; modeLabel = '▶ Video'; }

      const modeBadge = h('span', {
        style: `font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:6px;${modeColor}`
      }, modeLabel);

      // ── Mode switch link ─────────────────────────────────────────
      const modeSwitch = h('select', {
        style: 'font-size:11px;color:var(--ac);background:none;border:1px solid var(--ln);border-radius:4px;cursor:pointer;padding:2px 4px',
        onchange: e => {
          ct.mode = e.target.value;
          touch(); redraw();
        }
      },
        h('option', { value: 'html', selected: ct.mode === 'html' }, 'Switch to HTML'),
        h('option', { value: 'template', selected: ct.mode === 'template' }, 'Switch to Template'),
        h('option', { value: 'video', selected: ct.mode === 'video' }, 'Switch to Video')
      );

      // ── Container header ─────────────────────────────────────────
      box.append(
        h('div', { class: 'ct-banner-header' },
          h('div', { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap' },
            reorderGroup,
            modeBadge,
            h('div', {},
              h('h3', { style: 'margin:0;font-size:15px' },
                ct.title || (ct.mode === 'html' ? 'HTML Section #' + (idx + 1) : '(Untitled)')
              ),
              modeSwitch
            )
          ),
          h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' },
            homeToggleBtn, subToggleBtn, delBtn
          )
        )
      );

      // ════════════════════════════════════════════════════════════
      // HTML MODE — just a big code editor, full width rendering
      // ════════════════════════════════════════════════════════════
      if (ct.mode === 'html') {
        const charCount = h('span', {
          style: 'font-size:10.5px;color:var(--muted);font-family:monospace'
        }, (ct.htmlCode || '').length + ' chars');

        const codeArea = h('textarea', {
          placeholder:
`<!-- Paste any HTML here — it renders 100% full-width on the site with zero wrapper.
Example: stats bar like the reference site:

<section style="background:#107a33;padding:28px 0">
  <div style="max-width:1340px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;padding:0 32px">
    <div style="text-align:center;padding:0 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff">20+</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Years in industry</span>
    </div>
    <div style="text-align:center;padding:0 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff">100+</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Completed projects</span>
    </div>
    <div style="text-align:center;padding:0 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff">4</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Global partners</span>
    </div>
    <div style="text-align:center;padding:0 20px">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff">Dubai</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">UAE headquarters</span>
    </div>
  </div>
</section> -->`,
          style: 'min-height:240px;font-family:"Fira Code","Cascadia Code",monospace;font-size:12.5px;line-height:1.6;tab-size:2;background:#0d1a0f;color:#c8f76a;border:2px solid #18a041;border-radius:10px;padding:14px;resize:vertical',
          spellcheck: 'false',
          oninput: e => {
            ct.htmlCode = e.target.value;
            charCount.textContent = e.target.value.length + ' chars';
            touch();
          }
        }, ct.htmlCode || '');

        // Quick snippet buttons
        const snippets = [
          {
            label: '📊 Stats Bar',
            code: `<section style="background:#107a33;padding:clamp(18px,3vh,32px) 0">
  <div style="max-width:1340px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);padding:0 32px;gap:0">
    <div style="text-align:center;padding:16px 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff;letter-spacing:-1px">20+</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Years in industry</span>
    </div>
    <div style="text-align:center;padding:16px 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff;letter-spacing:-1px">100+</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Completed projects</span>
    </div>
    <div style="text-align:center;padding:16px 20px;border-right:1px solid rgba(255,255,255,.2)">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff;letter-spacing:-1px">4</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">Global partners</span>
    </div>
    <div style="text-align:center;padding:16px 20px">
      <b style="display:block;font-size:clamp(28px,3vw,42px);font-weight:800;color:#fff;letter-spacing:-1px">Dubai</b>
      <span style="font-size:13px;color:rgba(255,255,255,.75)">UAE headquarters</span>
    </div>
  </div>
</section>`
          },
          {
            label: '🔘 CTA Banner',
            code: `<section style="background:linear-gradient(135deg,#0a1a0c,#107a33);padding:clamp(40px,6vh,70px) 32px;text-align:center">
  <h2 style="color:#fff;font-size:clamp(22px,2.8vw,38px);font-weight:700;margin:0 0 12px;letter-spacing:-1px">Optimize your building's operations</h2>
  <p style="color:rgba(255,255,255,.75);max-width:600px;margin:0 auto 24px;font-size:15px;line-height:1.6">Achieve sustainability targets with integrated automation and energy control.</p>
  <a href="#contact" style="display:inline-flex;align-items:center;gap:8px;background:#c8f76a;color:#0a1a0c;font-weight:700;font-size:15px;padding:14px 32px;border-radius:99px;text-decoration:none">Contact us today →</a>
</section>`
          },
          {
            label: '📦 3-col Cards',
            code: `<section style="padding:clamp(40px,6vh,70px) 0;background:#080c0a">
  <div style="max-width:1340px;margin:0 auto;padding:0 32px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px">
      <div style="background:#111a14;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px">
        <h3 style="color:#c8f76a;font-size:20px;margin:0 0 10px">Card Title</h3>
        <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;margin:0">Card description text goes here.</p>
      </div>
      <div style="background:#111a14;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px">
        <h3 style="color:#c8f76a;font-size:20px;margin:0 0 10px">Card Title</h3>
        <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;margin:0">Card description text goes here.</p>
      </div>
      <div style="background:#111a14;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px">
        <h3 style="color:#c8f76a;font-size:20px;margin:0 0 10px">Card Title</h3>
        <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;margin:0">Card description text goes here.</p>
      </div>
    </div>
  </div>
</section>`
          },
          {
            label: '📋 Full Clear',
            code: ''
          }
        ];

        const snippetBtns = snippets.map(s =>
          h('button', {
            type: 'button', class: 'quick-preset-btn',
            style: 'font-size:11.5px',
            onclick: () => {
              codeArea.value  = s.code;
              ct.htmlCode     = s.code;
              charCount.textContent = s.code.length + ' chars';
              touch();
            }
          }, s.label)
        );

        const minHVal  = h('span', { class: 'gap-val' }, (ct.minHeight && ct.minHeight > 0) ? ct.minHeight + 'px' : 'Auto');

        box.append(
          h('div', { style: 'margin:14px 0 8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px' },
            h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' }, ...snippetBtns),
            charCount
          ),
          codeArea,
          h('p', { style: 'font-size:11px;color:var(--muted);margin-top:6px;line-height:1.5' },
            'Your HTML renders 100% full-width on the site — no wrapping div, no max-width, no padding added. Style everything inside your own HTML.'
          ),
          h('div', { class: 'gap-controls', style: 'margin-top:16px' },
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'Container Length / Min-Height:'), minHVal),
              h('input', { type: 'range', min: 0, max: 1400, step: 20, value: ct.minHeight || 0,
                oninput: e => { ct.minHeight = +e.target.value; minHVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Auto'; touch(); } })
            )
          ),
          // Visibility toggles
          h('div', { style: 'margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center' },
            h('span', { style: 'font-size:11.5px;color:var(--muted)' }, 'Show on:'),
            homeToggleBtn.cloneNode(true),
            subToggleBtn.cloneNode(true)
          )
        );

        // Re-wire the cloned toggle buttons (cloneNode doesn't copy event listeners)
        const clonedBtns = box.querySelectorAll('.sec-toggle-btn');
        if (clonedBtns[0]) clonedBtns[0].onclick = () => { setHomeActive(ct, !isHomeActive(ct)); if (onRender) onRender(); };
        if (clonedBtns[1]) clonedBtns[1].onclick = () => { setSubpageActive(ct, !isSubpageActive(ct)); if (onRender) onRender(); };

        return box;
      }

      // ════════════════════════════════════════════════════════════
      // VIDEO MODE — full width background video
      // ════════════════════════════════════════════════════════════
      if (ct.mode === 'video') {
        const minHVal = h('span', { class: 'gap-val' }, (ct.minHeight && ct.minHeight > 0) ? ct.minHeight + 'px' : 'Auto');
        box.append(
          h('label', { style: 'margin-top: 10px' }, 'Container Title (Optional)'),
          h('input', {
            type: 'text', value: ct.title || '', placeholder: 'Video Section Title',
            oninput: e => { ct.title = e.target.value; touch(); box.querySelector('h3').textContent = ct.title || '(Untitled Video)'; }
          }),
          renderImageWidget(ct, 'videoUrl', 'Video File (Upload or URL)'),
          h('div', { class: 'gap-controls', style: 'margin-top:16px' },
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'Container Length / Height:'), minHVal),
              h('input', { type: 'range', min: 0, max: 1400, step: 20, value: ct.minHeight || 0,
                oninput: e => { ct.minHeight = +e.target.value; minHVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Auto'; touch(); } })
            )
          ),
          // Visibility toggles
          h('div', { style: 'margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center' },
            h('span', { style: 'font-size:11.5px;color:var(--muted)' }, 'Show on:'),
            homeToggleBtn.cloneNode(true),
            subToggleBtn.cloneNode(true)
          )
        );

        const clonedBtns = box.querySelectorAll('.sec-toggle-btn');
        if (clonedBtns[0]) clonedBtns[0].onclick = () => { setHomeActive(ct, !isHomeActive(ct)); if (onRender) onRender(); };
        if (clonedBtns[1]) clonedBtns[1].onclick = () => { setSubpageActive(ct, !isSubpageActive(ct)); if (onRender) onRender(); };

        return box;
      }

      // ════════════════════════════════════════════════════════════
      // TEMPLATE MODE — title, text, cards, spacing, bg color
      // ════════════════════════════════════════════════════════════

      const ptVal    = h('span', { class: 'gap-val' }, (ct.paddingTop    || 80) + 'px');
      const pbVal    = h('span', { class: 'gap-val' }, (ct.paddingBottom || 80) + 'px');
      const minHVal  = h('span', { class: 'gap-val' }, (ct.minHeight && ct.minHeight > 0) ? ct.minHeight + 'px' : 'Auto');
      const cardHVal = h('span', { class: 'gap-val' }, (ct.cardHeight && ct.cardHeight > 0) ? ct.cardHeight + 'px' : 'Auto');
      const cardWVal = h('span', { class: 'gap-val' }, (ct.cardWidth  && ct.cardWidth  > 0) ? ct.cardWidth  + 'px' : 'Auto (280px)');

      const colorInput = h('input', {
        type: 'color', value: ct.bgColor || '#ffffff',
        oninput: e => { ct.bgColor = e.target.value; touch(); }
      });

      const cards    = ct.cards || (ct.cards = []);
      const cardsBox = h('div', { class: 'cards-grid' });

      const redrawCards = () => {
        cardsBox.replaceChildren(
          ...cards.map((card, ci) => {
            const perCardHVal = h('span', { class: 'gap-val' }, card.cardHeight ? card.cardHeight + 'px' : 'Default');
            return h('div', { class: 'card-edit-box' },
              h('div', { class: 'bar' },
                h('span', { style: 'font-weight:700;font-size:12px' }, 'Card #' + (ci + 1)),
                h('button', {
                  type: 'button', class: 'danger',
                  style: 'font-size:11px;padding:3px 8px;margin-left:auto',
                  onclick: () => { cards.splice(ci, 1); touch(); redrawCards(); }
                }, '✕ Remove')
              ),
              renderImageWidget(card, 'image', 'Card Image (Optional)'),
              h('label', {}, 'Card Title'),
              h('input', { type: 'text', value: card.title || '', placeholder: 'Card title', oninput: e => { card.title = e.target.value; touch(); } }),
              h('label', {}, 'Card Text'),
              h('textarea', { placeholder: 'Card description...', style: 'min-height:60px', oninput: e => { card.text = e.target.value; touch(); } }, card.text || ''),
              h('div', { style: 'margin-top:10px' },
                h('label', { style: 'display:flex;justify-content:space-between;font-size:11px' },
                  h('span', {}, 'Card Min-Height:'), perCardHVal),
                h('input', {
                  type: 'range', min: 0, max: 800, step: 10, value: card.cardHeight || 0,
                  oninput: e => { card.cardHeight = +e.target.value; perCardHVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Default'; touch(); }
                })
              )
            );
          })
        );
      };
      redrawCards();

      box.append(
        h('label', {}, 'Container Title'),
        h('input', {
          type: 'text', value: ct.title || '', placeholder: 'Section Title',
          oninput: e => { ct.title = e.target.value; touch(); box.querySelector('h3').textContent = ct.title || '(Untitled)'; }
        }),
        h('label', {}, 'Tag / Badge'),
        h('input', { type: 'text', value: ct.tag || '', placeholder: 'e.g. Core Solutions', oninput: e => { ct.tag = e.target.value; touch(); } }),
        h('label', {}, 'Description Text'),
        h('textarea', { oninput: e => { ct.text = e.target.value; touch(); } }, ct.text || ''),
        // Spacing
        h('div', { class: 'gap-controls' },
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Min-Height:'), minHVal),
            h('input', { type: 'range', min: 0, max: 1400, step: 20, value: ct.minHeight || 0,
              oninput: e => { ct.minHeight = +e.target.value; minHVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Auto'; touch(); } })
          ),
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Top Spacing:'), ptVal),
            h('input', { type: 'range', min: 0, max: 300, step: 5, value: ct.paddingTop || 80,
              oninput: e => { ct.paddingTop = +e.target.value; ptVal.textContent = e.target.value + 'px'; touch(); } })
          ),
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Bottom Spacing:'), pbVal),
            h('input', { type: 'range', min: 0, max: 300, step: 5, value: ct.paddingBottom || 80,
              oninput: e => { ct.paddingBottom = +e.target.value; pbVal.textContent = e.target.value + 'px'; touch(); } })
          )
        ),
        // Card sizing
        h('div', { class: 'card-size-box' },
          h('div', { class: 'card-size-header' },
            h('span', {}, '📏 Cards Sizing'),
            h('button', {
              type: 'button', class: 'quick-preset-btn',
              onclick: () => { delete ct.cardHeight; delete ct.cardWidth; cardHVal.textContent = 'Auto'; cardWVal.textContent = 'Auto (280px)'; touch(); }
            }, 'Reset Sizes')
          ),
          h('div', { class: 'gap-controls' },
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'Card Height:'), cardHVal),
              h('input', { type: 'range', min: 0, max: 800, step: 10, value: ct.cardHeight || 0,
                oninput: e => { ct.cardHeight = +e.target.value; cardHVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Auto'; touch(); } })
            ),
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'Card Width:'), cardWVal),
              h('input', { type: 'range', min: 0, max: 600, step: 10, value: ct.cardWidth || 0,
                oninput: e => { ct.cardWidth = +e.target.value; cardWVal.textContent = +e.target.value > 0 ? e.target.value + 'px' : 'Auto (280px)'; touch(); } })
            )
          )
        ),
        // BG color
        h('div', { class: 'color-field' },
          h('label', {}, 'Background Colour:'),
          colorInput,
          h('span', { style: 'font-size:11px;color:var(--muted)' }, ct.bgColor || '(default)'),
          ct.bgColor
            ? h('button', { type: 'button', style: 'font-size:11px;padding:4px 10px',
                onclick: () => { ct.bgColor = ''; touch(); redraw(); } }, 'Reset')
            : null
        ),
        // Cards editor
        h('div', { class: 'cards-editor' },
          h('div', { style: 'display:flex;justify-content:space-between;align-items:center' },
            h('label', { style: 'font-size:13px;margin:0' }, 'Cards (' + cards.length + ')'),
            h('button', {
              type: 'button', class: 'p', style: 'font-size:12px;padding:5px 12px',
              onclick: () => { cards.push({ title: '', text: '', image: '', cardHeight: 0 }); touch(); redrawCards(); }
            }, '+ Add Card')
          ),
          cardsBox
        ),
        // Also has HTML snippet area in template mode too
        h('div', { style: 'margin:18px 0 0;padding:14px;border:2px dashed var(--ln);border-radius:12px;background:rgba(0,0,0,.025)' },
          h('label', { style: 'font-size:12px;font-weight:700;margin-bottom:6px;display:block;color:var(--ac)' }, '⟨/⟩ Extra HTML (optional, appended after cards)'),
          h('textarea', {
            placeholder: '<a class="btn" href="/p/solutions">Explore all solutions</a>',
            style: 'min-height:80px;font-family:monospace;font-size:12px',
            oninput: e => { ct.htmlCode = e.target.value; touch(); }
          }, ct.htmlCode || '')
        )
      );

      return box;
    })
  );

  return wrap;
}
