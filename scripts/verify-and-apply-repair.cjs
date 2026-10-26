const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs');
const brokenHrefs = require('./broken-hrefs.json');

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

// Collect all directories with index.md
const dirIndexSet = new Set();
fileSet.forEach(f => {
  if (f.endsWith('index.md')) {
    dirIndexSet.add(f.replace(/\/index\.md$/, ''));
  }
});

function isValidPath(relUrl) {
  let clean = relUrl.trim().split('#')[0].split('?')[0];
  if (clean.startsWith('/')) clean = clean.slice(1);
  if (clean.endsWith('/')) clean = clean.slice(0, -1);
  
  if (fileSet.has(clean + '.md')) return true;
  if (fileSet.has(clean + '/index.md')) return true;
  if (fileSet.has(clean)) return true;
  if (dirIndexSet.has(clean)) return true;
  return false;
}

const manualSubMap = {
  // Demand
  'demand/academic-access/scholar-portal': 'demand/study-abroad/academic-portal-access',
  'demand/academic-access/paper-download': 'demand/study-abroad/paper-download-network',
  'demand/academic-access': 'demand/study-abroad',
  'demand/developer-network/git-docker-network': 'demand/dev-env/git-docker-network',
  'demand/developer-network/package-manager': 'demand/dev-env/pkg-manager-mirrors',
  'demand/developer-network': 'demand/dev-env',
  'demand/high-risk-privacy/browser-fingerprint': 'demand/high-risk-anonymity/browser-fingerprint-anti',
  'demand/high-risk-privacy/multi-account-sandbox': 'demand/high-risk-anonymity/multi-account-isolation',
  'demand/high-risk-privacy': 'demand/high-risk-anonymity',
  'demand/low-latency-gaming/console-gaming': 'demand/low-latency-gaming/console-online-acc',
  'demand/low-latency-gaming/pc-gaming': 'demand/low-latency-gaming/pc-gaming-network',
  'demand/multi-device-share/home-router': 'demand/multi-device/home-router-config',
  'demand/multi-device-share/soft-router-split': 'demand/multi-device/soft-router-split',
  'demand/multi-device-share': 'demand/multi-device',
  'demand/remote-work/cloud-collab': 'demand/remote-work/cloud-collab-security',
  'demand/remote-work/zoom-latency': 'demand/remote-work/zoom-latency-fix',
  'demand/streaming-entertainment/disney-region': 'demand/video-streaming/disney-account-region',
  'demand/streaming-entertainment/netflix-library': 'demand/video-streaming/netflix-regional-library',
  'demand/streaming-entertainment': 'demand/video-streaming',
  'demand/ai-office/chatgpt-connection': 'demand/ai-office/chatgpt-troubleshooting',
  'demand/ai-office/claude-restrictions': 'demand/ai-office/claude-access-restriction',
  'demand/video-streaming/netflix-regional-unlock': 'demand/video-streaming/netflix-regional-library',
  'demand/video-streaming/disney-plus-region': 'demand/video-streaming/disney-account-region',
  'demand/remote-work/zoom-teams-latency': 'demand/remote-work/zoom-latency-fix',
  'demand/remote-work/cloud-security': 'demand/remote-work/cloud-collab-security',
  'demand/low-latency-gaming/pc-gaming-acc': 'demand/low-latency-gaming/pc-gaming-network',
  'demand/low-latency-gaming/console-gaming-acc': 'demand/low-latency-gaming/console-online-acc',
  'demand/multi-device/home-router-sharing': 'demand/multi-device/home-router-config',
  'demand/dev-env/git-docker-acc': 'demand/dev-env/git-docker-network',
  'demand/high-risk-anonymity/browser-anti-fingerprint': 'demand/high-risk-anonymity/browser-fingerprint-anti',
  'demand/high-risk-anonymity/account-isolation': 'demand/high-risk-anonymity/multi-account-isolation',

  // Work study
  'work-study/remote-meeting/zoom-teams-latency': 'work-study/video-conferencing/zoom-teams-latency',
  'work-study/remote-meeting/meeting-drop-recovery': 'work-study/video-conferencing/meeting-disconnect-fix',
  'work-study/remote-meeting': 'work-study/video-conferencing',
  'work-study/ecommerce-backend/amazon-shopify-network': 'work-study/cross-border-ecommerce/amazon-shopify-network',
  'work-study/ecommerce-backend/anti-association-setup': 'work-study/cross-border-ecommerce/anti-association-config',
  'work-study/ecommerce-backend': 'work-study/cross-border-ecommerce',
  'work-study/google-suite/drive-sync-failure': 'work-study/google-workspace/drive-sync-failure',
  'work-study/google-suite/gmail-slowdown': 'work-study/google-workspace/gmail-intercept-release',
  'work-study/google-suite/gmail-intercept-bypass': 'work-study/google-workspace/gmail-intercept-release',
  'work-study/google-suite': 'work-study/google-workspace',
  'work-study/academic-portal/scholar-unreachable': 'work-study/academic-research/scholar-unreachable',
  'work-study/academic-portal/ieee-download': 'work-study/academic-research/ieee-acm-download',
  'work-study/academic-portal': 'work-study/academic-research',
  'work-study/academic-research/scholar-access': 'work-study/academic-research/scholar-unreachable',
  'work-study/cloud-design-sync/figma-collab-lag': 'work-study/cloud-design/figma-collab-lag',
  'work-study/cloud-design-sync/asset-load-slowdown': 'work-study/cloud-design/asset-load-slowdown',
  'work-study/cloud-design-sync': 'work-study/cloud-design',
  'work-study/cloud-design/asset-loading-speed': 'work-study/cloud-design/asset-load-slowdown',
  'work-study/code-deploy/github-acceleration': 'work-study/code-hosting/github-acceleration',
  'work-study/code-deploy/vercel-env-setup': 'work-study/code-hosting/vercel-env-setup',
  'work-study/code-deploy': 'work-study/code-hosting',
  'work-study/code-hosting/vercel-env-tuning': 'work-study/code-hosting/vercel-env-setup',
  'work-study/multi-device-sync/pc-mobile-sync': 'work-study/multi-device-collab/pc-mobile-sync',
  'work-study/multi-device-sync/tablet-seamless-access': 'work-study/multi-device-collab/tablet-seamless-access',
  'work-study/multi-device-sync': 'work-study/multi-device-collab',
  'work-study/multi-device-collab/pc-mobile-transfer': 'work-study/multi-device-collab/pc-mobile-sync',
  'work-study/remote-security/public-wifi-protection': 'work-study/office-security/public-wifi-protection',
  'work-study/remote-security/transport-encryption-audit': 'work-study/office-security/transport-encryption-audit',
  'work-study/remote-security': 'work-study/office-security',
  'work-study/office-security/data-encryption': 'work-study/office-security/transport-encryption-audit',

  // Troubleshooting
  'troubleshooting/ai-outage/platform-outage-check': 'troubleshooting/ai-unreachable/platform-outage-diagnosis',
  'troubleshooting/ai-outage/local-interception-audit': 'troubleshooting/ai-unreachable/local-firewall-intercept',
  'troubleshooting/ai-outage': 'troubleshooting/ai-unreachable',
  'troubleshooting/video-error/proxy-error-analysis': 'troubleshooting/video-playback-error/proxy-error-code-analysis',
  'troubleshooting/video-error/dns-pollution-fix': 'troubleshooting/video-playback-error/dns-pollution-resolution',
  'troubleshooting/video-error/dns-pollution-resolution': 'troubleshooting/video-playback-error/dns-pollution-resolution',
  'troubleshooting/video-error': 'troubleshooting/video-playback-error',
  'troubleshooting/speed-drop/line-congestion-detection': 'troubleshooting/slow-speed/line-congestion-detection',
  'troubleshooting/speed-drop/node-switch-routing': 'troubleshooting/slow-speed/node-switch-routing-rules',
  'troubleshooting/speed-drop': 'troubleshooting/slow-speed',
  'troubleshooting/slow-speed/node-switching-strategy': 'troubleshooting/slow-speed/node-switch-routing-rules',
  'troubleshooting/split-tunnel-bug/rule-matching-conflict': 'troubleshooting/split-tunnel-failure/rule-matching-conflict',
  'troubleshooting/split-tunnel-bug/dns-leak-webrtc': 'troubleshooting/split-tunnel-failure/dns-leak-webrtc-fix',
  'troubleshooting/split-tunnel-bug': 'troubleshooting/split-tunnel-failure',
  'troubleshooting/routing-failure/dns-leak-detection': 'troubleshooting/split-tunnel-failure/dns-leak-webrtc-fix',
  'troubleshooting/routing-failure/ruleset-disorder': 'troubleshooting/split-tunnel-failure/rule-matching-conflict',
  'troubleshooting/routing-failure': 'troubleshooting/split-tunnel-failure',
  'troubleshooting/sub-import-failure/client-import-syntax-err': 'troubleshooting/sub-connection-failed/client-import-syntax-err',
  'troubleshooting/sub-import-failure/sub-url-fetch-failure': 'troubleshooting/sub-connection-failed/sub-url-fetch-failure',
  'troubleshooting/sub-import-failure': 'troubleshooting/sub-connection-failed',
  'troubleshooting/subscription-error/client-import-error': 'troubleshooting/sub-connection-failed/client-import-syntax-err',
  'troubleshooting/subscription-error/subscription-url-failure': 'troubleshooting/sub-connection-failed/sub-url-fetch-failure',
  'troubleshooting/subscription-error': 'troubleshooting/sub-connection-failed',
  'troubleshooting/system-proxy-bug/windows-loopback-conflict': 'troubleshooting/system-proxy-conflict/windows-loopback-conflict',
  'troubleshooting/system-proxy-bug/mac-network-extension-bug': 'troubleshooting/system-proxy-conflict/mac-network-extension-bug',
  'troubleshooting/system-proxy-bug': 'troubleshooting/system-proxy-conflict',
  'troubleshooting/system-proxy-conflict/mac-network-extension': 'troubleshooting/system-proxy-conflict/mac-network-extension-bug',
  'troubleshooting/system-proxy-conflict/windows-proxy-conflict': 'troubleshooting/system-proxy-conflict/windows-loopback-conflict',
  'troubleshooting/tun-mode-error/route-table-collision': 'troubleshooting/tun-mode-issue/route-table-collision',
  'troubleshooting/tun-mode-error/admin-privilege-elevation': 'troubleshooting/tun-mode-issue/admin-privilege-elevation',
  'troubleshooting/tun-mode-error': 'troubleshooting/tun-mode-issue',
  'troubleshooting/tun-failure/route-table-conflict': 'troubleshooting/tun-mode-issue/route-table-collision',
  'troubleshooting/tun-failure/wintun-privilege': 'troubleshooting/tun-mode-issue/admin-privilege-elevation',
  'troubleshooting/tun-failure': 'troubleshooting/tun-mode-issue',
  'troubleshooting/account-risk-anomaly/frequent-ip-hopping': 'troubleshooting/account-login-anomaly/frequent-ip-hopping',
  'troubleshooting/account-risk-anomaly/browser-cache-fingerprint': 'troubleshooting/account-login-anomaly/browser-cache-fingerprint',
  'troubleshooting/account-risk-anomaly': 'troubleshooting/account-login-anomaly',
  'troubleshooting/login-anomaly/browser-cache-storage': 'troubleshooting/account-login-anomaly/browser-cache-fingerprint',
  'troubleshooting/login-anomaly/frequent-ip-jumping': 'troubleshooting/account-login-anomaly/frequent-ip-hopping',
  'troubleshooting/login-anomaly': 'troubleshooting/account-login-anomaly',

  // Streaming
  'streaming/disney-plus/geo-restriction-bypass': 'streaming/disney/geo-block-removal',
  'streaming/disney-plus/household-sharing-audit': 'streaming/disney/household-sharing-check',
  'streaming/disney-plus/account-sharing-check': 'streaming/disney/household-sharing-check',
  'streaming/disney-plus': 'streaming/disney',
  'streaming/netflix/non-native-ip-error': 'streaming/netflix/non-residential-ip-error',
  'streaming/netflix/4k-bitrate-optimization': 'streaming/netflix/4k-bitrate-stability',
  'streaming/youtube/buffer-acceleration': 'streaming/youtube/buffer-speed-opt',
  'streaming/youtube/live-stutter-mitigation': 'streaming/youtube/live-stutter-solution',
  'streaming/youtube/fast-buffering-tuning': 'streaming/youtube/buffer-speed-opt',
  'streaming/youtube/live-stream-lag-fix': 'streaming/youtube/live-stutter-solution',
  'streaming/tiktok/environment-disguise': 'streaming/tiktok/env-masking-skills',
  'streaming/tiktok/shadowban-audit': 'streaming/tiktok/shadowban-troubleshoot',
  'streaming/hbo-hulu/native-ip-unlock': 'streaming/hbo-hulu/native-unlock-strategy',
  'streaming/hbo-hulu/native-unlock': 'streaming/hbo-hulu/native-unlock-strategy',
  'streaming/hbo-hulu/proxy-detection-mitigation': 'streaming/hbo-hulu/proxy-detection-bypass',
  'streaming/tv-devices/apple-tv-clash-config': 'streaming/tv-devices/apple-tv-clash',
  'streaming/tv-devices/android-tv-box-setup': 'streaming/tv-devices/android-tv-box',
  'streaming/tv-setup/android-tv-config': 'streaming/tv-devices/android-tv-box',
  'streaming/tv-setup/apple-tv-config': 'streaming/tv-devices/apple-tv-clash',
  'streaming/tv-setup': 'streaming/tv-devices',
  'streaming/bandwidth-calc/resolution-usage-calc': 'streaming/bandwidth-calc/resolution-data-usage',
  'streaming/bandwidth-calc/peak-throttle-countermeasures': 'streaming/bandwidth-calc/peak-throttle-counter',
  'streaming/traffic-calc/bitrate-traffic-calc': 'streaming/bandwidth-calc/resolution-data-usage',
  'streaming/traffic-calc/evening-peak-throttling': 'streaming/bandwidth-calc/peak-throttle-counter',
  'streaming/traffic-calc': 'streaming/bandwidth-calc',
  'streaming/speed-unlock/speedtest-standard': 'streaming/speed-unlock/speedtest-methodology',
  'streaming/speed-unlock/unlock-benchmark': 'streaming/speed-unlock/unlock-ability-benchmark',
  'streaming/streaming-providers/bandwidth-speedtest': 'streaming/speed-unlock/speedtest-methodology',
  'streaming/streaming-providers/unlock-capability-test': 'streaming/speed-unlock/unlock-ability-benchmark',
  'streaming/streaming-providers': 'streaming/speed-unlock',

  // Providers
  'providers/backup-redundancy/anti-exit-scam-strategy': 'providers/failover-backup/anti-exit-scam-strategy',
  'providers/backup-redundancy/multi-protocol-redundancy': 'providers/failover-backup/multi-protocol-redundancy',
  'providers/backup-redundancy': 'providers/failover-backup',
  'providers/ai-dedicated/supported-platforms': 'providers/ai-dedicated/supported-platforms-list',
  'providers/ai-dedicated/ip-purity-audit': 'providers/ai-dedicated/ip-purity-benchmark',
  'providers/streaming-dedicated/big-bandwidth-speedtest': 'providers/streaming-dedicated/high-bandwidth-speedtest',
  'providers/streaming-dedicated/full-unlock-nodes-list': 'providers/streaming-dedicated/full-unlock-nodes',
  'providers/office-stable/sla-commitment': 'providers/office-stable/sla-promise-compare',
  'providers/office-stable/customer-support-speed': 'providers/office-stable/support-response-time',
  'providers/office-stable/customer-service-speed': 'providers/office-stable/support-response-time',
  'providers/dedicated-iplc/dedicated-bandwidth-advantage': 'providers/iplc-iepl/dedicated-bandwidth-edge',
  'providers/dedicated-iplc/iplc-iepl-difference': 'providers/iplc-iepl/iplc-iepl-difference',
  'providers/dedicated-iplc': 'providers/iplc-iepl',
  'providers/iplc-iepl/iplc-iepl-technical-diff': 'providers/iplc-iepl/iplc-iepl-difference',
  'providers/iplc-iepl/dedicated-bandwidth-advantage': 'providers/iplc-iepl/dedicated-bandwidth-edge',
  'providers/extreme-value/annual-discount-calc': 'providers/budget-value/annual-discount-analysis',
  'providers/extreme-value/low-monthly-plans': 'providers/budget-value/low-monthly-plans',
  'providers/extreme-value': 'providers/budget-value',
  'providers/budget-value/low-monthly-fee': 'providers/budget-value/low-monthly-plans',
  'providers/budget-value/annual-discount-strategy': 'providers/budget-value/annual-discount-analysis',
  'providers/beginner-friendly/zero-friction-setup': 'providers/beginner-friendly/hassle-free-setup',
  'providers/beginner-friendly/one-click-client-support': 'providers/beginner-friendly/one-click-client',
  'providers/beginner-friendly/hassle-free-subscription': 'providers/beginner-friendly/hassle-free-setup',
  'providers/provider-landscape/brand-history': 'providers/brands-comparison/history-background-matrix',
  'providers/provider-landscape/scam-prevention-guide': 'providers/brands-comparison/pitfall-avoidance-guide',
  'providers/provider-landscape': 'providers/brands-comparison',
  'providers/brands-comparison/pitfall-avoidance-checklist': 'providers/brands-comparison/pitfall-avoidance-guide',
  'providers/brands-comparison/brand-history-matrix': 'providers/brands-comparison/history-background-matrix',

  // Free
  'free/free-risks/privacy-leak-risk': 'free/security-risks/privacy-leak-risks',
  'free/free-risks/phishing-link-identification': 'free/security-risks/phishing-link-id',
  'free/free-risks': 'free/security-risks',
  'free/budget-alternatives/one-yuan-plans': 'free/cheap-alternatives/one-yuan-starter-plans',
  'free/budget-alternatives/lightweight-traffic-pack': 'free/cheap-alternatives/lightweight-traffic-pack',
  'free/budget-alternatives': 'free/cheap-alternatives',
  'free/config-cleanup/account-deregistration': 'free/cleanup-exit/account-cancellation',
  'free/config-cleanup/device-cleanup': 'free/cleanup-exit/device-cache-cleanup',
  'free/config-cleanup': 'free/cleanup-exit',
  'free/emergency-backup/opensource-nodes': 'free/emergency-backup/open-source-node-rescue',
  'free/emergency-backup/web-proxy': 'free/emergency-backup/web-proxy-emergency',
  'free/emergency-nodes/open-source-node-rescue': 'free/emergency-backup/open-source-node-rescue',
  'free/emergency-nodes/web-proxy-emergency': 'free/emergency-backup/web-proxy-emergency',
  'free/emergency-nodes': 'free/emergency-backup',
  'free/resource-types/commercial-trial': 'free/resource-types/commercial-free-trials',
  'free/resource-types/public-opensource': 'free/resource-types/public-opensource-nodes',
  'free/resource-types/commercial-trials': 'free/resource-types/commercial-free-trials',
  'free/resource-types/public-nodes': 'free/resource-types/public-opensource-nodes',
  'free/speed-verification/actual-availability-rate': 'free/speed-test/actual-availability-rate',
  'free/speed-verification/evening-peak-performance': 'free/speed-test/evening-peak-performance',
  'free/speed-verification': 'free/speed-test',
  'free/speed-test/actual-availability': 'free/speed-test/actual-availability-rate',
  'free/speed-test/evening-peak-test': 'free/speed-test/evening-peak-performance',
  'free/trial-conditions/payment-binding-trap': 'free/trial-conditions/payment-binding-pitfalls',
  'free/trial-conditions/traffic-limit-terms': 'free/trial-conditions/data-cap-limitations',
  'free/trial-conditions/data-cap-limit': 'free/trial-conditions/data-cap-limitations',
  'free/trial-conditions/payment-binding-pitfall': 'free/trial-conditions/payment-binding-pitfalls',
  'free/upgrade-timing/demand-upgrade-moment': 'free/upgrade-timing/demand-upgrade-milestones',
  'free/upgrade-timing/stability-tiering': 'free/upgrade-timing/stable-selection-checklist',
  'free/upgrade-timing/demand-milestones': 'free/upgrade-timing/demand-upgrade-milestones',
  'free/cleanup-exit/account-cancel': 'free/cleanup-exit/account-cancellation',
  'free/cleanup-exit/device-cache-clean': 'free/cleanup-exit/device-cache-cleanup',

  // Clients
  'clients/advanced-routing/custom-ruleset': 'clients/advanced-rules/custom-geosite-rules',
  'clients/advanced-routing/tun-mode-deep-dive': 'clients/advanced-rules/tun-virtual-adapter-deep',
  'clients/advanced-routing': 'clients/advanced-rules',
  'clients/android/sing-box-android': 'clients/android/singbox-android-routing',
  'clients/backup-migration/ruleset-recovery': 'clients/backup-migration/sub-backup-recovery',
  'clients/developer/git-proxy-setup': 'clients/dev-cli/git-ssh-http-proxy',
  'clients/developer/terminal-cli-proxy': 'clients/dev-cli/terminal-bash-zsh-proxy',
  'clients/developer': 'clients/dev-cli',
  'clients/router/merlin-asus': 'clients/router/asus-merlin-clash',
  'clients/router/openwrt-soft-router': 'clients/router/openwrt-passwall-openclash',
  'clients/windows/clash-verge-rev': 'clients/windows/clash-verge-rev-win',
  'clients/windows/v2rayn': 'clients/windows/v2rayn-core-setup',
  'clients/mac/clashx-meta': 'clients/mac/clashx-meta-config',
  'clients/mac/surge': 'clients/mac/surge-mac-advanced',
  'clients/ios/shadowrocket': 'clients/ios/shadowrocket-rule-install',
  'clients/ios/quantumult-x': 'clients/ios/quantumult-x-rewrite',
  'clients/android/sing-box': 'clients/android/singbox-android-routing',
  'clients/android/flclash-v2rayng': 'clients/android/flclash-v2rayng-mobile',
  'clients/router/openwrt-passwall': 'clients/router/openwrt-passwall-openclash',
  'clients/router/merlin-clash': 'clients/router/asus-merlin-clash',
  'clients/dev-cli/git-ssh-proxy': 'clients/dev-cli/git-ssh-http-proxy',
  'clients/dev-cli/terminal-env-proxy': 'clients/dev-cli/terminal-bash-zsh-proxy',
  'clients/advanced-rules/custom-geosite': 'clients/advanced-rules/custom-geosite-rules',
  'clients/advanced-rules/tun-mode-setup': 'clients/advanced-rules/tun-virtual-adapter-deep',
  'clients/backup-migration/subscription-backup': 'clients/backup-migration/sub-backup-recovery',
  'clients/backup-migration/cross-device-sync': 'clients/backup-migration/rule-sync-across-devices',

  // AI Guide
  'ai-guide/ai-comparison/network-environment-comparison': 'ai-guide/tools-comparison/network-env-matrix',
  'ai-guide/ai-comparison/platform-requirements': 'ai-guide/tools-comparison/platform-req-compare',
  'ai-guide/ai-comparison': 'ai-guide/tools-comparison',
  'ai-guide/ai-risk-control/ip-purity-fraud-score': 'ai-guide/account-risk/ip-purity-detection',
  'ai-guide/ai-risk-control/registration-environment': 'ai-guide/account-risk/reg-env-building',
  'ai-guide/ai-risk-control': 'ai-guide/account-risk',
  'ai-guide/ai-workflow/multi-tool-switching': 'ai-guide/workflow-opt/multi-tool-switching',
  'ai-guide/ai-workflow/stable-concurrency-tuning': 'ai-guide/workflow-opt/stable-concurrency-opt',
  'ai-guide/ai-workflow': 'ai-guide/workflow-opt',
  'ai-guide/chatgpt/api-timeout': 'ai-guide/chatgpt/api-timeout-retry',
  'ai-guide/claude/region-unavailable': 'ai-guide/claude/region-unsupported-error',
  'ai-guide/gemini/node-requirements': 'ai-guide/gemini/node-location-req',
  'ai-guide/gemini/account-eligibility': 'ai-guide/gemini/account-access-obtain',
  'ai-guide/ai-coding/cursor-network-config': 'ai-guide/ai-coding/cursor-network-setup',
  'ai-guide/ai-coding/copilot-connection-failure': 'ai-guide/ai-coding/copilot-connect-issue',
  'ai-guide/multimodal-ai/voice-latency-optimization': 'ai-guide/multimodal-ai/voice-chat-latency',
  'ai-guide/multimodal-ai/image-upload-optimization': 'ai-guide/multimodal-ai/image-upload-network',
  'ai-guide/tools-comparison/network-matrix': 'ai-guide/tools-comparison/network-env-matrix',
  'ai-guide/tools-comparison/platform-requirements': 'ai-guide/tools-comparison/platform-req-compare',
  'ai-guide/account-risk/ip-purity-audit': 'ai-guide/account-risk/ip-purity-detection',
  'ai-guide/account-risk/registration-env': 'ai-guide/account-risk/reg-env-building',
  'ai-guide/workflow-opt/stable-concurrency': 'ai-guide/workflow-opt/stable-concurrency-opt',
  'ai-guide/workflow-opt/tool-switching': 'ai-guide/workflow-opt/multi-tool-switching'
};

