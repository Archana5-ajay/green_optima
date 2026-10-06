export default function renderFooter(c) {
  const f = c.footer || {};
  const s = c.site || {};

  const emailAddr = s.email || 'info@greenoptima.ae';
  const phone = s.phone || '+971 04 566 7544';
  const address = s.address || 'Office 1201, Tower B, Prime Business Centre, JVC, Dubai, UAE';
  const siteName = s.name || 'Green Optima';


  const linkedInUrl = ((f.socials || []).find(x => /linkedin/i.test(x.label)) || {}).href
    || 'https://www.linkedin.com/company/green-optima';
  const youtubeUrl = ((f.socials || []).find(x => /youtube/i.test(x.label)) || {}).href
    || 'https://www.youtube.com/@greenoptima';

  const wrapper = document.createElement('div');
  wrapper.id = 'contact';
  wrapper.innerHTML = `
<style>
/* ── Green Optima Footer (scoped to .nft-*) ── */
.ft-root-container{--bg:#020b06;--text:#fff;--muted:rgba(255,255,255,.62);--line:rgba(255,255,255,.09);--acc:#7ccb35;--gut:clamp(20px,4vw,64px);--ease:cubic-bezier(.22,1,.36,1);}
.nft{background:var(--bg);padding:clamp(48px,6vw,80px) var(--gut) 0;color:var(--text);font-family:Inter,"Helvetica Neue",Arial,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased;}
.nft a{color:inherit;text-decoration:none}
.nft ul{list-style:none;padding:0;margin:0}
.nft-in{max-width:1560px;margin:0 auto}
.nft-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 0.8fr 1.2fr;gap:clamp(24px,3vw,48px)}
/* brand */
.nft-logo-img{display:block;width:min(100%,180px);height:auto}
.nft-logo-fallback{font:700 20px/1 Inter,sans-serif;color:#fff;letter-spacing:-.4px}
.nft-brand p{margin-top:16px;max-width:260px;color:var(--muted);font-size:14px;line-height:1.7;margin-bottom:0}
.nft-social-row{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}
.nft-soc-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(255,255,255,.16);color:rgba(255,255,255,.65);transition:border-color .28s,background .28s,color .28s,transform .32s var(--ease)}
.nft-soc-btn svg{width:16px;height:16px;fill:currentColor;flex-shrink:0}
.nft-soc-btn.soc-web svg{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.nft-soc-btn:hover{border-color:var(--acc);background:rgba(124,203,53,.1);color:var(--acc);transform:translateY(-3px)}
/* headings */
.nft h4{font-weight:700;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;margin:0 0 18px;color:rgba(255,255,255,.38)}
/* lists */
.nft li{margin-bottom:11px}
.nft li a{position:relative;display:inline-block;color:var(--muted);font-size:14px;transition:color .22s,transform .32s var(--ease)}
.nft li a::after{content:"";position:absolute;left:0;bottom:-2px;height:1px;width:100%;background:var(--acc);transform:scaleX(0);transform-origin:left;transition:transform .38s var(--ease)}
.nft li a:hover{color:#fff;transform:translateX(4px)}
.nft li a:hover::after{transform:scaleX(1)}
/* contact column */
.nft-contact li{display:flex;gap:11px;align-items:flex-start;margin-bottom:18px}
.nft-contact .ci{flex:none;width:17px;height:17px;margin-top:2px;stroke:var(--muted);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .22s}
.nft-contact li:hover .ci{stroke:var(--acc)}
.nft-contact a,.nft-contact span{color:var(--muted);font-size:14px;line-height:1.5}
.nft-contact li.addr .ci{margin-top:4px}
.nft-contact li.addr span{font-size:13px;max-width:210px}
/* map */
.nft-map{margin-top:clamp(36px,5vw,60px);border-radius:14px;overflow:hidden;background:#111a14;border:1px solid rgba(255,255,255,.05)}
.nft-map iframe{display:block;width:100%;height:290px;border:0}
/* bottom bar */
.nft-bot{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;margin-top:clamp(24px,3vw,44px);padding:22px 0;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
.nft-bot-socials{display:flex;gap:10px}
.nft-bot-links{display:flex;gap:20px;justify-self:center}
.nft-bot-links a{color:var(--muted);transition:color .22s}.nft-bot-links a:hover{color:#fff}
.nft-bot-copy{justify-self:end;text-align:right}
/* responsive */
@media(max-width:1100px){.nft-grid{grid-template-columns:repeat(3,1fr)}.nft-brand{grid-column:1/-1}}
@media(max-width:700px){
  .nft-grid{grid-template-columns:1fr 1fr}
  .nft-contact{grid-column:1/-1}
  .nft-bot{grid-template-columns:1fr;justify-items:center;text-align:center}
  .nft-bot-copy{justify-self:center;text-align:center}
}
@media(max-width:420px){.nft-grid{grid-template-columns:1fr}}
</style>

<footer class="nft ft-root-container">
<div class="nft-in">

  <div class="nft-grid">

    <!-- ① Brand -->
    <div class="nft-brand">
      <a href="/" style="display:inline-block">
        ${s.logo
      ? `<img class="nft-logo-img" src="${s.logo}" alt="${siteName}">`
      : `<span class="nft-logo-fallback">${siteName}</span>`}
      </a>
      <p>${s.tagline || 'Smart buildings. Sustainable future. Engineered in Dubai since 2006.'}</p>
      <div class="nft-social-row">
        <a class="nft-soc-btn" href="${linkedInUrl}" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.5H3zM9.5 9.75h3.8v1.6h.05c.54-1 1.85-2.06 3.8-2.06 4.04 0 4.85 2.66 4.85 6.12v5.8h-4v-5.14c0-1.23-.02-2.8-1.7-2.8s-1.97 1.33-1.97 2.7v5.24h-4z"/></svg>
        </a>
        <a class="nft-soc-btn" href="${youtubeUrl}" target="_blank" rel="noopener" aria-label="YouTube">
          <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"/><polygon fill="#020b06" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
        </a>

      </div>
    </div>

    <!-- ② Quick Links -->
    <div>
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/p/about">About</a></li>
        <li><a href="/p/projects">Projects</a></li>
        <li><a href="/p/partners">Partners</a></li>
        <li><a href="/p/news">News</a></li>
        <li><a href="/p/events">Events</a></li>
        <li><a href="/p/insights">Green Optima Insights</a></li>
        <li><a href="/p/careers">Careers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>

    <!-- ③ Solutions -->
    <div>
      <h4>Solutions</h4>
      <ul>
        <li><a href="/p/solutions">Integrated BMS</a></li>
        <li><a href="/p/solutions">Internet of Things</a></li>
        <li><a href="/p/solutions">Access Control Systems</a></li>
        <li><a href="/p/solutions">Energy Metering &amp; Dashboards</a></li>
        <li><a href="/p/solutions">Chiller Plant Manager</a></li>
        <li><a href="/p/solutions">Lighting Control Systems</a></li>
      </ul>
    </div>

    <!-- ④ Products -->
    <div>
      <h4>Products</h4>
      <ul>
        <li><a href="/p/products">Tridium</a></li>
        <li><a href="/p/products">Priva</a></li>
        <li><a href="/p/products">Belimo</a></li>
      </ul>
    </div>

    <!-- ⑤ Contact -->
    <div class="nft-contact">
      <h4>Contact</h4>
      <ul>
        <li>
          <svg class="ci" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
          <a href="tel:+97145667544">${phone}</a>
        </li>
        <li>
          <svg class="ci" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 7 9 6.5L21 7"/></svg>
          <a href="mailto:${emailAddr}">${emailAddr}</a>
        </li>
        <li class="addr">
          <svg class="ci" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
          <span>${address}</span>
        </li>

      </ul>
    </div>

  </div><!-- /nft-grid -->

  <!-- Map -->
  <div class="nft-map">
    <iframe title="Green Optima office" src="https://www.google.com/maps?q=Prime+Business+Centre+JVC+Dubai&output=embed" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>

  <!-- Bottom bar -->
  <div class="nft-bot">
    <div class="nft-bot-socials">
      <a class="nft-soc-btn" href="${linkedInUrl}" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.5H3zM9.5 9.75h3.8v1.6h.05c.54-1 1.85-2.06 3.8-2.06 4.04 0 4.85 2.66 4.85 6.12v5.8h-4v-5.14c0-1.23-.02-2.8-1.7-2.8s-1.97 1.33-1.97 2.7v5.24h-4z"/></svg>
      </a>
      <a class="nft-soc-btn" href="${youtubeUrl}" target="_blank" rel="noopener" aria-label="YouTube">
        <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"/><polygon fill="#020b06" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
      </a>
      
    </div>
    <nav class="nft-bot-links">
      <a href="/privacy">Privacy Policy</a>
      <a href="/cookie">Cookie Policy</a>
      <a href="/sitemap">Sitemap</a>
    </nav>
    <span class="nft-bot-copy">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</span>
  </div>

</div><!-- /nft-in -->
</footer>`;

  return wrapper;
}
