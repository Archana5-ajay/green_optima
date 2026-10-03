import{h,media,btn,tag,iconOrImg,embed}from'../lib/dom.js';import{pin}from'../lib/scroll.js';
export default c=>{const a=c.about,e=x=>x*x*(3-2*x),cl=(x,l=0,u=1)=>Math.min(Math.max(x,l),u);
const big=h('div',{class:'ab-big'},h('div',{},tag(a.tag),h('h2',{},a.title),h('p',{},a.text),h('ul',{class:'ab-p'},a.points.map(p=>h('li',{},h('b',{},p.label),h('span',{},p.text)))),btn(a.cta,a.ctaHref)),media(a.image,'IMAGE PLACEHOLDER'));
const cs=a.cards.map((k,i)=>h('div',{class:'ab-c',style:`z-index:${a.cards.length-i}`},h('span',{class:'pl-i'},iconOrImg(k.icon)),h('h3',{},k.title),h('p',{},k.text))),row=h('div',{class:'ab-r'},cs);
const sec=h('section',{id:'about',class:'dk pin ab'},h('div',{class:'pin-in'},h('div',{class:'in'},big,row)));
pin(sec,(v,np)=>cs.forEach((el,i)=>{if(np){el.style.transform='';return}const t=e(cl((v-.08-i*.2)/.4)),w=el.offsetWidth,off=(row.clientWidth-w)/2-el.offsetLeft;el.style.transform=`translate(${off*(1-t)}px,${(1-t)*-i*8}px) rotate(${(1-t)*(i-1)*3}deg)`}));
return[sec,h('section',{class:'dk ab-vid-sec'},h('div',{class:'in'},embed(a.video)))];};
