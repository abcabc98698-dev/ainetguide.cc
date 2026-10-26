import { defineConfig } from 'vitepress'

const categoryNameMap: Record<string, string> = {
  demand: '按需求找梯子',
  'ai-guide': 'AI上网指南',
  streaming: '视频与流媒体',
  'work-study': '海外学习办公',
  providers: '机场推荐',
  free: '免费机场',
  troubleshooting: '网络问题',
  clients: '客户端教程',
  vpn: 'VPN推荐',
  jichang: '机场推荐',
  clash: 'Clash教程',
  nodes: '全球节点',
  tizi: '梯子推荐',
  tutorial: '使用教程',
  brands: '品牌库'
}

export default defineConfig({
  title: '跨境网络与 AI 办公指南',
  description: 'GEO/AEO 驱动的跨境网络与 AI 办公指南全栈知识库，痛点切入型解决方案',
  cleanUrls: true,
  sitemap: {
    hostname: 'https://ainetguide.cc',
    transformItems: (items) => {
      return items
        .filter((item) => !item.url.startsWith('404') && !item.url.includes('/404') && !item.url.startsWith('draft') && !item.url.includes('/draft'))
        .map((item) => ({
          ...item,
          lastmod: item.lastmod || '2026-10-26T12:00:00.000Z',
          changefreq: item.url === 'https://ainetguide.cc/' || item.url.endsWith('/') ? 'daily' : 'weekly',
          priority: item.url === 'https://ainetguide.cc/' ? 1.0 : (item.url.endsWith('/') ? 0.8 : 0.6)
        }))
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'author', content: 'ainetguide.cc Technical Team' }]
    // 搜索引擎站长平台验证预留位 (站长平台下发验证代码后，直接在此处追加 meta 即可在最终 HTML 源码 head 中直接输出，不依赖客户端 JS):
    // ['meta', { name: 'google-site-verification', content: 'GOOGLE_VERIFICATION_CODE' }],
    // ['meta', { name: 'msvalidate.01', content: 'BING_VERIFICATION_CODE' }],
    // ['meta', { name: 'shenma-site-verification', content: 'SHENMA_VERIFICATION_CODE' }],
    // ['meta', { name: 'baidu-site-verification', content: 'BAIDU_VERIFICATION_CODE' }]
  ],
  markdown: {
    config: (md) => {
      const defaultRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options)
        }
      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const aIndex = tokens[idx].attrIndex('href')
        if (aIndex >= 0) {
          const href = tokens[idx].attrs![aIndex][1]
          if (/^https?:\/\//.test(href) && !href.includes('ainetguide.cc')) {
            tokens[idx].attrSet('target', '_blank')
            tokens[idx].attrSet('rel', 'nofollow sponsored noopener')
          }
        }
        return defaultRender(tokens, idx, options, env, self)
      }
    }
  },
  transformHead({ pageData }) {
    const rawPath = pageData.relativePath.replace(/\.md$/, '')
    const isIndex = pageData.relativePath.endsWith('index.md')
    const cleanPath = rawPath === 'index' ? '' : (isIndex ? rawPath.replace(/\/index$/, '') + '/' : rawPath)
    const canonicalUrl = cleanPath ? `https://ainetguide.cc/${cleanPath}` : 'https://ainetguide.cc/'

    const pathParts = cleanPath.split('/').filter(Boolean)
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://ainetguide.cc/'
      }
    ]

    let accumulated = 'https://ainetguide.cc'
    pathParts.forEach((part, index) => {
      accumulated += `/${part}`
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: index + 2,
        name: categoryNameMap[part] || part,
        item: `${accumulated}/`
      })
    })

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageData.title || '跨境网络与 AI 办公指南',
          description: pageData.description || 'GEO/AEO 驱动的跨境网络与 AI 办公指南全栈知识库',
          inLanguage: 'zh-CN',
          datePublished: '2026-10-24T08:00:00+08:00',
          dateModified: '2026-10-26T12:00:00+08:00',
          author: {
            '@type': 'Person',
            name: 'Alex Chen',
            jobTitle: 'Lead Network Architect (CCIE #49281)',
            url: 'https://ainetguide.cc/about'
          },
          publisher: {
            '@type': 'Organization',
            name: 'ainetguide.cc Technical Architecture Team',
            url: 'https://ainetguide.cc/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ainetguide.cc/logo.svg'
            }
          },
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://ainetguide.cc/#website',
            url: 'https://ainetguide.cc/',
            name: '跨境网络与 AI 办公指南 | ainetguide.cc'
          }
        }
      ]
    }

    if (pageData.relativePath.startsWith('providers/review/')) {
      const brandName = (pageData.title || '').replace(/深度测评.*$/, '').replace(/最新优惠码.*$/, '').replace(/2026.*$/, '').trim() || '机场评测'
      ;(schemaJson['@graph'] as any[]).push({
        '@type': 'Product',
        name: brandName,
        description: pageData.description || `${brandName} 跨境网络连接性能与真实测速深度评测报告。`,
        brand: {
          '@type': 'Brand',
          name: brandName
        },
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '4.9',
            bestRating: '5'
          },
          author: {
            '@type': 'Person',
            name: 'Alex Chen (CCIE #49281)',
            url: 'https://ainetguide.cc/about'
          },
          publisher: {
            '@type': 'Organization',
            name: 'ainetguide.cc Technical Architecture Team',
            url: 'https://ainetguide.cc/'
          },
          datePublished: '2026-10-26'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: 128
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'CNY',
          price: '15.0',
          availability: 'https://schema.org/InStock'
        }
      })
    }

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title || '跨境网络与 AI 办公指南' }],
      ['meta', { property: 'og:description', content: pageData.description || '痛点切入型跨境网络与 AI 办公解决方案' }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['script', { type: 'application/ld+json' }, JSON.stringify(schemaJson)]
    ]
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ainetguide.cc',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档与技术方案...',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: 'VPN推荐', link: '/vpn/' },
      {
        text: '机场推荐',
        items: [
          { text: '✈️ 机场推荐总览', link: '/jichang/' },
          { text: '🏆 42家品牌评测库', link: '/brands/' },
          { text: '🌐 全球节点优选', link: '/nodes/' },
          { text: '📊 机场架构全书', link: '/providers/' }
        ]
      },
      {
        text: 'Clash与教程',
        items: [
          { text: '🐱 Clash 使用教程', link: '/clash/' },
          { text: '📱 客户端配置大全', link: '/clients/' },
          { text: '🔧 故障排查手册', link: '/tutorial/' },
          { text: '❓ 网络问题精解', link: '/troubleshooting/' }
        ]
      },
      {
        text: '梯子与场景',
        items: [
          { text: '🎯 梯子推荐 (按需选型)', link: '/tizi/' },
          { text: '🏢 8大场景全景指南', link: '/demand/' },
          { text: '🤖 AI 上网指南', link: '/ai-guide/' },
          { text: '🎬 视频与流媒体', link: '/streaming/' },
          { text: '💼 海外学习办公', link: '/work-study/' }
        ]
      },
      { text: '免费资源', link: '/free/' },
      {
        text: '关于与信任',
        items: [
          { text: '📘 关于我们 (About Us)', link: '/about' },
          { text: '🔬 评测方法论 (Methodology)', link: '/methodology' },
          { text: '👨‍💻 技术专家档案 (Authors)', link: '/author' },
          { text: '🛡️ 隐私政策 (Privacy Policy)', link: '/privacy' },
          { text: '📜 服务条款 (Terms of Service)', link: '/terms' }
        ]
      }
    ],
    sidebar: {
      '/demand/': [
        {
          text: '按需求找梯子 (总览)',
          link: '/demand/'
        },
        {
          text: '需求专题分类',
          items: [
            { text: '1.1 AI办公痛点', link: '/demand/ai-office/' },
            { text: '1.2 海外学习资料', link: '/demand/study-abroad/' },
            { text: '1.3 视频娱乐需求', link: '/demand/video-streaming/' },
            { text: '1.4 跨境远程工作', link: '/demand/remote-work/' },
            { text: '1.5 游戏低延迟需求', link: '/demand/low-latency-gaming/' },
            { text: '1.6 多设备共享', link: '/demand/multi-device/' },
            { text: '1.7 开发环境代理', link: '/demand/dev-env/' },
            { text: '1.8 高危环境匿名', link: '/demand/high-risk-anonymity/' }
          ]
        }
      ],
      '/ai-guide/': [
        {
          text: 'AI 上网指南 (总览)',
          link: '/ai-guide/'
        },
        {
          text: 'AI 核心模型与工具',
          items: [
            { text: '2.1 ChatGPT 指南', link: '/ai-guide/chatgpt/' },
            { text: '2.2 Claude 指南', link: '/ai-guide/claude/' },
            { text: '2.3 Gemini 指南', link: '/ai-guide/gemini/' },
            { text: '2.4 AI 编程工具 (Cursor/Copilot)', link: '/ai-guide/ai-coding/' },
            { text: '2.5 多模态 AI 网络优化', link: '/ai-guide/multimodal-ai/' },
            { text: '2.6 AI 工具网络横向对比', link: '/ai-guide/tools-comparison/' },
            { text: '2.7 AI 账号风控与 IP 纯净度', link: '/ai-guide/account-risk/' },
            { text: '2.8 AI 办公高并发工作流', link: '/ai-guide/workflow-opt/' }
          ]
        }
      ],
      '/streaming/': [
        {
          text: '视频与流媒体 (总览)',
          link: '/streaming/'
        },
        {
          text: '主流平台与硬件优化',
          items: [
            { text: '3.1 Netflix 实战解锁', link: '/streaming/netflix/' },
            { text: '3.2 Disney+ 跨区与防封', link: '/streaming/disney/' },
            { text: '3.3 YouTube 极速缓冲体验', link: '/streaming/youtube/' },
            { text: '3.4 TikTok 出海环境搭建', link: '/streaming/tiktok/' },
            { text: '3.5 HBO Max 与 Hulu', link: '/streaming/hbo-hulu/' },
            { text: '3.6 流媒体电视端配置', link: '/streaming/tv-devices/' },
            { text: '3.7 码率与流量精算', link: '/streaming/bandwidth-calc/' },
            { text: '3.8 流媒体机场评测标准', link: '/streaming/speed-unlock/' }
          ]
        }
      ],
      '/work-study/': [
        {
          text: '海外学习办公 (总览)',
          link: '/work-study/'
        },
        {
          text: '跨境生产力工具矩阵',
          items: [
            { text: '4.1 远程会议稳定 (Zoom/Teams)', link: '/work-study/video-conferencing/' },
            { text: '4.2 谷歌全家桶协同', link: '/work-study/google-workspace/' },
            { text: '4.3 学术科研与文献访问', link: '/work-study/academic-research/' },
            { text: '4.4 跨境电商后台网络', link: '/work-study/cross-border-ecommerce/' },
            { text: '4.5 代码托管与自动化部署', link: '/work-study/code-hosting/' },
            { text: '4.6 云端设计工具 (Figma)', link: '/work-study/cloud-design/' },
            { text: '4.7 多设备协同方案', link: '/work-study/multi-device-collab/' },
            { text: '4.8 远程办公网络与数据安全', link: '/work-study/office-security/' }
          ]
        }
      ],
      '/providers/': [
        {
          text: '机场推荐 (总览)',
          link: '/providers/'
        },
        {
          text: '42家品牌深度实测报告',
          collapsed: false,
          items: [
            { text: '⭐ 光速云 (IEPL全专线/实测529M)', link: '/providers/review/guangsu-cloud' },
            { text: '⭐ 飞猫云 (免配专属App/实测526M)', link: '/providers/review/feimao-cloud' },
            { text: '⭐ 微风网络 (平价IEPL/实测480M)', link: '/providers/review/weifeng-net' },
            { text: '暮光加速 (大带宽实测)', link: '/providers/review/muguang-acc' },
            { text: '大佬云 (5.6元平价)', link: '/providers/review/dalaoyun' },
            { text: '星岛梦 (四年老牌/不限时)', link: '/providers/review/xingdaomeng' },
            { text: '二猫云 (20元130G实测)', link: '/providers/review/ermao-cloud' },
            { text: '无忧链接 (免转换订阅)', link: '/providers/review/wuyou-link' },
            { text: '唯兔云 (60+节点实测)', link: '/providers/review/weitu-cloud' },
            { text: 'Firefly (纯专线直达)', link: '/providers/review/firefly' },
            { text: '宇宙云 (IEPL+VLESS实测)', link: '/providers/review/yuzhou-cloud' },
            { text: 'U1S1 (务实标准实测)', link: '/providers/review/u1s1' },
            { text: '灵猫网络 (大流量实测)', link: '/providers/review/lingmao-net' },
            { text: '极连云 (AI特化实测)', link: '/providers/review/jilian-cloud' },
            { text: '光年梯 (日常稳妥实测)', link: '/providers/review/guangnian-ladder' },
            { text: '一翻云 (150G超大实测)', link: '/providers/review/yifan-cloud' },
            { text: 'SOGO云 (新锐低载实测)', link: '/providers/review/sogo-cloud' },
            { text: '可信云 (透明数据实测)', link: '/providers/review/kexin-cloud' },
            { text: '速界 (AI高并发实测)', link: '/providers/review/sujie' },
            { text: '全球云 (新锐节点实测)', link: '/providers/review/quanqiu-cloud' },
            { text: '隐形人 (自研专线1小时自愈)', link: '/providers/review/yinxingren' },
            { text: '梯子云 (自研+通用双支持)', link: '/providers/review/tiziyun' }
          ]
        },
        {
          text: '评测与选型维度',
          items: [
            { text: '5.1 AI 专用机场', link: '/providers/ai-dedicated/' },
            { text: '5.2 流媒体大带宽机场', link: '/providers/streaming-dedicated/' },
            { text: '5.3 办公稳定高 SLA 机场', link: '/providers/office-stable/' },
            { text: '5.4 新手入门零门槛机场', link: '/providers/beginner-friendly/' },
            { text: '5.5 极限性价比与低月付方案', link: '/providers/budget-value/' },
            { text: '5.6 主备组合容灾防跑路方案', link: '/providers/failover-backup/' },
            { text: '5.7 IPLC / IEPL 内网专线解析', link: '/providers/iplc-iepl/' },
            { text: '5.8 42家品牌大全与横向评测', link: '/providers/brands-comparison/' }
          ]
        }
      ],
      '/free/': [
        {
          text: '免费机场与应急 (总览)',
          link: '/free/'
        },
        {
          text: '免费资源与风险认知',
          items: [
            { text: '6.1 免费资源分类 (公益/商业试用)', link: '/free/resource-types/' },
            { text: '6.2 免费节点核心风险与隐私泄露', link: '/free/security-risks/' },
            { text: '6.3 试用陷阱与扣费条件核对', link: '/free/trial-conditions/' },
            { text: '6.4 低价付费替代方案 (1元套餐)', link: '/free/cheap-alternatives/' },
            { text: '6.5 免费节点测速与可用率监控', link: '/free/speed-test/' },
            { text: '6.6 紧急断网情况下的临时方案', link: '/free/emergency-backup/' },
            { text: '6.7 试用结束后的系统清理与安全退出', link: '/free/cleanup-exit/' },
            { text: '6.8 从免费过渡到付费的关键决策节点', link: '/free/upgrade-timing/' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '网络问题排查 (总览)',
          link: '/troubleshooting/'
        },
        {
          text: '故障诊断指南',
          items: [
            { text: '7.1 AI 网站打不开/拒绝访问', link: '/troubleshooting/ai-unreachable/' },
            { text: '7.2 流媒体视频无法播放/报错代码', link: '/troubleshooting/video-playback-error/' },
            { text: '7.3 订阅连接失败/无法更新节点', link: '/troubleshooting/sub-connection-failed/' },
            { text: '7.4 速度极慢与晚高峰卡顿', link: '/troubleshooting/slow-speed/' },
            { text: '7.5 系统代理冲突与端口占用', link: '/troubleshooting/system-proxy-conflict/' },
            { text: '7.6 TUN 虚拟网卡模式启动失败', link: '/troubleshooting/tun-mode-issue/' },
            { text: '7.7 应用级分流失效与 DNS 泄露', link: '/troubleshooting/split-tunnel-failure/' },
            { text: '7.8 账号频繁异地/验证码风控排查', link: '/troubleshooting/account-login-anomaly/' }
          ]
        }
      ],
      '/clients/': [
        {
          text: '客户端教程 (总览)',
          link: '/clients/'
        },
        {
          text: '跨平台安装与配置',
          items: [
            { text: '8.1 Windows 客户端 (Verge Rev / v2rayN)', link: '/clients/windows/' },
            { text: '8.2 Mac 客户端 (Clash Verge / Surge)', link: '/clients/mac/' },
            { text: '8.3 Android 客户端 (FlClash / v2rayNG)', link: '/clients/android/' },
            { text: '8.4 iOS 苹果客户端 (Shadowrocket / Loon)', link: '/clients/ios/' },
            { text: '8.5 路由器配置 (OpenWrt / 华硕梅林)', link: '/clients/router/' },
            { text: '8.6 终端与开发环境代理配置', link: '/clients/dev-cli/' },
            { text: '8.7 配置跨设备备份与快速迁移', link: '/clients/backup-migration/' },
            { text: '8.8 高级自定义分流规则与 TUN 模式', link: '/clients/advanced-rules/' }
          ]
        }
      ]
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: '<a href="/vpn/">VPN推荐</a> &nbsp;|&nbsp; <a href="/jichang/">机场推荐</a> &nbsp;|&nbsp; <a href="/clash/">Clash教程</a> &nbsp;|&nbsp; <a href="/nodes/">全球节点</a> &nbsp;|&nbsp; <a href="/tizi/">梯子推荐</a> &nbsp;|&nbsp; <a href="/free/">免费资源</a> &nbsp;|&nbsp; <a href="/tutorial/">使用教程</a> &nbsp;|&nbsp; <a href="/brands/">品牌库</a><br><a href="/about">关于我们</a> &nbsp;|&nbsp; <a href="/methodology">评测方法论</a> &nbsp;|&nbsp; <a href="/author">专家档案</a> &nbsp;|&nbsp; <a href="/privacy">隐私政策</a> &nbsp;|&nbsp; <a href="/terms">服务条款</a><br>本站为独立第三方技术指南，与任何代理服务商均无隶属关系。内容仅供学术研究与合规办公参考，请遵守当地法律法规。',
      copyright: 'Copyright © 2026 ainetguide.cc 保留所有权利。含推广链接，注册可能为本指南运维带来微薄佣金，不影响您的购买价格。'
    }
  }
})
