/**
 * Subpage application orchestrator (for /service/:slug pages)
 */
import { fetchContent, applyTheme } from './lib/api.js';
import { initScrollReveal } from './lib/ui.js';
import { isSubpageActive, applySectionSettings, renderCustomContainer } from './lib/container.js';

// UI components
import header from './components/header.js';
import footer from './components/footer.js';
import serviceDetail from './components/serviceDetail.js';

// Section components
import hero from './components/hero.js?v=2';
import pillars from './components/pillars.js';
import about from './components/about.js';
import cases from './components/cases.js';
import services from './components/services.js';
import industries from './components/industries.js';
import process from './components/process.js';
import stats from './components/stats.js';
import compare from './components/compare.js';
import reviews from './components/reviews.js';
import blog from './components/blog.js';

// Parse service slug from URL path
const slug = location.pathname.replace(/\/service\/?/, '').replace(/\/$/, '');
const decodedSlug = decodeURIComponent(slug).toLowerCase();

// Main initialization
async function init() {
  const content = await fetchContent();

  // Apply theme styles
  applyTheme(content.theme);

  // Set document title
  const currentService = (content.services?.items || []).find(s => {
    return (s.title || '').toLowerCase().replace(/\s+/g, '-') === decodedSlug;
  });
  document.title = (currentService ? currentService.title + ' — ' : '') + (content.site?.name || 'Green Optima');

  const app = document.getElementById('app');
  const sectionSettings = content.sectionSettings || {};
  const sectionColors = content.sectionColors || {};

  // 1. Render Header
  document.body.prepend(...header(content));

  // 2. Render Main Service Detail View
  app.append(serviceDetail(content, decodedSlug));

  // 3. Render any Standard Sections activated for Subpages
  const sectionList = [
    ['hero', hero],
    ['pillars', pillars],
    ['about', about],
    ['cases', cases],
    ['services', services],
    ['industries', industries],
    ['process', process],
    ['stats', stats],
    ['compare', compare],
    ['reviews', reviews],
    ['blog', blog],
  ];

  for (const [key, componentFn] of sectionList) {
    const cfg = sectionSettings[key];
    if (!isSubpageActive(cfg)) continue;

    const elements = [].concat(componentFn(content));
    elements.forEach((el, index) => {
      if (el && el.nodeType && index === 0) {
        applySectionSettings(el, key, sectionSettings, sectionColors);
      }
      app.append(el);
    });
  }

  // 4. Render any Custom Containers activated for Subpages
  (content.customContainers || []).forEach(ct => {
    if (!isSubpageActive(ct)) return;
    app.append(renderCustomContainer(ct));
  });

  // 5. Render Footer & Contact FAB
  const fab = document.createElement('a');
  fab.className = 'fab';
  fab.href = '#contact';
  fab.setAttribute('aria-label', 'Contact');
  fab.textContent = '✉';

  document.body.append(footer(content), fab);

  // 6. Initialize Scroll Reveal Animations
  requestAnimationFrame(() => {
    initScrollReveal();
  });
}

init().catch(err => {
  console.error('Service Page Error:', err);
  document.body.innerHTML = `<div style="color:#fff;padding:60px;font-family:sans-serif"><h2>Failed to load page</h2><p>${err.message}</p><a href="/" style="color:#22c55e">← Return to Homepage</a></div>`;
});
