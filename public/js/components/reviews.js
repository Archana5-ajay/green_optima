import{h,media,video,tag}from'../lib/dom.js';
export default c=>{const o=c.reviews;let n=0;const sl=o.items.map((r,i)=>h('div',{class:'sl'+(i?'':' a')},r.video?video(r.video):media(r.photo,'PHOTO PLACEHOLDER'),h('div',{style:'align-self:center'},h('h3',{style:'font-size:32px;line-height:38px'},'“'+r.quote+'”'),h('p',{style:'margin:20px 0'}),h('b',{},r.name),h('br'),r.role)));
const dots=o.items.map((_,i)=>h('button',{'aria-label':'Review '+(i+1),onclick:()=>go(i)})),go=i=>{n=i;sl.forEach((s,k)=>s.classList.toggle('a',k===i));dots.forEach((d,k)=>d.classList.toggle('a',k===i))};dots[0]?.classList.add('a');
if(sl.length>1)setInterval(()=>go((n+1)%sl.length),6000);
return h('section',{class:'sec cr',id:'reviews'},h('div',{class:'in'},tag(o.tag),h('h2',{style:'max-width:900px'},o.title),h('div',{class:'tt'},sl),h('div',{class:'dots'},dots)))};
