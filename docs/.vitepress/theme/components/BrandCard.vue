<template>
  <div v-if="selectedBrand" class="brand-card card">
    <div class="brand-header">
      <div class="brand-rank-title">
        <span class="rank-badge" :class="rankBadgeClass">TOP {{ selectedBrand.rank }}</span>
        <img
          v-if="selectedBrand.logo"
          :src="selectedBrand.logo"
          :alt="selectedBrand.name"
          class="brand-logo-img"
        />
        <div>
          <h3 class="brand-name">{{ selectedBrand.name }}</h3>
          <span v-if="selectedBrand.operatingSince" class="operating-year-tag">
            {{ selectedBrand.operatingSince }}
          </span>
        </div>
      </div>
      <div class="brand-meta-right">
        <DataStatusBadge :status="selectedBrand.dataStatus" :date="selectedBrand.lastChecked" />
      </div>
    </div>

    <div class="brand-tagline">{{ selectedBrand.tagline }}</div>

    <div class="brand-price-row">
      <span class="price-val">{{ selectedBrand.price }}</span>
      <span class="sla-badge" title="服务可用性承诺">SLA: {{ selectedBrand.sla }}</span>
      <span v-if="selectedBrand.speedtestImage" class="has-speedtest-badge" title="包含全节点测速截图">
        📊 测速图已收录
      </span>
    </div>

    <!-- 优惠券码高亮展示与一键复制 -->
    <div
      v-if="selectedBrand.couponCode"
      class="coupon-highlight-box"
      @click="copyCoupon(selectedBrand.couponCode)"
      :title="'点击一键复制专属优惠码: ' + selectedBrand.couponCode"
    >
      <span class="coupon-icon">🎁</span>
      <span class="coupon-label">专属优惠码:</span>
      <code class="coupon-code-text">{{ selectedBrand.couponCode }}</code>
      <span v-if="selectedBrand.discountInfo" class="coupon-desc">({{ selectedBrand.discountInfo }})</span>
      <button class="coupon-copy-btn" type="button" :class="{ copied: isCopied }">
        {{ isCopied ? '✓ 已复制' : '复制' }}
      </button>
    </div>

    <!-- 推荐场景标签 -->
    <div class="scenario-tags">
      <span
        v-for="sc in selectedBrand.recommendedScenarios"
        :key="sc"
        class="scenario-pill"
      >
        #{{ formatScenario(sc) }}
      </span>
    </div>

    <!-- 核心特性列表 -->
    <ul class="brand-features">
      <li v-for="(feat, idx) in selectedBrand.features.slice(0, 4)" :key="idx">
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span>{{ feat }}</span>
      </li>
    </ul>

    <!-- 协议支持 -->
    <div class="protocols-line">
      <span class="protocol-title">传输协议:</span>
      <span v-for="proto in selectedBrand.protocols" :key="proto" class="proto-tag">
        {{ proto }}
      </span>
    </div>

    <!-- 动作与合规直达 -->
    <div class="brand-action-area">
      <div class="button-row">
        <a
          v-if="selectedBrand.reviewUrl"
          :href="selectedBrand.reviewUrl"
          class="review-detail-btn"
        >
          查看深度实测报告
        </a>
        <AffiliateLink
          :href="selectedBrand.registerUrl"
          :is-btn="true"
          class="brand-cta-btn"
        >
          直达官网了解详情
        </AffiliateLink>
      </div>
      <div class="affiliate-disclosure">
        *含推广合作，通过此链接注册可能为本指南带来维护佣金，不会增加您的购买价格。
      </div>
    </div>
  </div>

  <!-- 多品牌网格展示模式 -->
  <div v-else-if="filteredList.length > 0" class="brand-showcase-container">
    <BrandCard
      v-for="b in filteredList"
      :key="b.id"
      :brand="b"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { brands, type BrandItem } from '../../../data/brands'
import AffiliateLink from './AffiliateLink.vue'
import DataStatusBadge from './DataStatusBadge.vue'

const isCopied = ref(false)

async function copyCoupon(code: string) {
  if (!code) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(code)
    } else if (typeof document !== 'undefined') {
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2200)
  } catch (e) {
    console.error('Failed to copy coupon', e)
  }
}

const props = withDefaults(
  defineProps<{
    brandId?: string
    brand?: BrandItem
    scenario?: string
    limit?: number
  }>(),
  {
    brandId: '',
    scenario: '',
    limit: 3
  }
)

const selectedBrand = computed<BrandItem | null>(() => {
  if (props.brand) return props.brand
  if (props.brandId) {
    return brands.find((b) => b.id === props.brandId) || null
  }
  return null
})

