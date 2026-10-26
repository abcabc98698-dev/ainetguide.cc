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

let realBroken = [];
let inboundCount = {};
for (const f of fileSet) inboundCount[f] = 0;

function checkHref(rawHref, source) {
  let href = rawHref.trim().split('#')[0].split('?')[0];
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
  
  let resolved;
  if (href.startsWith('/')) {
    resolved = href.slice(1);
  } else {
    resolved = path.posix.join(path.posix.dirname(source), href);
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
    realBroken.push({ source, target: rawHref, resolved });
  } else if (fileSet.has(resolved)) {
    inboundCount[resolved] = (inboundCount[resolved] || 0) + 1;
  }
}

allFiles.forEach(f => {
  const rel = path.relative(docsDir, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf-8');
  
  // 1. Markdown links [text](url)
  const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    checkHref(match[2], rel);
  }
  
  // 2. HTML anchor hrefs href="..."
  const htmlRegex = /href=["']([^"']+)["']/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    checkHref(match[1], rel);
  }
});

const orphans = Object.keys(inboundCount).filter(k => k !== 'index.md' && inboundCount[k] === 0);
const brokenBySource = {};
realBroken.forEach(b => {
  brokenBySource[b.source] = (brokenBySource[b.source] || 0) + 1;
});
console.log('Broken links count by source file:', brokenBySource);
console.log('Total broken links count:', realBroken.length);
console.log('Total files:', allFiles.length);
console.log('Orphan pages count (including HTML hrefs):', orphans.length);
const nonOrphans = Object.keys(inboundCount).filter(k => inboundCount[k] > 0);
console.log('Pages with inbound links:', nonOrphans.length);
console.log('Sample orphans:', orphans.slice(0, 5));
console.log('Sample non-orphans:', nonOrphans.slice(0, 5));
