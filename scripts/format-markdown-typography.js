import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsDir = path.resolve(rootDir, 'docs')

/**
 * 盘古之白 (Pangu Spacing) 与中文排版规范化工具
 * 严格保护：
 * 1. YAML Frontmatter (包括复杂 JSON-LD Schema)
 * 2. 多行代码块 (```...```) 与 ASCII 决策树、配置示例
 * 3. 行内代码 (`...`)
 * 4. HTML 标签 (<BrandCard ... />, <DataStatusBadge ... /> 等)
 * 5. Markdown 链接的目标 URL ([标题](URL))
 */

function formatProseTypography(text) {
  let s = text

  // 1. 中文与英文/数字之间插入单个空格 (盘古之白)
  // 中文后接英文/数字: (汉字)([a-zA-Z0-9]) -> $1 $2
  s = s.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2')

  // 英文/数字后接中文: ([a-zA-Z0-9])([\u4e00-\u9fa5]) -> $1 $2
  s = s.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2')

  // 2. 清理全角标点符号与汉字之间不必要的误空格
  s = s.replace(/([\u4e00-\u9fa5]) +([，。！？；：、）】》”’])/g, '$1$2')
  s = s.replace(/([（【《“‘]) +([\u4e00-\u9fa5])/g, '$1$2')

  return s
}

function processMarkdownContent(content) {
  // 分离 Frontmatter
  let frontmatter = ''
  let body = content

  if (content.startsWith('---')) {
    const endIdx = content.indexOf('\n---', 3)
    if (endIdx !== -1) {
      frontmatter = content.slice(0, endIdx + 4)
      body = content.slice(endIdx + 4)
    }
  }

  // 保护并提取占位符
  const placeholders = []
  let placeholderCounter = 0

  function createPlaceholder(raw) {
    const key = `___PANGU_TOKEN_${placeholderCounter++}___`
    placeholders.push({ key, raw })
    return key
  }

  // 1. 保护多行代码块 ```...```
  body = body.replace(/```[\s\S]*?```/g, (match) => createPlaceholder(match))

  // 2. 保护行内代码 `...`
  body = body.replace(/`[^`\n]+`/g, (match) => createPlaceholder(match))

  // 3. 保护 HTML 标签 <...> (注意不破坏普通文本)
  body = body.replace(/<[a-zA-Z\/][^>]*>/g, (match) => createPlaceholder(match))

  // 4. 保护 Markdown 链接的目标 URL 部分 [text](url) -> 仅保护 (url)
  body = body.replace(/(\[[^\]]+\])\(([^)\s]+)\)/g, (match, textPart, urlPart) => {
    const urlPlaceholder = createPlaceholder(`(${urlPart})`)
    return `${textPart}${urlPlaceholder}`
  })

  // 5. 对纯文本段落按行处理
  const lines = body.split('\n')
  const formattedLines = lines.map((line) => {
    // 忽略行首已是特殊标记的情况
    const trimmed = line.trimEnd()
    return formatProseTypography(trimmed)
  })

  let formattedBody = formattedLines.join('\n')

  // 恢复所有占位符 (逆序恢复防止嵌套)
  for (let i = placeholders.length - 1; i >= 0; i--) {
    const { key, raw } = placeholders[i]
    formattedBody = formattedBody.replace(key, () => raw)
  }

  // 规范化多余空行：最多保留两个连续换行
  formattedBody = formattedBody.replace(/\n{3,}/g, '\n\n')

  return frontmatter + formattedBody
}

function getAllMarkdownFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      if (file !== '.vitepress' && file !== 'node_modules') {
        results = results.concat(getAllMarkdownFiles(filePath))
      }
    } else if (file.endsWith('.md')) {
      results.push(filePath)
    }
  }
  return results
}

function run() {
  console.log('🚀 开始全站 Markdown 排版细节规范化清洗...')
  const files = getAllMarkdownFiles(docsDir)
  console.log(`📁 扫描到 Markdown 文件总数: ${files.length}`)

  let modifiedCount = 0

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf-8')
    const formatted = processMarkdownContent(original)
    if (formatted !== original) {
      fs.writeFileSync(filePath, formatted, 'utf-8')
      modifiedCount++
    }
  }

  console.log(`✅ 排版清洗完成！共处理 ${files.length} 个文件，其中规范优化了 ${modifiedCount} 个文件。`)
}

run()
