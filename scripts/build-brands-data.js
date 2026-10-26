import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const txtPath = path.resolve(rootDir, '../机场品牌信息/42家机场品牌清单.txt')

const content = fs.readFileSync(txtPath, 'utf-8')

// 1. Logo 映射表
const logoMap = {
  '光速云': '/images/logos/光速云主图.png',
  '飞猫云': '/images/logos/飞猫云主图.png',
  '微风网络': '/images/logos/bee_logo.webp',
  '二猫云': '/images/logos/2mao_logo.webp',
  '一翻云': '/images/logos/1fly_logo.webp',
  'EdgeNova': '/images/logos/edgenova_logo.webp',
  'Firefly': '/images/logos/fclogo.webp',
  'FlyingBird': '/images/logos/flyingbird.webp',
  '青云梯': '/images/logos/qyt_logo.webp',
  'SOGO云': '/images/logos/sogo.webp',
  '速界': '/images/logos/sujie_logo.webp',
  'TNTCloud': '/images/logos/TNT.webp',
  '龙猫云': '/images/logos/totoro.webp',
  'U1S1': '/images/logos/u1s1主图.png',
  '唯兔云': '/images/logos/v2云主图.png',
  '星岛梦': '/images/logos/xdm_logo.webp',
  '宇宙云': '/images/logos/yuzhou_logo.webp',
  '光年梯': '/images/logos/光年梯主图.png',
  '全球云': '/images/logos/全球云主图.png',
  '极连云': '/images/logos/极连云主图.png',
  '梯子云': '/images/logos/梯子云256x256.png',
  '灵动云': '/images/logos/灵动云256x256.png',
  '隐形人': '/images/logos/隐形人256x256.png'
}

// 2. 测速图映射表
const speedtestMap = {
  'SOGO云': '/images/speedtest/SOGO云-节点测速实测.png',
  'U1S1': '/images/speedtest/U1S1-节点测速实测.png',
  '一翻云': '/images/speedtest/一翻云-节点测速实测.png',
  '二猫云': '/images/speedtest/二猫云-节点测速实测.png',
  '光年梯': '/images/speedtest/光年梯-节点测速实测.png',
  '光速云': '/images/speedtest/光速云-节点测速实测.png',
  '全球云': '/images/speedtest/全球云-节点测速实测.png',
  '可信云': '/images/speedtest/可信云-节点测速实测.png',
  '唯兔云': '/images/speedtest/唯兔云-节点测速实测.png',
  '宇宙云': '/images/speedtest/宇宙云-节点测速实测.png',
  '暮光加速': '/images/speedtest/幕光加速-节点测速实测.png',
  '微风网络': '/images/speedtest/微风-节点测速实测.png',
  '星岛梦': '/images/speedtest/星岛梦-节点测速实测.png',
  '极连云': '/images/speedtest/极连云-节点测速实测.png',
  '灵猫网络': '/images/speedtest/灵猫网络-节点测速实测.png',
  '速界': '/images/speedtest/速界-节点测速实测.png',
  '飞猫云': '/images/speedtest/飞猫云-节点测速实测.png'
}

// 3. 解锁图映射表
const unlockMap = {
  '光速云': [
    '/images/unlock/photo_2026-08-19_12-13-01.jpg',
    '/images/unlock/photo_2026-08-19_12-13-50.jpg',
    '/images/unlock/photo_2026-08-19_12-13-58.jpg',
    '/images/unlock/photo_2026-08-19_12-18-40.jpg',
    '/images/unlock/photo_2026-08-19_12-20-10.jpg',
    '/images/unlock/photo_2026-09-07_12-51-58.jpg',
    '/images/unlock/photo_2026-09-07_12-51-59.jpg'
  ]
}

console.log('Script initialized, reading file...');
