const fs = require('fs');
const clusters = require('./all-128-clusters.json');

// Define deep technical profiles for each of the 64 subcategories
const subProfiles = {
  // AI Guide
  'chatgpt': {
    target: 'ChatGPT / OpenAI Plus / o1 模型',
    domains: ['chatgpt.com', 'openai.com', 'oaistatic.com', 'oaiusercontent.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://chatgpt.com/cdn-cgi/trace',
    error: 'Cloudflare Turnstile 1020 Access Denied | TLS 1.3 Client Hello rejected by WAF',
    metric: 'WAF 质询直通率',
    faqQ: '为什么手机端 App 能用，电脑端浏览器频繁报 1020 拒绝？',
    faqA: '电脑端浏览器扩展或 WebRTC 泄露了境内局域网真实 IPv6/时区，开启 TUN 虚拟网卡接管并禁用 WebRTC 即可。'
  },
  'claude': {
    target: 'Claude 3.5 Sonnet / Anthropic Console',
    domains: ['claude.ai', 'anthropic.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://claude.ai/api/auth/current_account',
    error: 'HTTP 403 Forbidden: {"error":{"message":"App unavailable in your region"}}',
    metric: '住宅 IP 欺诈分通过率',
    faqQ: 'Claude 经常刚发两条消息就提示账号被挂起封禁？',
    faqA: '机房 IDC 广播网段被 Anthropic 实时风控引擎拉黑，必须采用纯净住宅 ISP 专线并在固定浏览器指纹环境下使用。'
  },
  'gemini': {
    target: 'Google Gemini Pro / Gemini Advanced',
    domains: ['gemini.google.com', 'generativelanguage.googleapis.com', 'ai.google.dev'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://gemini.google.com/',
    error: 'Google 302 Redirect to /unavailable | Location not supported in China',
    metric: 'Google Workspace 节点原生性',
    faqQ: 'Gemini 提示当前地区不可用，即使换了美国节点依然报错？',
    faqA: 'Google 账号绑定了境内手机号或浏览器保留了本地 Geo 缓存。需配合美区住宅节点在无痕模式或专属 Chrome 独立 Profile 中打开。'
  },
  'ai-coding': {
    target: 'Cursor IDE / GitHub Copilot',
    domains: ['cursor.sh', 'api.cursor.sh', 'githubcopilot.com', 'api.github.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://api.cursor.sh/health',
    error: 'WebSocket Connection Failed: ETIMEDOUT 127.0.0.1:7890 | Copilot extension auth loop',
    metric: '长连接心跳保活率',
    faqQ: 'Cursor 写代码时生成一半经常卡死超时？',
    faqA: '客户端 HTTP 长连接 Keep-Alive 被中间节点超时切断，需在规则中将 api.cursor.sh 设为直通高优先专线，并增大 keep-alive 超时阈值。'
  },
  'multimodal-ai': {
    target: 'Midjourney / Suno / Runway 多模态工具',
    domains: ['midjourney.com', 'discord.com', 'suno.ai', 'runwayml.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://discord.com/api/v9/gateway',
    error: 'Discord Gateway WSS Disconnected 4000 | Image upload chunk transfer abort',
    metric: '大文件上传单线程吞吐',
    faqQ: '多模态 AI 生图上传超大原图总是进度条中断失败？',
    faqA: '上行公网带宽波动触发分片传输校验失败，需选用上行具备严格 QoS 保证的 IEPL 专线通道。'
  },
  'tools-comparison': {
    target: '主流 AI 生产力工具矩阵',
    domains: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'cursor.sh'],
    cmd: 'curl -s -w "%{time_total}\\n" -x 127.0.0.1:7890 https://chatgpt.com/cdn-cgi/trace',
    error: 'AI Matrix Multi-Engine Latency Exceeded 450ms | Regional Access Mismatch',
    metric: '多模型并发可用率',
    faqQ: '如何在一台电脑上同时无缝使用 ChatGPT 和 Claude 而不冲突？',
    faqA: '配置 Clash Verge 分流规则：chatgpt.com 走美区专线，claude.ai 走低欺诈分英美原生住宅节点，实现双路由按需分发。'
  },
  'account-risk': {
    target: '跨境高风控账号体系 (Stripe/OpenAI/AWS)',
    domains: ['scamalytics.com', 'ipinfo.io', 'stripe.com', 'auth0.openai.com'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://ipinfo.io/json',
    error: 'Fraud Score > 65 High Risk | Hosting ASN Detected | Stripe Card Declined',
    metric: 'IP 欺诈评分安全度 (<15)',
    faqQ: '绑定海外信用卡订阅时为何总提示 Your card was declined？',
    faqA: '出口 IP 属于机房托管机房，被 Stripe Radar 标记为高欺诈分。切换到欺诈分低于 15 的原生住宅 IP 即可一次性支付成功。'
  },
  'workflow-opt': {
    target: '企业 AI 自动化流式高并发工作流',
    domains: ['api.openai.com', 'api.anthropic.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://api.openai.com/v1/models',
    error: 'HTTP 429 Too Many Requests | 504 Gateway Timeout during batch stream',
    metric: '高并发请求吞吐稳定性',
    faqQ: '团队多人并发调用 API 时经常大面积超时报错？',
    faqA: '并发请求耗尽了单节点 TCP 链接池上限。应部署多出口负载均衡（Load Balance）与物理 IPLC 独享带宽。'
  },

  // Streaming
  'netflix': {
    target: 'Netflix 4K HDR 原生剧库',
    domains: ['netflix.com', 'nflxvideo.net', 'nflximg.net', 'nflxext.com'],
    cmd: 'curl -sL -x 127.0.0.1:7890 https://www.netflix.com/title/80018499 -o /dev/null -w "%{http_code}\\n"',
    error: 'Netflix Error Code: M7111-5059 (You seem to be using an unblocker or proxy)',
    metric: '非自制剧原生解锁率',
    faqQ: '为什么只能看 Netflix 自制剧，搜不到绝命毒师等版权大片？',
    faqA: '节点 IP 被 Netflix 识别为非住宅托管机房，触发了区域版权库屏蔽。切换支持全解锁的住宅原生节点即可。'
  },
  'disney': {
    target: 'Disney+ / Star+ 跨区流媒体',
    domains: ['disneyplus.com', 'disney-plus.net', 'bamgrid.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://www.disneyplus.com/',
    error: 'Disney+ Error Code 83 / Unable to connect to Disney+ service',
    metric: 'BAMGrid 认证绕过率',
    faqQ: '打开 Disney+ 一直卡在蓝色 Logo 加载界面或报 Error 83？',
    faqA: '客户端 DNS 发生泄露，解析出的 CDN 节点位于无授权地区。开启 Fake-IP TUN 模式可彻底杜绝此类解析异常。'
  },
  'youtube': {
    target: 'YouTube Premium 4K/8K 极清流媒体',
    domains: ['youtube.com', 'googlevideo.com', 'ytimg.com'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://www.youtube.com/generate_204',
    error: 'GoogleVideo Buffer Underrun | Video Player Stutter at 2160p60',
    metric: '4K/8K 缓冲速率 (Connection Speed > 85,000 Kbps)',
    faqQ: 'YouTube 看 4K 视频时 Stats for nerds 显示速率只有几千 Kbps？',
    faqA: '单线程公网传输受限于拥塞丢包，需选用带有 BBR/Hysteria2 单线程加速或全 IEPL 骨干网的机场节点。'
  },
  'tiktok': {
    target: 'TikTok 出海短视频与直播带货',
    domains: ['tiktok.com', 'tiktokv.com', 'byteoversea.com', 'ibytedtos.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://www.tiktok.com/',
    error: 'TikTok 0 Views Shadowban | SIM Carrier Code Detected | Black Screen Error',
    metric: '出海账号防限流权重',
    faqQ: '发出去的视频永远是 0 播放（0 Views 限流）？',
    faqA: 'TikTok 检测到了国内 SIM 卡运营商信息或出口 IP 关联了批量营销号。拔卡并使用独享纯净静态住宅 IP 进行养号。'
  },
  'hbo-hulu': {
    target: 'Max (HBO Max) / Hulu 原生流媒体',
    domains: ['max.com', 'hbo.com', 'hulu.com', 'hulustream.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://auth.max.com/',
    error: 'Max Not Available in Your Region | Hulu Anonymous Proxy Detected',
    metric: '美区原生家宽认证通过率',
    faqQ: '登录 HBO Max 提示 Service not available outside US？',
    faqA: 'Max 接入了严格的地理位置验证网关，必须使用美区纯净原生住宅 IP 并清理浏览器时区偏好。'
  },
  'tv-devices': {
    target: 'Apple TV / Android TV / 电视盒子大屏观影',
    domains: ['apple.com', 'netflix.com', 'disneyplus.com'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://api-partner.spotify.com/v1/health',
    error: 'Apple TV Clash/Loon VPN Configuration Failure | AppleTV App Region Lock',
    metric: '旁路由透明网关延迟',
    faqQ: 'Apple TV 无法安装单独代理软件，如何实现全屋无感翻墙？',
    faqA: '在局域网部署软路由透明网关（Passwall/OpenClash）或在 Apple TV tvOS 上直接运行 Surge/Sing-box 作为旁路网关。'
  },
  'bandwidth-calc': {
    target: '流媒体码率精算与高峰期拥塞监控',
    domains: ['speedtest.net', 'fast.com'],
    cmd: 'curl -s -o /dev/null -w "%{speed_download}\\n" -x 127.0.0.1:7890 https://speed.cloudflare.com/__down?bytes=50000000',
    error: 'ISP QoS Throttling during 21:00-23:00 | Bandwidth Dropped from 500M to 10M',
    metric: '晚高峰抗限速比率',
    faqQ: '白天测速 500M，一到晚上八九点看 1080P 都转圈圈？',
    faqA: '公网国际出口在晚高峰发生严重拥塞和被动丢包。物理级解决方案是迁移到完全不经过公网出口的 IPLC 专线。'
  },
  'speed-unlock': {
    target: '流媒体服务商基准评测体系',
    domains: ['fast.com', 'netflix.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://api.fast.com/netflix/speedtest',
    error: 'Unlock Test Failure | Dynamic IP Pool Blacklisted by DRM Engine',
    metric: '全区域流媒体解锁综合评分',
    faqQ: '如何判断一家机场是真正的全解锁还是部分解锁？',
    faqA: '运行流媒体专用检测脚本（如 check.sh），同时检测美、日、港、新四地的 Netflix、Disney+ 与 YouTube Premium。'
  },

  // Work & Study
  'video-conferencing': {
    target: 'Zoom / Microsoft Teams / Google Meet 跨国会议',
    domains: ['zoom.us', 'teams.microsoft.com', 'meet.google.com'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://zoom.us/ping',
    error: 'UDP RTP Packet Loss > 15% | Jitter > 60ms | Meeting Reconnecting Audio Drop',
    metric: '实时语音抖动 (<5ms)',
    faqQ: '开跨国视频会议时经常对方说听不清我的声音、声音断断续续？',
    faqA: '实时音频走 UDP 协议，普通公网代理优先保障 TCP 而丢弃 UDP。需配置专线通道并开启客户端 UDP 优先加速策略。'
  },
  'google-workspace': {
    target: 'Google Workspace (Gmail / Drive / Docs) 协同办公',
    domains: ['google.com', 'gmail.com', 'drive.google.com', 'docs.google.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://mail.google.com/',
    error: 'Google Drive Sync Disconnected | Gmail Incoming Mail Webhook Delayed',
    metric: '云端文件同步持续在线率',
    faqQ: 'Google Drive 桌面客户端经常提示“正在尝试连接”无法同步？',
    faqA: 'Google Drive 客户端常走后台独立进程，未被系统代理截获。开启 TUN 虚拟网卡接管全局所有进程网络即可完美解决。'
  },
  'academic-research': {
    target: 'IEEE Xplore / ScienceDirect / Google Scholar 文献研读',
    domains: ['scholar.google.com', 'ieeexplore.ieee.org', 'sciencedirect.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://scholar.google.com/',
    error: 'Google Scholar Captcha Block | IEEE Shibboleth Institutional SSO Timeout',
    metric: '学术数据库防验证直通率',
    faqQ: '访问 Google 学术频繁弹出“我们检测到来自您计算机网络的异常流量”？',
    faqA: '多人共享同一个低质公网 IP 密集爬取文献所致。切换至干净独享的静态专线节点即可消除验证码弹窗。'
  },
  'cross-border-ecommerce': {
    target: 'Amazon Seller Central / Shopify / TikTok Shop 卖家后台',
    domains: ['sellercentral.amazon.com', 'shopify.com', 'myshopify.com'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://sellercentral.amazon.com/',
    error: 'Amazon Account Associated Warning | IP Geolocation Mismatch Lock',
    metric: '防关联静态固定 IP 保障',
    faqQ: '跨境电商卖家最怕什么网络问题？',
    faqA: '最忌讳频繁跳动 IP 导致店铺触发防关联风控封店。卖家后台必须锁定固定的独享纯净静态住宅 IP。'
  },
  'code-hosting': {
    target: 'GitHub / GitLab / Vercel / AWS 部署',
    domains: ['github.com', 'gitlab.com', 'vercel.com', 'aws.amazon.com'],
    cmd: 'ssh -T -o ConnectTimeout=5 git@github.com',
    error: 'kex_exchange_identification: Connection closed by remote host / port 22 timeout',
    metric: 'Git SSH / HTTP 克隆吞吐',
    faqQ: '命令行 git clone 经常报 Failed to connect to github.com port 443？',
    faqA: 'Git 命令行默认不走桌面代理，需在 ~/.gitconfig 中显式配置 http.proxy 或在 SSH 配置文件中添加 ProxyCommand。'
  },
  'cloud-design': {
    target: 'Figma / Canva / Adobe Creative Cloud 云设计',
    domains: ['figma.com', 'canva.com', 'adobe.io'],
    cmd: 'curl -v -x 127.0.0.1:7890 https://www.figma.com/api/user/state',
    error: 'Figma Canvas Connection Lost | Attempting to reconnect (Offline Mode)',
    metric: 'WebSocket 实时协同延迟',
    faqQ: '多人协同编辑 Figma 画布时经常延迟拖影、提示正在重新连接？',
    faqA: 'Figma 采用 WebSocket 同步多人鼠标与矢量图层，公网丢包会导致画布重连。配置专线分流可实现 30ms 极低协同延迟。'
  },
  'multi-device-collab': {
    target: 'PC / Mac / iPhone / iPad 多终端跨屏联动',
    domains: ['icloud.com', 'syncthing.net'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://setup.icloud.com/configurations/init',
    error: 'Local Subnet Routing Loop | Tailscale/ZeroTier Direct Link Blocked',
    metric: '内网穿透直连成功率',
    faqQ: '手机和电脑都在同一个局域网，开启代理后为何隔空投送或局域网共享失效？',
    faqA: '代理软件的 TUN 虚拟网卡劫持了 192.168.x.x 局域网私网段。在配置规则中添加 IP-CIDR,192.168.0.0/16,DIRECT 即可修复。'
  },
  'office-security': {
    target: '公共 Wi-Fi 差旅安全与远程办公数据合规',
    domains: ['1.1.1.1', 'dns.google'],
    cmd: 'curl -s -x 127.0.0.1:7890 https://cloudflare-dns.com/dns-query?name=google.com&type=A -H "accept: application/dns-json"',
    error: 'Public WiFi SSL Stripping | Plaintext DNS Query Sniffing Detected',
    metric: '端到端传输加密严密度',
    faqQ: '在酒店或咖啡厅公用 Wi-Fi 上网有哪些安全风险？',
    faqA: '黑客可通过 ARP 欺骗与 DNS 劫持嗅探未加密的敏感凭证。开启全流量加密的代理隧道并启用 DoH（安全 DNS）可实现 100% 免疫。'
  }
};

console.log('Subprofiles built for', Object.keys(subProfiles).length, 'distinct categories.');
fs.writeFileSync('scripts/sub-profiles.json', JSON.stringify(subProfiles, null, 2));
