const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs');
const clusters = require('./all-128-clusters.json');
const brokenHrefs = require('./broken-hrefs.json');

// Build lookup tables
// 1. By section and subcategory keywords
// 2. Real cluster paths: e.g. 'ai-guide/chatgpt/api-timeout-retry'
const allRealClusters = clusters.map(c => c.relPath);

// Function to find best matching real path for any href
function findBestMatch(rawHref) {
  let clean = rawHref.trim().replace(/^\//, '').replace(/\/$/, '');
  const parts = clean.split('/');
  const sec = parts[0];
  
  // Case A: 1 part (e.g. 'work-study' -> '/work-study/')
  // Case B: 2 parts: sec/sub (e.g. 'work-study/remote-meeting')
  // Case C: 3 parts: sec/sub/cluster (e.g. 'work-study/remote-meeting/zoom-teams-latency')
  // Case D: 4 parts: sec/sub/cluster/article (e.g. 'work-study/remote-meeting/zoom-teams-latency/zoom-teams-latency-quickstart-emergency-fix')
  
  // Find which of the 128 clusters matches best
  let bestCluster = null;
  let bestScore = -1;
  
  // First filter clusters by sec if sec matches
  let candidateClusters = clusters.filter(c => c.section === sec);
  if (candidateClusters.length === 0) candidateClusters = clusters;
  
  // Score candidates
  candidateClusters.forEach(c => {
    let score = 0;
    // check subcategory similarity
    if (clean.includes(c.sub)) score += 10;
    else {
      // keyword overlap in sub
      c.sub.split('-').forEach(w => {
        if (clean.includes(w)) score += 3;
      });
    }
    
    // check cluster similarity
    if (clean.includes(c.cluster)) score += 20;
    else {
      c.cluster.split('-').forEach(w => {
        if (clean.includes(w)) score += 5;
      });
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestCluster = c;
    }
  });
  
  if (!bestCluster) return null;
  
  if (parts.length === 2) {
    // It was targeting a subcategory!
    // Let's find best subcategory
    let bestSub = bestCluster.sub;
    return `/${bestCluster.section}/${bestSub}/`;
  } else if (parts.length === 3) {
    // Target was a cluster index!
    return `/${bestCluster.relPath}/`;
  } else if (parts.length >= 4) {
    // Target was an article!
    // Extract the suffix
    const rawArticle = parts[parts.length - 1];
    // Find which of the 8 suffixes
    const suffixes = [
      'quickstart-emergency-fix',
      'residential-isp-ip-fraud-score-audit',
      'evening-peak-qos-throttle-mitigation',
      'cross-platform-pc-mobile-router-collab',
      'security-privacy-anti-association-blueprint',
      'tun-virtual-adapter-dns-leak-prevention',
      'vless-reality-hysteria2-tuning-rules',
      'wireshark-tcp-handshake-log-analysis'
    ];
    
    let matchedSuffix = suffixes.find(s => rawArticle.endsWith(s));
    if (!matchedSuffix) {
      // try partial
      matchedSuffix = suffixes[0];
    }
    return `/${bestCluster.relPath}/${bestCluster.cluster}-${matchedSuffix}`;
  }
  
  return null;
}

const replacementMap = {};
brokenHrefs.forEach(href => {
  const match = findBestMatch(href);
  replacementMap[href] = match;
});

console.log('Sample replacements:');
Object.entries(replacementMap).slice(0, 25).forEach(([orig, rep]) => {
  console.log(`  ${orig}\n    -> ${rep}\n`);
});
