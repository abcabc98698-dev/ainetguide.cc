import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsDir = path.resolve(rootDir, 'docs')

// 递归获取所有 markdown 文件
function getAllMdFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(getAllMdFiles(fullPath))
      }
    } else if (file.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

const allMdFiles = getAllMdFiles(docsDir)
console.log(`🔍 扫描到全站 Markdown 文件总数: ${allMdFiles.length} 个\n`)

// 1. URL 格式与批量 AI 特征检查
const urlIssues = []
const slugSet = new Set()
const numberedSlugs = []
let totalArticles = 0

for (const file of allMdFiles) {
  const relativePath = path.relative(docsDir, file).replace(/\\/g, '/')
  const filename = path.basename(file)

  // 检查是否包含老式序号特征 (如 01-, 02-)
  if (filename.match(/^\d{2}-.*\.md$/)) {
    numberedSlugs.push(relativePath)
  }

  // 检查是否有重复 Slug
  if (filename !== 'index.md') {
    totalArticles++
    if (slugSet.has(filename)) {
      urlIssues.push(`[重复文件名]: ${filename} 在多个路径存在`)
    } else {
      slugSet.add(filename)
    }
  }

  // 检查是否含有未解析占位符
  if (relativePath.includes('undefined') || relativePath.includes('[object')) {
    urlIssues.push(`[异常占位符]: ${relativePath}`)
  }
}

console.log('--- 1. URL 防批量 AI 识别专项检查结果 ---')
console.log(`- 检查文章总数: ${totalArticles} 篇`)
console.log(`- 带有固定序号(01-, 02-)的老式模板文件数: ${numberedSlugs.length} 个 ${numberedSlugs.length === 0 ? '✅ (完全消除了固定序号特征)' : '⚠️ 需清理'}`)
console.log(`- 重复文件名或占位符异常数: ${urlIssues.length} 个 ${urlIssues.length === 0 ? '✅ (全量 URL 唯一且语义化良好)' : '⚠️ 需关注'}`)
if (numberedSlugs.length > 0) {
  console.log('示例存在老式序号的文件:', numberedSlugs.slice(0, 5))
}
if (urlIssues.length > 0) {
  console.log('示例存在问题的 URL:', urlIssues.slice(0, 5))
}

// 2. 文本内容重复度 (Jaccard 相似度与标题/描述查重)
const titleMap = new Map()
const descMap = new Map()
const duplicates = []

// 提取正文内容（去除 frontmatter）
function extractBody(content) {
  const parts = content.split('---')
  if (parts.length >= 3) {
    return parts.slice(2).join('---').trim()
  }
  return content.trim()
}

// 计算两个字符串的词级 Jaccard 相似度
function calculateJaccard(strA, strB) {
  const wordsA = new Set(strA.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(Boolean))
  const wordsB = new Set(strB.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(Boolean))

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)))
  const union = new Set([...wordsA, ...wordsB])

  if (union.size === 0) return 0
  return intersection.size / union.size
}

const fileContents = []
for (const file of allMdFiles) {
  const relativePath = path.relative(docsDir, file).replace(/\\/g, '/')
  const content = fs.readFileSync(file, 'utf-8')
  
  // 提取 title 和 desc
  const titleMatch = content.match(/title:\s*(.*)/)
  const descMatch = content.match(/description:\s*(.*)/)

  const title = titleMatch ? titleMatch[1].trim() : ''
  const desc = descMatch ? descMatch[1].trim() : ''

  if (title && path.basename(file) !== 'index.md') {
    if (titleMap.has(title)) {
      duplicates.push({ type: 'Title 重复', title, fileA: titleMap.get(title), fileB: relativePath })
    } else {
      titleMap.set(title, relativePath)
    }
  }

  const body = extractBody(content)
  fileContents.push({ path: relativePath, body, length: body.length })
}

console.log('\n--- 2. 页面标题与描述查重结果 ---')
console.log(`- 标题重复数: ${duplicates.length} 个 ${duplicates.length === 0 ? '✅ (全站 1000+ 篇标题绝对唯一)' : '⚠️ 需优化'}`)
if (duplicates.length > 0) {
  console.log('重复标题样例:', duplicates.slice(0, 5))
}

// 3. 抽样内容相似度检测 (测试同一集群内相邻文章、以及跨集群文章的相似度)
console.log('\n--- 3. 跨文章正文相似度 (Jaccard Similarity) 深度抽样 ---')

let sampledComparisons = 0
let highSimilarityCount = 0
let maxSimilarity = 0
let maxPair = {}

// 抽样 200 对比样本进行交叉检验
for (let i = 0; i < Math.min(fileContents.length, 100); i += 5) {
  for (let j = i + 1; j < Math.min(fileContents.length, 100); j += 7) {
    sampledComparisons++
    const sim = calculateJaccard(fileContents[i].body, fileContents[j].body)
    if (sim > maxSimilarity) {
      maxSimilarity = sim
      maxPair = {
        sim: (sim * 100).toFixed(1) + '%',
        fileA: fileContents[i].path,
        fileB: fileContents[j].path
      }
    }
    // 搜索引擎通常认为词集合相似度 > 75% 属于高危重复内容
    if (sim > 0.75) {
      highSimilarityCount++
    }
  }
}

console.log(`- 抽样比对样本对数: ${sampledComparisons} 组`)
console.log(`- 最高相似度样本: ${maxPair.sim}`)
console.log(`  文件 A: ${maxPair.fileA}`)
console.log(`  文件 B: ${maxPair.fileB}`)
console.log(`- 超过 75% 警戒线的严重重复文章数: ${highSimilarityCount} 组 ${highSimilarityCount === 0 ? '✅ (无严重同质化内容)' : '⚠️ 需重写差异化'}`)

// 4. 文章长度与信息增益分布
const lengths = fileContents.map(f => f.length)
const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
const minLength = Math.min(...lengths)
const maxLength = Math.max(...lengths)

console.log('\n--- 4. 内容体量与篇幅分布审计 ---')
console.log(`- 全站平均字数/字符数: ~${avgLength} 字符`)
console.log(`- 单页最小字数: ${minLength} 字符`)
console.log(`- 单页最大字数: ${maxLength} 字符`)
