import express from 'express';import multer from 'multer';import crypto from 'node:crypto';import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import seed from'./data/seed.js';
const R=path.dirname(fileURLToPath(import.meta.url)),D=path.join(R,'data'),U=path.join(R,'public/uploads');
fs.mkdirSync(U,{recursive:true});
const PASS=process.env.ADMIN_PASSWORD;if(!PASS||PASS.length<8){console.error('Set ADMIN_PASSWORD (8+ chars)');process.exit(1)}
const SECRET=process.env.SESSION_SECRET||crypto.randomBytes(32).toString('hex');
const rd=(f,d)=>{try{return JSON.parse(fs.readFileSync(path.join(D,f),'utf8'))}catch{return d}};
const wr=(f,v)=>{const p=path.join(D,f);fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2));fs.renameSync(p+'.tmp',p)};
const mac=e=>crypto.createHmac('sha256',SECRET).update(String(e)).digest('hex');
const ok=t=>{const[e,s]=String(t||'').split('.');if(!e||!s||+e<Date.now())return false;const x=mac(e);return s.length===x.length&&crypto.timingSafeEqual(Buffer.from(s),Buffer.from(x))};
const ck=q=>Object.fromEntries((q.headers.cookie||'').split(';').map(c=>c.trim().split('=')).filter(x=>x[0]));
const auth=(q,s,n)=>ok(ck(q).sid)?n():s.status(401).json({error:'Unauthorized'});
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'2mb'}));
app.use((q,s,n)=>{s.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'same-origin'});n()});
const tries=new Map(),sha=v=>crypto.createHash('sha256').update(String(v)).digest();
app.post('/api/login',(q,s)=>{const t=tries.get(q.ip)||{n:0,r:Date.now()+9e5};if(Date.now()>t.r){t.n=0;t.r=Date.now()+9e5}
if(t.n>=5)return s.status(429).json({error:'Too many attempts, try later'});
if(!crypto.timingSafeEqual(sha(q.body?.password||''),sha(PASS))){t.n++;tries.set(q.ip,t);return s.status(401).json({error:'Wrong password'})}
tries.delete(q.ip);const e=Date.now()+864e5;s.cookie('sid',e+'.'+mac(e),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:864e5});s.json({ok:1})});
app.post('/api/logout',(q,s)=>{s.clearCookie('sid');s.json({ok:1})});
app.get('/api/me',auth,(q,s)=>s.json({ok:1}));
app.get('/api/content',(q,s)=>s.json({...seed,...rd('content.json',{})}));
app.put('/api/content',auth,(q,s)=>{const b=q.body;if(!b||typeof b!=='object'||!b.theme||!b.site)return s.status(400).json({error:'Invalid content'});wr('content.json',b);s.json({ok:1})});
const X={'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/gif':'.gif','video/mp4':'.mp4','video/webm':'.webm'};
const up=multer({storage:multer.diskStorage({destination:U,filename:(q,f,c)=>c(null,crypto.randomUUID()+X[f.mimetype])}),fileFilter:(q,f,c)=>c(X[f.mimetype]?null:new Error('Only PNG, JPG, WEBP, GIF, MP4, WEBM allowed'),!!X[f.mimetype]),limits:{fileSize:30e6}});
app.post('/api/upload',auth,(q,s)=>up.single('file')(q,s,e=>e||!q.file?s.status(400).json({error:e?.message||'No file'}):s.json({url:'/uploads/'+q.file.filename})));
app.post('/api/contact',(q,s)=>{const{name,email,message}=q.body||{};
if(![name,email,message].every(v=>typeof v==='string'&&v.trim())||name.length>200||email.length>200||message.length>3000)return s.status(400).json({error:'Please fill in all fields'});
const m=rd('messages.json',[]);m.unshift({id:crypto.randomUUID(),name:name.trim(),email:email.trim(),message:message.trim(),at:new Date().toISOString()});wr('messages.json',m.slice(0,1000));s.json({ok:1})});
app.get('/api/messages',auth,(q,s)=>s.json(rd('messages.json',[])));
app.delete('/api/messages/:id',auth,(q,s)=>{wr('messages.json',rd('messages.json',[]).filter(m=>m.id!==q.params.id));s.json({ok:1})});
app.get('/service/*',(q,s)=>s.sendFile(path.join(R,'public/service.html')));
app.use(express.static(path.join(R,'public')));
app.use((e,q,s,n)=>{console.error(e);s.status(500).json({error:'Server error'})});
app.listen(process.env.PORT||3000,()=>console.log('http://localhost:'+(process.env.PORT||3000)));
