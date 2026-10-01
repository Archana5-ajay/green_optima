import{h,btn}from'../lib/dom.js';
const safe=u=>typeof u==='string'&&/^(\/uploads\/|https?:\/\/)/.test(u)?u:'',pad=n=>String(n).padStart(2,'0');
export default c=>{const o=c.hero,S=o.slides||[],n=S.length,iv=+o.interval||6;let i=0,t;
const bg=S.map((s,k)=>{const e=h('div',{class:'hx-b'+(k?'':' on')});if(safe(s.image))e.append(h('img',{src:safe(s.image),alt:''}));if(safe(s.video)){const v=h('video',{src:safe(s.video),loop:'',playsinline:'',preload:k?'none':'auto'});v.muted=true;e.append(v)}return e});
const vids=bg.map(b=>b.querySelector('video'));vids[0]?.play().catch(()=>{});
const left=S.map((s,k)=>h('div',{class:'hx-l'+(k?'':' on')},s.eyebrow&&h('span',{class:'tag'},s.eyebrow),h('h1',{},s.title),h('p',{},s.text),h('div',{class:'hx-btns'},s.cta&&btn(s.cta,s.ctaHref),s.cta2&&h('a',{class:'hx-g',href:s.cta2Href||'#'},s.cta2))));
const right=S.map((s,k)=>h('aside',{class:'hx-card'+(k?'':' on')},h('div',{class:'hx-ch'},h('span',{},s.cardTag),h('b',{},pad(k+1)+' / '+pad(n))),h('small',{},s.cardTitle),h('ul',{},(s.cardItems||[]).map(x=>h('li',{},x)))));
const dots=S.map((_,k)=>h('button',{class:'hx-d'+(k?'':' a'),'aria-label':'Slide '+(k+1),onclick:()=>{go(k);start()}}));
const go=j=>{if(j===i)return;const p=i;i=j;bg[p].classList.remove('on');bg[p].classList.add('out');setTimeout(()=>{if(i!==p){bg[p].classList.remove('out');vids[p]?.pause()}},1000);
const x=bg[j];x.style.transition='none';x.classList.remove('out');void x.offsetWidth;x.style.transition='';x.classList.add('on');if(vids[j]){vids[j].currentTime=0;vids[j].play().catch(()=>{})}
[left,right,dots].forEach(a=>a.forEach((e,k)=>e.classList.toggle(e.className.includes('hx-d')?'a':'on',k===j)))};
const start=()=>{clearInterval(t);if(n>1)t=setInterval(()=>go((i+1)%n),iv*1000)};start();
const arrow=(l,d)=>h('button',{class:'hx-a','aria-label':l,onclick:()=>{go((i+d+n)%n);start()}},d<0?'←':'→');
return h('section',{class:'hx dk',style:`--iv:${iv}s`},h('div',{class:'hx-bg'},bg),h('div',{class:'hx-au'}),h('div',{class:'hx-ov'}),h('div',{class:'in hx-in'},h('div',{class:'hx-ls'},left),h('div',{class:'hx-rs'},right)),n>1?h('div',{class:'hx-ct'},arrow('Previous',-1),dots,arrow('Next',1)):null)};
