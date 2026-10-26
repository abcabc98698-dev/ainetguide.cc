const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs');
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== '.vitepress' && file !== 'public') results = results.concat(getAllFiles(full));
    } else if (file.endsWith('.md')) {
      results.push(full);
    }
  });
  return results;
}

const allFiles = getAllFiles(docsDir);
const fileSet = new Set(allFiles.map(f => path.relative(docsDir, f).replace(/\\/g, '/')));

// Collect all directories
const allRealDirs = new Set();
fileSet.forEach(f => {
  const parts = f.split('/');
  parts.pop();
  let acc = '';
  for (const p of parts) {
    acc = acc ? acc + '/' + p : p;
    allRealDirs.add(acc);
  }
});

const hubFiles = [
  'index.md',
  'ai-guide/index.md',
  'clients/index.md',
  'demand/index.md',
  'free/index.md',
  'providers/index.md',
  'streaming/index.md',
  'troubleshooting/index.md',
  'work-study/index.md'
];

let brokenMap = {};

hubFiles.forEach(rel => {
  const full = path.join(docsDir, rel);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf-8');
  
  const regex = /(?:\[([^\]]*)\]\(([^)]+)\)|href=["']([^"']+)["'])/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawHref = match[2] || match[3];
    let href = rawHref.trim().split('#')[0].split('?')[0];
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
    
    let resolved;
    if (href.startsWith('/')) {
      resolved = href.slice(1);
    } else {
      resolved = path.posix.join(path.posix.dirname(rel), href);
    }
    
    if (resolved.endsWith('/')) resolved += 'index.md';
    else if (!resolved.endsWith('.md') && !resolved.endsWith('.html') && !resolved.endsWith('.png') && !resolved.endsWith('.jpg') && !resolved.endsWith('.svg')) {
      if (fileSet.has(resolved + '.md')) resolved += '.md';
      else if (fileSet.has(resolved + '/index.md')) resolved += '/index.md';
    }
    
    if (resolved.endsWith('.html')) {
      resolved = resolved.replace(/\.html$/, '.md');
    }
    
    if (!fileSet.has(resolved) && !resolved.endsWith('.png') && !resolved.endsWith('.jpg') && !resolved.endsWith('.svg')) {
      if (!brokenMap[rawHref]) brokenMap[rawHref] = new Set();
      brokenMap[rawHref].add(rel);
    }
  }
});

console.log('Total unique broken hrefs:', Object.keys(brokenMap).length);
fs.writeFileSync('scripts/broken-hrefs.json', JSON.stringify(Object.keys(brokenMap), null, 2));
