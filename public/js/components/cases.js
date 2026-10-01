import{h,media,btn,tag}from'../lib/dom.js';
export default c=>{const o=c.cases,N=o.items.length,pd=n=>String(n).padStart(2,'0');let i=0,t;
const sl=o.items.map((k,j)=>h('article',{class:'cs-s'+(j?'':' on')},h('div',{class:'cs-card'},media(k.image,'IMAGE PLACEHOLDER'),h('small',{},k.client),h('h3',{},k.title),h('p',{class:'cs-q'},'“'+k.quote+'”')),h('div',{class:'cs-side'},h('ul',{},(k.points||[]).map(p=>h('li',{},p))),btn(k.cta||'Read More',k.href||'#'))));
const cur=h('span',{},'01'),dots=o.items.map((_,k)=>h('button',{class:k?'':'a','aria-label':'Case '+(k+1),onclick:()=>{go(k);start()}},pd(k+1)));
const go=j=>{if(j===i)return;const p=sl[i],x=sl[j];x.style.transition='none';x.classList.remove('out','on');void x.offsetWidth;x.style.transition='';x.classList.add('on');p.classList.remove('on');p.classList.add('out');i=j;cur.textContent=pd(j+1);dots.forEach((d,k)=>d.classList.toggle('a',k===j))};
const start=()=>{clearInterval(t);if(N>1)t=setInterval(()=>go((i+1)%N),(+o.interval||5)*1000)};start();
const stage=h('div',{class:'cs-st',onmouseenter:()=>clearInterval(t),onmouseleave:start},sl);
return h('section',{class:'sec cr',id:'projects'},h('div',{class:'in'},tag(o.tag),h('div',{class:'cs-top'},h('h2',{},o.title),h('div',{class:'cs-n'},cur,h('small',{},'/ '+pd(N)))),stage,h('div',{class:'cs-dots'},dots),h('a',{class:'cs-more',href:o.moreHref||'#'},o.moreLabel,h('b',{},'→'))))};
