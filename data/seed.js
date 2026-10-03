const L='Placeholder supporting copy sits here for layout testing.';
const n=(k,f)=>[...Array(k)].map((_,i)=>f(i+1));
const sec=t=>({tag:t,title:t+' heading placeholder'});
const slide=(eyebrow,title,cardTag,cardTitle,cardItems)=>({image:'',video:'',eyebrow,title,text:L,cta:'Get in touch',ctaHref:'#contact',cta2:'Our solutions',cta2Href:'#services',cardTag,cardTitle,cardItems});
const cs=(client,title,loc)=>({image:'',client,title,quote:'Dummy quote: replace with the client’s own words or an approved project excerpt.',points:['Location: '+loc,'Category: Success story (dummy)','Scope: placeholder','Result: placeholder'],cta:'Read More',href:'#'});
export default{
theme:{dark:'#0a0a0a',cream:'#ffffe6',card:'#edebbe',lime:'#e4fe7b',ink:'#1b1c1c',accent:'#18A041'},
site:{name:'Green Optima',logo:'',cta:'Get in touch',email:'info@example.com',phone:'+971 0 000 0000',address:'Office 1201, Tower B, Prime Business Centre, JVC, Dubai',hours:'Sun–Thu 9:00–18:00'},
nav:['Home','About','Solutions','Projects','Industries','Contact'].map(l=>({label:l,href:l=='Home'?'#':l=='Solutions'?'#services':'#'+l.toLowerCase()})),
hero:{interval:6,slides:[
slide('Dummy content','Your smart integrator. Save energy. Connect everything.','Solutions','What we integrate',['IBMS','Internet of Things','Energy metering','Access control','Lighting control','Chiller plant manager']),
slide('IBMS','From BMS to IBMS','IBMS','What it gives you',['One view of every building system','Open-protocol retrofits','Trends and alarms in one place']),
slide('Internet of Things','Connected buildings that respond','IoT','Three outcomes',['Solve traffic','Cut pollution','Boost safety']),
slide('Energy metering','Monitor. Engage. Optimize.','Energy metering','Three-step path',['Monitor','Engage','Optimize']),
slide('Chiller plant','Smarter plant control','Chiller plant manager','Dummy benefits',['Benefit one','Benefit two','Benefit three'])]},
pillars:{title:'What makes us different',sub:'Your smart integrator. Save energy. Connect everything.',items:[{icon:'target',image:'',title:'We make things simple',text:L},{icon:'clock',image:'',title:'We focus on deadlines',text:L},{icon:'cpu',image:'',title:'Open-protocol retrofits',text:L},{icon:'shield',image:'',title:'Tailor-made solutions',text:L}]},
about:{tag:'About our company',title:'Smarter buildings. Proven savings.',text:L+' '+L,cta:'Know more',ctaHref:'#',image:'',points:[{label:'Founding',text:'Founded in 2006 (dummy — confirm with client)'},{label:'Experience',text:'Projects across Dubai, Abu Dhabi and Ras Al Khaimah'}],cards:[{icon:'target',title:'Mission',text:L},{icon:'leaf',title:'Vision',text:'Leading technology and service provider for sustainable buildings'},{icon:'chart',title:'Expertise',text:L}],video:''},
cases:{tag:'Case studies',title:'Brands we have helped growing',interval:5,moreLabel:'Read more case studies',moreHref:'#',items:[cs('Khalifa Port','Khalifa Port — Packages 208 & 209','Abu Dhabi'),cs('Park Place Tower','Park Place Tower','Dubai'),cs('Healthpoint Hospital','Healthpoint Hospital','Abu Dhabi'),cs('DEWA','DEWA project (dummy)','Dubai')]},
services:{...sec('Our Services'),items:n(6,i=>({icon:'',title:['IBMS','Internet of Things','Access Control','Energy Metering','Chiller Plant Manager','Lighting Control'][i-1],text:L,image:'',subs:n(9,j=>'Sub-service '+j)}))},
industries:{tag:'Industries',title:'Industries we serve',sub:'Dummy sector list — confirm with client.',items:[['building','Commercial towers'],['hotel','Hospitality'],['retail','Retail'],['government','Government'],['hospital','Healthcare'],['port','Port & industrial'],['education','Education'],['datacenter','Data centres'],['energy','Utilities'],['factory','Manufacturing'],['transport','Logistics'],['water','Water & cooling']].map(([icon,name])=>({icon,name,href:'#contact'}))},
process:{...sec('Our process'),steps:n(4,i=>({title:'Step '+i+' title',text:L}))},
stats:{...sec('By the numbers'),items:n(3,i=>({tag:'Group '+i,value:i*50+'+',title:'Stat title '+i,line1:'Supporting line one',line2:'Supporting line two'}))},
compare:{...sec('The difference'),text:L,rows:n(7,i=>({label:'Row '+i,without:'Without-us placeholder',with:'With-us placeholder'}))},
blog:{...sec('Blog'),items:n(3,i=>({title:'Blog post title '+i,date:'Aug 21',tag:'News',excerpt:L+' '+L,image:''}))},
footer:{title:'Optimize your building’s operations',cta:'Let’s talk today',socials:[{label:'LinkedIn',href:'#'}]},
sectionSettings:{hero:{active:true,paddingTop:0,paddingBottom:0},pillars:{active:true,paddingTop:80,paddingBottom:80},about:{active:true,paddingTop:80,paddingBottom:80},cases:{active:true,paddingTop:80,paddingBottom:80},services:{active:true,paddingTop:80,paddingBottom:80},industries:{active:true,paddingTop:80,paddingBottom:80},process:{active:true,paddingTop:80,paddingBottom:80},stats:{active:true,paddingTop:80,paddingBottom:80},compare:{active:true,paddingTop:80,paddingBottom:80},reviews:{active:true,paddingTop:80,paddingBottom:80},blog:{active:true,paddingTop:80,paddingBottom:80}},
sectionColors:{hero:'',pillars:'',about:'',cases:'',services:'',industries:'',process:'',stats:'',compare:'',reviews:'',blog:''},
customContainers:[],
pages:[]
};
