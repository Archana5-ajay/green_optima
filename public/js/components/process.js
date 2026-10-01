import{h,tag}from'../lib/dom.js';
export default c=>{const p=c.process,R=650,cs=p.steps.map((s,i)=>h('div',{class:'c'},h('small',{},'STEP '+(i+1)),h('h3',{},s.title),h('p',{},s.text))),wh=h('div',{class:'wh'},cs);
const sec=h('section',{id:'pr',class:'dk'},h('div',{class:'st'},h('div',{class:'in'},tag(p.tag),h('h2',{style:'max-width:700px'},p.title)),wh));
const run=()=>{if(innerWidth<=768)return;const q=Math.min(Math.max((-60-sec.getBoundingClientRect().top)/550,0),cs.length-1),step=360/cs.length;
cs.forEach((el,i)=>{const deg=i*step-90*q,a=deg*Math.PI/180,d=((deg+540)%360)-180;el.style.transform=`translate(${R*Math.sin(a)}px,${-R*Math.cos(a)}px)`;el.style.opacity=Math.max(.15,1-Math.abs(d)/90)})};
addEventListener('scroll',run,{passive:true});addEventListener('resize',run);run();return sec};
