const $ = s => document.querySelector(s);

// Mini DOM builder with proper property assignment
const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k.startsWith('on')) {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class' || k === 'className') {
      el.className = v;
    } else if (k === 'checked') {
      el.checked = Boolean(v);
    } else if (k === 'value') {
      el.value = v == null ? '' : v;
    } else if (k === 'style') {
      if (typeof v === 'object') Object.assign(el.style, v);
      else el.style.cssText = v;
    } else if (v != null && v !== false) {
      el.setAttribute(k, v);
    }
  }
  el.append(...children.flat(9).filter(x => x != null && x !== false));
  return el;
};

// API helper
const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...opts,
    headers: opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && url !== '/api/login') show(false);
    throw new Error(data.error || res.statusText);
  }
  return data;
};

let data = null;
let tab = 'hero';
let dirty = false;

const MEDIA = /img|image|logo|photo|avatar|video|icon/i;
const LONG = /^(text|a|quote|excerpt|sub)$/;

const show = on => {
  $('#lg').style.display = on ? 'none' : 'grid';
  $('#app').style.display = on ? 'grid' : 'none';
};

const touch = () => {
  dirty = true;
  $('#st').textContent = '● Unsaved changes';
  $('#st').style.color = 'var(--yellow)';
};

const blank = x =>
  Array.isArray(x)
    ? []
    : x && typeof x === 'object'
    ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blank(v)]))
    : typeof x === 'number'
    ? x
    : '';

// Section definitions with human labels
const SECTION_INFO = {
  hero: { num: 1, name: 'Hero (Section 1)', defaultTop: 0, defaultBottom: 0 },
  pillars: { num: 2, name: 'Pillars (Section 2)', defaultTop: 80, defaultBottom: 80 },
  about: { num: 3, name: 'About (Section 3)', defaultTop: 80, defaultBottom: 80 },
  cases: { num: 4, name: 'Case Studies (Section 4)', defaultTop: 80, defaultBottom: 80 },
  services: { num: 5, name: 'Services (Section 5)', defaultTop: 80, defaultBottom: 80 },
  industries: { num: 6, name: 'Industries (Section 6)', defaultTop: 80, defaultBottom: 80 },
  process: { num: 7, name: 'Process (Section 7)', defaultTop: 80, defaultBottom: 80 },
  stats: { num: 8, name: 'Stats (Section 8)', defaultTop: 80, defaultBottom: 80 },
  compare: { num: 9, name: 'Compare (Section 9)', defaultTop: 80, defaultBottom: 80 },
  reviews: { num: 10, name: 'Reviews (Section 10)', defaultTop: 80, defaultBottom: 80 },
  blog: { num: 11, name: 'Blog (Section 11)', defaultTop: 80, defaultBottom: 80 }
};

const SECTION_KEYS = Object.keys(SECTION_INFO);

// File uploader helper
async function uploadFile(file) {
  if (!file) return null;
  const fd = new FormData();
  fd.append('file', file);
  $('#st').textContent = 'Uploading image…';
  $('#st').style.color = 'var(--green)';
  try {
    const res = await api('/api/upload', { method: 'POST', body: fd });
    $('#st').textContent = 'Image uploaded ✓ Remember to save';
    touch();
    return res.url;
  } catch (err) {
    $('#st').textContent = 'Upload failed: ' + err.message;
    $('#st').style.color = 'var(--red)';
    throw err;
  }
}

