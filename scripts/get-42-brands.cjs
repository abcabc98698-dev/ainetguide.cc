const fs = require('fs');
const files = fs.readdirSync('docs/providers/review').filter(f => f.endsWith('.md'));
const list = files.map(f => {
  const c = fs.readFileSync('docs/providers/review/' + f, 'utf-8');
  const titleMatch = c.match(/^title:\s*["']?([^"\n\r]+)["']?/m);
  let title = titleMatch ? titleMatch[1].split('|')[0].trim() : f;
  title = title.replace(/^2026\s*/, '').replace(/机场评测.*$/, '').replace(/深度评测.*$/, '').trim();
  return {
    slug: f.replace('.md', ''),
    title: title || f.replace('.md', '')
  };
});
console.log('Total brand reviews parsed:', list.length);
fs.writeFileSync('scripts/42-brands-list.json', JSON.stringify(list, null, 2));
