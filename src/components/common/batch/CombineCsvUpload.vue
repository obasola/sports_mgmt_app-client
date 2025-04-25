// CombineCsvUpload.vue
<template>
  <div class="flex flex-col gap-4">
    <FileUpload
      mode="basic"
      name="csv"
      accept=".csv"
      choose-label="Upload CSV"
      customUpload
      @uploader="handleUpload"
    />
    <Message v-if="error" severity="error">{{ error }}</Message>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import type { CombineScore } from '@/domain/models/CombineScore';

const emit = defineEmits<{
  (e: 'update:scores', value: CombineScore[]): void;
}>();

const error = ref<string | null>(null);

function handleUpload(event: any) {
  const file = event.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        const parsed = (results.data as any[]).map((row, index) => {
          const parsedRow: CombineScore = {
            fortyTime: parseFloat(row.fortyTime),
            tenYardSplit: parseFloat(row.tenYardSplit),
            twentyYardShuttle: parseFloat(row.twentyYardShuttle),
            threeCone: parseFloat(row.threeCone),
            verticalLeap: parseFloat(row.verticalLeap),
            broadJump: parseFloat(row.broadJump),
            playerId: parseInt(row.playerId),
          };

          if (Object.values(parsedRow).some(val => isNaN(val))) {
            throw new Error(`Row ${index + 1} has invalid numeric values.`);
          }

          return parsedRow;
        });

        emit('update:scores', parsed);
        error.value = null;
      } catch (err: any) {
        error.value = `Parse error: ${err.message}`;
      }
    },
    error: (err) => {
      error.value = `CSV parse failed: ${err.message}`;
    }
  });
}
</script>

<style scoped>
.p-message {
  margin-top: 1rem;
}
</style>
