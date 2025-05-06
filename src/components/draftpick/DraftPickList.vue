// DraftPickList.vue
<template>
  <div>
    <h2>Draft Picks</h2>
    <div class="query-options">
      <button @click="fetchDraftPicks('standard')">Current Team</button>
      <button @click="fetchDraftPicks('allHistory')">All Team History</button>
      <button @click="fetchDraftPicks('draftingTeam')">Drafting Team</button>
      <button @click="showConsole" class="btn-console">Log to Console</button>
    </div>

    <DataTable
      :value="draftPicks"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="draftYear" header="Year" sortable></Column>
      <Column field="round" header="Round" sortable></Column>
      <Column field="pickNumber" header="Pick #" sortable></Column>
      <Column field="playerName" header="Player" sortable></Column>
      <Column field="teamName" header="Team" sortable></Column>
      <Column v-if="showTeamHistory" field="teamDates" header="Team Dates" sortable></Column>
      <Column header="Actions" style="width: 10%">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-rounded p-button-info"
              @click="$emit('view', data.id)"
              v-tooltip.top="'View'"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-success"
              @click="editPick(data.id)"
              v-tooltip.top="'Edit'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger"
              @click="confirmDelete(data)"
              v-tooltip.top="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <div class="container">
      <!-- Console Dialog -->
      <ConsoleDialog
        v-model="consoleVisible"
        :output="consoleOutput"
        @clear="clearConsole"
      />
    </div>
    <div class="container">
      <Dialog
        v-model:visible="deleteDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="pickToDelete">
            Are you sure you want to delete
            <b>{{ pickToDelete.playerFirstName }} {{ pickToDelete.playerLastName }}</b
            >?
          </span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDraftPick" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useDraftPickStore } from '../../stores/draftPick';
// import the apiClient at the top of your file
import apiClient from '@/utils/axios-config';
import axios from 'axios';
import ConsoleDialog from '../common/ConsoleDialog.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { DraftPick } from '../../domain/models/DraftPick';

const draftPickStore = useDraftPickStore();
const showTeamHistory = ref(false);
const consoleVisible = ref(false);
const consoleOutput = ref<string[]>([]);
const deleteDialog = ref(false)
const pickToDelete = ref<DraftPick | null>(null)
const toast = useToast();
const emit = defineEmits(['view', 'create', 'deleted'])

const draftPicks = computed(() => {
  return draftPickStore.picks.map(pick => ({
    ...pick,
    playerName: `${pick.playerFirstName} ${pick.playerLastName}`.trim(),
    teamDates: getTeamDates(pick)
  }));
});

const fetchDraftPicks = async (queryType: 'standard' | 'allHistory' | 'draftingTeam') => {
  let endpoint = '';
  try {

    showTeamHistory.value = false;

    switch (queryType) {
      case 'standard':
        endpoint = '/draft-picks/with-details';
        break;
      case 'allHistory':
        endpoint = '/draft-picks/with-all-team-history';
        showTeamHistory.value = true;
        break;
      case 'draftingTeam':
        endpoint = '/draft-picks/with-drafting-team';
        break;
    }

    // Use apiClient instead of fetch
    const response = await apiClient.get(endpoint);
    draftPickStore.picks = response.data;

    // Auto-log after fetching new data
    logDraftPicks();
  } catch (error) {
    console.log('Error fetching draft picks:', error);
    // Call this method to debug
    debugAPICall(endpoint);
  }
};

