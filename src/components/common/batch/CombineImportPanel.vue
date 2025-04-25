// CombineImportPanel.vue
<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">Import Combine Scores</h2>

    <CombineCsvUpload v-model:scores="scores" />

    <CombineTableEditor v-if="scores.length > 0" v-model:scores="scores" />

    <div class="flex gap-2">
      <Button label="Process File" icon="pi pi-cloud-upload" @click="processFile" :disabled="scores.length === 0" />
      <Button label="Clear" icon="pi pi-times" severity="secondary" @click="clear" />
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import CombineCsvUpload from './CombineCsvUpload.vue';
import CombineTableEditor from './CombineTableEditor.vue';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import axios from 'axios';

import type { CombineScore } from '@/domain/models/CombineScore';

const scores = ref<CombineScore[]>([]);
const loading = ref(false);
const toast = useToast();

async function processFile() {
  loading.value = true;
  let success = 0;
  let failed = 0;

  for (const score of scores.value) {
    try {
      await axios.post('/api/combine-scores', score);
      success++;
    } catch (e) {
      failed++;
    }
  }

  toast.add({
    severity: failed === 0 ? 'success' : 'warn',
    summary: 'Upload Finished',
    detail: `${success} success, ${failed} failed.`
  });

  loading.value = false;
}

function clear() {
  scores.value = [];
}
</script>

<style scoped>
.p-datatable-sm .p-inputtext {
  width: 100%;
}
</style>
