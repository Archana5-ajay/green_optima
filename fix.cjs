const fs = require('fs');
const file = './data/content.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));
let changed = 0;

data.pages.forEach(p => {
  if (p.template !== 'custom' || !p.customCode) return;
  const code = p.customCode;

  // Detect full HTML documents with body { display:flex } pattern
  if (/<html[\s>]/i.test(code)) {
    // Parse it: grab everything between <body> and </body>
    const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const headStyleMatch = code.match(/<head[^>]*>([\s\S]*?)<\/head>/i);

    let bodyContent = bodyMatch ? bodyMatch[1] : code;
    let headContent = headStyleMatch ? headStyleMatch[1] : '';

    // Extract <style> and <script> from head
    const headAssets = [];
    headContent.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, match => {
      headAssets.push(match);
    });

    // Scope body {} rules in extracted styles to .coming-soon-wrap
    const scopedAssets = headAssets.map(asset => {
      if (!asset.startsWith('<style')) return asset;
      return asset
        // Remove html/body height:100% rules entirely
        .replace(/html\s*,\s*body\s*\{[^}]*height\s*:\s*100%[^}]*\}/gi, '')
        // Replace body { ... } with scoped wrapper
        .replace(/\bbody\s*\{/g, '.coming-soon-wrap {');
    });

    // Wrap body content so the scoped styles apply
    const newCode = `${scopedAssets.join('\n')}\n<div class="coming-soon-wrap">\n${bodyContent}\n</div>`;

    p.customCode = newCode;
    changed++;
    console.log(`Fixed: ${p.title} (${p.slug})`);
  }
});

if (changed > 0) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`\nFixed ${changed} page(s). Saved.`);
} else {
  console.log('No pages needed fixing.');
}
