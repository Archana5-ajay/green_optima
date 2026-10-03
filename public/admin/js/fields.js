/**
 * Admin field & form input generator components
 */
import { h } from './dom.js';
import { uploadFile } from './api.js';
import { touch, getTab, blank } from './state.js';

const MEDIA = /img|image|logo|photo|avatar|video|icon/i;
const LONG = /^(text|a|quote|excerpt|sub)$/;

// ── IMAGE & MEDIA WIDGET ───────────────────────────────────────────────────
export function renderImageWidget(obj, key, label) {
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

// ── LEAF INPUT FIELD ───────────────────────────────────────────────────────
export function leaf(o, k, label, ctx) {
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

  if (getTab() === 'theme' && /^#[0-9a-f]{6}$/i.test(v)) {
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

// ── RECURSIVE FIELD DISPATCHER ─────────────────────────────────────────────
export function field(o, k, label, ctx) {
  const v = o[k];
  return Array.isArray(v)
    ? list(o, k, label)
    : v && typeof v === 'object'
    ? group(v, label)
    : leaf(o, k, label, ctx || k);
}

// ── GROUP FIELDSET ─────────────────────────────────────────────────────────
export function group(obj, label) {
  return h('fieldset', {}, h('legend', {}, label), Object.keys(obj).map(k => field(obj, k, k)));
}

// ── LIST / ARRAY EDITOR ────────────────────────────────────────────────────
export function list(o, k, label) {
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
