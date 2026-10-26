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
let fixedCount = 0;

allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  let original = content;
  
  // Look for <code> in answer-first-callout that doesn't have closing </code>
  // Specifically: 执行命令 <code>[^\n<]+(\n|\r\n)\s*<\/p>
  content = content.replace(/(执行命令\s*<code>[^<\n\r]+)(?!\s*<\/code>)(\s*<\/p>|\r?\n\s*<\/p>)/g, (match, p1, p2) => {
    return `${p1}</code> 校验连通性；② 在分流策略中确保命中专属代理组；③ 切换至支持原生出口的专线节点。${p2}`;
  });
  
  // Also check any <code> without </code> in the same line or paragraph
  const lines = content.split('\n');
  let modified = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const openCount = (l.match(/<code>/g) || []).length;
    const closeCount = (l.match(/<\/code>/g) || []).length;
    if (openCount > closeCount) {
      // Find unclosed <code>
      if (l.includes('执行命令 <code>') && !l.includes('</code> 校验')) {
        lines[i] = l.replace(/(执行命令\s*<code>[^<\n\r]+)$/, '$1</code> 校验连通性；② 在分流策略中确保命中专属代理组；③ 切换至支持原生出口的专线节点。');
        modified = true;
      } else if (!l.includes('</code>')) {
        lines[i] = l + '</code>';
        modified = true;
      }
    }
  }
  
  if (modified) {
    content = lines.join('\n');
  }
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf-8');
    fixedCount++;
  }
});

console.log('Fixed unclosed <code> tags in', fixedCount, 'files.');
