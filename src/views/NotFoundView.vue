<template>
  <div class="not-found">
    <Card>
      <template #title>
        <h1>404 - Page Not Found</h1>
      </template>
      <template #content>
        <div class="not-found-content">
          <i class="pi pi-exclamation-circle" style="font-size: 5rem"></i>
          <p>The page you are looking for does not exist or has been moved.</p>
          <Button label="Go Home" icon="pi pi-home" @click="goHome" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.not-found h1 {
  color: var(--primary-text);
}

.not-found p {
  margin: 1rem 0;
  font-size: 1.2rem;
}

.not-found i {
  color: var(--accent);
  margin-bottom: 1rem;
}
</style>
