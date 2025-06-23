<!-- File: src/components/team/TeamList.vue -->
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '@/stores/teamStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const teamStore = useTeamStore()
const router = useRouter()

// Pagination state - match what DataTable expects (0-based for PrimeVue)
const currentPage = ref(0) // PrimeVue uses 0-based indexing
const rowsPerPage = ref(10)

// Computed for total records using correct backend field names
const totalRecords = computed(() => {
  return teamStore.pagination?.total || 0
})

// Computed for current backend page (1-based)
const backendPage = computed(() => currentPage.value + 1)

onMounted(() => {
  console.log('Component mounted, fetching initial data')
  teamStore.fetchAll(backendPage.value, rowsPerPage.value)
})

// Watch for pagination changes from the backend to sync UI (page only, not rows)
watch(() => teamStore.pagination?.page, (newPage) => {
  if (newPage) {
    console.log('Backend page updated:', newPage)
    // Only sync page number, not rows per page (let user control that)
    const frontendPage = newPage - 1 // Convert to 0-based
    if (currentPage.value !== frontendPage) {
      currentPage.value = frontendPage
    }
  }
})

const onPageChange = (event: any) => {
  console.log('Page change event:', event)
  console.log('Event details - page:', event.page, 'rows:', event.rows)
  
  // Update local state
  currentPage.value = event.page // PrimeVue page is 0-based
  rowsPerPage.value = event.rows
  
  // Calculate 1-based page for backend
  const backendPageNum = event.page + 1
  
  console.log(`Requesting backend: page=${backendPageNum}, limit=${event.rows}`)
  console.log('Local state after update - currentPage:', currentPage.value, 'rowsPerPage:', rowsPerPage.value)
  
  // Fetch new data from backend
  teamStore.fetchAll(backendPageNum, event.rows, true)
}

const viewTeam = (id: number) => {
  router.push(`/teams/${id}?mode=read`)
}

const editTeam = (id: number) => {
  router.push(`/teams/${id}?mode=edit`)
}

const createTeam = () => {
  router.push('/teams?mode=create')
}

const deleteTeam = async (id: number) => {
  if (confirm('Are you sure you want to delete this team?')) {
    await teamStore.remove(id)
    // Refresh current page after deletion
    await teamStore.fetchAll(backendPage.value, rowsPerPage.value, true)
  }
}
</script>

<template>
  <div class="team-list">
    <div class="list-header">
      <h2>Teams</h2>
      <Button
        @click="createTeam"
        label="Create Team"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="teamStore.teams"
      :loading="teamStore.loading"
      lazy
      paginator
      :first="currentPage * rowsPerPage"
      :rows="rowsPerPage"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPageChange"
      responsiveLayout="scroll"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} teams"
    >
      <Column field="name" header="Team Name" sortable />
      <Column field="city" header="City" sortable />
      <Column field="state" header="State" sortable />
      <Column field="conference" header="Conference" sortable />
      <Column field="division" header="Division" sortable />
      <Column field="stadium" header="Stadium" sortable />
      <Column field="country" header="Country" sortable />
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="viewTeam(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="editTeam(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="deleteTeam(data.id)"
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              v-tooltip="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Debug info - remove after testing -->
    <div v-if="teamStore.pagination" class="debug-info" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
      <h4>Debug - Pagination Info:</h4>
      <pre>{{ JSON.stringify(teamStore.pagination, null, 2) }}</pre>
      <p>Frontend Current Page (0-based): {{ currentPage }}</p>
      <p>Backend Page (1-based): {{ backendPage }}</p>
      <p>Rows Per Page: {{ rowsPerPage }}</p>
      <p>Total Records: {{ totalRecords }}</p>
      <p>Teams Count: {{ teamStore.teams.length }}</p>
    </div>
  </div>
</template>

<style scoped>
.team-list {
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.debug-info {
  font-size: 0.8rem;
  color: #666;
}
</style>