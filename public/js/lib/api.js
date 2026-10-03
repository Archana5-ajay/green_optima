/**
 * API client module for Green Optima CMS
 */

// Fetch full website content
export async function fetchContent() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to load content: ' + res.statusText);
  return res.json();
}

// Send contact message
export async function sendContactMessage(formData) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

// Apply theme CSS variables to document
export function applyTheme(theme = {}) {
  for (const [key, value] of Object.entries(theme)) {
    if (/^#[0-9a-f]{3,8}$/i.test(value)) {
      document.documentElement.style.setProperty('--' + key, value);
    }
  }
}
