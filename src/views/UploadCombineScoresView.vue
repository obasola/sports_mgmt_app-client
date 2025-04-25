<!-- views/batch/UploadCombineScoresView.vue -->
<template>
  <div class="p-6">
    <Card>
      <template #title>
        Upload Combine Scores
      </template>
      <template #content>
        <CombineImportPanel />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import CombineImportPanel from '@/components/common/batch/CombineImportPanel.vue';
import Card from 'primevue/card';

alert("UploadCombineScoresView");
</script>

<style scoped>
.p-card {
  max-width: 1000px;
  margin: auto;
}
</style>
