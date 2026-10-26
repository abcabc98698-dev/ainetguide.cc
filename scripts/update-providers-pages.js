import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brands } from '../docs/data/brands.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsDir = path.resolve(rootDir, 'docs')

// 1. 生成 42 家品牌的完整横向技术对比表 Markdown
const brandTableRows = brands.map((b) => {
  const logoMd = b.logo ? `<img src="${b.logo}" style="width:24px; height:24px; vertical-align:middle; display:inline-block; margin-right:4px;" />` : ''
  const nameMd = b.reviewUrl ? `[${logoMd}**${b.name}**](${b.reviewUrl})` : `${logoMd}**${b.name}**`
  const couponMd = b.couponCode ? `\`${b.couponCode}\`` : '-'
  const speedtestMd = b.speedtestImage ? `[📊 测速图](${b.reviewUrl})` : '-'
  const affBtn = `<AffiliateLink href="${b.registerUrl}" :is-btn="false">直达官网</AffiliateLink>`
  const reportBtn = b.reviewUrl ? `[实测报告](${b.reviewUrl})` : '-'

  return `| TOP ${b.rank} | ${nameMd} | ${b.price} | ${couponMd} | \`${b.protocols[0] || 'SS'}\` | ${b.sla} | ${speedtestMd} | ${reportBtn} | ${affBtn} |`
}).join('\n')

const brandsComparisonContent = `---
layout: doc
title: 42家主流机场品牌横向大横评与深度实测大全 | 2026权威选型
description: 42 家主流机场品牌清单、独家优惠码、实测测速跑分图、Netflix/Disney+与ChatGPT解锁状态全景对比表。
---

<div class="answer-first-callout">
  <div class="af-title">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    42 家品牌大横评：选型速查结论
  </div>
  <p>
    <strong>主推第一梯队：</strong> 追求极致稳定与企业办公首选 <strong>光速云</strong>（IEPL全专线+双线路，实测 529Mbps，优惠码 <code>AMM</code>）；新手免配置与轻快首选 <strong>飞猫云</strong>（专属客户端扫码即连，优惠码 <code>flycat888</code>）；平价高性价比首选 <strong>微风网络</strong>（7元档IEPL专线，优惠码 <code>flat888</code>）。下方汇总了全部 42 家品牌实测数据与优惠码。
  </p>
</div>

<div class="disclosure-banner">
  <span>📌 <strong>合规与推广声明：</strong> 本站评测基于真实网络环境跑分。文内部分链接包含推广参数，不影响用户最终支付价格。未知数据标记为历史归档，拒绝任何虚构评分。</span>
</div>

# 42 家主流机场品牌横向技术对比大全

本数据库收录了 2026 年最新活跃的 **42 家主流跨境网络服务商**，涵盖纯内网专线（IPLC/IEPL）、多线 BGP 中继与抗封锁新协议（VLESS Reality / Hysteria 2）。针对拥有实测跑分截图的重点品牌，提供端到端深度测评报告。

---

## 42 家品牌技术参数与专属优惠码速查表

| 排名 | 品牌名称 | 起步参考资费 | 独家优惠码 | 主协议 | 可用性SLA | 节点测速实测 | 深度评测 | 官网通道 |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |
${brandTableRows}

---

## 重点主推品牌实测卡片直达

<div class="brand-showcase-container">
  <BrandCard brand-id="guangsu-cloud" />
  <BrandCard brand-id="feimao-cloud" />
  <BrandCard brand-id="weifeng-net" />
  <BrandCard brand-id="xingdaomeng" />
  <BrandCard brand-id="ermao-cloud" />
  <BrandCard brand-id="weitu-cloud" />
</div>

---

## 下辖技术集群矩阵

<div class="matrix-grid">
  <a href="/providers/brands-comparison/history-background-matrix/" class="matrix-card">
    <div class="matrix-card-title">🎯 历史与背景 (品牌溯源)</div>
    <p class="matrix-card-desc">深入分析 42 家服务商的上游链路来源、运营历史资质与技术演进。</p>
    <div class="matrix-card-count">包含 8 篇深度技术实战长文</div>
  </a>
  <a href="/providers/brands-comparison/pitfall-avoidance-guide/" class="matrix-card">
    <div class="matrix-card-title">🎯 避坑指南 (财务与防失联)</div>
    <p class="matrix-card-desc">识别骨折低价陷阱、月付与主备容灾策略、节点健康度排查。</p>
    <div class="matrix-card-count">包含 8 篇深度技术实战长文</div>
  </a>
</div>

<!-- JSON-LD Schema will be injected here -->
`

fs.writeFileSync(path.join(docsDir, 'providers/brands-comparison/index.md'), brandsComparisonContent, 'utf-8')
console.log('✅ 已更新 docs/providers/brands-comparison/index.md 包含完整 42 品牌大表格！')

// 2. 更新 docs/providers/index.md 中的推荐卡片
const providersIndexPath = path.join(docsDir, 'providers/index.md')
let providersIndex = fs.readFileSync(providersIndexPath, 'utf-8')

const targetSection = `## 真实变现与严选服务商直达展示

以下展示经过严格评测、最契合 **机场推荐** 业务场景的标杆服务商：

<div class="brand-showcase-container">
  <BrandCard brand-id="guangsu-cloud" />
  <BrandCard brand-id="feimao-cloud" />
  <BrandCard brand-id="weifeng-net" />
  <BrandCard brand-id="muguang-acc" />
  <BrandCard brand-id="xingdaomeng" />
  <BrandCard brand-id="ermao-cloud" />
</div>`

// 检查是否包含老展示，做替换
if (providersIndex.includes('<BrandCard brand-id="guangsu-cloud" />')) {
  providersIndex = providersIndex.replace(
    /## 真实变现与严选服务商直达展示[\s\S]*?<\/div>/,
    targetSection
  )
  fs.writeFileSync(providersIndexPath, providersIndex, 'utf-8')
  console.log('✅ 已更新 docs/providers/index.md 展示前 6 大主推品牌卡片！')
}
