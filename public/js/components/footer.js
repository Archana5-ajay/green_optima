import{h,btn}from'../lib/dom.js';
export default c=>{const f=c.footer,s=c.site,clk=h('p',{id:'clk',style:'margin-top:20px'}),tick=()=>clk.textContent=new Date().toLocaleTimeString('en-US');tick();setInterval(tick,1000);
const msg=h('small'),form=h('form',{class:'cf',onsubmit:async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));msg.textContent='Sending…';
try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();if(!r.ok)throw Error(j.error);form.reset();msg.textContent='Thanks — we’ll be in touch.'}catch(x){msg.textContent=x.message||'Something went wrong'}}},
h('input',{name:'name',placeholder:'Name',required:'',maxlength:200}),h('input',{name:'email',type:'email',placeholder:'Email',required:'',maxlength:200}),h('textarea',{name:'message',placeholder:'Message',rows:4,required:'',maxlength:3000}),h('button',{class:'btn'},'Send',h('b',{},'→'),h('i')),msg);
const list=(t,a)=>h('ul',{},h('li',{},h('b',{},t)),a.map(l=>h('li',{},h('a',{class:'nl',href:l.href},l.label))));
return h('footer',{id:'contact',class:'dk'},h('div',{class:'in'},h('h2',{style:'max-width:700px'},f.title),form,
h('div',{class:'g'},h('div',{},h('p',{},s.phone,h('br'),s.email,h('br'),s.address,h('br'),s.hours),clk),list('Pages',c.nav),list('Services',c.services.items.map(i=>({label:i.title,href:'#services'}))),list('Socials',f.socials))))};
