/**
 * Pages & Subpages Management Component
 * Allows creating, editing, and nesting pages with custom code (HTML/CSS/JS),
 * standard rich templates with sub-sections, and navbar dropdown integration.
 */
import { h } from '../dom.js';
import { getData, touch } from '../state.js';
import { renderImageWidget } from '../fields.js';
import { renderPageContentBuilder } from './pageContentBuilder.js';

// Pre-crafted responsive HTML/CSS/JS templates
const CODE_PRESETS = {
  heroGrid: `<!-- Custom Hero & Responsive Grid Layout -->
<section class="custom-hero-block">
  <div class="wrap" style="padding:140px var(--pad) 60px;text-align:center">
    <span class="tag">Exclusive Solution</span>
    <h1 style="font:600 56px/64px Inter;letter-spacing:-2.5px;color:var(--cream);margin:16px 0 20px">Smart Integration Platform</h1>
    <p style="font-size:19px;line-height:1.7;max-width:720px;margin:0 auto 36px;opacity:.85">
      Next-generation intelligent automation engineered for enterprise buildings, hospitals, and commercial real estate.
    </p>
    <a href="#contact" class="btn" style="height:50px;padding:0 32px">Request Live Demo</a>
  </div>
</section>

<section class="wrap" style="padding:40px var(--pad) 100px">
  <div class="custom-grid-cards">
    <div class="custom-card-item">
      <div class="badge-pill">Module 01</div>
      <h3>Real-time Telemetry</h3>
      <p>Continuous sensor data aggregation from HVAC, chiller plants, and IoT power monitors.</p>
    </div>
    <div class="custom-card-item">
      <div class="badge-pill">Module 02</div>
      <h3>Predictive Analytics</h3>
      <p>Machine learning models identify energy anomalies and optimize setpoints dynamically.</p>
    </div>
    <div class="custom-card-item">
      <div class="badge-pill">Module 03</div>
      <h3>Automated Fault Detection</h3>
      <p>Instant SMS & email alerts with automated diagnostics and maintenance ticket generation.</p>
    </div>
  </div>
</section>

<style>
.custom-hero-block {
  background: radial-gradient(circle at 50% 20%, rgba(24,160,65,.18) 0%, transparent 70%);
}
.custom-grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}
.custom-card-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  padding: 36px 30px;
  transition: transform .3s ease, border-color .3s ease;
}
.custom-card-item:hover {
  transform: translateY(-6px);
  border-color: var(--lime);
  background: rgba(255, 255, 255, 0.08);
}
.badge-pill {
  display: inline-block;
  font: 700 11px/1 'Red Hat Mono';
  color: var(--lime);
  background: rgba(228, 254, 123, 0.12);
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}
.custom-card-item h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: var(--cream);
}
.custom-card-item p {
  opacity: .8;
  line-height: 1.6;
}
</style>`,

  twoCol: `<!-- Two Column Feature Showcase with Interactive Tabs -->
<section class="wrap" style="padding:140px var(--pad) 100px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center" class="two-col-container">
    <div>
      <span class="tag">System Capability</span>
      <h2 style="font:600 48px/54px Inter;letter-spacing:-2px;color:var(--cream);margin:16px 0 20px">Complete Building Visibility In One Dashboard</h2>
      <p style="font-size:17px;line-height:1.7;opacity:.8;margin-bottom:28px">
        Manage BACnet, Modbus, MQTT, and KNX protocols through an intuitive cloud gateway.
      </p>
      
      <div style="display:grid;gap:14px" id="featureTabs">
        <button class="feat-tab active" onclick="switchTab(0)">Ã¢Å¡Â¡ Instant Commissioning</button>
        <button class="feat-tab" onclick="switchTab(1)">Ã°Å¸â€ºÂ¡ Zero-Trust Security Protocols</button>
        <button class="feat-tab" onclick="switchTab(2)">Ã°Å¸â€œÅ  ESG Compliance Reporting</button>
      </div>
    </div>
    
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:40px;min-height:360px;display:flex;flex-direction:column;justify-content:center" id="tabContentBox">
      <h3 id="tabHeading" style="font-size:26px;color:var(--lime);margin-bottom:12px">Ã¢Å¡Â¡ Instant Commissioning</h3>
      <p id="tabDesc" style="font-size:16px;line-height:1.7;opacity:.85">
        Auto-discover building controllers in minutes without disruptive downtime or manual point mapping.
      </p>
    </div>
  </div>
</section>

<style>
.feat-tab {
  text-align: left;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  color: var(--cream);
  padding: 16px 20px;
  border-radius: 14px;
  font: 600 15px Inter;
  cursor: pointer;
  transition: all .25s ease;
}
.feat-tab:hover, .feat-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
@media(max-width:900px){.two-col-container{grid-template-columns:1fr}}
</style>

<script>
window.tabData = [
  { h: "Ã¢Å¡Â¡ Instant Commissioning", d: "Auto-discover building controllers in minutes without disruptive downtime or manual point mapping." },
  { h: "Ã°Å¸â€ºÂ¡ Zero-Trust Security Protocols", d: "End-to-end encrypted tunnels, role-based access control, and ISO-certified cloud compliance." },
  { h: "Ã°Å¸â€œÅ  ESG Compliance Reporting", d: "Automated carbon accounting exports aligned with LEED, BREEAM, and global sustainability standards." }
];
window.switchTab = function(idx) {
  const tabs = document.querySelectorAll('.feat-tab');
  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  const data = window.tabData[idx];
  if(data) {
    document.getElementById('tabHeading').textContent = data.h;
    document.getElementById('tabDesc').textContent = data.d;
  }
};
</script>`,

  blank: `<!-- Custom Subpage Content -->
<section class="wrap" style="padding:140px var(--pad) 100px">
  <div style="max-width:800px;margin:auto;text-align:center">
    <span class="tag">Subpage</span>
    <h1 style="font-size:48px;color:var(--cream);margin:20px 0">Custom Section Title</h1>
    <p style="font-size:18px;line-height:1.7;opacity:.8">
      Insert your custom HTML, CSS stylesheets in &lt;style&gt;, and interactive scripts in &lt;script&gt;.
    </p>
  </div>
</section>`
};

