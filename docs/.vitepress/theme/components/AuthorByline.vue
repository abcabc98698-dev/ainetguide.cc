<template>
  <div v-if="showByline" class="author-byline-card">
    <div class="author-avatar">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div class="author-meta-content">
      <div class="author-name-row">
        <span class="author-title-tag">技术主审</span>
        <a href="/about" class="author-name">Alex Chen (CCIE #49281)</a>
        <span class="author-sep">/</span>
        <a href="/about" class="author-name">Marcus Zhang (协议安全)</a>
        <span class="author-status-tag">物理实验室核验</span>
      </div>
      <div class="author-sub-row">
        <span class="author-date">核验时间：2026-10-26</span>
        <span class="author-dot">•</span>
        <a href="/methodology" class="methodology-link">遵循《量化评测方法论 v2.4》</a>
        <span class="author-dot">•</span>
        <span class="author-env">华东/华南/华北千兆多线拓扑</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// Do not show on home page
const showByline = computed(() => {
  const path = route.path
  return path !== '/' && path !== '/index.html'
})
</script>

<style scoped>
.author-byline-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 8px;
  padding: 10px 16px;
  margin: 16px 0 24px 0;
  font-size: 13px;
  line-height: 1.5;
}

.author-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.1));
  color: var(--vp-c-brand-1, #3b82f6);
  border-radius: 50%;
  flex-shrink: 0;
}

.author-meta-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.author-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.author-title-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  background: var(--vp-c-default-soft, rgba(125, 125, 125, 0.15));
  border-radius: 4px;
  color: var(--vp-c-text-2);
}

.author-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.author-name:hover {
  color: var(--vp-c-brand-1, #3b82f6);
}

.author-sep {
  color: var(--vp-c-text-3);
}

.author-status-tag {
  font-size: 11px;
  padding: 1px 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border-radius: 4px;
  font-weight: 500;
}

.author-sub-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.author-dot {
  color: var(--vp-c-text-3);
}

.methodology-link {
  color: var(--vp-c-brand-1, #3b82f6);
  text-decoration: none;
}

.methodology-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .author-byline-card {
    padding: 8px 12px;
  }
  .author-avatar {
    display: none;
  }
}
</style>
