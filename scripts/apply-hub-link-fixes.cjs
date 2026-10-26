const fs = require('fs');
const path = require('path');

const fixMap = require('./fix-map.json');

const hubFiles = [
  'docs/index.md',
  'docs/ai-guide/index.md',
  'docs/clients/index.md',
  'docs/demand/index.md',
  'docs/free/index.md',
  'docs/providers/index.md',
  'docs/streaming/index.md',
  'docs/troubleshooting/index.md',
  'docs/work-study/index.md'
];

// Sort entries from longest href to shortest
const sortedEntries = Object.entries(fixMap).sort((a, b) => b[0].length - a[0].length);

let totalReplacements = 0;

hubFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let fileReplacements = 0;
  
  sortedEntries.forEach(([badHref, goodHref]) => {
    // We want to match badHref in markdown links [text](badHref) or href="badHref" or href='badHref'
    // To be safe, do exact string replacement for badHref
    if (content.includes(badHref)) {
      const parts = content.split(badHref);
      const count = parts.length - 1;
      content = parts.join(goodHref);
      fileReplacements += count;
    }
  });
  
  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Updated ${file}: ${fileReplacements} replacements made.`);
  totalReplacements += fileReplacements;
});

console.log(`\nAll done! Total replacements across 9 hubs: ${totalReplacements}`);
