import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsDir = path.resolve(rootDir, 'docs')
const distDir = path.resolve(docsDir, '.vitepress', 'dist')

function getAllFiles(dir, ext = '.md') {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(getAllFiles(fullPath, ext))
      }
    } else if (file.endsWith(ext)) {
      results.push(fullPath)
    }
  }
  return results
}

const mdFiles = getAllFiles(docsDir, '.md')

console.log(`=== 开始 SEO 技术与内容全面审计 ===`)
console.log(`扫描 Markdown 总数: ${mdFiles.length}`)

// 1. Robots.txt 检查
const robotsExists = fs.existsSync(path.join(docsDir, 'public', 'robots.txt'))
console.log(`1.1 robots.txt 存在: ${robotsExists}`)

// 2. Sitemap 检查
const sitemapPath = path.join(distDir, 'sitemap.xml')
const sitemapExists = fs.existsSync(sitemapPath)
let sitemapUrls = []
let sitemapHasLastmod = false
if (sitemapExists) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []
  sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''))
  sitemapHasLastmod = sitemapContent.includes('<lastmod>')
}
console.log(`1.3 sitemap 存在: ${sitemapExists}, URL 总数: ${sitemapUrls.length}, 包含 lastmod: ${sitemapHasLastmod}`)

// 3. 页面字数与深度统计
const thin300 = []
const thin500 = []
const titleMap = new Map()
const descMap = new Map()
const h1Map = new Map()
const dupTitles = []
const dupDescs = []
const dupH1s = []

// 4. E-E-A-T 检查
let pagesWithAuthor = 0
let pagesWithoutAuthor = 0
const missingAuthorList = []

// 5. 联盟链接与合规检查
let totalOutboundLinks = 0
let markedAffiliateLinks = 0
let unmarkedAffiliateLinks = []
let pagesWithDisclosure = 0
let pagesWithoutDisclosure = []

// 6. 内部链接与死链检查
const allValidPaths = new Set(mdFiles.map(f => {
  let rel = path.relative(docsDir, f).replace(/\\/g, '/')
  return rel.replace(/\.md$/, '')
}))

let emptyLinks = 0
let hashLinks = 0
let brokenInternalLinks = []
const incomingLinksCount = new Map()
allValidPaths.forEach(p => incomingLinksCount.set(p, 0))

// 7. 日期检查
let olderThan6Months = 0
let olderThan12Months = 0
const now = new Date('2026-10-26T00:00:00Z').getTime()

