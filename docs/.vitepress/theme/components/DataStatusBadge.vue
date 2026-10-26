<template>
  <span :class="['status-badge', badgeClass]" :title="hoverTitle">
    <span class="status-dot"></span>
    <span class="status-label">{{ labelText }}</span>
    <span v-if="date" class="status-date">({{ date }})</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type DataStatus = 'verified' | 'monitoring' | 'historical' | 'untested'

const props = withDefaults(
  defineProps<{
    status?: DataStatus | string
    date?: string
    text?: string
  }>(),
  {
    status: 'verified',
    date: '',
    text: ''
  }
)

const badgeClass = computed(() => {
  switch (props.status) {
    case 'verified':
      return 'badge-verified'
    case 'monitoring':
      return 'badge-monitoring'
    case 'historical':
      return 'badge-historical'
    case 'untested':
    default:
      return 'badge-untested'
  }
})

const labelText = computed(() => {
  if (props.text) return props.text
  switch (props.status) {
    case 'verified':
      return '已核验'
    case 'monitoring':
      return '实时监控'
    case 'historical':
      return '历史数据'
    case 'untested':
    default:
      return '待验证'
  }
})

const hoverTitle = computed(() => {
  switch (props.status) {
    case 'verified':
      return '此数据已通过近期多链路实测核验，准确度高'
    case 'monitoring':
      return '此数据由自动化健康探针定期复测中'
    case 'historical':
      return '此数据属于历史采集记录，仅供技术演进参考'
    case 'untested':
    default:
      return '此数据尚未通过完整自动化验证，请谨慎参考'
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
  vertical-align: middle;
  border: 1px solid transparent;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.badge-verified {
  background-color: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}
.badge-verified .status-dot {
  background-color: #10b981;
}

.badge-monitoring {
  background-color: #eff6ff;
  color: #1e40af;
  border-color: #bfdbfe;
}
.badge-monitoring .status-dot {
  background-color: #3b82f6;
}

.badge-historical {
  background-color: #fffbeb;
  color: #92400e;
  border-color: #fde68a;
}
.badge-historical .status-dot {
  background-color: #f59e0b;
}

.badge-untested {
  background-color: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}
.badge-untested .status-dot {
  background-color: #ef4444;
}

/* 暗色模式适配 */
.dark .badge-verified {
  background-color: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
}
.dark .badge-monitoring {
  background-color: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.35);
}
.dark .badge-historical {
  background-color: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  border-color: rgba(245, 158, 11, 0.35);
}
.dark .badge-untested {
  background-color: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.35);
}

.status-date {
  opacity: 0.8;
  font-size: 0.7rem;
}
</style>
