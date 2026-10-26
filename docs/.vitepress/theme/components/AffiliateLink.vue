<template>
  <span class="affiliate-wrapper">
    <a
      :href="href"
      target="_blank"
      rel="nofollow sponsored noopener"
      :class="['affiliate-link', isBtn ? 'affiliate-button' : '']"
      :title="disclaimer"
    >
      <slot>{{ text || '前往官网' }}</slot>
      <svg
        v-if="!isBtn"
        class="external-icon"
        viewBox="0 0 24 24"
        width="12"
        height="12"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
    <span v-if="showDisclaimerInline" class="affiliate-disclaimer-tag">
      *含推广链接
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    href: string
    text?: string
    isBtn?: boolean
    showDisclaimerInline?: boolean
  }>(),
  {
    text: '',
    isBtn: false,
    showDisclaimerInline: false
  }
)

const disclaimer = '含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格'
</script>

<style scoped>
.affiliate-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.affiliate-link {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
  transition: color 0.15s ease;
}

.affiliate-link:hover {
  color: var(--vp-c-brand-2);
}

.external-icon {
  display: inline-block;
  opacity: 0.6;
}

.affiliate-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  background-color: var(--vp-c-brand-1);
  color: #ffffff !important;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none !important;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;
}

.affiliate-button:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.affiliate-disclaimer-tag {
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
}
</style>