const debugAPICall = async (url: string) => {
  //const url = '/draft-picks/with-details';

  try {
    console.log(`Making request to: ${url}`);

    const response = await apiClient.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('- Status:', response.status);
    console.log('- StatusText:', response.statusText);
    console.log('- Headers:', response.headers);
    console.log('- Data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    // Check if it's an axios error with response
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

const getTeamDates = (pick: any) => {
  if (pick.playerTeamStartDate && pick.playerTeamEndDate) {
    return `${formatDate(pick.playerTeamStartDate)} - ${formatDate(pick.playerTeamEndDate)}`;
  } else if (pick.playerTeamStartDate) {
    return `Since ${formatDate(pick.playerTeamStartDate)}`;
  } else {
    return '';
  }
};

const formatDate = (date: Date | string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString();
};

const logDraftPicks = () => {
  const logs: string[] = [];

  // Clear previous logs
  logs.push('==========================================');
  logs.push('Draft Picks Console Log - ' + new Date().toLocaleTimeString());
  logs.push('==========================================');
  logs.push('');

  // Summary
  logs.push(`Total Draft Picks: ${draftPicks.value.length}`);
  logs.push('');

  // Detailed logs
  draftPicks.value.forEach((pick, index) => {
    logs.push(`${'-'.repeat(40)}`);
    logs.push(`#${index + 1}`);
    logs.push(`Year: ${pick.draftYear}`);
    logs.push(`Round: ${pick.round}`);
    logs.push(`Pick: ${pick.pickNumber}`);
    logs.push(`Player: ${pick.playerFirstName} ${pick.playerLastName}`);
    logs.push(`Team: ${pick.team?.name || 'Not assigned'}`);

    if (pick.pickFrom) {
      logs.push(`Team start date: ${new Date(pick.pickFrom).toLocaleDateString()}`);
    }

    if (pick.pickTo) {
      logs.push(`Team end date: ${new Date(pick.pickTo).toLocaleDateString()}`);
    }

    logs.push('');
  });

  // Stats summary
  const yearlyPickCounts = new Map<number, number>();
  const roundPickCounts = new Map<number, number>();

  draftPicks.value.forEach(pick => {
    yearlyPickCounts.set(pick.draftYear, (yearlyPickCounts.get(pick.draftYear) || 0) + 1);
    roundPickCounts.set(pick.round, (roundPickCounts.get(pick.round) || 0) + 1);
  });

  logs.push('==========================================');
  logs.push('Statistics Summary');
  logs.push('==========================================');
  logs.push('');
  logs.push('Picks by Year:');
  yearlyPickCounts.forEach((count, year) => {
    logs.push(`  ${year}: ${count}`);
  });
  logs.push('');
  logs.push('Picks by Round:');
  roundPickCounts.forEach((count, round) => {
    logs.push(`  Round ${round}: ${count}`);
  });

  return logs;
};

const showConsole = () => {
  consoleOutput.value = logDraftPicks();
  consoleVisible.value = true;
};

const clearConsole = () => {
  consoleOutput.value = [];
};


const router = useRouter()

// Instead of emitting an event, navigate directly with a query parameter
const editPick = (id: number) => {
  router.push({
    path: `/draft-picks/${id}`,
    query: { edit: 'true' }
  })
}

const confirmDelete = (player: DraftPick) => {
  pickToDelete.value = player
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  pickToDelete.value = null
}

const deleteDraftPick = async () => {
  try {
    if (pickToDelete.value && pickToDelete.value.id) {
      await draftPickStore.deleteDraftPick(pickToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${pickToDelete.value.playerFirstName} ${pickToDelete.value.playerLastName} was deleted successfully`,
        life: 3000
      })
      emit('deleted', pickToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the player',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }

  // Fetch data when component mounts
  onMounted(() => {
    fetchDraftPicks('standard');
  });
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

.query-options {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.query-options button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.query-options button:hover {
  background-color: #45a049;
}

.log-button {
  background-color: #2196F3 !important;
}

.log-button:hover {
  background-color: #1976D2 !important;
}

.p-datatable-sm {
  margin-top: 20px;
  width: 100%;
}
/* Fixed action buttons styling */
.action-buttons {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.action-buttons .p-button {
  padding: 0.25rem;
  margin: 0 2px;
}

/* Ensure PrimeVue buttons don't break to new line */
:deep(.p-button-rounded) {
  width: 32px;
  height: 32px;
  line-height: 32px;
}

</style>
