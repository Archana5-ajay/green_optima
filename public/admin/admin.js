/**
 * Main Admin Dashboard Orchestrator
 */
import { $, h, showApp } from './js/dom.js';
import { api } from './js/api.js';
import {
  getData,
  setData,
  getTab,
  isDirty,
  clearDirty,
  SECTION_INFO,
  SECTION_KEYS
} from './js/state.js';
import { list, group } from './js/fields.js';

// Modular Components
import { renderNav } from './js/components/nav.js';
import { renderContainerControls } from './js/components/containerControls.js';
import { renderPillarsEditor } from './js/components/pillarsEditor.js';
import { renderCustomContainers } from './js/components/customContainers.js';
import { renderSectionManager } from './js/components/sectionManager.js';
import { renderMessages } from './js/components/messagesEditor.js';
import { renderPagesEditor } from './js/components/pagesEditor.js';
import { renderNavEditor } from './js/components/navEditor.js';
import { renderNavbarSettingsEditor } from './js/components/navbarSettingsEditor.js';
import { renderTopNavPagesEditor } from './js/components/topNavPagesEditor.js';

// Render active tab view
function renderMain() {
  const tab = getTab();
  const data = getData();
  const main = $('#mn');
  if (!main) return;

  if (tab === 'pages') {
    main.replaceChildren(renderPagesEditor(render));
    return;
  }
  if (tab === 'nav') {
    main.replaceChildren(renderNavEditor(render));
    return;
  }
  if (tab === 'topnav') {
    main.replaceChildren(renderTopNavPagesEditor(render));
    return;
  }
  if (tab === 'navbar') {
    main.replaceChildren(renderNavbarSettingsEditor(render));
    return;
  }
  if (tab === 'messages') {
    renderMessages();
    return;
  }
  if (tab === 'sections') {
    main.replaceChildren(renderSectionManager(render));
    return;
  }
  if (tab === 'containers') {
    main.replaceChildren(renderCustomContainers(render));
    return;
  }
  if (tab === 'pillars') {
    main.replaceChildren(renderPillarsEditor(render));
    return;
  }

  // Any standard website container
  if (SECTION_KEYS.includes(tab)) {
    const v = data[tab];
    if (v == null) {
      main.replaceChildren(h('p', {}, 'Section not found'));
      return;
    }
    const containerControls = renderContainerControls(tab, render);
    const contentEditor = Array.isArray(v) ? list(data, tab, tab) : group(v, tab);
    main.replaceChildren(
      containerControls,
      h('h2', { style: 'text-transform:capitalize;margin-top:20px' }, SECTION_INFO[tab]?.name || tab),
      contentEditor
    );
    return;
  }

  // Site settings / Theme / Nav
  const v = data[tab];
  if (v == null) {
    main.replaceChildren(h('p', {}, 'Section not found'));
    return;
  }
  main.replaceChildren(
    h('h2', { style: 'text-transform:capitalize' }, tab),
    Array.isArray(v) ? list(data, tab, tab) : group(v, tab)
  );
}

// Master render
export function render() {
  renderNav(render);
  renderMain();
}

// Load website data from server
async function load() {
  const content = await api('/api/content');
  delete content.faq;
  content.sectionSettings = content.sectionSettings || {};
  content.sectionColors = content.sectionColors || {};
  content.customContainers = content.customContainers || [];
  content.pages = content.pages || [];
  content.nav = content.nav || [];
  content.navTop = content.navTop || [];
  content.navbarSettings = content.navbarSettings || {};
  
  // Ensure all section data objects exist
  SECTION_KEYS.forEach(key => {
    if (!content[key]) content[key] = { items: [] };
  });

  setData(content);
  showApp(true);
  render();
}

// Login form submit
$('#lg').onsubmit = async e => {
  e.preventDefault();
  try {
    await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password: $('#pw').value })
    });
    $('#pw').value = '';
    load();
  } catch (err) {
    $('#le').textContent = err.message;
  }
};

// Save changes button
$('#sb').onclick = async () => {
  try {
    const data = getData();
    delete data.faq;
    await api('/api/content', { method: 'PUT', body: JSON.stringify(data) });
    clearDirty();
    const st = $('#st');
    if (st) {
      st.textContent = 'Saved successfully ✓';
      st.style.color = 'var(--green)';
      setTimeout(() => {
        if (!isDirty()) st.textContent = '';
      }, 4000);
    }
  } catch (err) {
    const st = $('#st');
    if (st) {
      st.textContent = 'Save failed: ' + err.message;
      st.style.color = 'var(--red)';
    }
  }
};

// Logout button
$('#lo').onclick = async () => {
  await api('/api/logout', { method: 'POST' });
  showApp(false);
};

// Warn on leave if unsaved
window.addEventListener('beforeunload', e => {
  if (isDirty()) e.preventDefault();
});

// Auto-login check
api('/api/me')
  .then(load)
  .catch(() => showApp(false));
