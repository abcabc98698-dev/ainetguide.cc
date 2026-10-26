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
const dirSet = new Set();
fileSet.forEach(f => {
  const parts = f.split('/');
  parts.pop();
  let acc = '';
  for (const p of parts) {
    acc = acc ? acc + '/' + p : p;
    dirSet.add(acc);
  }
});

console.log('Total files:', fileSet.size);
console.log('Total dirs:', dirSet.size);

// Print all first-level and second-level folders
const structure = {};
dirSet.forEach(d => {
  const parts = d.split('/');
  if (!structure[parts[0]]) structure[parts[0]] = {};
  if (parts.length === 2) {
    if (!structure[parts[0]][parts[1]]) structure[parts[0]][parts[1]] = [];
  } else if (parts.length === 3) {
    if (!structure[parts[0]][parts[1]]) structure[parts[0]][parts[1]] = [];
    structure[parts[0]][parts[1]].push(parts[2]);
  }
});

console.log('Top-level sections:', Object.keys(structure));
for (const [top, subs] of Object.entries(structure)) {
  console.log(`\n=== Section: ${top} (${Object.keys(subs).length} subcategories) ===`);
  for (const [sub, clusters] of Object.entries(subs)) {
    console.log(`  ${sub} -> [${clusters.join(', ')}]`);
  }
}
