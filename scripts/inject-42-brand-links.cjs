const fs = require('fs');
const brands = require('./42-brands-list.json');

// Let's read providers/index.md
let content = fs.readFileSync('docs/providers/index.md', 'utf-8');

// Build markdown table for 42 brands
let table = `\n\n---\n\n## 42 家标杆机场独立深度评测报告索引 (42 In-Depth Brand Reviews)\n\n实验室对全球 42 家代表性机场进行了持续性网络压测与审计，点击下方链接可直达各品牌的独立实测报告与节点测速图：\n\n`;

table += `<div class="brand-directory-grid">\n`;
brands.forEach(b => {
  table += `  <a href="/providers/review/${b.slug}" class="brand-directory-item">\n`;
  table += `    <span class="brand-item-name">📄 ${b.title}</span>\n`;
  table += `    <span class="brand-item-link">查看完整实测报告 &rarr;</span>\n`;
  table += `  </a>\n`;
});
table += `</div>\n\n`;

content += table;
fs.writeFileSync('docs/providers/index.md', content, 'utf-8');
console.log('Successfully injected 42 brand review links into docs/providers/index.md');
