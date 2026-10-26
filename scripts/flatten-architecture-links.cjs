const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs');
const clusters = require('./all-128-clusters.json');

// Group clusters by subcategory relPath: e.g. 'ai-guide/chatgpt'
const subGroups = {};
clusters.forEach(c => {
  const subKey = `${c.section}/${c.sub}`;
  if (!subGroups[subKey]) subGroups[subKey] = [];
  subGroups[subKey].push(c);
});

console.log('Total subcategories to update:', Object.keys(subGroups).length);

const suffixIcons = {
  'quickstart-emergency-fix': '⚡ 应急快速排障',
  'residential-isp-ip-fraud-score-audit': '🛡️ 住宅IP欺诈分审计',
  'evening-peak-qos-throttle-mitigation': '🚀 晚高峰QoS限速调优',
  'cross-platform-pc-mobile-router-collab': '📱 全平台多端协同部署',
  'security-privacy-anti-association-blueprint': '🔒 隐私安全防关联沙盒',
  'tun-virtual-adapter-dns-leak-prevention': '🌐 TUN虚拟网卡与DNS防泄露',
  'vless-reality-hysteria2-tuning-rules': '⚙️ VLESS/Hysteria2协议实操',
  'wireshark-tcp-handshake-log-analysis': '🔍 Wireshark抓包排障取证'
};

let updatedSubCount = 0;

for (const [subKey, clusterList] of Object.entries(subGroups)) {
  const subIndexPath = path.join(docsDir, subKey, 'index.md');
  if (!fs.existsSync(subIndexPath)) continue;
  
  let content = fs.readFileSync(subIndexPath, 'utf-8');
  
  // Build a rich direct navigation section
  let deepNavSection = `\n\n---\n\n## 专题下辖实战长文全景直达 (Crawl Depth 3 Flattened Index)\n\n为确保快速获取最定向的实操指南，以下为本专题下辖两大核心技术集群全部 16 篇深度实操手册直达入口：\n\n`;
  
  clusterList.forEach(c => {
    const clusterDir = path.join(docsDir, c.relPath);
    if (!fs.existsSync(clusterDir)) return;
    const articles = fs.readdirSync(clusterDir).filter(f => f.endsWith('.md') && f !== 'index.md');
    
    deepNavSection += `### 📂 集群：${c.cluster}\n\n`;
    deepNavSection += `<div class="sub-article-grid">\n`;
    
    articles.forEach(art => {
      const artSlug = art.replace('.md', '');
      let label = artSlug;
      for (const [suf, title] of Object.entries(suffixIcons)) {
        if (artSlug.endsWith(suf)) {
          label = title;
          break;
        }
      }
      deepNavSection += `  <a href="/${c.relPath}/${artSlug}" class="sub-article-card">\n`;
      deepNavSection += `    <span class="sub-art-title">${label}</span>\n`;
      deepNavSection += `    <span class="sub-art-arrow">&rarr;</span>\n`;
      deepNavSection += `  </a>\n`;
    });
    
    deepNavSection += `</div>\n\n`;
  });
  
  // Remove any previously injected flattened index
  content = content.replace(/\n\n---\n\n## 专题下辖实战长文全景直达[\s\S]*$/, '');
  
  content += deepNavSection;
  fs.writeFileSync(subIndexPath, content, 'utf-8');
  updatedSubCount++;
}

console.log(`Successfully flattened internal link architecture across ${updatedSubCount} subcategory index pages.`);
