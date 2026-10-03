/**
 * All Containers Manager (Overview Tab) Component
 */
import { h } from '../dom.js';
import {
  getData,
  touch,
  setTab,
  SECTION_INFO,
  SECTION_CARD_INFO,
  SECTION_KEYS,
  isHomeActive,
  isSubpageActive,
  setHomeActive,
  setSubpageActive
} from '../state.js';

export function renderSectionManager(onRender) {
  const data = getData();
  const ss = data.sectionSettings || (data.sectionSettings = {});
  const sc = data.sectionColors || (data.sectionColors = {});

  const rows = SECTION_KEYS.map(key => {
    const info = SECTION_INFO[key];
    const cardInfo = SECTION_CARD_INFO[key];
    const cfg = ss[key] || (ss[key] = {
      active: true,
      showOnHome: true,
      showOnSubpage: false,
      paddingTop: info.defaultTop,
      paddingBottom: info.defaultBottom,
      minHeight: 0
    });
    const col = sc[key] || '';
    const homeOn = isHomeActive(cfg);
    const subOn = isSubpageActive(cfg);
    const isAnyActive = homeOn || subOn;

    const row = h('div', { class: 'sec-row' + (isAnyActive ? '' : ' inactive') });

    // Left info & toggles
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
      homeOn ? '🏠 Home: ON' : '🏠 Home: OFF'
    );

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
      subOn ? '📄 Subpage: ON' : '📄 Subpage: OFF'
    );

    const quickSubBtn = h(
      'button',
      {
        type: 'button',
        class: 'quick-preset-btn',
        title: 'Deactivate on Home & Activate on Subpage',
        onclick: () => {
          setHomeActive(cfg, false);
          setSubpageActive(cfg, true);
          if (onRender) onRender();
        }
      },
      '⚡ Subpage Only'
    );

    const leftCol = h(
      'div',
      { class: 'sec-row-info' },
      h('h4', {}, info.name),
      h('div', { style: 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:8px' }, homeToggleBtn, subToggleBtn),
      h('div', { style: 'margin-top:6px' }, quickSubBtn)
    );

    // Right controls: sliders & color
    const ptVal = h('span', { class: 'gap-val' }, (cfg.paddingTop ?? info.defaultTop) + 'px');
    const pbVal = h('span', { class: 'gap-val' }, (cfg.paddingBottom ?? info.defaultBottom) + 'px');
    const minHVal = h('span', { class: 'gap-val' }, (cfg.minHeight && cfg.minHeight > 0) ? cfg.minHeight + 'px' : 'Auto');

    const ptSlider = h('input', {
      type: 'range',
      min: 0,
      max: 300,
      step: 5,
      value: cfg.paddingTop ?? info.defaultTop,
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
      value: cfg.paddingBottom ?? info.defaultBottom,
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

    // Card length slider in Section Manager
    let cardSliderEl = null;
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
      cardSliderEl = h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Card Length:'), cardHVal),
        cardHSlider
      );
    }

    const colorInput = h('input', {
      type: 'color',
      value: col || '#ffffff',
      oninput: e => {
        sc[key] = e.target.value;
        touch();
      }
    });

    const clearBtn = col
      ? h(
        'button',
        {
          type: 'button',
          style: 'font-size:11px;padding:4px 8px',
          onclick: () => {
            sc[key] = '';
            touch();
            if (onRender) onRender();
          }
        },
        'Reset'
      )
      : null;

    const editBtn = h(
      'button',
      {
        type: 'button',
        style: 'margin-left:auto;font-size:12px;font-weight:600;padding:6px 14px',
        onclick: () => {
          setTab(key);
          if (onRender) onRender();
        }
      },
      'Edit Content →'
    );

    const rightCol = h(
      'div',
      { class: 'sec-row-controls' },
      h(
        'div',
        { class: 'gap-controls' },
        h('div', { class: 'gap-field' },
          h('label', {}, h('span', {}, 'Container Length:'), minHVal),
          minHSlider
        ),
        h('div', { class: 'gap-field' },
          h('label', {}, h('span', {}, 'Top Gap:'), ptVal),
          ptSlider
        ),
        h('div', { class: 'gap-field' },
          h('label', {}, h('span', {}, 'Bottom Gap:'), pbVal),
          pbSlider
        ),
        cardSliderEl
      ),
      h(
        'div',
        { class: 'color-field' },
        h('label', {}, 'Color:'),
        colorInput,
        h('span', { style: 'font-size:11px;color:var(--muted)' }, col || '(default)'),
        clearBtn,
        editBtn
      )
    );

    row.append(leftCol, rightCol);
    return row;
  });

  return h(
    'div',
    {},
    h('h2', {}, 'All Containers Manager'),
    h(
      'p',
      { style: 'color:var(--muted);margin-bottom:24px;font-size:13px' },
      'High-level overview of every container. Toggle homepage and subpage visibility independently (e.g. deactivate on home and activate on subpage), adjust container length/height, change card length/sizes, and customize spacing gaps and background colours.'
    ),
    h('div', { class: 'sec-mgr' }, ...rows)
  );
}
