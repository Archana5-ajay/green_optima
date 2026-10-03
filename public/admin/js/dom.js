/**
 * Admin DOM utilities
 */
export const $ = selector => document.querySelector(selector);

export const h = (tag, attrs = {}, ...children) => {
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

export const showApp = isLoggedIn => {
  const loginForm = $('#lg');
  const appContainer = $('#app');
  if (loginForm) loginForm.style.display = isLoggedIn ? 'none' : 'grid';
  if (appContainer) appContainer.style.display = isLoggedIn ? 'grid' : 'none';
};
