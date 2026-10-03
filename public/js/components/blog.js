import{h,media,tag}from'../lib/dom.js';
export default c=>{const o=c.blog||{items:[]};return h('section',{class:'sec dk',id:'blog',style:'padding-top:0'},h('div',{class:'in'},tag(o.tag),h('h2',{style:'max-width:760px'},o.title),
h('div',{class:'bl'},(o.items||[]).map(b=>h('a',{class:'bc',href:'#'},media(b.image,'IMAGE PLACEHOLDER','aspect-ratio:4/3;border-radius:20px'),h('small',{style:'opacity:.6'},b.date+' · '+b.tag),h('h3',{},b.title),h('p',{class:'d'},b.excerpt))))))};