const filteredList = computed<BrandItem[]>(() => {
  if (selectedBrand.value) return []
  if (props.scenario) {
    return brands
      .filter((b) => b.recommendedScenarios.includes(props.scenario))
      .slice(0, props.limit)
  }
  return brands.slice(0, props.limit)
})

const rankBadgeClass = computed(() => {
  const r = selectedBrand.value?.rank || 99
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return 'rank-normal'
})

function formatScenario(s: string) {
  const map: Record<string, string> = {
    ai: 'AI与ChatGPT',
    streaming: '4K流媒体',
    'remote-work': '远程外企办公',
    dev: '开发者/代码环境',
    gaming: '联机游戏低延迟',
    study: '海外学术查阅',
    budget: '极限性价比',
    beginner: '新手免折腾',
    privacy: '隐私多开防关联'
  }
  return map[s] || s
}
</script>

<style scoped>
.brand-card {
  padding: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.brand-rank-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 2px;
  background-color: #ffffff;
}

.rank-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.rank-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
}
.rank-silver {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  color: #fff;
}
.rank-bronze {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
}
.rank-normal {
  background: #e2e8f0;
  color: #475569;
}

.brand-name {
  margin: 0 !important;
  font-size: 1.25rem !important;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.operating-year-tag {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 2px;
  display: inline-block;
}

.brand-tagline {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  line-height: 1.45;
}

.brand-price-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.price-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}

.sla-badge {
  font-size: 0.72rem;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.has-speedtest-badge {
  font-size: 0.72rem;
  color: #7c3aed;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

/* 优惠券提示框 */
.coupon-highlight-box {
  background: #fffbeb;
  border: 1px dashed #f59e0b;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  color: #92400e;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.coupon-highlight-box:hover {
  background: #fef3c7;
  border-color: #d97706;
}

.coupon-copy-btn {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 2px 8px;
  background-color: #f59e0b;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.coupon-copy-btn:hover {
  background-color: #d97706;
}

.coupon-copy-btn.copied {
  background-color: #10b981;
}

.coupon-code-text {
  background: #fef3c7;
  color: #b45309;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.coupon-desc {
  font-size: 0.72rem;
  color: #78350f;
}

.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.scenario-pill {
  font-size: 0.75rem;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 500;
}

.brand-features {
  list-style: none !important;
  padding-left: 0 !important;
  margin: 0 0 14px 0 !important;
  flex-grow: 1;
}

.brand-features li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  line-height: 1.4;
}

.check-icon {
  width: 15px;
  height: 15px;
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}

.protocols-line {
  font-size: 0.76rem;
  color: #64748b;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.protocol-title {
  font-weight: 600;
}

.proto-tag {
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
  color: #334155;
}

.brand-action-area {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.review-detail-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: #f1f5f9;
  color: #334155 !important;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none !important;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.review-detail-btn:hover {
  background-color: #e2e8f0;
  color: var(--vp-c-brand-1) !important;
  border-color: var(--vp-c-brand-1);
}

.brand-cta-btn {
  flex: 1.2;
}

.affiliate-disclosure {
  font-size: 0.7rem;
  color: #94a3b8;
  line-height: 1.35;
  text-align: center;
}

/* 暗色模式细节打磨 */
.dark .brand-card {
  background-color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.dark .brand-logo-img {
  background-color: #0f172a;
  border-color: #334155;
}

.dark .coupon-highlight-box {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fcd34d;
}

.dark .coupon-code-text {
  background: rgba(245, 158, 11, 0.25);
  color: #fef3c7;
}

.dark .coupon-desc {
  color: #fbbf24;
}

.dark .proto-tag {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
}

.dark .review-detail-btn {
  background-color: #1e293b;
  color: #e2e8f0 !important;
  border-color: #475569;
}

.dark .review-detail-btn:hover {
  background-color: #334155;
  color: #60a5fa !important;
  border-color: #60a5fa;
}

.dark .sla-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.dark .has-speedtest-badge {
  background: rgba(124, 58, 237, 0.15);
  color: #c4b5fd;
  border-color: rgba(124, 58, 237, 0.3);
}

.dark .scenario-pill {
  background: rgba(37, 99, 235, 0.15);
  color: #93c5fd;
}

@media (max-width: 480px) {
  .brand-card {
    padding: 16px;
  }
  .button-row {
    flex-direction: column;
  }
  .brand-header {
    flex-direction: column;
    gap: 8px;
  }
  .brand-meta-right {
    align-self: flex-start;
  }
}
</style>
