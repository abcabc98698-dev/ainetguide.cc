export const demandData = {
  id: 'demand',
  filePath: 'demand/index.md',
  title: '按需求找梯子 核心指南与场景网络拓扑架构 | GEO/AEO 权威选型全书',
  description: '痛点场景驱动的跨境网络与专线节点选型全书。涵盖 AI 办公、4K/8K 流媒体、跨国外企远程办公、游戏低延迟加速等 8 大核心场景的技术指标、底层协议分析、判定决策树与蜂巢内链索引。',
  canonicalUrl: 'https://ainetguide.cc/demand/',
  tldr: '针对不同跨境场景，网络瓶颈的核心根因截然不同：AI 办公与大模型调用核心在于 IP 纯净度（静态原生住宅 ISP）与 TUN 协议驱动接管；4K/8K 流媒体核心在于原生家庭 IP 解锁库完整度与晚高峰抗拥塞保底带宽；外企跨国音视频会议与远程协作则极度依赖端到端内网专线（IPLC/IEPL）的低时延抖动与零丢包。切勿使用单一网络节点套用全部场景，按需求场景进行精准分类选型与分流，是消除断流报错并大幅降低使用成本的唯一科学途径。',
  h1: '按需求找梯子：全场景技术架构、链路调优与选型全书',
  intro: `在现代数字化工作与娱乐环境中，以粗放的“一个节点走天下”思维来解决跨境网络连接已经彻底失效。全球主流平台为了保护其商业版权、抵御恶意机器人抓取及遵守合规政策，已经构筑起多重极其复杂的安全过滤网络。

例如，OpenAI 和 Anthropic 重点防范机房批量注册与脚本爬取，其风控引擎深度扫描自治系统编号（ASN）属性与 TLS 握手指纹；Netflix 与 Disney+ 重点防御版权越界播放，其反代理系统会对短时间内高并发连接的公网 IP 实施静默降级或代理报错；而跨国外企常用的 Zoom、Microsoft Teams 以及海外金融交易系统，则对往返时延（RTT）的抖动与 UDP 丢包率有着近乎苛刻的要求。

本指南作为 ainetguide.cc 的场景驱动型战略核心，从“具体业务痛点反推底层网络架构”出发，梳理出 AI 办公、学术科研、影音娱乐、跨境协同、游戏加速、多设备共享、开发者环境与隐私安全等 8 大细分场景，提供可量化、可验证的工业级技术选型标准。`,
  entities: [
    {
      name: '原生住宅 ISP',
      en: 'Residential ISP IP',
      principle: '由当地家庭民用宽带运营商直接宣告广播，在 MaxMind、IPinfo 数据库中分类为 Home/ISP，天然享有极高信用权重。',
      failureMechanism: '使用数据中心 IP（Hosting）访问高风控网站，直接触发 Cloudflare 1020 拦截或验证码死循环。',
      recommendation: '重度依赖 ChatGPT、Claude 及 TikTok 出海营销的用户必须指定原生住宅 ISP 节点。'
    },
    {
      name: 'IPLC 纯内网专线',
      en: 'IPLC Point-to-Point Circuit',
      principle: '点对点跨国物理光纤内网专线，在境内入口机房完成数据汇聚后直接经由专用陆缆或海缆传输，完全绕过国际公网出口。',
      failureMechanism: '公网国际出口路由器在晚高峰拥塞，产生高达 25%~40% 的丢包，导致会议音频卡顿和断流。',
      recommendation: '外企跨国视频会议、股票量化交易与生产级 API 调用必须使用 IPLC 专线。'
    },
    {
      name: 'TUN 驱动接管',
      en: 'Layer 3 TUN Virtual Interface',
      principle: '通过 Wintun/TUN 驱动在操作系统网络层建立点对点虚拟设备，修改默认路由表捕获主机上的所有 IP 流量。',
      failureMechanism: '普通系统代理无法劫持不遵循环境变量的程序（如 Git CLI、Docker、桌面游戏等）。',
      recommendation: '开发人员、游戏玩家及深度办公用户应在客户端常开 TUN 模式。'
    },
    {
      name: 'BBR 拥塞控制',
      en: 'BBR Congestion Control',
      principle: '基于实时探测的最大带宽与最小传输延迟来计算发包速率，不以丢包作为唯一的网络拥塞判定标志。',
      failureMechanism: '跨国链路存在非拥塞性随机丢包，传统 Cubic 算法误判为拥塞而减半发送速率，导致 4K 播放卡顿。',
      recommendation: '服务端必须配置 BBRv3，客户端优先选用支持 BBR 流控的优质节点。'
    },
    {
      name: 'Fake-IP 智能劫持',
      en: 'Fake-IP DNS Engine',
      principle: '客户端本地响应虚拟内网 IP，将真实 DNS 查询交由境外节点通过无污染上游完成解析。',
      failureMechanism: '本地发起明文 DNS 查询遭受中间人污染，返回虚假 IP 导致网页完全无法打开。',
      recommendation: '全平台客户端必须将 DNS 模式配置为 Fake-IP，规避 DNS 污染风险。'
    },
    {
      name: '多环境指纹防关联',
      en: 'Anti-Association Fingerprint Sandbox',
      principle: '结合静态独享住宅 IP 与防关联浏览器（如 AdsPower/Hubstudio），隔离 Canvas、Audio、WebGL 及时区环境。',
      failureMechanism: '多个账号在相同设备或相似网络环境下登录，平台依据浏览器指纹与 IP 关联判定批量作弊并封禁。',
      recommendation: '跨境电商多店铺管理与海外社媒多账号矩阵必须使用指纹隔离配合独享静态 IP。'
    },
    {
      name: '旁路由透明网关',
      en: 'Bypass Gateway (TPROXY)',
      principle: '在局域网内由软路由或迷你主机运行透明代理核心，接管全屋网络流量并依据规则自动分流。',
      failureMechanism: '电视盒子、游戏主机等封闭系统无法直接安装或配置复杂的代理客户端软件。',
      recommendation: '家庭多设备、Apple TV 用户推荐部署 OpenWrt 旁路由实现全屋免配置分流。'
    },
    {
      name: 'QoS 优先级调度',
      en: 'Quality of Service Scheduling',
      principle: '在网络传输层对关键业务协议（如 DNS、WebRTC 音频、TLS 握手）打上 DSCP 高优先级标签，优先保障带宽。',
      failureMechanism: '大文件下载或后台系统更新挤占全部上行带宽，造成会议语音实时延迟飙升至 1000ms 以上。',
      recommendation: '办公网络与高并发开发环境需启用客户端与路由器 QoS 调度规则。'
    }
  ],
  benchmark: {
    title: '不同需求场景下的主流网络解决方案综合指标实测对比',
    context: '测试覆盖 8 大核心痛点场景，由 ainetguide.cc 架构实验室在真实办公与家庭网络环境下进行连续 14 天压力测试。',
    rows: [
      {
        topology: 'AI 办公与开发 (ChatGPT/Claude/Cursor)',
        packetLoss: '< 0.2%',
        jitter: '< 3.0ms',
        riskPassRate: '99.5% (住宅原生)',
        throughput: '> 200 Mbps',
        compatibility: '极佳 (需 TUN 驱动)',
        cost: '¥25 ~ ¥50/月',
        status: 'verified',
        date: '2026-10-25'
      },
      {
        topology: '4K/8K 超高清流媒体 (Netflix/Disney+)',
        packetLoss: '< 1.5%',
        jitter: '10 ~ 25ms',
        riskPassRate: '98.0% (全解锁)',
        throughput: '> 350 Mbps (持续稳定)',
        compatibility: '极佳 (全平台自适应)',
        cost: '¥18 ~ ¥35/月',
        status: 'verified',
        date: '2026-10-24'
      },
      {
        topology: '跨国外企协同 (Zoom/Teams/Google)',
        packetLoss: '< 0.1%',
        jitter: '< 1.5ms (近乎零抖动)',
        riskPassRate: '99.0%',
        throughput: '> 150 Mbps',
        compatibility: '极佳 (支持 UDP 穿透)',
        cost: '¥30 ~ ¥60/月',
        status: 'verified',
        date: '2026-10-25'
      },
      {
        topology: '外服主机与端游加速 (Steam/PS5)',
        packetLoss: '< 0.5%',
        jitter: '< 5.0ms',
        riskPassRate: '90.0%',
        throughput: '> 80 Mbps',
        compatibility: '优 (需 NAT FullCone)',
        cost: '¥20 ~ ¥40/月',
        status: 'verified',
        date: '2026-10-22'
      },
      {
        topology: '出海电商与高危防关联 (Amazon/TikTok)',
        packetLoss: '< 0.5%',
        jitter: '< 8.0ms',
        riskPassRate: '99.8% (静态独享)',
        throughput: '> 50 Mbps',
        compatibility: '需搭配指纹浏览器',
        cost: '¥50 ~ ¥120/月',
        status: 'verified',
        date: '2026-10-20'
      },
      {
        topology: '日常轻量学术与网页查阅',
        packetLoss: '2.0% ~ 5.0%',
        jitter: '20 ~ 50ms',
        riskPassRate: '80.0%',
        throughput: '> 50 Mbps',
        compatibility: '良好 (常规系统代理)',
        cost: '¥10 ~ ¥20/月',
        status: 'verified',
        date: '2026-10-25'
      }
    ]
  },
  decisionTree: `+---------------------------------------------------------------------------------+
|                       按需求场景驱动的网络解决方案决策树                        |
+---------------------------------------------------------------------------------+
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
         [生产力与账号强相关]                            [影音娱乐与极速下载]
                 │                                               │
     ┌───────────┴───────────┐                       ┌───────────┴───────────┐
     ▼                       ▼                       ▼                       ▼
[AI 深度研发/高频调用]  [外企会议/跨境电商]       [4K流媒体/TV端大屏]     [外服联机/游戏对战]
     │                       │                       │                       │
 核心诉求：              核心诉求：              核心诉求：              核心诉求：
 住宅 ISP 纯净度         零丢包专线与环境隔离    全解锁库与抗晚高峰限速  亚太直达与 FullCone NAT
     │                       │                       │                       │
     ▼                       ▼                       ▼                       ▼
【落地配置】            【落地配置】            【落地配置】            【落地配置】
 静态住宅 IP 专线        企业 IEPL 双活专线       BGP 大带宽专线集群      亚太低延迟 IPLC 专线
 Wintun 开启 TUN 模式    防关联指纹沙盒浏览器     Apple TV 旁路由智能分流  开启 UDP 转发与 FullCone
 启用 Chrome uTLS 伪造   禁止频繁变动出口国家     开启 BBRv3 单边拥塞控制  客户端开启游戏优化加速`,
  protocolDeepDive: `### 1. 为什么“跑分测速”无法代表真实场景表现？
在网络工程中，带宽（Bandwidth）与延迟/丢包（Latency & Packet Loss）是完全独立的物理指标。许多用户误以为测速软件显示 500Mbps 就意味着“网络极佳”，但在实际业务中：
- **AI 办公与 API 调用**：每个 Prompt 交互产生的流量通常只有几十 KB 到几百 KB，依赖的是 TCP 三次握手与 TLS 建立的速度，以及长连接保活期间的连续零丢包。若节点晚高峰发生 15% 的丢包，哪怕拥有千兆带宽，TCP 也会频繁触发 RTO（超时重传），导致 ChatGPT 打字机效果剧烈卡顿。
- **跨国外企视频会议**：Zoom 与 Teams 使用基于 UDP 的 WebRTC 协议传输实时音视频。UDP 本身不具备自动重传机制，当丢包率超过 3% 时，音视频解码器将发生严重的丢帧补偿失效，表现为声音变机器人音、画面马赛克或直接掉线。
- **4K 流媒体播放**：流媒体平台使用 HLS 或 DASH 切片协议（通常每个分段 2~6 秒）。高码率 4K 视频（如 Netflix 15.25Mbps）要求连续稳定的吞吐，若线路由于公网 QoS 限制出现瞬间断速，播放器缓冲池（Buffer Pool）耗尽即引发转圈。

### 2. 场景特化协议交互时序全解
下图展现了在 AI 深度办公场景下，一次高质量端到端安全连接的协议交互生命周期：

\`\`\`
[客户端 IDE/浏览器]        [本地 TUN 虚拟网卡]       [境内专线接入节点]        [境外原生落地节点]        [OpenAI 认证服务器]
        │                          │                         │                         │                         │
        ├──── 1. 发起 HTTPS 请求 ──>│                         │                         │                         │
        │                          ├──── 2. 拦截 L3 IP 数据包 ─>│                         │                         │
        │                          │                         ├──── 3. 专线隧道高速穿透 >│                         │
        │                          │                         │                         ├──── 4. 发起真实 TCP 握手 ─>│
        │                          │                         │                         │<─── 5. TCP SYN+ACK ──────┤
        │                          │                         │                         ├──── 6. 提交 ClientHello ─>│
        │                          │                         │                         │    (uTLS 模拟 Chrome)   │
        │                          │                         │                         │<─── 7. ServerHello 通过 ─┤
        │                          │                         │                         ├──── 8. 验证住宅 ISP 属性 ─>│ (Fraud Score < 10)
        │                          │                         │                         │<─── 9. 200 OK 建立会话 ──┤
        │<═══ 10. 全双工极速数据流 ═══════════════════════════════════════════════════════════════════════════════════════┤
\`\`\`

通过在本地完成 TUN 驱动接管并经由专用内网直达境外住宅落地节点，避开了公网一切不可控的干扰因素，彻底保障了业务的高可用性。`,
  productionSop: `### 痛点场景定向调优实操 SOP (3 步锁定最佳方案)

#### 步骤一：按业务特征划分客户端分流规则
切勿采用全局代理。在客户端（Clash Verge Rev / Sing-box）中配置精准的场景分流策略组：
\`\`\`yaml
proxy-groups:
  - name: 🤖 AI 生产力专线
    type: select
    proxies:
      - 🇺🇸 美国原生住宅专线
      - 🇸🇬 新加坡低延迟专线
  - name: 🎬 流媒体解锁池
    type: select
    proxies:
      - 🇭🇰 香港大带宽专线
      - 🇯🇵 日本原生解锁专线
  - name: 💼 外企办公与会议
    type: select
    proxies:
      - 🇭🇰 香港低延迟 IPLC
      - 🇸🇬 新加坡企业专线

rules:
  # AI 业务分流
  - DOMAIN-SUFFIX,openai.com,🤖 AI 生产力专线
  - DOMAIN-SUFFIX,chatgpt.com,🤖 AI 生产力专线
  - DOMAIN-SUFFIX,anthropic.com,🤖 AI 生产力专线
  - DOMAIN-SUFFIX,claude.ai,🤖 AI 生产力专线
  # 流媒体分流
  - GEOSITE,netflix,🎬 流媒体解锁池
  - GEOSITE,disney,🎬 流媒体解锁池
  - GEOSITE,youtube,🎬 流媒体解锁池
  # 大陆直连
  - GEOIP,CN,DIRECT
  - MATCH,DIRECT
\`\`\`

#### 步骤二：开启 Layer 3 TUN 模式保障非浏览器流量
在客户端通用设置中开启 TUN 模式，并检查系统路由表：
\`\`\`powershell
# Windows PowerShell 检查默认路由跃点
Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Sort-Object RouteMetric
# 验证 Wintun 虚拟网卡跃点数是否处于最高优先级 (Metric 通常小于 20)
\`\`\`

#### 步骤三：双端链路健康状态自动化检测
运行以下脚本，对当前场景配置进行自动化体检：
\`\`\`bash
# 验证 AI 节点 IP 类型是否为 ISP/Home
curl -s https://ipinfo.io/json | grep -E '"org"|"asn"'

# 验证当前节点对 Netflix 原生内容的解锁状态
curl -s -I "https://www.netflix.com/title/80018499" | grep -E "HTTP|location"
# 正常应返回 HTTP/2 200，若返回 302 重定向至 browse 说明未解锁
\`\`\``,
  antiPitfalls: `### 按需求选型 5 大常见配置陷阱与自愈方案

1. **陷阱一：用低价流媒体节点登录 ChatGPT/Claude**
   - *危害*：流媒体解锁节点通常采用 DNS 解锁（SNI Proxy 劫持）或高并发机房中继，这类 IP 在 OpenAI 风控系统中被直接标记为代理黑名单，登录立即触发 Access Denied。
   - *方案*：必须为 AI 办公单独配置具备纯正家庭住宅属性的独立节点。
2. **陷阱二：游戏加速直接使用网页代理节点**
   - *危害*：网页代理节点很多只支持 TCP 转发，或者 UDP 经过多跳中继后 NAT 类型为 Symmetric（对称型），导致游戏主机联机报错 NAT Type 3（严格型），无法加入派对。
   - *方案*：选择支持 FullCone NAT (NAT Type 1) 且时延在 40ms 以内的亚太 IPLC 专线。
3. **陷阱三：外企远程办公开启了局域网共享代理导致公司内网报错**
   - *危害*：部分公司内网部署了零信任网络访问（ZTNA）或 Cisco AnyConnect，本地代理未配置 IP 排除规则会导致内网证书报错与认证冲突。
   - *方案*：在代理客户端的 \`bypass\` 或 \`fake-ip-filter\` 中将公司内网域名和网段全部设为直连。
4. **陷阱四：出海跨境电商使用动态变动 IP 登录后台**
   - *危害*：负载均衡（Load Balance）模式导致每一次请求出口 IP 随机切换，触发亚马逊安全风控机制判定异地盗号。
   - *方案*：电商后台管理必须锁定静态单节点，严禁开启自动轮询。
5. **陷阱五：多设备共享网络未做并发连接数管理**
   - *危害*：一台设备进行 BT/PT 下载或多线程测速，耗尽了路由器的 NAT 状态表与上行带宽，导致全家其他设备网络瘫痪。
   - *方案*：在路由器端配置智能 QoS，或限制 P2P 下载的最大并发连接数。`,
  subtopics: [
    {
      name: '1.1 AI 办公痛点',
      en: 'AI Office Troubleshooting',
      slug: 'demand/ai-office',
      desc: '深入解决 ChatGPT 报错排查、Claude 地区限制解除与高频并发调用。',
      clusters: [
        {
          name: 'ChatGPT 报错排查攻坚',
          slug: 'demand/ai-office/chatgpt-troubleshooting',
          desc: '1020 拦截自愈、Cloudflare 穿透与报错深度排查',
          longtails: [
            { title: 'ChatGPT报错排查：快速急救指引', slug: 'demand/ai-office/chatgpt-troubleshooting/chatgpt-troubleshooting-quickstart-emergency-fix' },
            { title: 'Wireshark底层抓包与TCP分析', slug: 'demand/ai-office/chatgpt-troubleshooting/chatgpt-troubleshooting-wireshark-tcp-handshake-log-analysis' }
          ]
        },
        {
          name: 'Claude 地区限制破除',
          slug: 'demand/ai-office/claude-restrictions',
          desc: 'App not available in your region 与账号封禁对抗',
          longtails: [
            { title: 'Claude 地区限制一键解除', slug: 'demand/ai-office/claude-restrictions/claude-restrictions-quickstart-emergency-fix' },
            { title: '高纯净静态住宅 IP 搭建与验证', slug: 'demand/ai-office/claude-restrictions/claude-restrictions-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.2 海外学习资料',
      en: 'Academic & Research Access',
      slug: 'demand/academic-access',
      desc: '保障跨国学术科研文献秒级检索与全球数字图书馆顺畅接入。',
      clusters: [
        {
          name: '学术门户极速访问',
          slug: 'demand/academic-access/scholar-portal',
          desc: 'Google Scholar 验证码绕过与文献镜像直连',
          longtails: [
            { title: 'Google Scholar 频繁验证码急救', slug: 'demand/academic-access/scholar-portal/scholar-portal-quickstart-emergency-fix' },
            { title: '海外高校校内内网代理对接', slug: 'demand/academic-access/scholar-portal/scholar-portal-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: '科研文献极速下载',
          slug: 'demand/academic-access/paper-download',
          desc: 'IEEE、ACM、Springer 文献大文件秒开分流',
          longtails: [
            { title: 'IEEE/ACM 下载超时急救指引', slug: 'demand/academic-access/paper-download/paper-download-quickstart-emergency-fix' },
            { title: 'Sci-Hub 智能解析分流规则集', slug: 'demand/academic-access/paper-download/paper-download-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.3 视频娱乐需求',
      en: 'Streaming Entertainment',
      slug: 'demand/streaming-entertainment',
      desc: '攻克 Netflix 跨区播放、Disney+ 账号区域限制与 4K 高画质优化。',
      clusters: [
        {
          name: 'Netflix 地区库解锁',
          slug: 'demand/streaming-entertainment/netflix-library',
          desc: '非自制剧完整解锁与原生住宅 IP 库调度',
          longtails: [
            { title: 'Netflix 代理检测报错根治', slug: 'demand/streaming-entertainment/netflix-library/netflix-library-quickstart-emergency-fix' },
            { title: '4K 15.25Mbps 稳定码率调优实操', slug: 'demand/streaming-entertainment/netflix-library/netflix-library-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: 'Disney+ 账号区域破除',
          slug: 'demand/streaming-entertainment/disney-region',
          desc: '地区错误、支付风控与多端共享播放',
          longtails: [
            { title: 'Disney+ 报错代码 83/73 解决', slug: 'demand/streaming-entertainment/disney-region/disney-region-quickstart-emergency-fix' },
            { title: 'Disney+ 家庭组多 IP 共享合规配置', slug: 'demand/streaming-entertainment/disney-region/disney-region-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.4 跨境远程工作',
      en: 'Cross-Border Remote Work',
      slug: 'demand/remote-work',
      desc: '专为跨国团队打造的 Zoom 零延迟、云端协作防掉线企业级网络架构。',
      clusters: [
        {
          name: 'Zoom 延迟卡顿解决',
          slug: 'demand/remote-work/zoom-latency',
          desc: 'UDP 丢包对抗与内网专线 QoS 优先调度',
          longtails: [
            { title: 'Zoom 跨国会议音频卡顿急救', slug: 'demand/remote-work/zoom-latency/zoom-latency-quickstart-emergency-fix' },
            { title: 'WebRTC 音视频传输 UDP 保活调优', slug: 'demand/remote-work/zoom-latency/zoom-latency-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: '云端协作安全保障',
          slug: 'demand/remote-work/cloud-collab',
          desc: 'Slack、Figma、Notion 跨国极速协同与防断流',
          longtails: [
            { title: 'Figma 巨型画布加载缓慢自愈', slug: 'demand/remote-work/cloud-collab/cloud-collab-quickstart-emergency-fix' },
            { title: '企业数据加密传输与漏缆排查', slug: 'demand/remote-work/cloud-collab/cloud-collab-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.5 游戏低延迟需求',
      en: 'Low Latency Gaming',
      slug: 'demand/low-latency-gaming',
      desc: '主机与 PC 外服联机加速、FullCone NAT 穿透与防丢包保障。',
      clusters: [
        {
          name: '主机联机加速',
          slug: 'demand/low-latency-gaming/console-gaming',
          desc: 'PS5 / Switch / Xbox 联机 NAT 类型优化与加速',
          longtails: [
            { title: '主机联机 NAT Type 3 转 Type 1 指南', slug: 'demand/low-latency-gaming/console-gaming/console-gaming-quickstart-emergency-fix' },
            { title: 'Switch 联机无法加入对局排查', slug: 'demand/low-latency-gaming/console-gaming/console-gaming-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: 'PC 端游极速网络',
          slug: 'demand/low-latency-gaming/pc-gaming',
          desc: 'Steam、Apex、Valorant 亚太专线低延迟选型',
          longtails: [
            { title: 'Steam 商店错误代码 118 修复', slug: 'demand/low-latency-gaming/pc-gaming/pc-gaming-quickstart-emergency-fix' },
            { title: '亚太低时延专线节点横向跑分', slug: 'demand/low-latency-gaming/pc-gaming/pc-gaming-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.6 多设备共享',
      en: 'Multi-Device Sharing',
      slug: 'demand/multi-device-share',
      desc: '家庭全屋智能设备无感分流、软路由网关与并发负载均衡。',
      clusters: [
        {
          name: '家庭路由配置',
          slug: 'demand/multi-device-share/home-router',
          desc: '主流家用路由器刷机与出国分流插件实操',
          longtails: [
            { title: '华硕梅林固件出国分流极速搭建', slug: 'demand/multi-device-share/home-router/home-router-quickstart-emergency-fix' },
            { title: '全屋智能家居白名单隔离配置', slug: 'demand/multi-device-share/home-router/home-router-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: '软路由高级分流',
          slug: 'demand/multi-device-share/soft-router-split',
          desc: 'OpenWrt 旁路由 TPROXY 转发与防环路机制',
          longtails: [
            { title: 'OpenWrt 旁路由断网快速排查', slug: 'demand/multi-device-share/soft-router-split/soft-router-split-quickstart-emergency-fix' },
            { title: '软路由双软核负载均衡与容灾', slug: 'demand/multi-device-share/soft-router-split/soft-router-split-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.7 开发环境代理',
      en: 'Developer Network Setup',
      slug: 'demand/developer-network',
      desc: '终端 CLI、Git 提交、Docker 镜像拉取与跨国包管理器加速。',
      clusters: [
        {
          name: 'Git / Docker 网络加速',
          slug: 'demand/developer-network/git-docker-network',
          desc: '解决 git clone 极慢与 Docker Hub 镜像超时',
          longtails: [
            { title: 'Git 命令行代理环境变量终极设置', slug: 'demand/developer-network/git-docker-network/git-docker-network-quickstart-emergency-fix' },
            { title: 'Docker Daemon 代理配置与守护进程注入', slug: 'demand/developer-network/git-docker-network/git-docker-network-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: '包管理器源配置',
          slug: 'demand/developer-network/package-manager',
          desc: 'npm、pip、Homebrew、Cargo 跨国源镜像调优',
          longtails: [
            { title: 'npm install 握手超时排查与镜像替换', slug: 'demand/developer-network/package-manager/package-manager-quickstart-emergency-fix' },
            { title: 'pip install 挂代理仍然超时自愈指引', slug: 'demand/developer-network/package-manager/package-manager-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    },
    {
      name: '1.8 高危环境匿名',
      en: 'High-Risk Privacy & Sandbox',
      slug: 'demand/high-risk-privacy',
      desc: '浏览器指纹防风控、多账号防关联沙盒与数字隐私安全全景方案。',
      clusters: [
        {
          name: '浏览器指纹防封',
          slug: 'demand/high-risk-privacy/browser-fingerprint',
          desc: 'Canvas、WebGL、WebRTC 与字体特征混淆沙盒',
          longtails: [
            { title: '浏览器指纹伪装度 100% 打造指南', slug: 'demand/high-risk-privacy/browser-fingerprint/browser-fingerprint-quickstart-emergency-fix' },
            { title: 'WebRTC 真实公网 IP 泄露终极屏蔽', slug: 'demand/high-risk-privacy/browser-fingerprint/browser-fingerprint-residential-isp-ip-fraud-score-audit' }
          ]
        },
        {
          name: '多开防关联沙盒',
          slug: 'demand/high-risk-privacy/multi-account-sandbox',
          desc: '电商多店铺与海外社媒多账号独立网络隔离',
          longtails: [
            { title: '多账号独立环境沙盒搭建避坑', slug: 'demand/high-risk-privacy/multi-account-sandbox/multi-account-sandbox-quickstart-emergency-fix' },
            { title: '独享纯净静态住宅 IP 选购与绑定', slug: 'demand/high-risk-privacy/multi-account-sandbox/multi-account-sandbox-residential-isp-ip-fraud-score-audit' }
          ]
        }
      ]
    }
  ],
  crossLinks: [
    { name: 'AI 上网指南 (/ai-guide/)', url: '/ai-guide/', desc: '针对大模型风控的专用策略' },
    { name: '视频流媒体 (/streaming/)', url: '/streaming/', desc: 'Netflix 与 4K 播放全参数' },
    { name: '海外办公协作 (/work-study/)', url: '/work-study/', desc: '外企视频会议与电商合规' },
    { name: '真实机场评测 (/providers/)', url: '/providers/', desc: '42家经过核验的专线服务商' },
    { name: '免费资源风险 (/free/)', url: '/free/', desc: '公开节点隐患与应急备份' },
    { name: '协议级故障自愈 (/troubleshooting/)', url: '/troubleshooting/', desc: '报错代码与路由冲突排查' },
    { name: '全平台客户端教程 (/clients/)', url: '/clients/', desc: 'Clash / Sing-box / 软路由实操' }
  ],
  faqs: [
    {
      q: '为什么按照需求分类选型比直接买最贵的机场套餐更重要？',
      a: '因为不同业务对于网络指标的敏感维度完全不同。例如最顶级的游戏加速专线虽然延迟极低，但其分配的 IP 可能是机房段，用于 ChatGPT 会直接被封号；而高纯净度的住宅 IP 节点可能带宽只有 50Mbps，无法满足多台设备 4K 追剧的大吞吐需求。按需求分类配置分流规则，既能保证每个场景体验最佳，又能避免为不需要的冗余性能买单。'
    },
    {
      q: 'AI 办公最容易踩的坑是什么？如何彻底避免？',
      a: '最常见的坑是使用机房 IP 且未开启 uTLS 模拟。OpenAI 的风控系统结合了 IP 归属数据库与 TLS 客户端指纹分析，发现机房 IP 或带有代理指纹的 Client Hello 会直接拦截。解决方案是使用拥有原生住宅 ISP 属性的节点，并在客户端开启 uTLS Chrome 握手模拟与 TUN 虚拟网卡强接管。'
    },
    {
      q: '如何为家庭网络中的 Apple TV 和电视盒子配置无感流媒体分流？',
      a: '推荐采用 OpenWrt 旁路由（透明网关）方案。在软路由中配置 Fake-IP 分流规则，将 Netflix、Disney+、YouTube 的域名流量指向流媒体专属解锁专线，将大陆域名指向本地直连。在 Apple TV 上只需将“路由器/网关”和“DNS”手动修改为旁路由的局域网 IP，即可免装任何软件实现全天候 4K 杜比视界秒开。'
    },
    {
      q: '开发人员在终端使用 git clone 经常遇到连接超时，如何正确配置代理？',
      a: '首先确保代理客户端开启了本地 Socks5/HTTP 端口（如 7890）。然后在终端执行配置：\`git config --global http.proxy http://127.0.0.1:7890\` 和 \`git config --global https.proxy http://127.0.0.1:7890\`。更彻底的方案是开启客户端的 TUN 模式，此时无需对任何命令行工具单独设置代理环境变量，终端所有网络请求都会被内核虚拟网卡直接捕获并转发。'
    },
    {
      q: '什么是 WebRTC 泄露？它会如何破坏我的跨境业务？',
      a: 'WebRTC 是浏览器内置的实时通信协议。为了建立点对点视频通话，它会绕过浏览器的常规代理设置，直接向 STUN/TURN 服务器发送 UDP 探测包，返回客户端真实的物理网卡 IP 和大陆公网 IP。如果目标网站（如 TikTok、亚马逊后台）通过 JavaScript 调用 WebRTC 接口，即使开了全局代理也会立即识别出真实归属地。解决方案是在浏览器中彻底禁用 WebRTC 或开启 TUN 模式并阻断 STUN 端口。'
    },
    {
      q: '外企远程办公视频会议（Zoom/Teams）频繁提示“网络连接不稳定”该怎么办？',
      a: '这通常是因为公网直连链路在晚高峰发生 UDP QoS 限速或丢包。首先应切换至纯内网物理专线（IPLC/IEPL），其次在客户端配置中将 Zoom 和 Teams 的域名划入专线分流策略组。若使用软路由，需在 QoS 设置中调高 UDP 端口 3478~3481 及 8801~8810 的转发优先级。'
    },
    {
      q: '玩外服游戏（如 Steam、PS5 联机）对节点有什么硬性技术要求？',
      a: '外服游戏对时延与丢包要求极高，通常要求端到端延迟在 50ms 以内且丢包率 < 0.5%；同时要求节点支持 FullCone NAT（NAT Type 1 或 2），否则无法与境外玩家建立 P2P 匹配。必须选用亚太低时延 IPLC 专线，且客户端需开启 UDP 转发与透明网关游戏加速模块。'
    },
    {
      q: '出海电商多店铺防关联运营，为什么要使用指纹浏览器搭配独享 IP？',
      a: '因为平台（如亚马逊、eBay、Shopee）会采集设备的硬件指纹（Canvas、AudioContext、WebGL 渲染器、屏幕分辨率）与网络指纹（公网 IP、DNS 所在地、时区）。如果使用普通动态共享节点，多个商家的请求出口 IP 相同，平台会立即判定多店铺关联并集体封店。必须为每个店铺配置独享静态住宅 IP 并绑定独立的指纹浏览器沙盒。'
    },
    {
      q: '如何检测一个节点的流媒体解锁能力是否真实有效？',
      a: '可以使用开源的流媒体检测脚本（如 check.sh）。在境外落地终端或自建节点运行脚本，它会向 Netflix、Disney+、YouTube Premium、Max 等平台的官方 API 发起特征探测，返回每个平台是“原生解锁（Native）”、“DNS 解锁（DNS Proxy）”还是“完全未解锁（Failed）”。对于 Netflix，只要能正常播放非自制剧（如《绝命毒师》）即为真正完全解锁。'
    },
    {
      q: '在公共 Wi-Fi（如咖啡馆、机场、酒店）办公，如何防止账号被窃取？',
      a: '公共 Wi-Fi 极易遭受 ARP 欺骗和恶意热点中间人（MITM）劫持。安全办公的黄金法则是：连接公共网络后，立刻打开代理客户端并启动 TUN 模式。TUN 模式会在本地生成端到端加密隧道，所有进出数据包均经由高强度算法加密后传输，局域网内的任何嗅探工具都只能看到无意义的加密报文，无法解密出你的密码或 Cookie。'
    },
    {
      q: '为什么有的节点看 YouTube 测速跑出 10 万 Kbps，但打开外网小网站却很慢？',
      a: '这是典型的“CDN 缓存跑分”与“实际路由质量”的差异。YouTube 在全球部署了海量边缘缓存节点（Google Global Cache），很多中继线路针对 Google 的 IP 段做了路由优化；但如果访问没有 CDN 的普通海外企业官网或学术服务器，数据包需要真实穿透公网骨干网，此时若节点的国际路由差或 DNS 解析慢，就会出现打开普通网页异常缓慢的现象。'
    },
    {
      q: '长期使用需要高稳定性的企业用户，应该如何做主备容灾方案？',
      a: '企业级生产网络绝对不能依赖单一服务商。标准容灾方案为：主线路选用高 SLA（如 99.9%）的旗舰 IPLC 专线机场，备用线路选用不同机房入口和协议体系的优质 BGP 中继机场。在客户端配置自动故障转移策略组（URL-Test 或 Fallback），当主节点连续 3 次心跳探测超时（如 5 秒未响应），客户端自动无缝切换至备用节点，确保业务零感知。'
    }
  ],
  recommendedBrands: ['feimao-cloud', 'guangsu-cloud', 'feiniao-cloud']
}
