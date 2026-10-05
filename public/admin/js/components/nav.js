/**
 * Admin Sidebar Navigation Component
 */
import { h, $ } from '../dom.js';
import {
  getData,
  getTab,
  setTab,
  SECTION_INFO,
  SECTION_KEYS,
  isHomeActive,
  isSubpageActive
} from '../state.js';

export function renderNav(onTabSelect) {
  const nv = $('#nv');
  if (!nv) return;

  const data = getData();
  const tab = getTab();
  const ss = data?.sectionSettings || {};
  const customCount = (data?.customContainers || []).length;
  const pagesCount = (data?.pages || []).length;

  nv.replaceChildren(
    // 1. Pages & Navigation FIRST
    h('div', { class: 'nav-section', style: 'color:var(--green);font-weight:800' }, 'Pages & Navigation'),
    h(
      'button',
      {
        class: tab === 'pages' ? 'on' : '',
        style: 'font-weight:700',
        onclick: () => {
          setTab('pages');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '📄 Pages & Subpages'),
      h('span', { class: 'nav-badge on' }, pagesCount)
    ),
    h(
      'button',
      {
        class: tab === 'nav' ? 'on' : '',
        onclick: () => {
          setTab('nav');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '▾ Header Nav & Dropdowns')
    ),
    h(
      'button',
      {
        class: tab === 'navbar' ? 'on' : '',
        onclick: () => {
          setTab('navbar');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '🎛 Navbar Style & Layout')
    ),
    h(
      'button',
      {
        class: tab === 'topnav' ? 'on' : '',
        onclick: () => {
          setTab('topnav');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '🔗 Top Bar Pages'),
      h('span', { class: 'nav-badge', style: 'background:rgba(24,160,65,.18);color:var(--green)' },
        (getData()?.navTop || []).filter(x => x.href && x.href.startsWith('/p/')).length || 0
      )
    ),

    // 2. Homepage Sections
    h('div', { class: 'nav-section' }, 'Homepage Sections'),
    ...SECTION_KEYS.map(k => {
      const info = SECTION_INFO[k];
      const cfg = ss[k];
      const homeOn = isHomeActive(cfg);
      const subOn = isSubpageActive(cfg);

      let badgeText = 'OFF';
      let badgeClass = 'off';
      let badgeStyle = '';

      if (homeOn && subOn) {
        badgeText = 'ALL';
        badgeClass = 'on';
      } else if (homeOn) {
        badgeText = 'HOME';
        badgeClass = 'on';
      } else if (subOn) {
        badgeText = 'SUBPAGE';
        badgeClass = '';
        badgeStyle = 'background:#e0e7ff;color:#3730a3';
      }

      const badge = h('span', { class: 'nav-badge ' + badgeClass, style: badgeStyle }, badgeText);
      return h(
        'button',
        {
          class: k === tab ? 'on' : '',
          onclick: () => {
            setTab(k);
            if (onTabSelect) onTabSelect();
          }
        },
        h('span', {}, info.num + '. ' + (k === 'cases' ? 'Case Studies' : k.charAt(0).toUpperCase() + k.slice(1))),
        badge
      );
    }),

    // 3. Custom Containers & Overview
    h('div', { class: 'nav-section' }, 'Advanced Blocks'),
    h(
      'button',
      {
        class: tab === 'containers' ? 'on' : '',
        onclick: () => {
          setTab('containers');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '＋ Custom Containers'),
      h('span', { class: 'nav-badge on' }, customCount)
    ),
    h(
      'button',
      {
        class: tab === 'sections' ? 'on' : '',
        onclick: () => {
          setTab('sections');
          if (onTabSelect) onTabSelect();
        }
      },
      h('span', {}, '⚙ Containers Manager')
    ),

    // 4. Site Settings
    h('div', { class: 'nav-section' }, 'Site Settings'),
    h('button', {
      class: tab === 'theme' ? 'on' : '',
      onclick: () => {
        setTab('theme');
        if (onTabSelect) onTabSelect();
      }
    }, '🎨 Theme & Colors'),
    h('button', {
      class: tab === 'site' ? 'on' : '',
      onclick: () => {
        setTab('site');
        if (onTabSelect) onTabSelect();
      }
    }, '🏢 Site Details'),
    h('button', {
      class: tab === 'messages' ? 'on' : '',
      onclick: () => {
        setTab('messages');
        if (onTabSelect) onTabSelect();
      }
    }, '✉ Contact Messages')
  );
}
