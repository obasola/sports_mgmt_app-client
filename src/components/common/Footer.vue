
<!-- src/components/common/Footer.vue -->
<template>
  <footer class="footer">
    <div class="content">
      <p>© {{ currentYear }} Sports Management App. All rights reserved.</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: var(--surface-ground);
  color: var(--text-color);
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