// ── CONTAINER CONTROLS BANNER (At the top of every section) ─────────────────
function renderContainerControls(secKey) {
  const ss = data.sectionSettings || (data.sectionSettings = {});
  const sc = data.sectionColors || (data.sectionColors = {});
  const defInfo = SECTION_INFO[secKey] || { defaultTop: 80, defaultBottom: 80, name: secKey };

  if (!ss[secKey]) {
    ss[secKey] = { active: true, paddingTop: defInfo.defaultTop, paddingBottom: defInfo.defaultBottom };
  }
  const cfg = ss[secKey];
  const col = sc[secKey] || '';
  const isActive = cfg.active !== false;

  const banner = h('div', { class: 'ct-banner' + (isActive ? '' : ' inactive') });

  // Status badge & toggle button
  const statusBadge = h(
    'span',
    { class: 'ct-status-badge ' + (isActive ? 'on' : 'off') },
    isActive ? '● ACTIVE (Visible on Website)' : '○ DEACTIVATED (Hidden)'
  );

  const toggleBtn = h(
    'button',
    {
      type: 'button',
      class: 'sec-toggle-btn ' + (isActive ? 'is-active' : 'is-inactive'),
      onclick: () => {
        cfg.active = !isActive;
        touch();
        render();
      }
    },
    isActive ? '✕ Deactivate Container' : '✓ Activate Container'
  );

  // Top/bottom gap sliders
  const ptVal = h('span', { class: 'gap-val' }, (cfg.paddingTop ?? defInfo.defaultTop) + 'px');
  const pbVal = h('span', { class: 'gap-val' }, (cfg.paddingBottom ?? defInfo.defaultBottom) + 'px');

  const ptSlider = h('input', {
    type: 'range',
    min: 0,
    max: 200,
    step: 10,
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
    max: 200,
    step: 10,
    value: cfg.paddingBottom ?? defInfo.defaultBottom,
    oninput: e => {
      cfg.paddingBottom = +e.target.value;
      pbVal.textContent = e.target.value + 'px';
      touch();
    }
  });

  // Color picker & presets
  const colorInput = h('input', {
    type: 'color',
    value: col || '#ffffff',
    oninput: e => {
      sc[secKey] = e.target.value;
      touch();
    }
  });

  const presets = ['#ffffff', '#ffffe6', '#0a0a0a', '#edebbe', '#18A041'];
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
        render();
      }
    },
    'Reset to default'
  );

  banner.append(
    h(
      'div',
      { class: 'ct-banner-header' },
      h('div', {},
        h('span', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--muted)' }, 'Container Controls'),
        h('h3', { style: 'margin:2px 0 0;font-size:16px' }, defInfo.name)
      ),
      h('div', { style: 'display:flex;gap:10px;align-items:center' }, statusBadge, toggleBtn)
    ),
    h(
      'div',
      { class: 'gap-controls' },
      h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Top Spacing (Gap)'), ptVal),
        ptSlider
      ),
      h('div', { class: 'gap-field' },
        h('label', {}, h('span', {}, 'Bottom Spacing (Gap)'), pbVal),
        pbSlider
      )
    ),
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

// ── IMAGE WIDGET (With preview, upload button, and URL input) ───────────────
function renderImageWidget(obj, key, label) {
  const box = h('div', { class: 'img-widget' });

  const draw = () => {
    const val = obj[key] || '';
    const isVid = /\.(mp4|webm)$/i.test(val);

    const prevEl = val
      ? isVid
        ? h('video', { src: val, controls: '' })
        : h('img', { src: val, alt: 'Preview' })
      : h('div', { class: 'no-img' }, 'No image');

    const fileInput = h('input', {
      type: 'file',
      accept: 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm',
      style: 'font-size:12px;width:auto',
      onchange: async e => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) {
          obj[key] = url;
          touch();
          draw();
        }
      }
    });

    const urlInput = h('input', {
      type: 'text',
      value: val,
      placeholder: '/uploads/… or https://…',
      style: 'flex:1;min-width:200px',
      oninput: e => {
        obj[key] = e.target.value.trim();
        touch();
      },
      onchange: () => draw()
    });

    const clearBtn = val
      ? h(
          'button',
          {
            type: 'button',
            style: 'font-size:11px;padding:5px 10px',
            onclick: () => {
              obj[key] = '';
              touch();
              draw();
            }
          },
          'Clear'
        )
      : null;

    box.replaceChildren(
      h('div', { class: 'img-widget-preview' },
        prevEl,
        h('div', { style: 'display:grid;gap:6px;flex:1' },
          h('div', { style: 'display:flex;gap:8px;align-items:center' }, fileInput, clearBtn),
          urlInput
        )
      )
    );
  };

  draw();
  return h('div', {}, h('label', {}, label), box);
}

