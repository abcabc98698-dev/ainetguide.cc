const fs = require('fs');
const path = require('path');
const reviewDir = path.resolve('docs/providers/review');
const files = fs.readdirSync(reviewDir).filter(f => f.endsWith('.md'));
let count = 0;
files.forEach(f => {
  const p = path.join(reviewDir, f);
  let c = fs.readFileSync(p, 'utf-8');
  if (c.includes('application/ld+json')) {
    c = c.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');
    fs.writeFileSync(p, c, 'utf-8');
    count++;
  }
});
console.log('Cleaned script tags from', count, 'review files.');
