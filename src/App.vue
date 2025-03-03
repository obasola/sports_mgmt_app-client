// src/App.vue
<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Navbar from './components/common/Navbar.vue';
import Footer from './components/common/Footer.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

onMounted(() => {
  // Initialization logic if needed
  console.log('Application mounted');
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>
