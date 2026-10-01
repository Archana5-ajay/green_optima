import{h,media,btn}from'../lib/dom.js';
export default c=>{const hb=h('button',{id:'hb','aria-label':'Menu',onclick:()=>{hb.classList.toggle('o');mm.classList.toggle('o')}},h('span'),h('span'));
const mm=h('div',{id:'mm',onclick:()=>{hb.classList.remove('o');mm.classList.remove('o')}},c.nav.map(n=>h('a',{href:n.href},n.label)));
return[h('header',{id:'hd'},h('a',{href:'#',style:'display:block;width:110px;height:30px'},media(c.site.logo,'LOGO','height:30px;background:none')),h('nav',{},c.nav.map(n=>h('a',{class:'nl',href:n.href},n.label))),btn(c.site.cta,'#contact','height:44px'),hb),mm]};
