import{h,tag}from'../lib/dom.js';
export default c=>{const o=c.faq;return h('section',{class:'sec dk'},h('div',{class:'in',style:'max-width:1000px'},tag(o.tag),h('h2',{style:'margin-bottom:50px'},o.title),
o.items.map(i=>{const f=h('div',{class:'fq',onclick:()=>f.classList.toggle('o')},h('h3',{},i.q,h('i',{},'+')),h('div',{class:'bd'},h('p',{},i.a)));return f})))};
