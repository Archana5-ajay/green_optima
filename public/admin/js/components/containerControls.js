/**
 * Container Controls Banner Component
 * Displays Homepage / Subpage visibility toggles, container length / minHeight slider,
 * spacing gap sliders, card dimensions box, and color picker.
 */
import { h } from '../dom.js';
import {
  getData,
  touch,
  SECTION_INFO,
  SECTION_CARD_INFO,
  isHomeActive,
  isSubpageActive,
  setHomeActive,
  setSubpageActive
} from '../state.js';

export function renderContainerControls(secKey, onRender) {
  const data = getData();
  const ss = data.sectionSettings || (data.sectionSettings = {});
  const sc = data.sectionColors || (data.sectionColors = {});
  const defInfo = SECTION_INFO[secKey] || { defaultTop: 80, defaultBottom: 80, name: secKey };
  const cardInfo = SECTION_CARD_INFO[secKey];

  if (!ss[secKey]) {
    ss[secKey] = {
      active: true,
      showOnHome: true,
      showOnSubpage: false,
      paddingTop: defInfo.defaultTop,
      paddingBottom: defInfo.defaultBottom,
      minHeight: 0
    };
  }
  const cfg = ss[secKey];
  const col = sc[secKey] || '';

  const homeOn = isHomeActive(cfg);
  const subOn = isSubpageActive(cfg);
  const isAnyActive = homeOn || subOn;

  const banner = h('div', { class: 'ct-banner' + (isAnyActive ? '' : ' inactive') });

  // 1. Homepage visibility toggle button
  const homeToggleBtn = h(
    'button',
    {
      type: 'button',
      class: 'sec-toggle-btn ' + (homeOn ? 'is-active' : 'is-inactive'),
      onclick: () => {
        setHomeActive(cfg, !homeOn);
        if (onRender) onRender();
      }
    },
    homeOn ? '🏠 Homepage: ACTIVE' : '🏠 Homepage: DEACTIVATED'
  );

  // 2. Subpage visibility toggle button
  const subToggleBtn = h(
    'button',
    {
      type: 'button',
      class: 'sec-toggle-btn ' + (subOn ? 'is-active' : 'is-inactive'),
      onclick: () => {
        setSubpageActive(cfg, !subOn);
        if (onRender) onRender();
      }
    },
    subOn ? '📄 Subpage: ACTIVE' : '📄 Subpage: DEACTIVATED'
  );

  // 3. Quick preset buttons
  const presetHomeOnly = h(
    'button',
    {
      type: 'button',
      class: 'quick-preset-btn',
      title: 'Show only on homepage',
      onclick: () => {
        setHomeActive(cfg, true);
        setSubpageActive(cfg, false);
        if (onRender) onRender();
      }
    },
    '🏠 Home Only'
  );

  const presetSubOnly = h(
    'button',
    {
      type: 'button',
      class: 'quick-preset-btn',
      style: subOn && !homeOn ? 'background:var(--fg);color:var(--bg);font-weight:700' : '',
      title: 'Deactivate on home & activate on subpage',
      onclick: () => {
        setHomeActive(cfg, false);
        setSubpageActive(cfg, true);
        if (onRender) onRender();
      }
    },
    '⚡ Deactivate Home / Activate Subpage'
  );

  const presetBoth = h(
    'button',
    {
      type: 'button',
      class: 'quick-preset-btn',
      title: 'Show on both homepage and subpage',
      onclick: () => {
        setHomeActive(cfg, true);
        setSubpageActive(cfg, true);
        if (onRender) onRender();
      }
    },
    '🌐 Show on Both'
  );

  // 4. Dimension controls (Length & Spacing)
  const ptVal = h('span', { class: 'gap-val' }, (cfg.paddingTop ?? defInfo.defaultTop) + 'px');
  const pbVal = h('span', { class: 'gap-val' }, (cfg.paddingBottom ?? defInfo.defaultBottom) + 'px');
  const minHVal = h('span', { class: 'gap-val' }, (cfg.minHeight && cfg.minHeight > 0) ? cfg.minHeight + 'px' : 'Auto');

  const ptSlider = h('input', {
    type: 'range',
    min: 0,
    max: 300,
    step: 5,
    value: cfg.paddingTop ?? defInfo.defaultTop,
    oninput: e => {
      cfg.paddingTop = +e.target.value;
      ptVal.textContent = e.target.value + 'px';
      touch();
    }
  });

  const pbSlider = h('input', {
    type: 'range',
    min: 0,
    max: 300,
    step: 5,
    value: cfg.paddingBottom ?? defInfo.defaultBottom,
    oninput: e => {
      cfg.paddingBottom = +e.target.value;
      pbVal.textContent = e.target.value + 'px';
      touch();
    }
  });

  const minHSlider = h('input', {
    type: 'range',
    min: 0,
    max: 1400,
    step: 20,
    value: cfg.minHeight || 0,
    oninput: e => {
      const val = +e.target.value;
      cfg.minHeight = val;
      minHVal.textContent = val > 0 ? val + 'px' : 'Auto';
      touch();
    }
  });

  // 5. Card Dimensions (if section has cards)
  let cardBox = null;
  if (cardInfo) {
    const curCardH = cfg.cardHeight || cardInfo.defaultH;
    const cardHVal = h('span', { class: 'gap-val' }, curCardH + 'px');

    const cardHSlider = h('input', {
      type: 'range',
      min: cardInfo.minH,
      max: cardInfo.maxH,
      step: 5,
      value: curCardH,
      oninput: e => {
        cfg.cardHeight = +e.target.value;
        cardHVal.textContent = e.target.value + 'px';
        touch();
      }
    });

    const resetCardHBtn = h(
      'button',
      {
        type: 'button',
        class: 'quick-preset-btn',
        onclick: () => {
          delete cfg.cardHeight;
          cardHSlider.value = cardInfo.defaultH;
          cardHVal.textContent = cardInfo.defaultH + 'px';
          touch();
        }
      },
      'Reset Card Height'
    );

    let cardWSlider = null;
    let cardWVal = null;
    let resetCardWBtn = null;

    if (cardInfo.defaultW) {
      const curCardW = cfg.cardWidth || cardInfo.defaultW;
      cardWVal = h('span', { class: 'gap-val' }, curCardW + 'px');
      cardWSlider = h('input', {
        type: 'range',
        min: cardInfo.minW,
        max: cardInfo.maxW,
        step: 5,
        value: curCardW,
        oninput: e => {
          cfg.cardWidth = +e.target.value;
          cardWVal.textContent = e.target.value + 'px';
          touch();
        }
      });
      resetCardWBtn = h(
        'button',
        {
          type: 'button',
          class: 'quick-preset-btn',
          onclick: () => {
            delete cfg.cardWidth;
            cardWSlider.value = cardInfo.defaultW;
            cardWVal.textContent = cardInfo.defaultW + 'px';
            touch();
          }
        },
        'Reset Card Width'
      );
    }

    cardBox = h(
      'div',
      { class: 'card-size-box' },
      h(
        'div',
        { class: 'card-size-header' },
        h('span', {}, '📏 ' + cardInfo.name + ' Sizing (Length & Width)'),
        h('div', { style: 'display:flex;gap:6px' }, resetCardHBtn, resetCardWBtn)
      ),
      h(
        'div',
        { class: 'gap-controls' },
        h('div', { class: 'gap-field' },
          h('label', {}, h('span', {}, 'Card Length / Height:'), cardHVal),
          cardHSlider
        ),
        cardInfo.defaultW
          ? h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Card Width:'), cardWVal),
            cardWSlider
          )
          : null
      )
    );
  }

  // 6. Color picker & presets
  const colorInput = h('input', {
    type: 'color',
    value: col || '#ffffff',
    oninput: e => {
      sc[secKey] = e.target.value;
      touch();
    }
  });

  const presets = ['#ffffff', '#f8fafc', '#ffffe6', '#0a0a0a', '#edebbe', '#18A041'];
  const presetButtons = presets.map(c =>
    h('button', {
      type: 'button',
      class: 'color-swatch-btn',
      style: `background:${c}`,
      title: c,
      onclick: () => {
        sc[secKey] = c;
        colorInput.value = c;
        touch();
      }
    })
  );

  const clearColorBtn = h(
    'button',
    {
      type: 'button',
      style: 'font-size:11px;padding:4px 10px',
      onclick: () => {
        sc[secKey] = '';
        touch();
        if (onRender) onRender();
      }
    },
    'Reset to default'
  );

  banner.append(
    h(
      'div',
      { class: 'ct-banner-header' },
      h('div', {},
        h('span', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--muted)' }, 'Container Controls & Display Rules'),
        h('h3', { style: 'margin:2px 0 0;font-size:16px' }, defInfo.name)
      ),
      h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, homeToggleBtn, subToggleBtn)
    ),
    h(
      'div',
      { style: 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:12px;padding-bottom:12px;border-bottom:1px dashed rgba(0,0,0,.08)' },
      h('span', { style: 'font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-right:4px' }, 'Quick Visibility:'),
      presetHomeOnly,
      presetSubOnly,
      presetBoth
    ),
    h(
      'div',
      { class: 'gap-controls' },
      h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Container Length / Min-Height:'), minHVal),
        minHSlider
      ),
      h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Top Spacing (Gap):'), ptVal),
        ptSlider
      ),
      h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Bottom Spacing (Gap):'), pbVal),
        pbSlider
      )
    ),
    cardBox,
    h(
      'div',
      { class: 'color-field' },
      h('label', {}, 'Container Background Colour:'),
      colorInput,
      h('span', { style: 'font-size:11px;color:var(--muted)' }, col ? col : '(default)'),
      h('div', { class: 'color-swatch-list' }, ...presetButtons),
      col ? clearColorBtn : null
    )
  );

  return banner;
}