// Module-level active dropdown/category state
let activeDropdownName = null;
let currentPagesView = 'dropdowns';

export function renderPagesEditor(onRender) {
  const data = getData();
  data.nav = data.nav || [];
  const nav = data.nav;
  const pages = data.pages || (data.pages = []);
  const wrap = h('div', { class: 'pages-editor-wrap' });

  const redraw = () => {
    wrap.replaceWith(renderPagesEditor(onRender));
  };

  // Get all dropdown menus in navbar
  let dropdowns = nav.filter(item => Array.isArray(item.children));

  // If no dropdowns exist yet, create default Solutions dropdown
  if (dropdowns.length === 0) {
    const defaultDropdown = {
      label: 'Solutions',
      href: '#services',
      children: []
    };
    nav.push(defaultDropdown);
    dropdowns = [defaultDropdown];
  }

  // Set default active dropdown tab if not set or not found
  if (!activeDropdownName || !dropdowns.some(d => d.label.toLowerCase() === activeDropdownName.toLowerCase())) {
    activeDropdownName = dropdowns[0].label;
  }

  // Active dropdown object
  const activeDropdown = dropdowns.find(d => d.label.toLowerCase() === activeDropdownName.toLowerCase()) || dropdowns[0];

  // Helper: Find all pages belonging to a specific dropdown
  const getPagesForDropdown = (dropdown) => {
    const dropdownUrls = (dropdown.children || []).map(c => (c.href || '').toLowerCase().trim());
    return pages.filter(p => {
      const pUrl = `/p/${(p.slug || p.id).toLowerCase().trim().replace(/^\/+/, '')}`;
      return dropdownUrls.includes(pUrl) || (p.dropdownCategory && p.dropdownCategory.toLowerCase() === dropdown.label.toLowerCase());
    });
  };

  // Action: Add New Dropdown Menu to Navbar
  const addNewDropdownMenu = () => {
    const name = prompt('Enter the name for the new Navbar Dropdown Menu (e.g. Services, Industries, Resources):');
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    if (nav.some(item => item.label.toLowerCase() === cleanName.toLowerCase())) {
      alert('A menu with this name already exists.');
      return;
    }
    const newDropdown = {
      label: cleanName,
      href: 'javascript:void(0)',
      children: []
    };
    nav.push(newDropdown);
    activeDropdownName = cleanName;
    touch();
    if (onRender) onRender();
    else redraw();
  };

  // Action: Add New Page inside the active dropdown
  const addNewPageToActiveDropdown = () => {
    const newId = 'page_' + Date.now().toString(36);
    const newSlug = (activeDropdown.label || 'page').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '-page-' + Math.floor(Math.random() * 1000);
    const pageUrl = `/p/${newSlug}`;

    const newPage = {
      id: newId,
      title: `${activeDropdown.label} - New Page`,
      slug: newSlug,
      dropdownCategory: activeDropdown.label,
      parentId: '',
      template: 'custom',
      customCode: CODE_PRESETS.heroGrid,
      hero: {
        eyebrow: activeDropdown.label,
        title: 'New Page Headline',
        description: 'Describe the features, specifications, and details of this solution.',
        badge: 'NEW',
        ctaText: 'Get in Touch',
        ctaHref: '#contact',
        image: ''
      },
      subsections: [],
      activeSections: ['stats', 'cases'],
      showInNav: true,
      navBadge: ''
    };

    pages.push(newPage);

    // Automatically add to the navbar dropdown's children list!
    activeDropdown.children = activeDropdown.children || [];
    if (!activeDropdown.children.some(c => c.href === pageUrl)) {
      activeDropdown.children.push({
        label: newPage.title,
        href: pageUrl,
        badge: ''
      });
    }

    touch();
    if (onRender) onRender();
    else redraw();
  };

  // Helper: Render Subsections Builder for Standard Template
  const renderSubsectionsBuilder = (page) => {
    page.subsections = page.subsections || [];
    const box = h('fieldset', { style: 'margin-top:16px' },
      h('legend', {}, `Sub-Sections (${page.subsections.length})`)
    );

    const subRedraw = () => {
      box.replaceWith(renderSubsectionsBuilder(page));
    };

    page.subsections.forEach((sub, subIdx) => {
      const card = h('div', { class: 'it', style: 'margin-bottom:14px' },
        h('div', { class: 'bar' },
          h('span', { style: 'font-weight:700;font-size:12px' }, `Sub-Section #${subIdx + 1}`),
          h('button', {
            type: 'button',
            class: 'danger',
            style: 'margin-left:auto;font-size:11px;padding:3px 8px',
            onclick: () => {
              if (confirm('Delete this sub-section?')) {
                page.subsections.splice(subIdx, 1);
                touch();
                subRedraw();
              }
            }
          }, 'Ã¢Å“â€¢ Remove')
        ),
        h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px' },
          h('div', {},
            h('label', {}, 'Sub-Section Title'),
            h('input', {
              type: 'text',
              value: sub.title || '',
              oninput: e => { sub.title = e.target.value; touch(); }
            })
          ),
          h('div', {},
            h('label', {}, 'Badge Tag'),
            h('input', {
              type: 'text',
              value: sub.badge || '',
              placeholder: 'e.g. FEATURE, PRO, 2026',
              oninput: e => { sub.badge = e.target.value; touch(); }
            })
          )
        ),
        h('div', { style: 'margin-top:8px' },
          h('label', {}, 'Sub-Section Content / Description'),
          h('textarea', {
            rows: 3,
            oninput: e => { sub.text = e.target.value; touch(); }
          }, sub.text || '')
        ),
        h('div', { style: 'margin-top:8px' },
          renderImageWidget(sub, 'image', 'Sub-Section Image (Optional)')
        )
      );
      box.append(card);
    });

    box.append(
      h('button', {
        type: 'button',
        class: 'p',
        style: 'font-size:12px;padding:6px 14px;margin-top:6px',
        onclick: () => {
          page.subsections.push({
            title: 'New Sub-Section',
            text: 'Sub-section description text.',
            badge: 'Feature',
            image: '',
            cta: '',
            ctaHref: ''
          });
          touch();
          subRedraw();
        }
      }, 'Ã¯Â¼â€¹ Add Sub-Section')
    );

    return box;
  };

  // Helper: Render Page Card inside active Dropdown
  const renderPageCard = (page, idx) => {
    const pageId = page.id || (page.id = 'page_' + idx);
    const cleanSlug = (page.slug || pageId).toLowerCase().trim().replace(/^\/+/, '');
    const previewUrl = `/p/${cleanSlug}`;

    // Find the corresponding navbar child item
    let navChild = (activeDropdown.children || []).find(c => (c.href || '').toLowerCase().trim() === previewUrl);

    const cardBox = h('div', {
      class: 'it',
      style: 'margin-bottom:28px;padding:24px;border-radius:16px;border-left:5px solid var(--green);background:var(--card);box-shadow:0 4px 18px rgba(0,0,0,.04)'
    });

    const setTemplate = (tmpl) => {
      page.template = tmpl;
      touch();
      redraw();
    };

    // Header Bar
    const headerBar = h('div', { style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px' },
      h('span', {
        style: 'font-weight:800;font-size:11px;padding:5px 12px;border-radius:8px;letter-spacing:.04em;text-transform:uppercase;background:#dcfce7;color:#15803d'
      }, `PAGE IN "${activeDropdown.label.toUpperCase()}" DROPDOWN`),
      h('strong', { style: 'font-size:18px;color:var(--ink)' }, page.title || 'Untitled Page'),
      h('a', {
        class: `live-open-link-${pageId}`,
        href: previewUrl,
        target: '_blank',
        style: 'margin-left:auto;font-size:12px;font-weight:700;color:var(--accent);display:inline-flex;align-items:center;gap:4px;text-decoration:none;padding:5px 12px;background:rgba(24,160,65,.1);border-radius:6px'
      }, 'Ã¢â€ â€” Live Website Preview'),
      h('button', {
        type: 'button',
        class: 'danger',
        style: 'font-size:11px;padding:5px 10px',
        onclick: () => {
          if (confirm(`Delete page "${page.title}" and remove it from the "${activeDropdown.label}" dropdown menu?`)) {
            // Remove from pages array
            const pIndex = pages.indexOf(page);
            if (pIndex !== -1) pages.splice(pIndex, 1);
            // Remove from activeDropdown.children
            if (activeDropdown.children) {
              activeDropdown.children = activeDropdown.children.filter(c => (c.href || '').toLowerCase().trim() !== previewUrl);
            }
            touch();
            redraw();
          }
        }
      }, 'Ã¢Å“â€¢ Delete Page')
    );

    // Slug auto generator from title
    const handleTitleInput = (e) => {
      page.title = e.target.value;
      const autoSlug = page.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (autoSlug) {
        const oldUrl = `/p/${page.slug}`;
        page.slug = autoSlug;
        const newUrl = `/p/${autoSlug}`;

        // Sync with navbar dropdown child link
        if (activeDropdown.children) {
          activeDropdown.children.forEach(c => {
            if ((c.href || '').toLowerCase().trim() === oldUrl) {
              c.href = newUrl;
              c.label = page.title;
            }
          });
        }

        const slugInput = cardBox.querySelector(`input[name="slug_${pageId}"]`);
        if (slugInput) slugInput.value = autoSlug;
        const urlCode = cardBox.querySelector(`.live-url-code-${pageId}`);
        if (urlCode) urlCode.textContent = newUrl;
        const openLink = cardBox.querySelector(`.live-open-link-${pageId}`);
        if (openLink) openLink.href = newUrl;
      }
      touch();
    };

    // Meta Inputs (Title, URL Slug, Navbar Badge)
    const metaRow = h('div', { style: 'display:grid;grid-template-columns:1.2fr 1.2fr 1fr;gap:14px;margin-bottom:16px' },
      h('div', {},
        h('label', { style: 'font-weight:700' }, 'Page Title / Menu Label:'),
        h('input', {
          type: 'text',
          value: page.title || '',
          placeholder: 'e.g. Smart IBMS Automation',
          oninput: handleTitleInput
        })
      ),
      h('div', {},
        h('label', { style: 'font-weight:700' }, 'Page URL (/p/...):'),
        h('input', {
          type: 'text',
          name: `slug_${pageId}`,
          value: page.slug || '',
          placeholder: 'e.g. smart-ibms-automation',
          oninput: e => {
            const oldUrl = `/p/${page.slug}`;
            page.slug = e.target.value.toLowerCase().trim().replace(/[^a-z0-9\-_/]+/g, '');
            const newUrl = `/p/${page.slug}`;

            if (activeDropdown.children) {
              activeDropdown.children.forEach(c => {
                if ((c.href || '').toLowerCase().trim() === oldUrl) {
                  c.href = newUrl;
                }
              });
            }

            const urlCode = cardBox.querySelector(`.live-url-code-${pageId}`);
            if (urlCode) urlCode.textContent = newUrl;
            const openLink = cardBox.querySelector(`.live-open-link-${pageId}`);
            if (openLink) openLink.href = newUrl;
            touch();
          }
        })
      ),
      h('div', {},
        h('label', { style: 'font-weight:700' }, 'Menu Badge Tag (Optional):'),
        h('input', {
          type: 'text',
          value: navChild?.badge || page.hero?.badge || '',
          placeholder: 'e.g. NEW, POPULAR, 2026',
          oninput: e => {
            const badgeVal = e.target.value;
            page.hero = page.hero || {};
            page.hero.badge = badgeVal;
            if (navChild) navChild.badge = badgeVal;
            touch();
          }
        })
      )
    );

    // Live URL notification & Direct Preview bar
    const liveBar = h('div', {
      style: 'background:rgba(24,160,65,.07);border:1px solid rgba(24,160,65,.25);border-radius:12px;padding:12px 16px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px'
    },
      h('div', { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap' },
        h('span', { style: 'font-weight:700;font-size:12px;color:var(--green)' }, 'Ã°Å¸Å’Â Live Page URL:'),
        h('code', { class: `live-url-code-${pageId}`, style: 'background:var(--card);padding:4px 8px;border-radius:6px;font-size:12px;border:1px solid var(--ln);color:var(--ink);font-weight:700' }, previewUrl),
        h('a', {
          class: `live-open-link-${pageId}`,
          href: previewUrl,
          target: '_blank',
          style: 'font-size:11.5px;font-weight:700;background:var(--green);color:#fff;padding:5px 12px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:4px'
        }, 'Open Page Ã¢â€ â€”')
      ),
      h('div', { style: 'font-size:12px;color:var(--muted);font-weight:600' },
        `Ã¢Å“â€œ Automatically linked inside the "${activeDropdown.label}" Navbar Dropdown`
      )
    );

    // Template Selection Buttons
    const templateSelector = h('div', { style: 'margin-bottom:18px' },
      h('label', { style: 'font-weight:700;margin-bottom:8px;display:block' }, 'Choose Page Template Engine:'),
      h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' },
        h('button', {
          type: 'button',
          class: page.template === 'custom' ? 'p' : '',
          style: 'padding:8px 16px;font-size:13px',
          onclick: () => setTemplate('custom')
        }, 'Ã¢Å¡Â¡ Custom Code (HTML/CSS/JS)'),
        h('button', {
          type: 'button',
          class: page.template === 'standard' ? 'p' : '',
          style: 'padding:8px 16px;font-size:13px',
          onclick: () => setTemplate('standard')
        }, 'Ã°Å¸â€œâ€ž Standard Subpage Template'),
        h('button', {
          type: 'button',
          class: page.template === 'sections' ? 'p' : '',
          style: 'padding:8px 16px;font-size:13px',
          onclick: () => setTemplate('sections')
        }, 'Ã°Å¸Â§Â© CMS Section Assembler')
      )
    );

    // Template Specific Content
    let templateContent;
    if (page.template === 'custom') {
      // Tab state for visual builder vs code editor
      page._codeTab = page._codeTab || 'visual'; // 'visual' | 'code'
      const codeTabState = page._pcbState || (page._pcbState = { showPalette: false });

      // Shared textarea reference so visual builder can sync code into it
      let codeTextarea;

      const switchCodeTab = (tab) => {
        page._codeTab = tab;
        redraw();
      };

      // Tab Header
      const codeTabBar = h('div', { style: 'display:flex;gap:8px;margin-bottom:16px;border-bottom:2px solid var(--ln);padding-bottom:12px' },
        h('button', {
          type: 'button',
          style: 'padding:8px 18px;font-size:13px;font-weight:700;border-radius:10px 10px 0 0;border:1px solid ' + (page._codeTab === 'visual' ? 'var(--green);background:var(--green);color:#fff' : 'var(--ln);background:var(--card);color:var(--ink)') + ';cursor:pointer',
          onclick: () => switchCodeTab('visual')
        }, 'Ã°Å¸Â§Â© Visual Builder'),
        h('button', {
          type: 'button',
          style: 'padding:8px 18px;font-size:13px;font-weight:700;border-radius:10px 10px 0 0;border:1px solid ' + (page._codeTab === 'code' ? 'var(--green);background:var(--green);color:#fff' : 'var(--ln);background:var(--card);color:var(--ink)') + ';cursor:pointer',
          onclick: () => switchCodeTab('code')
        }, '</> Code Editor')
      );

      let activeTabContent;

      if (page._codeTab === 'visual') {
        // Visual block builder
        activeTabContent = h('div', {},
          renderPageContentBuilder(page, (generatedCode) => {
            page.customCode = generatedCode;
            touch();
          }, codeTabState),
          // Show the generated code below as read-only hint
          page.contentBlocks && page.contentBlocks.length > 0
            ? h('details', { style: 'margin-top:16px' },
                h('summary', { style: 'font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;padding:6px 0' }, 'Ã°Å¸â€˜Â Preview Generated HTML Code'),
                h('textarea', {
                  style: 'font-family:"Red Hat Mono",monospace;font-size:11.5px;line-height:1.5;min-height:200px;background:#111;color:#9fa;border:1px solid #333;border-radius:8px;padding:12px;width:100%;margin-top:8px;opacity:.7',
                  rows: 8,
                  readOnly: true
                }, page.customCode || '<!-- Visual builder will generate code here -->')
              )
            : null
        );
      } else {
        // Raw Code Editor tab
        activeTabContent = h('div', {},
          h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px' },
            h('span', { style: 'font-weight:700;font-size:13px' }, 'Custom Code (HTML, <style>, and <script>)'),
            h('div', { style: 'display:flex;gap:6px' },
              h('span', { style: 'font-size:11px;opacity:.7;margin-right:6px;align-self:center' }, 'Load Preset:'),
              h('button', {
                type: 'button',
                style: 'font-size:11px;padding:4px 8px',
                onclick: () => {
                  if (confirm('Load Hero & Grid template? This will replace the editor code.')) {
                    page.customCode = CODE_PRESETS.heroGrid;
                    touch();
                    redraw();
                  }
                }
              }, 'Hero + Grid'),
              h('button', {
                type: 'button',
                style: 'font-size:11px;padding:4px 8px',
                onclick: () => {
                  if (confirm('Load 2-Column Tabs template?')) {
                    page.customCode = CODE_PRESETS.twoCol;
                    touch();
                    redraw();
                  }
                }
              }, 'Interactive Tabs'),
              h('button', {
                type: 'button',
                style: 'font-size:11px;padding:4px 8px',
                onclick: () => {
                  if (confirm('Load Blank Canvas template?')) {
                    page.customCode = CODE_PRESETS.blank;
                    touch();
                    redraw();
                  }
                }
              }, 'Blank')
            )
          ),
          h('textarea', {
            style: 'font-family:"Red Hat Mono",monospace;font-size:12.5px;line-height:1.5;min-height:280px;background:#111;color:#e4fe7b;border:1px solid #333;border-radius:8px;padding:12px;width:100%',
            rows: 14,
            placeholder: '<!-- Enter custom HTML, CSS in <style>, and JS in <script> here -->',
            oninput: e => {
              page.customCode = e.target.value;
              touch();
            }
          }, page.customCode || ''),
          h('p', { style: 'font-size:11.5px;color:var(--muted);margin-top:6px' },
            'Ã°Å¸â€™Â¡ You can insert any valid HTML tags, embedded <style> CSS styles, and <script> Javascript code. Tip: Use the Visual Builder tab to create content blocks without writing code!'
          )
        );
      }

      templateContent = h('div', { style: 'background:rgba(0,0,0,.03);padding:18px;border-radius:12px;border:1px solid var(--ln)' },
        codeTabBar,
        activeTabContent
      );
    } else if (page.template === 'sections') {
      page.activeSections = page.activeSections || [];
      const allSecs = ['hero', 'pillars', 'about', 'cases', 'services', 'industries', 'process', 'stats', 'compare', 'reviews', 'blog'];
      templateContent = h('div', { style: 'background:rgba(0,0,0,.03);padding:16px;border-radius:12px;border:1px solid var(--ln)' },
        h('span', { style: 'font-weight:700;font-size:13px;display:block;margin-bottom:10px' }, 'Select CMS Sections to display on this page:'),
        h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px' },
          ...allSecs.map(secKey => {
            const isChecked = page.activeSections.includes(secKey);
            return h('label', { style: 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;text-transform:capitalize' },
              h('input', {
                type: 'checkbox',
                checked: isChecked,
                onchange: e => {
                  if (e.target.checked) page.activeSections.push(secKey);
                  else page.activeSections = page.activeSections.filter(k => k !== secKey);
                  touch();
                }
              }),
              secKey
            );
          })
        )
      );
    } else {
      page.hero = page.hero || {};
      templateContent = h('div', { style: 'display:grid;gap:14px' },
        h('fieldset', {},
          h('legend', {}, 'Subpage Hero Header'),
          h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:12px' },
            h('div', {},
              h('label', {}, 'Hero Eyebrow / Tag'),
              h('input', {
                type: 'text',
                value: page.hero.eyebrow || '',
                oninput: e => { page.hero.eyebrow = e.target.value; touch(); }
              })
            ),
            h('div', {},
              h('label', {}, 'Hero Badge (Optional)'),
              h('input', {
                type: 'text',
                value: page.hero.badge || '',
                placeholder: 'e.g. EXCLUSIVE',
                oninput: e => { page.hero.badge = e.target.value; touch(); }
              })
            )
          ),
          h('div', { style: 'margin-top:8px' },
            h('label', {}, 'Hero Headline'),
            h('input', {
              type: 'text',
              value: page.hero.title || page.title || '',
              oninput: e => { page.hero.title = e.target.value; touch(); }
            })
          ),
          h('div', { style: 'margin-top:8px' },
            h('label', {}, 'Hero Description'),
            h('textarea', {
              rows: 3,
              oninput: e => { page.hero.description = e.target.value; touch(); }
            }, page.hero.description || '')
          ),
          h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px' },
            h('div', {},
              h('label', {}, 'Hero CTA Button Label'),
              h('input', {
                type: 'text',
                value: page.hero.ctaText || 'Get in touch',
                oninput: e => { page.hero.ctaText = e.target.value; touch(); }
              })
            ),
            h('div', {},
              h('label', {}, 'Hero CTA Link'),
              h('input', {
                type: 'text',
                value: page.hero.ctaHref || '#contact',
                oninput: e => { page.hero.ctaHref = e.target.value; touch(); }
              })
            )
          ),
          h('div', { style: 'margin-top:10px' },
            renderImageWidget(page.hero, 'image', 'Hero Background / Featured Image')
          )
        ),
        renderSubsectionsBuilder(page)
      );
    }

    cardBox.append(
      headerBar,
      metaRow,
      liveBar,
      templateSelector,
      templateContent
    );

    return cardBox;
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ HORIZONTAL DROPDOWN TABS BAR Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const tabsBar = h('div', {
    style: 'display:flex;align-items:center;gap:8px;overflow-x:auto;padding-bottom:12px;margin-bottom:24px;border-bottom:2px solid var(--ln)'
  });

  dropdowns.forEach(dropdown => {
    const isActive = dropdown.label.toLowerCase() === activeDropdown.label.toLowerCase();
    const dropdownPages = getPagesForDropdown(dropdown);

    const tabBtn = h('button', {
      type: 'button',
      style: `padding:11px 20px;font-size:14px;font-weight:700;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;transition:all .2s;${
        isActive
          ? 'background:var(--green);color:#fff;border:1px solid var(--green);box-shadow:0 4px 14px rgba(24,160,65,.3)'
          : 'background:var(--card);color:var(--ink);border:1px solid var(--ln)'
      }`,
      onclick: () => {
        activeDropdownName = dropdown.label;
        redraw();
      }
    },
      h('span', {}, 'Ã¢â€“Â¾'),
      h('span', {}, dropdown.label),
      h('span', {
        style: `font-size:11px;padding:2px 8px;border-radius:99px;font-weight:800;${
          isActive ? 'background:rgba(255,255,255,.3);color:#fff' : 'background:rgba(24,160,65,.12);color:var(--green)'
        }`
      }, `${dropdownPages.length} pages`)
    );
    tabsBar.append(tabBtn);
  });

  // Add Dropdown Tab Button
  const addDropdownBtn = h('button', {
    type: 'button',
    style: 'padding:11px 18px;font-size:13.5px;font-weight:700;background:rgba(99,102,241,.1);color:#4338ca;border:1.5px dashed #6366f1;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap',
    onclick: addNewDropdownMenu
  }, 'Ã¯Â¼â€¹ Add New Navbar Dropdown');
  tabsBar.append(addDropdownBtn);

  // Ã¢â€â‚¬Ã¢â€â‚¬ ACTIVE DROPDOWN CONTENT WORKSPACE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const pagesInActiveDropdown = getPagesForDropdown(activeDropdown);

  const activeDropdownHeader = h('div', {
    style: 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;padding:20px 24px;background:var(--card);border-radius:16px;border:1px solid var(--ln);box-shadow:0 2px 8px rgba(0,0,0,.03)'
  },
    h('div', {},
      h('div', { style: 'display:flex;align-items:center;gap:8px;margin-bottom:4px' },
        h('span', { style: 'font-size:18px' }, 'Ã¢â€“Â¾'),
        h('h2', { style: 'margin:0;font-size:20px;color:var(--ink)' }, `Navbar Dropdown: "${activeDropdown.label}"`)
      ),
      h('p', { style: 'margin:0;color:var(--muted);font-size:13px' },
        `Pages added below will automatically show up inside the "${activeDropdown.label}" dropdown in your website header.`
      )
    ),
    h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' },
      h('button', {
        type: 'button',
        class: 'p',
        style: 'padding:11px 22px;font-size:13.5px;font-weight:700;border-radius:10px',
        onclick: addNewPageToActiveDropdown
      }, `Ã¯Â¼â€¹ Add New Page to "${activeDropdown.label}" Dropdown`)
    )
  );

  const pagesListContainer = h('div', {});

  if (pagesInActiveDropdown.length === 0) {
    pagesListContainer.append(
      h('div', {
        style: 'text-align:center;padding:50px 20px;background:var(--card);border-radius:16px;border:1.5px dashed var(--ln);color:var(--muted)'
      },
        h('h3', { style: 'font-size:18px;margin-bottom:8px;color:var(--ink)' }, `No Pages in "${activeDropdown.label}" Dropdown Yet`),
        h('p', { style: 'font-size:13.5px;margin-bottom:20px' }, `Click the button below to add your first page with code to the "${activeDropdown.label}" menu.`),
        h('button', {
          type: 'button',
          class: 'p',
          style: 'padding:10px 22px;font-size:13.5px',
          onclick: addNewPageToActiveDropdown
        }, `Ã¯Â¼â€¹ Add First Page to "${activeDropdown.label}"`)
      )
    );
  } else {
    pagesInActiveDropdown.forEach((page, i) => {
      pagesListContainer.append(renderPageCard(page, pages.indexOf(page)));
    });
  }

  // -- STANDALONE NAV PAGES --------------------------------------------------
  const standaloneLinks = nav.filter(item => !Array.isArray(item.children));

  const modeBar = h('div', { style: 'display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap' },
    h('button', {
      type: 'button',
      style: 'padding:11px 22px;font-size:14px;font-weight:700;border-radius:12px;transition:all .2s;' + (currentPagesView === 'dropdowns' ? 'background:var(--green);color:#fff;border:1px solid var(--green);box-shadow:0 4px 14px rgba(24,160,65,.3)' : 'background:var(--card);color:var(--ink);border:1px solid var(--ln)'),
      onclick: () => { currentPagesView = 'dropdowns'; redraw(); }
    }, 'v Dropdown Menu Pages'),
    h('button', {
      type: 'button',
      style: 'padding:11px 22px;font-size:14px;font-weight:700;border-radius:12px;transition:all .2s;' + (currentPagesView === 'standalone' ? 'background:#6366f1;color:#fff;border:1px solid #6366f1;box-shadow:0 4px 14px rgba(99,102,241,.3)' : 'background:var(--card);color:var(--ink);border:1px solid var(--ln)'),
      onclick: () => { currentPagesView = 'standalone'; redraw(); }
    }, 'Link Standalone Nav Pages (' + standaloneLinks.length + ')')
  );

  const standaloneSection = h('div', {});

  if (currentPagesView === 'standalone') {
    if (standaloneLinks.length === 0) {
      standaloneSection.append(h('div', { style: 'text-align:center;padding:50px 20px;background:var(--card);border-radius:16px;border:1.5px dashed var(--ln);color:var(--muted)' },
        h('h3', { style: 'font-size:18px;margin-bottom:8px;color:var(--ink)' }, 'No Simple Nav Links Found'),
        h('p', { style: 'font-size:13.5px' }, 'Go to the Navigation tab, add a Simple Nav Link (not a dropdown), then return here to create its full page.')
      ));
    } else {
      standaloneLinks.forEach(navItem => {
        const itemHref = (navItem.href || '').trim();
        const linkedSlug = itemHref.startsWith('/p/') ? itemHref.replace('/p/', '') : null;
        const linkedPage = linkedSlug ? pages.find(p => (p.slug || p.id) === linkedSlug) : null;
        const card = h('div', { style: 'margin-bottom:24px;padding:22px;border-radius:16px;border-left:5px solid #6366f1;background:var(--card);box-shadow:0 4px 18px rgba(0,0,0,.04)' });
        card.append(h('div', { style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px' },
          linkedPage
            ? h('span', { style: 'font-weight:800;font-size:11px;padding:5px 12px;border-radius:8px;background:#ede9fe;color:#6d28d9;text-transform:uppercase;letter-spacing:.04em' }, 'Page Linked')
            : h('span', { style: 'font-weight:800;font-size:11px;padding:5px 12px;border-radius:8px;background:#fef3c7;color:#92400e;text-transform:uppercase;letter-spacing:.04em' }, 'No Page Yet'),
          h('strong', { style: 'font-size:18px;color:var(--ink)' }, 'Nav Link: "' + navItem.label + '"'),
          h('code', { style: 'font-size:12px;color:var(--muted);background:rgba(0,0,0,.05);padding:3px 8px;border-radius:6px' }, itemHref || '(no href)')
        ));
        if (!linkedPage) {
          card.append(
            h('p', { style: 'color:var(--muted);font-size:13.5px;margin-bottom:14px' }, 'Currently points to: ', h('strong', {}, itemHref || '(nothing)'), '. Create a full page below and this nav link will redirect there automatically.'),
            h('button', {
              type: 'button', class: 'p',
              style: 'padding:11px 22px;font-size:13.5px;font-weight:700;background:#6366f1;border-color:#6366f1',
              onclick: () => {
                const slug = navItem.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                const blankCode = '<section class="wrap" style="padding:140px var(--pad) 100px"><div style="max-width:800px;margin:auto"><h1 style="color:var(--cream);font:600 48px/1.1 Inter;letter-spacing:-2px;margin-bottom:20px">' + navItem.label + '</h1><p style="font-size:18px;line-height:1.7;opacity:.8">Add your content here.</p></div></section>';
                pages.push({ id: 'page_' + Date.now().toString(36), title: navItem.label, slug, dropdownCategory: '', parentId: '', template: 'custom', customCode: blankCode, hero: { eyebrow:'', title: navItem.label, description:'', badge:'', ctaText:'Get in Touch', ctaHref:'#contact', image:'' }, subsections: [], activeSections: [], showInNav: true, navBadge: '', standaloneNavLink: true });
                navItem.href = '/p/' + slug;
                touch();
                redraw();
              }
            }, '+ Create Page for "' + navItem.label + '"')
          );
        } else {
          card.append(
            h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px' },
              h('div', {}, h('label', { style: 'font-weight:700' }, 'Page Title (also updates nav label):'),
                h('input', { type: 'text', value: linkedPage.title || '', oninput: e => { linkedPage.title = e.target.value; navItem.label = e.target.value; touch(); } })),
              h('div', {}, h('label', { style: 'font-weight:700' }, 'URL Slug (/p/...):'),
                h('div', { style: 'display:flex;gap:8px;align-items:center' },
                  h('input', { type: 'text', value: linkedPage.slug || '', style: 'flex:1', oninput: e => { const s = e.target.value.toLowerCase().replace(/[^a-z0-9\-_]+/g,''); linkedPage.slug = s; navItem.href = '/p/' + s; touch(); } }),
                  h('a', { href: '/p/' + (linkedPage.slug || linkedPage.id), target: '_blank', style: 'font-size:12px;font-weight:700;color:var(--accent);padding:5px 12px;background:rgba(24,160,65,.1);border-radius:6px;text-decoration:none;white-space:nowrap' }, 'Open Preview')
                ))
            ),
            h('label', { style: 'font-weight:700;display:block;margin-bottom:8px' }, 'Page Code (HTML / CSS / JS):'),
            h('textarea', { style: 'width:100%;min-height:300px;font:13px/1.6 monospace;padding:14px;border-radius:10px;border:1px solid var(--ln);background:rgba(0,0,0,.04);resize:vertical;box-sizing:border-box', spellcheck: false, oninput: e => { linkedPage.customCode = e.target.value; touch(); } }, linkedPage.customCode || ''),
            h('button', {
              type: 'button', class: 'danger', style: 'margin-top:14px;font-size:12px;padding:6px 14px',
              onclick: () => { if (confirm('Delete this page and reset the nav link to "#"?')) { const i = pages.indexOf(linkedPage); if (i !== -1) pages.splice(i, 1); navItem.href = '#'; touch(); redraw(); } }
            }, 'Delete Page and Unlink')
          );
        }
        standaloneSection.append(card);
      });
    }
  }

  wrap.append(
    h('div', { style: 'margin-bottom:18px' },
      h('h2', { style: 'margin-bottom:6px' }, 'Navbar Pages Manager'),
      h('p', { style: 'color:var(--muted);font-size:13.5px' }, 'Manage dropdown menu pages, or create full pages for simple nav links like Contact, About, etc.')
    ),
    modeBar,
    currentPagesView === 'dropdowns' ? h('div', {}, tabsBar, activeDropdownHeader, pagesListContainer) : standaloneSection
  );

  return wrap;
}
