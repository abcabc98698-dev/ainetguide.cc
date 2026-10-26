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
const descs = {};
allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const match = content.match(/^description:\s*["']?([^"\n\r]+)["']?/m);
  if (match) {
    const d = match[1].trim();
    if (!descs[d]) descs[d] = [];
    descs[d].push(path.relative(docsDir, f).replace(/\\/g, '/'));
  }
});

const duplicates = Object.entries(descs).filter(([k, v]) => v.length > 1);
console.log('Unique duplicate description texts:', duplicates.length);
console.log('Total files affected by duplicate descriptions:', duplicates.reduce((acc, [k, v]) => acc + v.length, 0));
duplicates.slice(0, 5).forEach(([desc, files]) => {
  console.log('\nDesc: ' + desc);
  console.log('Count: ' + files.length);
  console.log('Sample files:', files.slice(0, 3));
});
