import{h,tag,iconOrImg}from'../lib/dom.js';
export default c=>{const o=c.industries;return h('section',{class:'sec dk',id:'industries'},h('div',{class:'in'},tag(o.tag),h('h2',{},o.title),h('p',{class:'sq'},o.sub),h('div',{class:'ind-g'},o.items.map(i=>h('a',{class:'ind-c',href:i.href||'#'},h('span',{class:'pl-i'},iconOrImg(i.icon)),h('b',{},i.name))))))};
