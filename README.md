# CMS Site
1. `npm install`
2. `ADMIN_PASSWORD='choose-a-strong-one' SESSION_SECRET='long-random-string' npm start`
3. Site: http://localhost:3000  ·  Admin: http://localhost:3000/admin/
Data lives in `data/*.json`, uploads in `public/uploads`. Back both up. Run behind HTTPS in production (set NODE_ENV=production so the cookie is Secure).
Sections: hero slider (add unlimited slides in admin → hero → slides) · cards · about · case studies · services · industries · process · stats · compare · reviews · FAQ · blog · footer. Icon fields accept a built-in name (leaf, building, factory, hospital, hotel, retail, government, port, education, datacenter, energy, water, transport, shield, chart, target, check, cpu, clock) or an uploaded image. About video accepts a YouTube/Vimeo link or an uploaded MP4/WEBM.