// ── LEAF FIELD EDITOR ───────────────────────────────────────────────────────
function leaf(o, k, label, ctx) {
  const v = o[k];
  const set = x => {
    o[k] = x;
    touch();
  };

  if (typeof v === 'number') {
    return h('div', {}, h('label', {}, label), h('input', {
      type: 'number',
      step: 'any',
      value: v,
      oninput: e => set(+e.target.value)
    }));
  }

  if (tab === 'theme' && /^#[0-9a-f]{6}$/i.test(v)) {
    return h('div', { class: 'm' },
      h('label', { style: 'margin:0;width:90px' }, label),
      h('input', { type: 'color', value: v, oninput: e => set(e.target.value) }),
      h('code', {}, v)
    );
  }

  if (MEDIA.test(ctx || k)) {
    // If it's an icon field, also provide datalist options
    if (/icon/i.test(ctx || k)) {
      const box = h('div', { class: 'm' });
      const draw = () => {
        box.replaceChildren(
          o[k] && /\.(png|jpg|webp|svg)$/i.test(o[k])
            ? h('img', { src: o[k], style: 'width:36px;height:36px;object-fit:contain' })
            : h('span', { style: 'font-weight:600;font-size:12px;padding:6px 10px;background:var(--ln);border-radius:6px' }, o[k] || '—'),
          h('input', {
            type: 'text',
            value: o[k] || '',
            placeholder: 'icon name (e.g. target, clock, cpu) or /uploads/…',
            list: 'ic',
            oninput: e => {
              set(e.target.value.trim());
            },
            onchange: () => draw()
          }),
          h('input', {
            type: 'file',
            accept: 'image/png,image/jpeg,image/webp,image/svg+xml',
            style: 'font-size:11px',
            onchange: async e => {
              const file = e.target.files[0];
              if (!file) return;
              const url = await uploadFile(file);
              if (url) {
                set(url);
                draw();
              }
            }
          }),
          o[k] ? h('button', { type: 'button', onclick: () => { set(''); draw(); } }, 'Clear') : null
        );
      };
      draw();
      return h('div', {}, h('label', {}, label), box);
    }
    // Full image uploader widget
    return renderImageWidget(o, k, label);
  }

  return h(
    'div',
    {},
    h('label', {}, label),
    LONG.test(ctx || k)
      ? h('textarea', { oninput: e => set(e.target.value) }, v)
      : h('input', { type: 'text', value: v, oninput: e => set(e.target.value) })
  );
}

function field(o, k, label, ctx) {
  const v = o[k];
  return Array.isArray(v)
    ? list(o, k, label)
    : v && typeof v === 'object'
    ? group(v, label)
    : leaf(o, k, label, ctx || k);
}

function group(obj, label) {
  return h('fieldset', {}, h('legend', {}, label), Object.keys(obj).map(k => field(obj, k, k)));
}

function list(o, k, label) {
  const a = o[k];
  const box = h('fieldset', {}, h('legend', {}, label + ' (' + a.length + ')'));
  const redraw = () => {
    const n = list(o, k, label);
    box.replaceWith(n);
  };
  const mv = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    touch();
    redraw();
  };

  a.forEach((it, i) =>
    box.append(
      h(
        'div',
        { class: 'it' },
        h(
          'div',
          { class: 'bar' },
          h('button', { type: 'button', onclick: () => mv(i, -1) }, '↑'),
          h('button', { type: 'button', onclick: () => mv(i, 1) }, '↓'),
          h('span', { style: 'font-weight:700;font-size:12px;margin-left:6px' }, '#' + (i + 1)),
          h(
            'button',
            {
              type: 'button',
              class: 'danger',
              style: 'margin-left:auto;font-size:11px;padding:3px 8px',
              onclick: () => {
                if (confirm('Remove item #' + (i + 1) + '?')) {
                  a.splice(i, 1);
                  touch();
                  redraw();
                }
              }
            },
            '✕ Remove'
          )
        ),
        it && typeof it === 'object' && !Array.isArray(it)
          ? Object.keys(it).map(x => field(it, x, x))
          : Array.isArray(it)
          ? list(a, i, '#' + (i + 1))
          : leaf(a, i, '#' + (i + 1), k)
      )
    )
  );

  box.append(
    h(
      'button',
      {
        type: 'button',
        class: 'p',
        style: 'margin-top:8px',
        onclick: () => {
          a.push(a.length ? blank(a[a.length - 1]) : '');
          touch();
          redraw();
        }
      },
      '+ Add Item'
    )
  );

  return box;
}

