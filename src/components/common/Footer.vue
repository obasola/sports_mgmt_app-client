<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Sports Management App</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: var(--secondary-bg);
  color: var(--light-text);
  padding: 1rem;
  text-align: center;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
