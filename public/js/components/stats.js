import{h,tag}from'../lib/dom.js';
export default c=>{const s=c.stats,it=s.items.map(i=>h('div',{},h('small',{class:'tag',style:'margin:0'},i.tag),h('b',{},i.value),h('h3',{},i.title),h('p',{style:'opacity:.7'},i.line1,h('br'),i.line2)));
const tk=h('div',{class:'tk'},[0,1,2,3].flatMap(()=>it.map(n=>n.cloneNode(true))));let x=0,l=performance.now();
(function f(t){x-=57.5*(t-l)/1000;l=t;const w=tk.scrollWidth/4;if(w&&-x>=w)x+=w;tk.style.transform=`translateX(${x}px)`;requestAnimationFrame(f)})(l);
return h('section',{class:'sec cr'},h('div',{class:'in'},tag(s.tag),h('h2',{style:'max-width:860px'},s.title),h('div',{class:'sw'},tk)))};
