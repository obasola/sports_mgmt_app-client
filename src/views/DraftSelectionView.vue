<template>
  <div class="draft-selection-view">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// This view serves as a container for the draft selection components
// The router-view will render the appropriate component based on the current route
</script>

<style scoped>
.draft-selection-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
