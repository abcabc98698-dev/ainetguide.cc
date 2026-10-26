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

// Collect all directories that have index.md or are folders
const allDirs = new Set();
fileSet.forEach(f => {
  const parts = f.split('/');
  parts.pop(); // remove file
  let cur = '';
  for (const p of parts) {
    cur = cur ? cur + '/' + p : p;
    allDirs.add(cur);
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

let issues = [];

hubFiles.forEach(rel => {
  const full = path.join(docsDir, rel);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf-8');
  
  // Find all links (markdown and HTML)
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
      issues.push({
        source: rel,
        rawHref,
        resolved
      });
    }
  }
});

console.log('Total issues found in hubs:', issues.length);

// Group by source and inspect
const bySource = {};
issues.forEach(iss => {
  if (!bySource[iss.source]) bySource[iss.source] = [];
  bySource[iss.source].push(iss);
});

for (const [src, list] of Object.entries(bySource)) {
  console.log(`\n=== Source: ${src} (${list.length} broken links) ===`);
  list.slice(0, 10).forEach(item => {
    console.log(`  Raw: ${item.rawHref} -> Resolved: ${item.resolved}`);
  });
}
