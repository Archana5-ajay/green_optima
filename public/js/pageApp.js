/**
 * Dynamic Multi-Page & Subpage application orchestrator
 * Renders custom code, standard templates, sub-sections, and child subpages
 */
import { fetchContent, applyTheme } from './lib/api.js';
import { initScrollReveal } from './lib/ui.js';
import { h, media, btn } from './lib/dom.js';
import { isSubpageActive, applySectionSettings, renderCustomContainer } from './lib/container.js';

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

const SECTION_COMPONENTS = {
  hero,
  pillars,
  about,
  cases,
  services,
  industries,
  process,
  stats,
  compare,
  reviews,
  blog
};

// Helper: Extract clean slug from current URL
function getPageSlug() {
  const pathname = window.location.pathname;
  let s = pathname.replace(/^\/(p|page|custom)\//, '').replace(/^\//, '').replace(/\/$/, '');
  return decodeURIComponent(s).toLowerCase();
}

// Helper: Run script tags inside dynamically inserted HTML
function executeScripts(container) {
  const scripts = Array.from(container.querySelectorAll('script'));
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Helper: Render child subpages grid
function renderChildSubpages(children) {
  if (!children || !children.length) return null;

  return h('div', { class: 'wrap', style: 'padding-top:40px;padding-bottom:60px' },
    h('div', { class: 'tag' }, 'Subpages & Explorations'),
    h('h2', { style: 'font-size:36px;margin:12px 0 24px' }, 'Explore Sub-Sections & Subpages'),
    h('div', { class: 'subpages-grid' },
      ...children.map(sub => {
        const url = `/p/${sub.slug || sub.id}`;
        return h('a', { class: 'subpage-card', href: url },
          h('div', {},
            sub.badge ? h('span', { class: 'tag', style: 'font-size:10px;margin-bottom:12px;display:inline-block' }, sub.badge) : null,
            h('h3', {}, sub.title || 'Untitled Subpage'),
            h('p', {}, sub.hero?.description || sub.content?.slice(0, 140) || 'Click to view subpage details and interactive custom components.')
          ),
          h('span', { class: 'subpage-card-link' }, 'View Subpage →')
        );
      })
    )
  );
}

// Helper: Render Standard Template Sub-sections
function renderSubsections(subsections) {
  if (!subsections || !subsections.length) return null;

  return h('div', { class: 'wrap page-subsections' },
    ...subsections.map(sub => {
      const hasImg = Boolean(sub.image);
      const leftCol = h('div', {},
        sub.badge ? h('span', { class: 'tag', style: 'margin-bottom:12px;display:inline-block' }, sub.badge) : null,
        h('h3', { style: 'font-size:32px;margin-bottom:14px;color:var(--cream)' }, sub.title || 'Sub Section'),
        h('p', { style: 'font-size:16px;line-height:1.7;opacity:.8;color:rgba(255,255,255,.9)' }, sub.text || ''),
        sub.cta ? h('div', { style: 'margin-top:24px' }, btn(sub.cta, sub.ctaHref || '#contact')) : null
      );

      const rightCol = hasImg
        ? h('div', {}, media(sub.image, sub.title, 'border-radius:18px;aspect-ratio:16/9;object-fit:cover'))
        : null;

      return h('div', { class: 'page-subsec-card' + (hasImg ? '' : ' no-img') },
        leftCol,
        rightCol
      );
    })
  );
}

async function init() {
  const content = await fetchContent();
  applyTheme(content.theme);

  const pages = content.pages || [];
  const currentSlug = getPageSlug();

  const normalizeSlug = (s) => (s || '').toLowerCase().trim().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9\-]+/g, '-');
  const normalizedCurrent = normalizeSlug(currentSlug);

  // Find page by slug, id, or title
  let currentPage = pages.find(p =>
    normalizeSlug(p.slug) === normalizedCurrent ||
    normalizeSlug(p.id) === normalizedCurrent ||
    normalizeSlug(p.title) === normalizedCurrent
  );

  // If not found in custom pages, check if it matches a service item
  if (!currentPage && content.services?.items) {
    const matchedService = content.services.items.find(s => normalizeSlug(s.title) === normalizedCurrent);
    if (matchedService) {
      window.location.replace(`/service/${normalizedCurrent}`);
      return;
    }
  }

  // Fallback if no page matched: create a welcoming 404 / custom view
  if (!currentPage) {
    if (pages.length > 0) {
      currentPage = pages[0]; // fallback to first custom page
    } else {
      currentPage = {
        title: 'Page Not Found',
        slug: currentSlug,
        template: 'standard',
        hero: {
          eyebrow: '404',
          title: 'Page Not Found',
          description: `The page "/${currentSlug}" could not be found or has not been created yet in the admin panel.`
        }
      };
    }
  }

  // Update Page Title
  document.title = `${currentPage.title || 'Page'} — ${content.site?.name || 'Green Optima'}`;

  const app = document.getElementById('app');
  app.innerHTML = '';

  // 1. Render Header (with dropdown menus)
  document.body.prepend(...header(content));

  // 2. Identify child subpages for this page
  const childSubpages = pages.filter(p => p.parentId && p.parentId === currentPage.id);

  // 3. Render Page Based on Selected Template Mode
  if (currentPage.template === 'custom' && currentPage.customCode) {
    // ── CUSTOM CODE / HTML / CSS / JS TEMPLATE ────────────────────────────
    const codeWrapper = h('div', { class: 'custom-code-wrap' });

    // ── Permanent sanitizer for full-HTML custom pages ─────────────────────
    // If someone pastes a full HTML document (with <html>/<head>/<body> tags),
    // we extract only the body content and styles — and critically, we REWRITE
    // any  body { ... }  CSS rules to target .custom-code-wrap instead.
    // This stops `body { display:flex }` from pushing the footer sideways,
    // no matter how new pages are created.
    let safeCode = currentPage.customCode;

    // Helper: scope all `body {` rules in a CSS string to `.custom-code-wrap`
    const scopeBodyCSS = (css) => css
      .replace(/\bhtml\s*,\s*body\s*\{([^}]*)\}/gi, '.custom-code-wrap {$1}')
      .replace(/\bhtml\b\s*\{([^}]*)\}/gi, '')        // drop html{} entirely
      .replace(/\bbody\s*\{/gi, '.custom-code-wrap {'); // scope body{} rules

    if (/<html[\s>]/i.test(safeCode)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(safeCode, 'text/html');

      // Rewrite <style> tags from <head> — scope body{} → .custom-code-wrap
      const headStyles = [...doc.head.querySelectorAll('style')]
        .map(el => `<style>${scopeBodyCSS(el.textContent)}</style>`)
        .join('\n');

      // Keep <script> tags from head as-is
      const headScripts = [...doc.head.querySelectorAll('script')]
        .map(el => el.outerHTML).join('\n');

      // Also scope any inline <style> blocks inside the body
      [...doc.body.querySelectorAll('style')].forEach(el => {
        el.textContent = scopeBodyCSS(el.textContent);
      });

      safeCode = headStyles + '\n' + headScripts + '\n' + doc.body.innerHTML;
    } else {
      // Even for non-full-HTML code, scope any stray body{} rules in <style> tags
      safeCode = safeCode.replace(
        /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
        (_, open, css, close) => open + scopeBodyCSS(css) + close
      );
    }

    codeWrapper.innerHTML = safeCode;
    app.append(codeWrapper);
    executeScripts(codeWrapper);

    // If there are child subpages, render them below custom code
    if (childSubpages.length > 0) {
      app.append(renderChildSubpages(childSubpages));
    }
  } else if (currentPage.template === 'sections' && Array.isArray(currentPage.activeSections)) {
    // ── CMS SECTION ASSEMBLER TEMPLATE ────────────────────────────────────
    const heroBox = h('div', { class: 'page-hero' },
      h('div', { class: 'page-hero-in' },
        h('a', { href: '/', class: 'back-btn' }, '← Back to Home'),
        currentPage.hero?.eyebrow ? h('div', { class: 'tag' }, currentPage.hero.eyebrow) : null,
        h('h1', {}, currentPage.title || 'Custom Page'),
        currentPage.hero?.description ? h('p', {}, currentPage.hero.description) : null
      )
    );
    app.append(heroBox);

    currentPage.activeSections.forEach(secKey => {
      const compFn = SECTION_COMPONENTS[secKey];
      if (compFn) {
        const els = [].concat(compFn(content));
        els.forEach((el, index) => {
          if (el && el.nodeType && index === 0) {
            applySectionSettings(el, secKey, content.sectionSettings || {}, content.sectionColors || {});
          }
          app.append(el);
        });
      }
    });

    if (childSubpages.length > 0) {
      app.append(renderChildSubpages(childSubpages));
    }
  } else {
    // ── STANDARD SUBPAGE TEMPLATE ─────────────────────────────────────────
    const heroData = currentPage.hero || {};
    const heroBox = h('div', { class: 'page-hero' },
      h('div', { class: 'page-hero-in' },
        h('a', { href: '/', class: 'back-btn' }, '← Back to Home'),
        heroData.badge ? h('span', { class: 'tag', style: 'margin-bottom:16px;display:inline-block' }, heroData.badge) : (heroData.eyebrow ? h('div', { class: 'tag' }, heroData.eyebrow) : null),
        h('h1', {}, heroData.title || currentPage.title || 'Subpage Title'),
        heroData.description ? h('p', {}, heroData.description) : null,
        heroData.ctaText ? h('div', { style: 'margin-top:32px' }, btn(heroData.ctaText, heroData.ctaHref || '#contact')) : null,
        heroData.image ? h('div', { style: 'margin-top:40px' }, media(heroData.image, heroData.title, 'width:100%;max-height:500px;border-radius:24px;object-fit:cover')) : null
      )
    );
    app.append(heroBox);

    // Render Sub-Sections
    if (currentPage.subsections && currentPage.subsections.length) {
      app.append(renderSubsections(currentPage.subsections));
    }

    // Render Nested Child Subpages
    if (childSubpages.length > 0) {
      app.append(renderChildSubpages(childSubpages));
    }
  }

  // 4. Render any Custom Containers designated for Subpages
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
    // Dismiss the page loader
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('done');
  });
}

init().catch(err => {
  console.error('Page App Error:', err);
  document.body.innerHTML = `
    <div style="background:#0a0a0a;color:#ffffe6;padding:80px 24px;font-family:Inter,sans-serif;text-align:center;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
      <h1 style="font-size:48px;margin-bottom:16px;color:#e4fe7b">Page Loading Error</h1>
      <p style="opacity:.8;max-width:500px;margin-bottom:28px">${err.message}</p>
      <a href="/" style="background:#18A041;color:#fff;padding:12px 28px;border-radius:12px;font-weight:600;text-decoration:none">Return to Homepage</a>
    </div>
  `;
});
