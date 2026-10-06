/**
 * Main application orchestrator for Green Optima Homepage
 */
import { fetchContent, applyTheme } from './lib/api.js';
import { initScrollReveal } from './lib/ui.js';
import { isHomeActive, applySectionSettings, renderCustomContainer } from './lib/container.js';

// UI components
import header from './components/header.js';
import footer from './components/footer.js';

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

async function init() {
  const content = await fetchContent();

  // 1. Apply theme variables & page title
  applyTheme(content.theme);
  document.title = content.site?.name || 'Green Optima';

  const app = document.getElementById('app');
  const sectionSettings = content.sectionSettings || {};
  const sectionColors = content.sectionColors || {};

  // 2. Render Header Nav
  document.body.prepend(...header(content));

  // 3. Render Homepage Sections
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
    const cfg = sectionSettings[key] || { active: true };
    if (!isHomeActive(cfg)) continue;

    const elements = [].concat(componentFn(content));
    elements.forEach((el, index) => {
      if (el && el.nodeType && index === 0) {
        applySectionSettings(el, key, sectionSettings, sectionColors);
      }
      app.append(el);
    });
  }

  // 4. Render Homepage Custom Containers
  (content.customContainers || []).forEach(ct => {
    if (!isHomeActive(ct)) return;
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
    // Dismiss the page loader
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('done');
  });
}

init().catch(err => {
  console.error('Homepage Initialization Error:', err);
});
