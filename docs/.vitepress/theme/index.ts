import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './custom.css'

import BrandCard from './components/BrandCard.vue'
import AffiliateLink from './components/AffiliateLink.vue'
import DataStatusBadge from './components/DataStatusBadge.vue'
import AuthorByline from './components/AuthorByline.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(AuthorByline)
    })
  },
  enhanceApp({ app, router }) {
    app.component('BrandCard', BrandCard)
    app.component('AffiliateLink', AffiliateLink)
    app.component('DataStatusBadge', DataStatusBadge)
    app.component('AuthorByline', AuthorByline)

    // 客户端合规：拦截所有外部链接，确保无遗漏注入 nofollow sponsored noopener
    if (typeof window !== 'undefined') {
      window.addEventListener('click', (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest('a')
        if (!target) return
        const href = target.getAttribute('href')
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          const currentHost = window.location.host
          if (!href.includes(currentHost)) {
            target.setAttribute('target', '_blank')
            target.setAttribute('rel', 'nofollow sponsored noopener')
          }
        }
      }, true)
    }
  }
} satisfies Theme
