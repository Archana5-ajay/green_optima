import{h}from'./lib/dom.js';
import header from'./components/header.js';
import hero from'./components/hero.js';
import pillars from'./components/pillars.js';
import about from'./components/about.js';
import services from'./components/services.js';
import cases from'./components/cases.js';
import industries from'./components/industries.js';
import process from'./components/process.js';
import stats from'./components/stats.js';
import compare from'./components/compare.js';
import reviews from'./components/reviews.js';
import blog from'./components/blog.js';
import footer from'./components/footer.js';

const c=await(await fetch('/api/content')).json();

// Apply theme CSS variables
for(const[k,v]of Object.entries(c.theme||{}))if(/^#[0-9a-f]{3,8}$/i.test(v))document.documentElement.style.setProperty('--'+k,v);
document.title=c.site.name;

const app=document.getElementById('app');
const ss=c.sectionSettings||{};
const sc=c.sectionColors||{};

function isDark(hex){
  if(!hex||!hex.startsWith('#'))return false;
  let c=hex.slice(1);if(c.length===3)c=c.split('').map(x=>x+x).join('');
  const r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16);
  return (0.299*r+0.587*g+0.114*b)<145;
}

// Helper: apply section settings (padding-top, padding-bottom, background color) to a section element
function applySettings(el,key){
  const cfg=ss[key]||{};
  if(cfg.paddingTop!=null)el.style.paddingTop=cfg.paddingTop+'px';
  if(cfg.paddingBottom!=null)el.style.paddingBottom=cfg.paddingBottom+'px';
  if(sc[key]){
    el.style.backgroundColor=sc[key];
    if(isDark(sc[key]))el.style.color='#fff';
  }
}

// Ordered list of sections with their keys
const sections=[
  ['hero',hero],
  ['pillars',pillars],
  ['about',about],
  ['cases',cases],
  ['services',services],
  ['industries',industries],
  ['process',process],
  ['stats',stats],
  ['compare',compare],
  ['reviews',reviews],
  ['blog',blog],
];

for(const[key,fn]of sections){
  const cfg=ss[key]||{active:true};
  if(cfg.active===false)continue;
  const result=[].concat(fn(c));
  result.forEach((el,i)=>{
    if(el&&el.nodeType&&i===0)applySettings(el,key);
    app.append(el);
  });
}

// Render custom containers
(c.customContainers||[]).forEach(ct=>{
  if(ct.active===false)return;
  const dark=isDark(ct.bgColor);
  const bg=ct.bgColor?`background:${ct.bgColor};`:''
  const col=dark?'color:#fff;':''
  const sec=h('section',{class:'sec',style:`padding-top:${ct.paddingTop||80}px;padding-bottom:${ct.paddingBottom||80}px;${bg}${col}`},
    h('div',{class:'in'},
      ct.tag?h('span',{class:'tag'},ct.tag):null,
      ct.title?h('h2',{style:'margin-bottom:30px;'+(dark?'color:#fff;':'')},ct.title):null,
      ct.text?h('p',{style:'opacity:.75;max-width:720px;margin-bottom:40px;'+(dark?'color:rgba(255,255,255,.85);':'')},ct.text):null,
      (ct.cards||[]).length?h('div',{class:'custom-cards'},
        (ct.cards||[]).map(card=>h('div',{class:'custom-card',style:dark?'background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff;':''},
          card.image?h('div',{style:'margin-bottom:16px;border-radius:14px;overflow:hidden;aspect-ratio:16/9;background:#111'},h('img',{src:card.image,alt:card.title||'',style:'width:100%;height:100%;object-fit:cover;display:block'})):null,
          card.title?h('h3',{style:dark?'color:#fff;':''},card.title):null,
          card.text?h('p',{style:dark?'color:rgba(255,255,255,.8);':''},card.text):null
        ))
      ):null
    )
  );
  app.append(sec);
});

document.body.prepend(...header(c));
document.body.append(footer(c),h('a',{class:'fab',href:'#contact','aria-label':'Contact'},'✉'));

// Scroll reveal animations for words and elements
function initScrollReveal() {
  const selector = 'section h2, section .tag, section .sq, .ind-c, .svc, .cs-card, .cs-side, .ab-c, .ab-big, .vals > div, .sw, .cmp .r, .bc, .custom-card, .ab-vid-sec, .tt';
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    if (el.parentElement) {
      const parent = el.parentElement;
      if (parent.classList.contains('ind-g') || parent.classList.contains('custom-cards') || parent.classList.contains('bl') || parent.classList.contains('ab-r')) {
        const idx = Array.from(parent.children).indexOf(el);
        el.style.transitionDelay = `${(idx % 6) * 0.08}s`;
      }
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

requestAnimationFrame(() => {
  initScrollReveal();
});

