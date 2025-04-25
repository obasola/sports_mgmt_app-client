<template>
  <div class="app-wrapper">
    <Navbar />
    
    <div class="main-content">
      <Toast />
      <ConfirmDialog></ConfirmDialog>
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #003049;
  color: #780000;
}

.main-content {
  flex: 1;
  padding: 1rem;
  margin-top: 4rem;
}
</style>
