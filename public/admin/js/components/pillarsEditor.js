/**
 * Section 2 (Pillars) Special Editor Component
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';
import { renderContainerControls } from './containerControls.js';
import { renderImageWidget, leaf } from '../fields.js';

export function renderPillarsEditor(onRender) {
  const data = getData();
  const p = data.pillars || (data.pillars = { title: '', sub: '', items: [] });
  const wrap = h('div', {});

  // Prepend container controls banner (with card dimensions & subpage/homepage toggle)
  wrap.append(renderContainerControls('pillars', onRender));

  // Section title & sub
  wrap.append(
    h('label', {}, 'Section Title'),
    h('input', {
      type: 'text',
      value: p.title || '',
      placeholder: 'What makes us different',
      oninput: e => {
        p.title = e.target.value;
        touch();
      }
    }),
    h('label', {}, 'Section Subtitle / Tagline'),
    h('textarea', {
      oninput: e => {
        p.sub = e.target.value;
        touch();
      }
    }, p.sub || '')
  );

  // Cards header
  wrap.append(
    h('h3', { style: 'margin-top:24px;margin-bottom:8px' }, 'Section 2 Pillar Cards (' + (p.items || []).length + ')')
  );

  const itemsBox = h('div', {});
  const redrawItems = () => {
    itemsBox.replaceChildren(
      ...(p.items || []).map((it, idx) => {
        if (it.image === undefined) it.image = '';

        const cardBox = h('div', { class: 'it', style: 'margin-bottom:16px;border-left-width:4px' });

        const bar = h(
          'div',
          { class: 'bar' },
          h('button', { type: 'button', onclick: () => { if (idx > 0) { [p.items[idx], p.items[idx - 1]] = [p.items[idx - 1], p.items[idx]]; touch(); redrawItems(); } } }, '↑'),
          h('button', { type: 'button', onclick: () => { if (idx < p.items.length - 1) { [p.items[idx], p.items[idx + 1]] = [p.items[idx + 1], p.items[idx]]; touch(); redrawItems(); } } }, '↓'),
          h('span', { style: 'font-weight:700;font-size:13px;margin-left:6px' }, 'Card #' + (idx + 1) + (it.title ? ': ' + it.title : '')),
          h(
            'button',
            {
              type: 'button',
              class: 'danger',
              style: 'margin-left:auto;font-size:11px;padding:3px 8px',
              onclick: () => {
                if (confirm('Delete Card #' + (idx + 1) + '?')) {
                  p.items.splice(idx, 1);
                  touch();
                  redrawItems();
                }
              }
            },
            '✕ Remove'
          )
        );

        const imgField = renderImageWidget(it, 'image', 'Card Image (Section 2 Image upload/URL)');
        const iconField = leaf(it, 'icon', 'Card Icon', 'icon');

        const titleField = h('div', {},
          h('label', {}, 'Card Title'),
          h('input', {
            type: 'text',
            value: it.title || '',
            placeholder: 'e.g. We make things simple',
            oninput: e => {
              it.title = e.target.value;
              touch();
            }
          })
        );

        const textField = h('div', {},
          h('label', {}, 'Card Description Text'),
          h('textarea', {
            oninput: e => {
              it.text = e.target.value;
              touch();
            }
          }, it.text || '')
        );

        cardBox.append(bar, imgField, iconField, titleField, textField);
        return cardBox;
      })
    );
  };

  redrawItems();

  wrap.append(
    itemsBox,
    h(
      'button',
      {
        type: 'button',
        class: 'p',
        style: 'margin-top:8px',
        onclick: () => {
          (p.items || (p.items = [])).push({
            icon: 'target',
            image: '',
            title: 'New Pillar Title',
            text: 'Supporting description text.'
          });
          touch();
          redrawItems();
        }
      },
      '+ Add Pillar Card'
    )
  );

  return wrap;
}
