/**
 * Messages Inbox Component
 */
import { h, $ } from '../dom.js';
import { api } from '../api.js';

export async function renderMessages() {
  const m = await api('/api/messages');
  const main = $('#mn');
  if (!main) return;

  main.replaceChildren(
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
            type: 'button',
            class: 'danger',
            style: 'font-size:12px;padding:4px 10px',
            onclick: async () => {
              await api('/api/messages/' + x.id, { method: 'DELETE' });
              renderMessages();
            }
          },
          'Delete'
        )
      )
    )
  );
}
