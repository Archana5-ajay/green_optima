/**
 * Custom Containers Builder Component
 */
import { h } from '../dom.js';
import { getData, touch, isHomeActive, isSubpageActive, setHomeActive, setSubpageActive } from '../state.js';
import { renderImageWidget } from '../fields.js';

export function renderCustomContainers(onRender) {
  const data = getData();
  const arr = data.customContainers || (data.customContainers = []);
  const wrap = h('div', {});

  const redraw = () => {
    wrap.replaceWith(renderCustomContainers(onRender));
  };

  const addContainerBtn = () =>
    h(
      'button',
      {
        type: 'button',
        class: 'p',
        style: 'padding:10px 20px;font-size:14px;margin-bottom:18px',
        onclick: () => {
          arr.push({
            title: 'New Section Heading',
            tag: 'Custom Section',
            text: 'Section description text.',
            active: true,
            showOnHome: true,
            showOnSubpage: false,
            minHeight: 0,
            paddingTop: 80,
            paddingBottom: 80,
            cardHeight: 0,
            cardWidth: 0,
            bgColor: '',
            cards: []
          });
          touch();
          if (onRender) onRender();
          else redraw();
        }
      },
      '+ Add New Container'
    );

  wrap.append(
    h('h2', {}, 'Custom Containers (' + arr.length + ')'),
    h(
      'p',
      { style: 'color:var(--muted);margin-bottom:20px;font-size:13px' },
      'Create brand new custom containers for your website. Control whether they appear on the homepage, subpages, or both. Customize container length, gap spacing, background colour, and cards dimensions inside.'
    ),
    addContainerBtn(),
    ...arr.map((ct, idx) => {
      const homeOn = isHomeActive(ct);
      const subOn = isSubpageActive(ct);
      const isAnyActive = homeOn || subOn;

      const box = h('div', { class: 'custom-ct-box' + (isAnyActive ? '' : ' inactive') });

      const homeToggleBtn = h(
        'button',
        {
          type: 'button',
          class: 'sec-toggle-btn ' + (homeOn ? 'is-active' : 'is-inactive'),
          onclick: () => {
            setHomeActive(ct, !homeOn);
            if (onRender) onRender();
          }
        },
        homeOn ? '🏠 Home: ACTIVE' : '🏠 Home: DEACTIVATED'
      );

      const subToggleBtn = h(
        'button',
        {
          type: 'button',
          class: 'sec-toggle-btn ' + (subOn ? 'is-active' : 'is-inactive'),
          onclick: () => {
            setSubpageActive(ct, !subOn);
            if (onRender) onRender();
          }
        },
        subOn ? '📄 Subpage: ACTIVE' : '📄 Subpage: DEACTIVATED'
      );

      const quickSubOnly = h(
        'button',
        {
          type: 'button',
          class: 'quick-preset-btn',
          title: 'Deactivate on home & activate on subpage',
          onclick: () => {
            setHomeActive(ct, false);
            setSubpageActive(ct, true);
            if (onRender) onRender();
          }
        },
        '⚡ Subpage Only'
      );

      const delBtn = h(
        'button',
        {
          type: 'button',
          class: 'danger',
          style: 'font-size:12px;padding:6px 14px',
          onclick: () => {
            if (confirm('Delete container #' + (idx + 1) + ' permanently?')) {
              arr.splice(idx, 1);
              touch();
              if (onRender) onRender();
              else redraw();
            }
          }
        },
        'Delete Container'
      );

      // Spacing & Length sliders
      const ptVal = h('span', { class: 'gap-val' }, (ct.paddingTop || 80) + 'px');
      const pbVal = h('span', { class: 'gap-val' }, (ct.paddingBottom || 80) + 'px');
      const minHVal = h('span', { class: 'gap-val' }, (ct.minHeight && ct.minHeight > 0) ? ct.minHeight + 'px' : 'Auto');

      // Card sizing controls
      const cardHVal = h('span', { class: 'gap-val' }, (ct.cardHeight && ct.cardHeight > 0) ? ct.cardHeight + 'px' : 'Auto');
      const cardWVal = h('span', { class: 'gap-val' }, (ct.cardWidth && ct.cardWidth > 0) ? ct.cardWidth + 'px' : 'Auto (280px)');

      // Color picker
      const colorInput = h('input', {
        type: 'color',
        value: ct.bgColor || '#ffffff',
        oninput: e => {
          ct.bgColor = e.target.value;
          touch();
        }
      });

      // Cards inside container
      const cards = ct.cards || (ct.cards = []);
      const cardsBox = h('div', { class: 'cards-grid' });

      const redrawCards = () => {
        cardsBox.replaceChildren(
          ...cards.map((card, ci) => {
            const perCardHVal = h('span', { class: 'gap-val' }, card.cardHeight ? card.cardHeight + 'px' : 'Default');
            return h(
              'div',
              { class: 'card-edit-box' },
              h(
                'div',
                { class: 'bar' },
                h('span', { style: 'font-weight:700;font-size:12px' }, 'Card #' + (ci + 1)),
                h(
                  'button',
                  {
                    type: 'button',
                    class: 'danger',
                    style: 'font-size:11px;padding:3px 8px;margin-left:auto',
                    onclick: () => {
                      cards.splice(ci, 1);
                      touch();
                      redrawCards();
                    }
                  },
                  '✕ Remove'
                )
              ),
              renderImageWidget(card, 'image', 'Card Image (Optional)'),
              h('label', {}, 'Card Title'),
              h('input', {
                type: 'text',
                value: card.title || '',
                placeholder: 'Card title',
                oninput: e => {
                  card.title = e.target.value;
                  touch();
                }
              }),
              h('label', {}, 'Card Text'),
              h('textarea', {
                placeholder: 'Card description...',
                style: 'min-height:60px',
                oninput: e => {
                  card.text = e.target.value;
                  touch();
                }
              }, card.text || ''),
              h('div', { style: 'margin-top:10px' },
                h('label', { style: 'display:flex;justify-content:space-between;font-size:11px' },
                  h('span', {}, 'Individual Card Length / Min-Height:'),
                  perCardHVal
                ),
                h('input', {
                  type: 'range',
                  min: 0,
                  max: 800,
                  step: 10,
                  value: card.cardHeight || 0,
                  oninput: e => {
                    const val = +e.target.value;
                    card.cardHeight = val;
                    perCardHVal.textContent = val > 0 ? val + 'px' : 'Default';
                    touch();
                  }
                })
              )
            );
          })
        );
      };

      redrawCards();

      box.append(
        h(
          'div',
          { class: 'ct-banner-header' },
          h('div', {},
            h('span', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--muted)' }, 'Custom Container #' + (idx + 1)),
            h('h3', { style: 'margin:2px 0 0;font-size:16px' }, ct.title || '(Untitled Container)')
          ),
          h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, homeToggleBtn, subToggleBtn, quickSubOnly, delBtn)
        ),
        h('label', {}, 'Container Title'),
        h('input', {
          type: 'text',
          value: ct.title || '',
          placeholder: 'Section Title',
          oninput: e => {
            ct.title = e.target.value;
            touch();
            box.querySelector('h3').textContent = ct.title || '(Untitled Container)';
          }
        }),
        h('label', {}, 'Tag / Badge'),
        h('input', {
          type: 'text',
          value: ct.tag || '',
          placeholder: 'e.g. Solutions or Our Work',
          oninput: e => {
            ct.tag = e.target.value;
            touch();
          }
        }),
        h('label', {}, 'Description Text'),
        h('textarea', {
          oninput: e => {
            ct.text = e.target.value;
            touch();
          }
        }, ct.text || ''),
        h(
          'div',
          { class: 'gap-controls' },
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Container Length / Min-Height:'), minHVal),
            h('input', {
              type: 'range',
              min: 0,
              max: 1400,
              step: 20,
              value: ct.minHeight || 0,
              oninput: e => {
                const val = +e.target.value;
                ct.minHeight = val;
                minHVal.textContent = val > 0 ? val + 'px' : 'Auto';
                touch();
              }
            })
          ),
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Top Spacing (Gap):'), ptVal),
            h('input', {
              type: 'range',
              min: 0,
              max: 300,
              step: 5,
              value: ct.paddingTop || 80,
              oninput: e => {
                ct.paddingTop = +e.target.value;
                ptVal.textContent = e.target.value + 'px';
                touch();
              }
            })
          ),
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Bottom Spacing (Gap):'), pbVal),
            h('input', {
              type: 'range',
              min: 0,
              max: 300,
              step: 5,
              value: ct.paddingBottom || 80,
              oninput: e => {
                ct.paddingBottom = +e.target.value;
                pbVal.textContent = e.target.value + 'px';
                touch();
              }
            })
          )
        ),
        h(
          'div',
          { class: 'card-size-box' },
          h(
            'div',
            { class: 'card-size-header' },
            h('span', {}, '📏 Cards Sizing Inside Container'),
            h('button', {
              type: 'button',
              class: 'quick-preset-btn',
              onclick: () => {
                delete ct.cardHeight;
                delete ct.cardWidth;
                cardHVal.textContent = 'Auto';
                cardWVal.textContent = 'Auto (280px)';
                touch();
              }
            }, 'Reset Card Sizes')
          ),
          h(
            'div',
            { class: 'gap-controls' },
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'All Cards Length / Height:'), cardHVal),
              h('input', {
                type: 'range',
                min: 0,
                max: 800,
                step: 10,
                value: ct.cardHeight || 0,
                oninput: e => {
                  const val = +e.target.value;
                  ct.cardHeight = val;
                  cardHVal.textContent = val > 0 ? val + 'px' : 'Auto';
                  touch();
                }
              })
            ),
            h('div', { class: 'gap-field' },
              h('label', {}, h('span', {}, 'All Cards Width:'), cardWVal),
              h('input', {
                type: 'range',
                min: 0,
                max: 600,
                step: 10,
                value: ct.cardWidth || 0,
                oninput: e => {
                  const val = +e.target.value;
                  ct.cardWidth = val;
                  cardWVal.textContent = val > 0 ? val + 'px' : 'Auto (280px)';
                  touch();
                }
              })
            )
          )
        ),
        h(
          'div',
          { class: 'color-field' },
          h('label', {}, 'Background Colour:'),
          colorInput,
          h('span', { style: 'font-size:11px;color:var(--muted)' }, ct.bgColor || '(default)'),
          ct.bgColor
            ? h('button', {
                type: 'button',
                style: 'font-size:11px;padding:4px 10px',
                onclick: () => {
                  ct.bgColor = '';
                  touch();
                  redraw();
                }
              }, 'Reset colour')
            : null
        ),
        h(
          'div',
          { class: 'cards-editor' },
          h('div', { style: 'display:flex;justify-content:space-between;align-items:center' },
            h('label', { style: 'font-size:13px;margin:0' }, 'Cards inside this container (' + cards.length + ')'),
            h(
              'button',
              {
                type: 'button',
                class: 'p',
                style: 'font-size:12px;padding:5px 12px',
                onclick: () => {
                  cards.push({ title: '', text: '', image: '', cardHeight: 0 });
                  touch();
                  redrawCards();
                }
              },
              '+ Add Card'
            )
          ),
          cardsBox
        )
      );

      return box;
    })
  );

  return wrap;
}
