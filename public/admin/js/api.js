/**
 * Admin API client
 */
import { showApp, $ } from './dom.js';

export const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...opts,
    headers: opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && url !== '/api/login') showApp(false);
    throw new Error(data.error || res.statusText);
  }
  return data;
};

export async function uploadFile(file) {
  if (!file) return null;
  const fd = new FormData();
  fd.append('file', file);
  const st = $('#st');
  if (st) {
    st.textContent = 'Uploading file…';
    st.style.color = 'var(--green)';
  }
  try {
    const res = await api('/api/upload', { method: 'POST', body: fd });
    if (st) {
      st.textContent = 'Uploaded successfully ✓ Remember to save changes';
    }
    return res.url;
  } catch (err) {
    if (st) {
      st.textContent = 'Upload failed: ' + err.message;
      st.style.color = 'var(--red)';
    }
    throw err;
  }
}