mdFiles.forEach(f => {
  const rel = path.relative(docsDir, f).replace(/\\/g, '/')
  const content = fs.readFileSync(f, 'utf8')
  const cleanRel = rel.replace(/\.md$/, '')

  // 提取正文
  let body = content
  if (content.startsWith('---')) {
    const parts = content.split('---')
    if (parts.length >= 3) body = parts.slice(2).join('---')
  }

  // 汉字+英文纯正文长度
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '').trim()
  const charCount = prose.length

  if (charCount < 300) thin300.push({ file: rel, len: charCount })
  else if (charCount < 500) thin500.push({ file: rel, len: charCount })

  // Title / Desc / H1
  const tMatch = content.match(/title:\s*["']?(.*?)["']?\r?\n/)
  const dMatch = content.match(/description:\s*["']?(.*?)["']?\r?\n/)
  const hMatch = content.match(/^#\s+(.+)$/m)

  const title = tMatch ? tMatch[1].trim() : ''
  const desc = dMatch ? dMatch[1].trim() : ''
  const h1 = hMatch ? hMatch[1].trim() : ''

  if (title && !rel.endsWith('index.md')) {
    if (titleMap.has(title)) dupTitles.push({ title, a: titleMap.get(title), b: rel })
    else titleMap.set(title, rel)
  }
  if (desc && !rel.endsWith('index.md')) {
    if (descMap.has(desc)) dupDescs.push({ desc, a: descMap.get(desc), b: rel })
    else descMap.set(desc, rel)
  }
  if (h1 && !rel.endsWith('index.md')) {
    if (h1Map.has(h1)) dupH1s.push({ h1, a: h1Map.get(h1), b: rel })
    else h1Map.set(h1, rel)
  }

  // 作者检查
  if (content.includes('author:') || content.includes('ainetguide.cc 技术架构实验室') || content.includes('作者：')) {
    pagesWithAuthor++
  } else {
    pagesWithoutAuthor++
    missingAuthorList.push(rel)
  }

  // 日期检查
  const dateMatch = content.match(/date:\s*["']?(.*?)["']?\r?\n/) || content.match(/lastUpdated:\s*["']?(.*?)["']?\r?\n/)
  if (dateMatch) {
    const pDate = new Date(dateMatch[1]).getTime()
    if (!isNaN(pDate)) {
      const diffDays = (now - pDate) / (1000 * 3600 * 24)
      if (diffDays > 365) olderThan12Months++
      else if (diffDays > 180) olderThan6Months++
    }
  }

  // 推广披露
  if (content.includes('disclosure-banner') || content.includes('推广合作') || content.includes('含推广链接')) {
    pagesWithDisclosure++
  } else if (!rel.endsWith('index.md') && content.includes('http')) {
    pagesWithoutDisclosure.push(rel)
  }

  // 链接扫描 (Markdown 链接)
  const linkMatches = content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)
  for (const m of linkMatches) {
    const rawTarget = m[2].trim()
    if (rawTarget === '') emptyLinks++
    else if (rawTarget === '#') hashLinks++
    else if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
      if (!rawTarget.includes('ainetguide.cc')) {
        totalOutboundLinks++
        // 检查在 markdown 源码中是否有标注
        // 注意：商业外链如果直接写在 markdown 中是否带有 rel="nofollow"
      }
    } else {
      // 内部链接
      let targetPath = rawTarget.split('#')[0].replace(/^\//, '').replace(/\.md$/, '').replace(/\/$/, '')
      if (targetPath === '') targetPath = 'index'
      if (allValidPaths.has(targetPath)) {
        incomingLinksCount.set(targetPath, (incomingLinksCount.get(targetPath) || 0) + 1)
      } else if (targetPath.length > 0 && !targetPath.startsWith('mailto:') && !targetPath.startsWith('javascript:')) {
        brokenInternalLinks.push({ source: rel, target: rawTarget })
      }
    }
  }
})

console.log(`2.1 内容深度: <300字: ${thin300.length}, 300-500字: ${thin500.length}`)
console.log(`2.3 重复 Title: ${dupTitles.length}, 重复 Desc: ${dupDescs.length}, 重复 H1: ${dupH1s.length}`)
console.log(`2.4 日期: >6个月: ${olderThan6Months}, >12个月: ${olderThan12Months}`)
console.log(`3.1 作者署名: 有作者: ${pagesWithAuthor}, 无作者: ${pagesWithoutAuthor}`)
console.log(`4.1 外链总数: ${totalOutboundLinks}`)
console.log(`4.2 披露框存在页数: ${pagesWithDisclosure}`)
console.log(`5.1 内部空链接: ${emptyLinks}, Hash链接: ${hashLinks}, 死链数: ${brokenInternalLinks.length}`)

// 孤立页面检查
let orphanCount = 0
const orphanList = []
incomingLinksCount.forEach((count, page) => {
  if (count === 0 && page !== 'index') {
    orphanCount++
    if (orphanList.length < 10) orphanList.push(page)
  }
})
console.log(`5.3 孤立页面 (0内链指向): ${orphanCount}`)

// 保存详细审计数据供报告生成使用
const auditReportData = {
  robotsExists,
  sitemapExists,
  sitemapCount: sitemapUrls.length,
  sitemapHasLastmod,
  thin300Count: thin300.length,
  thin300List: thin300.slice(0, 10),
  thin500Count: thin500.length,
  dupTitlesCount: dupTitles.length,
  dupDescsCount: dupDescs.length,
  dupH1sCount: dupH1s.length,
  pagesWithAuthor,
  pagesWithoutAuthor,
  olderThan6Months,
  olderThan12Months,
  totalOutboundLinks,
  pagesWithDisclosure,
  emptyLinks,
  hashLinks,
  brokenInternalLinksCount: brokenInternalLinks.length,
  brokenInternalLinksSample: brokenInternalLinks.slice(0, 10),
  orphanCount,
  orphanSample: orphanList
}

fs.writeFileSync(path.join(__dirname, 'audit-raw-data.json'), JSON.stringify(auditReportData, null, 2), 'utf8')
console.log(`✅ 原始技术审计数据已导出至 scripts/audit-raw-data.json`)