// ── SECTION 2 (PILLARS) SPECIAL EDITOR ──────────────────────────────────────
function renderPillarsEditor() {
  const p = data.pillars || (data.pillars = { title: '', sub: '', items: [] });
  const wrap = h('div', {});

  // Prepend container controls banner
  wrap.append(renderContainerControls('pillars'));

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
        // Ensure image property exists
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

        // Prominent image uploader widget
        const imgField = renderImageWidget(it, 'image', 'Card Image (Section 2 Image upload/URL)');

        // Icon input
        const iconField = leaf(it, 'icon', 'Card Icon', 'icon');

        // Title input
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

        // Text input
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

// ── CUSTOM CONTAINERS BUILDER ───────────────────────────────────────────────
function renderCustomContainers() {
  const arr = data.customContainers || (data.customContainers = []);
  const wrap = h('div', {});

  const redraw = () => {
    wrap.replaceWith(renderCustomContainers());
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
            paddingTop: 80,
            paddingBottom: 80,
            bgColor: '',
            cards: []
          });
          touch();
          redraw();
        }
      },
      '+ Add New Container'
    );

  wrap.append(
    h('h2', {}, 'Custom Containers (' + arr.length + ')'),
    h(
      'p',
      { style: 'color:var(--muted);margin-bottom:20px;font-size:13px' },
      'Create brand new custom containers for your website. You can toggle them active/deactivated, choose background colour, set top & bottom gap spacing, and add content cards inside.'
    ),
    addContainerBtn(),
    ...arr.map((ct, idx) => {
      const isOn = ct.active !== false;
      const box = h('div', { class: 'custom-ct-box' + (isOn ? '' : ' inactive') });

      const badge = h(
        'span',
        { class: 'ct-status-badge ' + (isOn ? 'on' : 'off') },
        isOn ? '● ACTIVE' : '○ INACTIVE'
      );

      const toggleBtn = h(
        'button',
        {
          type: 'button',
          class: 'sec-toggle-btn ' + (isOn ? 'is-active' : 'is-inactive'),
          onclick: () => {
            ct.active = !isOn;
            touch();
            redraw();
          }
        },
        isOn ? '✕ Deactivate' : '✓ Activate'
      );

      const delBtn = h(
        'button',
        {
          type: 'button',
          class: 'danger',
          style: 'font-size:12px;padding:6px 14px',
          onclick: () => {
            if (confirm('Delete this container permanently?')) {
              arr.splice(idx, 1);
              touch();
              redraw();
            }
          }
        },
        'Delete Container'
      );

      // Spacing sliders
      const ptVal = h('span', { class: 'gap-val' }, (ct.paddingTop || 80) + 'px');
      const pbVal = h('span', { class: 'gap-val' }, (ct.paddingBottom || 80) + 'px');

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
              }, card.text || '')
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
          h('div', { style: 'display:flex;gap:10px;align-items:center' }, badge, toggleBtn, delBtn)
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
            h('label', {}, h('span', {}, 'Top Spacing (Gap)'), ptVal),
            h('input', {
              type: 'range',
              min: 0,
              max: 200,
              step: 10,
              value: ct.paddingTop || 80,
              oninput: e => {
                ct.paddingTop = +e.target.value;
                ptVal.textContent = e.target.value + 'px';
                touch();
              }
            })
          ),
          h('div', { class: 'gap-field' },
            h('label', {}, h('span', {}, 'Bottom Spacing (Gap)'), pbVal),
            h('input', {
              type: 'range',
              min: 0,
              max: 200,
              step: 10,
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
                  cards.push({ title: '', text: '', image: '' });
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

// ── ALL CONTAINERS OVERVIEW (SECTION MANAGER) ────────────────────────────────
function renderSectionManager() {
  const ss = data.sectionSettings || (data.sectionSettings = {});
  const sc = data.sectionColors || (data.sectionColors = {});

  const rows = SECTION_KEYS.map(key => {
    const info = SECTION_INFO[key];
    const cfg = ss[key] || (ss[key] = { active: true, paddingTop: info.defaultTop, paddingBottom: info.defaultBottom });
    const col = sc[key] || '';
    const isActive = cfg.active !== false;

    const row = h('div', { class: 'sec-row' + (isActive ? '' : ' inactive') });

    // Left info & toggle
    const statusBadge = h(
      'span',
      { class: 'ct-status-badge ' + (isActive ? 'on' : 'off'), style: 'font-size:11px' },
      isActive ? '● Active' : '○ Deactivated'
    );

    const toggleBtn = h(
      'button',
      {
        type: 'button',
        class: 'sec-toggle-btn ' + (isActive ? 'is-active' : 'is-inactive'),
        onclick: () => {
          cfg.active = !isActive;
          touch();
          render();
        }
      },
      isActive ? 'Deactivate' : 'Activate'
    );

    const leftCol = h(
      'div',
      { class: 'sec-row-info' },
      h('h4', {}, info.name),
      h('div', { style: 'display:flex;gap:8px;align-items:center;margin-top:6px' }, statusBadge, toggleBtn)
    );

    // Right controls: sliders & color
    const ptVal = h('span', { class: 'gap-val' }, (cfg.paddingTop ?? info.defaultTop) + 'px');
    const pbVal = h('span', { class: 'gap-val' }, (cfg.paddingBottom ?? info.defaultBottom) + 'px');

    const ptSlider = h('input', {
      type: 'range',
      min: 0,
      max: 200,
      step: 10,
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
      max: 200,
      step: 10,
      value: cfg.paddingBottom ?? info.defaultBottom,
      oninput: e => {
        cfg.paddingBottom = +e.target.value;
        pbVal.textContent = e.target.value + 'px';
        touch();
      }
    });

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
              render();
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
          tab = key;
          render();
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
          h('label', {}, h('span', {}, 'Top Gap'), ptVal),
          ptSlider
        ),
        h('div', { class: 'gap-field' },
          h('label', {}, h('span', {}, 'Bottom Gap'), pbVal),
          pbSlider
        )
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
      'High-level overview of every container on your website. Activate/deactivate any container, adjust spacing gaps (top and bottom), and pick background colours.'
    ),
    h('div', { class: 'sec-mgr' }, ...rows)
  );
}

// ── MESSAGES TAB ────────────────────────────────────────────────────────────
async function messages() {
  const m = await api('/api/messages');
  $('#mn').replaceChildren(
    h('h2', {}, 'Messages (' + m.length + ')'),
    ...m.map(x =>
      h(
        'fieldset',
        {},
        h('legend', {}, x.name + ' · ' + new Date(x.at).toLocaleString()),
        h('a', { href: 'mailto:' + x.email, style: 'font-weight:600' }, x.email),
        h('p', { style: 'white-space:pre-wrap;margin:10px 0' }, x.message),
        h(
          'button',
          {
            class: 'danger',
            style: 'font-size:12px;padding:4px 10px',
            onclick: async () => {
              await api('/api/messages/' + x.id, { method: 'DELETE' });
              messages();
            }
          },
          'Delete'
        )
      )
    )
  );
}

// ── MAIN RENDERER ───────────────────────────────────────────────────────────
function renderMain() {
  if (tab === 'messages') {
    messages();
    return;
  }
  if (tab === 'sections') {
    $('#mn').replaceChildren(renderSectionManager());
    return;
  }
  if (tab === 'containers') {
    $('#mn').replaceChildren(renderCustomContainers());
    return;
  }
  if (tab === 'pillars') {
    $('#mn').replaceChildren(renderPillarsEditor());
    return;
  }

  // Any other website container
  if (SECTION_KEYS.includes(tab)) {
    const v = data[tab];
    if (v == null) {
      $('#mn').replaceChildren(h('p', {}, 'Section not found'));
      return;
    }
    const containerControls = renderContainerControls(tab);
    const contentEditor = Array.isArray(v) ? list(data, tab, tab) : group(v, tab);
    $('#mn').replaceChildren(
      containerControls,
      h('h2', { style: 'text-transform:capitalize;margin-top:20px' }, SECTION_INFO[tab]?.name || tab),
      contentEditor
    );
    return;
  }

  // Site settings / Theme / Nav
  const v = data[tab];
  if (v == null) {
    $('#mn').replaceChildren(h('p', {}, 'Section not found'));
    return;
  }
  $('#mn').replaceChildren(
    h('h2', { style: 'text-transform:capitalize' }, tab),
    Array.isArray(v) ? list(data, tab, tab) : group(v, tab)
  );
}

function render() {
  const nv = $('#nv');
  const ss = data.sectionSettings || {};
  const customCount = (data.customContainers || []).length;

  nv.replaceChildren(
    // 1. Website Containers
    h('div', { class: 'nav-section' }, 'Website Containers'),
    ...SECTION_KEYS.map(k => {
      const info = SECTION_INFO[k];
      const isActive = (ss[k]?.active !== false);
      const badge = h('span', { class: 'nav-badge ' + (isActive ? 'on' : 'off') }, isActive ? 'ON' : 'OFF');
      return h(
        'button',
        {
          class: k === tab ? 'on' : '',
          onclick: () => {
            tab = k;
            render();
          }
        },
        h('span', {}, info.num + '. ' + (k === 'cases' ? 'Case Studies' : k.charAt(0).toUpperCase() + k.slice(1))),
        badge
      );
    }),

    // 2. Custom Containers
    h('div', { class: 'nav-section' }, 'Custom Containers'),
    h(
      'button',
      {
        class: tab === 'containers' ? 'on' : '',
        onclick: () => {
          tab = 'containers';
          render();
        }
      },
      h('span', {}, '＋ Custom Containers'),
      h('span', { class: 'nav-badge on' }, customCount)
    ),

    // 3. Overview
    h('div', { class: 'nav-section' }, 'Overview'),
    h(
      'button',
      {
        class: tab === 'sections' ? 'on' : '',
        onclick: () => {
          tab = 'sections';
          render();
        }
      },
      h('span', {}, '⚙ Containers Manager')
    ),

    // 4. Site Config
    h('div', { class: 'nav-section' }, 'Site Config'),
    h('button', { class: tab === 'theme' ? 'on' : '', onclick: () => { tab = 'theme'; render(); } }, 'Theme Colors'),
    h('button', { class: tab === 'site' ? 'on' : '', onclick: () => { tab = 'site'; render(); } }, 'Site Details'),
    h('button', { class: tab === 'nav' ? 'on' : '', onclick: () => { tab = 'nav'; render(); } }, 'Header Nav'),
    h('button', { class: tab === 'messages' ? 'on' : '', onclick: () => { tab = 'messages'; render(); } }, 'Messages')
  );

  renderMain();
}

async function load() {
  data = await api('/api/content');
  // Ensure FAQ is completely ignored
  delete data.faq;
  data.sectionSettings = data.sectionSettings || {};
  data.sectionColors = data.sectionColors || {};
  data.customContainers = data.customContainers || [];
  tab = 'hero';
  show(true);
  render();
}

$('#lg').onsubmit = async e => {
  e.preventDefault();
  try {
    await api('/api/login', { method: 'POST', body: JSON.stringify({ password: $('#pw').value }) });
    $('#pw').value = '';
    load();
  } catch (err) {
    $('#le').textContent = err.message;
  }
};

$('#sb').onclick = async () => {
  try {
    delete data.faq;
    await api('/api/content', { method: 'PUT', body: JSON.stringify(data) });
    dirty = false;
    $('#st').textContent = 'Saved successfully ✓';
    $('#st').style.color = 'var(--green)';
    setTimeout(() => {
      if (!dirty) $('#st').textContent = '';
    }, 4000);
  } catch (err) {
    $('#st').textContent = 'Save failed: ' + err.message;
    $('#st').style.color = 'var(--red)';
  }
};

$('#lo').onclick = async () => {
  await api('/api/logout', { method: 'POST' });
  show(false);
};

window.addEventListener('beforeunload', e => {
  if (dirty) e.preventDefault();
});

api('/api/me').then(load).catch(() => show(false));
