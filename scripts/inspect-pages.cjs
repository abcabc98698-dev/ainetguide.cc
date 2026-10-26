const fs = require('fs');
const path = require('path');
const sitemap = fs.readFileSync('docs/.vitepress/dist/sitemap.xml', 'utf8');

const list = [
  { name: '首页', file: 'index.html', url: 'https://ainetguide.cc/' },
  { name: 'VPN', file: 'vpn/index.html', url: 'https://ainetguide.cc/vpn/' },
  { name: '机场推荐', file: 'jichang/index.html', url: 'https://ainetguide.cc/jichang/' },
  { name: 'Clash', file: 'clash/index.html', url: 'https://ainetguide.cc/clash/' },
  { name: '节点', file: 'nodes/index.html', url: 'https://ainetguide.cc/nodes/' },
  { name: '梯子', file: 'tizi/index.html', url: 'https://ainetguide.cc/tizi/' },
  { name: '免费资源', file: 'free/index.html', url: 'https://ainetguide.cc/free/' },
  { name: '使用教程', file: 'tutorial/index.html', url: 'https://ainetguide.cc/tutorial/' },
  { name: '品牌库', file: 'brands/index.html', url: 'https://ainetguide.cc/brands/' }
];

list.forEach(item => {
  const fp = path.resolve('docs/.vitepress/dist', item.file);
  const exists = fs.existsSync(fp);
  const html = exists ? fs.readFileSync(fp, 'utf8') : '';
  const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '无';
  const desc = (html.match(/<meta name="description" content="(.*?)"/) || [])[1] || '无';
  const canonical = (html.match(/<link rel="canonical" href="(.*?)"/) || [])[1] || '无';
  const robots = (html.match(/<meta name="robots" content="(.*?)"/) || [])[1] || '无';
  const inSitemap = sitemap.includes('<loc>' + item.url + '</loc>');
  console.log(JSON.stringify({
    name: item.name,
    file: item.file,
    url: item.url,
    exists,
    title,
    descPreview: desc.slice(0, 60),
    canonical,
    robots,
    inSitemap
  }, null, 2));
});
