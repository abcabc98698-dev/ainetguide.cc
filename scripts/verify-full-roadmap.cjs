const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs');
const distDir = path.resolve('docs/.vitepress/dist');

console.log('=== STARTING FULL ROADMAP VERIFICATION ===');

const results = {
  robotsTxt: false,
  brokenLinks: 0,
  orphanPages: 0,
  duplicateTitles: 0,
  duplicateDescriptions: 0,
  duplicateH1s: 0,
  sitemapCount: 0,
  sitemapHasLastmod: false,
  canonicalMismatch: 0,
  reviewsWithSchema: 0,
  trustPagesExist: 0
};

// 1. Robots.txt
const robotsPath = path.join(docsDir, 'public', 'robots.txt');
const distRobotsPath = path.join(distDir, 'robots.txt');
results.robotsTxt = fs.existsSync(robotsPath) && fs.existsSync(distRobotsPath);

// 2. Trust pages
const trustFiles = ['about.md', 'methodology.md', 'privacy.md', 'terms.md', 'author.md'];
results.trustPagesExist = trustFiles.filter(f => fs.existsSync(path.join(docsDir, f))).length;

// 3. Scan all MD files
function getAllFiles(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== '.vitepress' && file !== 'public') res = res.concat(getAllFiles(full));
    } else if (file.endsWith('.md')) {
      res.push(full);
    }
  });
  return res;
}

const allFiles = getAllFiles(docsDir);
const fileSet = new Set(allFiles.map(f => path.relative(docsDir, f).split(path.sep).join('/')));

const titles = {};
const descs = {};
const h1s = {};

let inboundCount = {};
for (const f of fileSet) inboundCount[f] = 0;

function checkHref(rawHref, source) {
  let href = rawHref.trim().split('#')[0].split('?')[0];
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
  
  let resolved;
  if (href === '/') {
    resolved = 'index.md';
  } else if (href.startsWith('/')) {
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
  
  if (fileSet.has(resolved)) {
    inboundCount[resolved] = (inboundCount[resolved] || 0) + 1;
  } else if (!resolved.endsWith('.png') && !resolved.endsWith('.jpg') && !resolved.endsWith('.svg')) {
    results.brokenLinks++;
    console.log('Broken link:', source, '->', rawHref, 'resolved as:', resolved);
  }
}

allFiles.forEach(f => {
  const rel = path.relative(docsDir, f).split(path.sep).join('/');
  const c = fs.readFileSync(f, 'utf-8');
  
  // Title
  const tm = c.match(/^title:\s*["']?([^"\n\r]+)["']?/m);
  if (tm) {
    const t = tm[1].trim();
    titles[t] = (titles[t] || 0) + 1;
  }
  
  // Desc
  const dm = c.match(/^description:\s*["']?([^"\n\r]+)["']?/m);
  if (dm) {
    const d = dm[1].trim();
    descs[d] = (descs[d] || 0) + 1;
  }
  
  // H1
  const h1m = c.match(/^#\s+([^\n\r]+)/m);
  if (h1m) {
    const h = h1m[1].trim();
    h1s[h] = (h1s[h] || 0) + 1;
  }
  
  // Links
  const mdRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(c)) !== null) checkHref(match[2], rel);
  
  const htmlRegex = /href=["']([^"']+)["']/g;
  while ((match = htmlRegex.exec(c)) !== null) checkHref(match[1], rel);
});

results.duplicateTitles = Object.values(titles).filter(v => v > 1).length;
results.duplicateDescriptions = Object.values(descs).filter(v => v > 1).length;
results.duplicateH1s = Object.values(h1s).filter(v => v > 1).length;

const orphans = Object.keys(inboundCount).filter(k => k !== 'index.md' && k !== '404.md' && inboundCount[k] === 0);
results.orphanPages = orphans.length;
if (orphans.length > 0) console.log('Orphan pages found:', orphans);

// 4. Sitemap & Dist checks
if (fs.existsSync(path.join(distDir, 'sitemap.xml'))) {
  const smContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8');
  results.sitemapHasLastmod = smContent.includes('<lastmod>');
  results.sitemapCount = (smContent.match(/<loc>/g) || []).length;
}

// 5. Review Schema in Dist HTML
const reviewHtmlDir = path.join(distDir, 'providers', 'review');
if (fs.existsSync(reviewHtmlDir)) {
  const htmls = fs.readdirSync(reviewHtmlDir).filter(f => f.endsWith('.html'));
  htmls.forEach(h => {
    const hc = fs.readFileSync(path.join(reviewHtmlDir, h), 'utf-8');
    if (hc.includes('"@type":"Product"') && hc.includes('"@type":"Review"')) {
      results.reviewsWithSchema++;
    }
  });
}

console.log('Verification Results:\n', JSON.stringify(results, null, 2));
