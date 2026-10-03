import{h,tag}from'../lib/dom.js';
export default c=>{const o=c.compare||{rows:[]};return h('section',{class:'sec dk'},h('div',{class:'in'},tag(o.tag),h('h2',{style:'max-width:760px'},o.title),h('p',{style:'max-width:640px;margin-top:20px'},o.text),
h('div',{class:'cmp'},h('div',{class:'r h'},h('span'),h('span',{},'WITHOUT US'),h('span',{},'WITH US')),(o.rows||[]).map(r=>h('div',{class:'r'},h('h3',{},r.label),h('p',{},r.without),h('p',{},r.with))))))};
