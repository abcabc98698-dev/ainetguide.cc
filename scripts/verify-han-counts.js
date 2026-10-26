import fs from 'node:fs'

const files = [
  'docs/index.md',
  'docs/demand/index.md',
  'docs/ai-guide/index.md',
  'docs/streaming/index.md',
  'docs/work-study/index.md',
  'docs/providers/index.md',
  'docs/free/index.md',
  'docs/troubleshooting/index.md',
  'docs/clients/index.md'
]

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8')
  let body = content
  if (content.startsWith('---')) {
    const parts = content.split('---')
    if (parts.length >= 3) body = parts.slice(2).join('---')
  }
  body = body.replace(/```[\s\S]*?```/g, '')
  body = body.replace(/`[^`]+`/g, '')
  body = body.replace(/<!--[\s\S]*?-->/g, '')
  body = body.replace(/<[^>]+>/g, '')
  body = body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  body = body.replace(/https?:\/\/[^\s]+/g, '')
  const m = body.match(/[\u4e00-\u9fa5]/g)
  console.log(`${f}: ${m ? m.length : 0} 纯汉字 | ${content.length} 总字符`)
})
