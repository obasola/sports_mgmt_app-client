// PlayerImportPanel.vue
<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">Import NFL Prospects</h2>

    <PlayerCsvUpload v-model:players="players" />

    <PlayerTableEditor v-if="players.length > 0" v-model:players="players" />

    <div class="flex gap-2">
      <Button label="Import Players" icon="pi pi-cloud-upload" @click="importPlayers" :disabled="players.length === 0" />
      <Button label="Clear" icon="pi pi-times" severity="secondary" @click="clear" />
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import PlayerCsvUpload from './PlayerCsvUpload.vue';
import PlayerTableEditor from './PlayerTableEditor.vue';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { PlayerService } from '@/domain/services';
import type { Player } from '@/domain/models/Player';

const players = ref<Player[]>([]);

const loading = ref(false);
const toast = useToast();
const playerService = new PlayerService();

async function importPlayers() {
  loading.value = true;
  let success = 0;
  let failed = 0;

  
  for (const player of players.value) {
    try{
      await playerService.create(player);
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
  players.value = [];
}
</script>

<style scoped>
.p-datatable-sm .p-inputtext {
  width: 100%;
}
</style>
