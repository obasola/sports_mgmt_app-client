
<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Button label="Go to Home" icon="pi pi-home" @click="goHome" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

const goHome = () => {
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
}

.content {
  max-width: 500px;
}

h1 {
  font-size: 6rem;
  color: var(--primary-color);
  margin: 0;
}

h2 {
  font-size: 2rem;
  margin: 0.5rem 0;
}

p {
  margin-bottom: 2rem;
  color: var(--text-color-secondary);
}
</style>