function resolveHref(rawHref) {
  let clean = rawHref.trim().replace(/^\//, '').replace(/\/$/, '');
  
  // Sort keys from longest to shortest
  const sortedEntries = Object.entries(manualSubMap).sort((a, b) => b[0].length - a[0].length);
  
  for (const [bad, good] of sortedEntries) {
    if (clean === bad) {
      return `/${good}/`;
    }
    if (clean.startsWith(bad + '/')) {
      const rest = clean.slice(bad.length + 1);
      const goodCluster = good.split('/').pop();
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
      const s = suffixes.find(suf => rest.endsWith(suf));
      if (s) {
        return `/${good}/${goodCluster}-${s}`;
      } else {
        return `/${good}/${rest}`;
      }
    }
  }
  
  return null;
}

// Test against all broken hrefs
let resolvedCount = 0;
let unresolved = [];
const fixMap = {};

brokenHrefs.forEach(href => {
  const rep = resolveHref(href);
  if (rep && isValidPath(rep)) {
    resolvedCount++;
    fixMap[href] = rep;
  } else {
    unresolved.push({ href, rep, valid: rep ? isValidPath(rep) : false });
  }
});

console.log(`Resolved: ${resolvedCount} / ${brokenHrefs.length}`);
if (unresolved.length > 0) {
  console.log(`Unresolved (${unresolved.length}):`);
  unresolved.forEach(u => console.log('  ', u));
}

fs.writeFileSync('scripts/fix-map.json', JSON.stringify(fixMap, null, 2));
