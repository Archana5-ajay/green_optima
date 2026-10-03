/**
 * Admin state management & schema configurations
 */
import { $ } from './dom.js';

let appData = null;
let currentTab = 'pages';
let hasUnsavedChanges = false;

export const SECTION_INFO = {
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

export const SECTION_CARD_INFO = {
  pillars: { name: 'Pillar Card', defaultH: 430, minH: 220, maxH: 800, defaultW: 400, minW: 240, maxW: 700 },
  services: { name: 'Service Card', defaultH: 600, minH: 300, maxH: 1200 },
  reviews: { name: 'Testimonial Card', defaultH: 310, minH: 180, maxH: 650 },
  cases: { name: 'Case Study Card', defaultH: 420, minH: 220, maxH: 800 },
  about: { name: 'About Card', defaultH: 210, minH: 120, maxH: 500, defaultW: 240, minW: 150, maxW: 600 },
  industries: { name: 'Industry Card', defaultH: 72, minH: 45, maxH: 180 },
  blog: { name: 'Blog Card', defaultH: 360, minH: 200, maxH: 700 }
};

export const SECTION_KEYS = Object.keys(SECTION_INFO);

export const getData = () => appData;
export const setData = d => {
  appData = d;
};

export const getTab = () => currentTab;
export const setTab = t => {
  currentTab = t;
};

export const isDirty = () => hasUnsavedChanges;
export const clearDirty = () => {
  hasUnsavedChanges = false;
};

export const touch = () => {
  hasUnsavedChanges = true;
  const st = $('#st');
  if (st) {
    st.textContent = '● Unsaved changes';
    st.style.color = 'var(--yellow)';
  }
};

export const isHomeActive = cfg => {
  if (!cfg) return true;
  if (cfg.showOnHome !== undefined) return Boolean(cfg.showOnHome);
  if (cfg.activeHome !== undefined) return Boolean(cfg.activeHome);
  return cfg.active !== false;
};

export const isSubpageActive = cfg => {
  if (!cfg) return false;
  if (cfg.showOnSubpage !== undefined) return Boolean(cfg.showOnSubpage);
  if (cfg.activeSubpage !== undefined) return Boolean(cfg.activeSubpage);
  return false;
};

export const setHomeActive = (cfg, val) => {
  cfg.showOnHome = Boolean(val);
  cfg.active = cfg.showOnHome;
  touch();
};

export const setSubpageActive = (cfg, val) => {
  cfg.showOnSubpage = Boolean(val);
  touch();
};

export const blank = x =>
  Array.isArray(x)
    ? []
    : x && typeof x === 'object'
      ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blank(v)]))
      : typeof x === 'number'
        ? x
        : '';
