<!-- src/components/ui/AppHeader.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <h1 @click="goHome" class="app-title">Sports Management System</h1>
      <div class="header-actions">
        <!-- Add user menu or other header actions here -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--text-primary);
  color: var(--text-secondary);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  margin: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.app-title:hover {
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 1rem;
}
</style>
