/**
 * Navbar Style Settings Editor — FULL CONTROL
 * Controls: dual/single mode, position (top/left/right), heights, padding,
 * border-radius, bg colors, text colors, font size, max-width, top-bar links
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';

const PRESETS = [
  {
    label: 'Dark Glass',
    main: { bg: 'rgba(8,14,10,0.88)',  color: '#ffffff' },
    top:  { bg: 'rgba(5,8,6,0.97)',    color: 'rgba(180,220,190,0.82)' }
  },
  {
    label: 'Green Optima',
    main: { bg: 'rgba(0,30,8,0.92)',   color: '#ffffff' },
    top:  { bg: 'rgba(0,0,0,0.97)',    color: '#a3e6b4' }
  },
  {
    label: 'White / Light',
    main: { bg: 'rgba(255,255,255,0.97)', color: '#111111' },
    top:  { bg: 'rgba(240,245,240,0.98)', color: '#333333' }
  },
  {
    label: 'Solid Black',
    main: { bg: '#080c0a', color: '#ffffff' },
    top:  { bg: '#050705', color: 'rgba(200,247,106,0.8)' }
  },
  {
    label: 'Deep Navy',
    main: { bg: 'rgba(10,20,50,0.93)',  color: '#e0ecff' },
    top:  { bg: 'rgba(5,10,35,0.97)',   color: 'rgba(180,210,255,0.8)' }
  },
  {
    label: 'Forest Green',
    main: { bg: 'rgba(5,30,12,0.93)',   color: '#c8f76a' },
    top:  { bg: 'rgba(0,18,6,0.97)',    color: 'rgba(170,230,190,0.85)' }
  },
  {
    label: 'Transparent',
    main: { bg: 'rgba(0,0,0,0)',        color: '#ffffff' },
    top:  { bg: 'rgba(0,0,0,0)',        color: 'rgba(255,255,255,0.75)' }
  }
];

export function renderNavbarSettingsEditor(onRender) {
  const data = getData();
  const ns = data.navbarSettings = data.navbarSettings || {};

  // — Defaults —
  const D = {
    dualNavbar:   false,
    mainHeight:   70,
    topHeight:    38,
    mainBg:       'rgba(8,14,10,0.88)',
    mainColor:    '#ffffff',
    topBg:        'rgba(5,8,6,0.97)',
    topColor:     'rgba(180,220,190,0.82)',
    maxWidth:     1340,
    padding:      32,
    borderRadius: 0,
    topOffset:    0,
    leftOffset:   0,
    rightOffset:  0,
    mainFontSize: 14,
    topFontSize:  12,
    backdropBlur: 18,
    borderColor:  'rgba(255,255,255,0.07)',
    logoMaxHeight:38,
  };
  Object.keys(D).forEach(k => { if (ns[k] === undefined) ns[k] = D[k]; });

  const wrap = h('div', { class: 'nav-editor-wrap' });

  const redraw = () => {
    const newEl = renderNavbarSettingsEditor(onRender);
    wrap.replaceWith(newEl);
    if (onRender) onRender();
  };

  // ── UI helpers ─────────────────────────────────────────────────
  const field = (lbl, inputEl, hint) =>
    h('div', { style: 'display:flex;flex-direction:column;gap:4px' },
      h('label', {}, lbl),
      inputEl,
      hint ? h('span', { style: 'font-size:10.5px;color:var(--muted)' }, hint) : null
    );

  const colorInput = (val, onChange, isGlass = false) => {
    const txt = h('input', {
      type: 'text',
      value: val,
      placeholder: 'e.g. rgba(10,10,10,0.85) or #0a0a0a',
      style: 'flex:1;font-size:12px',
      oninput: e => { onChange(e.target.value); touch(); }
    });
    const picker = h('input', {
      type: 'color',
      value: val.match(/#[0-9a-f]{6}/i)?.[0] || '#0a0a0a',
      title: isGlass ? 'Pick a colour (will be made semi-transparent automatically)' : 'Pick a colour',
      oninput: e => {
        if (isGlass) {
          // Convert hex to semi-transparent rgba automatically to preserve glassmorphism
          const hex = e.target.value;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const rgba = `rgba(${r}, ${g}, ${b}, 0.35)`;
          txt.value = rgba;
          onChange(rgba);
        } else {
          txt.value = e.target.value;
          onChange(e.target.value);
        }
        touch();
      }
    });
    return h('div', { style: 'display:flex;gap:8px;align-items:center' }, txt, picker);
  };

  const rangeField = (lbl, val, min, max, step, unit, onChange) => {
    const disp = h('span', { style: 'font-weight:700;color:var(--green);font-family:monospace;min-width:52px;text-align:right' }, val + unit);
    const range = h('input', {
      type: 'range', min, max, step, value: val,
      oninput: e => { disp.textContent = e.target.value + unit; onChange(Number(e.target.value)); touch(); }
    });
    return h('div', { class: 'gap-field' },
      h('label', { style: 'display:flex;justify-content:space-between;align-items:center' },
        h('span', {}, lbl), disp),
      range
    );
  };

  const numInput = (val, min, max, unit, onChange) => {
    const inp = h('input', {
      type: 'number', min, max, value: val,
      style: 'width:90px',
      oninput: e => { onChange(Number(e.target.value)); touch(); }
    });
    return h('div', { style: 'display:flex;align-items:center;gap:6px' }, inp, h('span', { style: 'font-size:11px;color:var(--muted)' }, unit));
  };

  // ── Dual mode toggle ───────────────────────────────────────────
  const dualToggle = h('button', {
    type: 'button',
    class: `sec-toggle-btn ${ns.dualNavbar ? 'is-active' : 'is-inactive'}`,
    onclick: () => { ns.dualNavbar = !ns.dualNavbar; touch(); redraw(); }
  }, ns.dualNavbar ? '✅ Dual Navbar — ON' : '⬜ Dual Navbar — OFF');

  // ── Color presets ──────────────────────────────────────────────
  const presetBtns = PRESETS.map(p =>
    h('button', {
      type: 'button',
      class: 'quick-preset-btn',
      onclick: () => {
        ns.mainBg = p.main.bg; ns.mainColor = p.main.color;
        ns.topBg  = p.top.bg;  ns.topColor  = p.top.color;
        touch(); redraw();
      }
    }, p.label)
  );

  // ── Top bar link editor ────────────────────────────────────────
  const navTop = data.navTop = data.navTop || [];
  const topLinksEditor = ns.dualNavbar ? h('div', {
    style: 'margin-top:16px;padding:14px;background:rgba(0,0,0,.04);border-radius:12px;border:1px solid var(--ln)'
  },
    h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px' },
      h('span', { style: 'font-weight:700;font-size:13px' }, `Top Bar Links (${navTop.length})`),
      h('button', {
        type: 'button', class: 'p',
        style: 'font-size:11.5px;padding:5px 12px',
        onclick: () => { navTop.push({ label: 'New Link', href: '#' }); touch(); redraw(); }
      }, '＋ Add Link')
    ),
    navTop.length === 0
      ? h('p', { style: 'font-size:12px;color:var(--muted)' }, 'No top bar links yet. Add links like Partners, News, Events, Contact.')
      : h('div', { style: 'display:grid;gap:8px' },
          ...navTop.map((item, idx) =>
            h('div', { style: 'display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center' },
              h('input', {
                type: 'text', value: item.label || '', placeholder: 'Label (e.g. Partners)',
                oninput: e => { item.label = e.target.value; touch(); }
              }),
              h('input', {
                type: 'text', value: item.href || '', placeholder: '/page or #section',
                oninput: e => { item.href = e.target.value; touch(); }
              }),
              h('button', {
                type: 'button', class: 'danger',
                style: 'padding:6px 10px;font-size:11px',
                onclick: () => { navTop.splice(idx, 1); touch(); redraw(); }
              }, '✕')
            )
          )
        )
  ) : null;

  // ── Build editor UI ─────────────────────────────────────────────
  wrap.append(
    h('h2', {}, '🎛 Navbar Style & Layout'),
    h('p', { style: 'color:var(--muted);margin-bottom:20px;font-size:13px;line-height:1.6' },
      'Full control over navbar layout, colors, sizing, position, padding, and more. Save to apply.'
    ),

    // Layout mode
    h('fieldset', {},
      h('legend', {}, '① Layout Mode'),
      h('div', { style: 'display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:4px' },
        dualToggle,
        h('span', { style: 'font-size:12px;color:var(--muted)' },
          ns.dualNavbar
            ? 'Two-row: thin top bar with secondary links + main bar with logo & nav.'
            : 'Single-row: logo and nav links in one full-width bar.'
        )
      )
    ),

    // Position & Placement
    h('fieldset', {},
      h('legend', {}, '② Position & Placement'),
      h('div', { class: 'gap-controls' },
        h('div', {}, h('label', {}, 'Top Offset (px)'),
          numInput(ns.topOffset, -20, 200, 'px', v => { ns.topOffset = v; }),
          h('span', { style: 'font-size:10px;color:var(--muted);display:block;margin-top:2px' }, '0 = flush to top, 8 = floating pill style')
        ),
        h('div', {}, h('label', {}, 'Left Inset (px)'),
          numInput(ns.leftOffset, 0, 200, 'px', v => { ns.leftOffset = v; }),
          h('span', { style: 'font-size:10px;color:var(--muted);display:block;margin-top:2px' }, '0 = full width, 14 = pill/floating')
        ),
        h('div', {}, h('label', {}, 'Right Inset (px)'),
          numInput(ns.rightOffset, 0, 200, 'px', v => { ns.rightOffset = v; }),
          h('span', { style: 'font-size:10px;color:var(--muted);display:block;margin-top:2px' }, '0 = full width, 14 = pill/floating')
        )
      ),
      h('div', { style: 'margin-top:14px' },
        rangeField('Border Radius (pill shape)', ns.borderRadius, 0, 40, 1, 'px', v => { ns.borderRadius = v; })
      )
    ),

    // Main bar settings
    h('fieldset', {},
      h('legend', {}, '③ Main Navbar Bar'),
      h('div', { class: 'gap-controls' },
        rangeField('Height', ns.mainHeight, 40, 160, 1, 'px', v => { ns.mainHeight = v; }),
        rangeField('Max Content Width', ns.maxWidth, 600, 1920, 10, 'px', v => { ns.maxWidth = v; }),
        rangeField('Side Padding', ns.padding, 0, 80, 2, 'px', v => { ns.padding = v; }),
        rangeField('Backdrop Blur', ns.backdropBlur, 0, 40, 1, 'px', v => { ns.backdropBlur = v; }),
        rangeField('Logo Max Height', ns.logoMaxHeight, 20, 80, 1, 'px', v => { ns.logoMaxHeight = v; }),
        rangeField('Nav Font Size', ns.mainFontSize, 10, 20, 1, 'px', v => { ns.mainFontSize = v; })
      ),
      h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px' },
        field('Background Color (supports RGBA)', colorInput(ns.mainBg, v => { ns.mainBg = v; }, true)),
        field('Text / Nav Link Color', colorInput(ns.mainColor, v => { ns.mainColor = v; })),
        field('Border / Separator Color', colorInput(ns.borderColor, v => { ns.borderColor = v; }, true))
      )
    ),

    // Top bar settings
    ns.dualNavbar ? h('fieldset', {},
      h('legend', {}, '④ Top Secondary Bar'),
      h('div', { class: 'gap-controls' },
        rangeField('Height', ns.topHeight, 20, 80, 1, 'px', v => { ns.topHeight = v; }),
        rangeField('Font Size', ns.topFontSize, 10, 18, 1, 'px', v => { ns.topFontSize = v; })
      ),
      h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px' },
        field('Background Color (supports RGBA)', colorInput(ns.topBg, v => { ns.topBg = v; })),
        field('Text / Link Color', colorInput(ns.topColor, v => { ns.topColor = v; }))
      ),
      topLinksEditor
    ) : null,

    // Color presets
    h('fieldset', {},
      h('legend', {}, '⑤ Quick Color Presets'),
      h('p', { style: 'font-size:12px;color:var(--muted);margin-bottom:10px' },
        'Apply a complete color scheme to both bars instantly.'
      ),
      h('div', { style: 'display:flex;flex-wrap:wrap;gap:8px' }, ...presetBtns)
    ),

    // Preview tip
    h('div', {
      style: 'margin-top:20px;padding:14px 18px;background:var(--bg);border:1px solid var(--ln);border-radius:12px;font-size:12.5px;color:var(--muted);line-height:1.7'
    },
      h('strong', { style: 'display:block;color:var(--fg);margin-bottom:4px' }, '💡 How to preview'),
      'Click "Save changes" below, then click "View site ↗" to see your navbar changes live. The navbar CSS variables update immediately on page load.'
    )
  );

  return wrap;
}
