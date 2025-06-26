<!-- src/components/game/GameList.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Dialog from 'primevue/dialog'
import GameCreateForm from '@/components/game/GameCreateForm.vue'
import GameEditForm from '@/components/game/GameEditForm.vue'

const gameStore = useGameStore()
const router = useRouter()

// Pagination refs
const rows = ref(10)
const first = ref(0)
// ✅ Sorting refs
const sortField = ref('')
const sortOrder = ref(0) // 0 = none, 1 = asc, -1 = desc
// ✅ Modal visibility control
const showCreateModal = ref(false)

onMounted(async () => {
  console.log('🔍 GameList: Component mounted, fetching initial data')
  try {
    await gameStore.fetchAll(1, rows.value)
    console.log('🔍 GameList: Initial data fetch successful')
    
    // Debug: Check first game's team data structure
    if (gameStore.games.length > 0) {
      const firstGame = gameStore.games[0]
      console.log('🔍 GameList: First game data structure:', {
        id: firstGame.id,
        homeTeam: firstGame.homeTeam,
        awayTeam: firstGame.awayTeam,
        homeTeamId: firstGame.homeTeamId,
        awayTeamId: firstGame.awayTeamId
      })
    }
  } catch (error) {
    console.error('❌ GameList: Initial data fetch failed:', error)
  }
})

// Handle pagination events
const onPage = async (event: any) => {
  const page = event.page + 1 // PrimeVue uses 0-based, backend uses 1-based
  const limit = event.rows
  
  console.log(`🔍 GameList: Page change event - page: ${page}, limit: ${limit}`)
  
  first.value = event.first
  rows.value = limit
  
  try {
    await gameStore.fetchAll(page, limit, false)
    console.log(`🔍 GameList: Successfully loaded page ${page}`)
  } catch (error) {
    console.error(`❌ GameList: Failed to load page ${page}:`, error)
  }
}

// ✅ Handle sorting events
const onSort = async (event: any) => {
  console.log('🔍 GameList: Sort event:', event)
  
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  
  // Reset to first page when sorting
  first.value = 0
  const page = 1
  
  try {
    await gameStore.fetchAll(page, rows.value, false)
    console.log(`🔍 GameList: Successfully sorted by ${sortField.value}`)
  } catch (error) {
    console.error(`❌ GameList: Failed to sort:`, error)
  }
}

// ✅ Build sort parameters for API
const buildSortParams = () => {
  if (!sortField.value || sortOrder.value === 0) {
    return undefined
  }
  
  const direction = sortOrder.value === 1 ? 'asc' : 'desc'
  return {
    sortBy: sortField.value,
    sortOrder: direction
  }
}

const viewGame = (id: number) => {
  router.push(`/games/${id}?mode=read`)
}

const editGame = (id: number) => {
  router.push(`/games/${id}?mode=edit`)
}

const createGame = () => {
   showCreateModal.value = true
}

const deleteGame = async (id: number) => {
  if (confirm('Are you sure you want to delete this game?')) {
    try {
      await gameStore.remove(id)
      // Refresh current page after delete
      await gameStore.fetchAll(gameStore.currentPage, gameStore.itemsPerPage, true)
      console.log(`✅ GameList: Successfully deleted game ${id}`)
    } catch (error) {
      console.error(`❌ GameList: Failed to delete game ${id}:`, error)
    }
  }
}

const retryFetch = async () => {
  console.log('🔄 GameList: Retrying data fetch')
  gameStore.clearError()
  try {
    await gameStore.fetchAll(1, rows.value, true)
  } catch (error) {
    console.error('❌ GameList: Retry failed:', error)
  }
}

// Helper function to get team display name
const getTeamName = (team: any, teamId: number) => {
  if (team && team.name) {
    return team.name
  }
  if (team && team.city && team.name) {
    return `${team.city} ${team.name}`
  }
  if (team && team.city) {
    return team.city
  }
  return `Team ${teamId}`
}

// Helper function to format matchup
const formatMatchup = (game: any) => {
  const awayTeamName = getTeamName(game.awayTeam, game.awayTeamId)
  const homeTeamName = getTeamName(game.homeTeam, game.homeTeamId)
  return `${awayTeamName} @ ${homeTeamName}`
}

// ✅ Handle successful game creation
const onGameCreated = (newGame: any) => {

  showCreateModal.value = false
  
  // Optional: Refresh games list
  gameStore.fetchAll()
  
  // Optional: Navigate to the new game
  // router.push(`/games/${newGame.id}`)
  
  // Optional: Show success message
  // toast.add({ severity: 'success', summary: 'Success', detail: 'Game created successfully!' })
}
</script>

<template>
  <div class="game-list">
    <div class="list-header">
      <h2>Games</h2>
      <Button
        @click="createGame"
        label="Create Game"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <!-- Error Message -->
    <Message 
      v-if="gameStore.error" 
      severity="error" 
      :closable="false"
      class="mb-3"
    >
      <div class="flex justify-content-between align-items-center">
        <span>{{ gameStore.error }}</span>
        <Button 
          label="Retry" 
          icon="pi pi-refresh" 
          class="p-button-sm p-button-outlined"
          @click="retryFetch"
        />
      </div>
    </Message>

    <!-- Debug Info (remove in production) -->
    <Message 
      v-if="gameStore.games.length === 0 && !gameStore.loading && !gameStore.error" 
      severity="info" 
      class="mb-3"
    >
      No games found. Total records: {{ gameStore.pagination?.total || 0 }}
      <br>
      <small>API endpoint: <code>/games?page=1&limit=10</code></small>
    </Message>

    <!-- Team Data Debug (remove in production) -->
    <Message 
      v-if="gameStore.games.length > 0 && gameStore.games[0] && (!gameStore.games[0].homeTeam || !gameStore.games[0].awayTeam)" 
      severity="warn" 
      class="mb-3"
    >
      ⚠️ Team relationship data missing. First game data:
      <br>
      <small>
        homeTeamId: {{ gameStore.games[0]?.homeTeamId }} | 
        awayTeamId: {{ gameStore.games[0]?.awayTeamId }} | 
        homeTeam: {{ gameStore.games[0]?.homeTeam ? 'present' : 'missing' }} | 
        awayTeam: {{ gameStore.games[0]?.awayTeam ? 'present' : 'missing' }}
      </small>
    </Message>

    <DataTable
      :value="gameStore.games"
      :loading="gameStore.loading"
      :lazy="true"
      paginator
      :rows="rows"
      :first="first"
      :totalRecords="gameStore.pagination?.total || 0"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      @sort="onSort"
      :sortField="sortField"
      :sortOrder="sortOrder"
      responsiveLayout="scroll"
      sortMode="single"
      :globalFilterFields="['seasonYear', 'homeTeam.name', 'awayTeam.name', 'gameLocation']"
    >
      <!-- Season Year -->
      <Column field="seasonYear" header="Season" sortable />
      
      <!-- Week -->
      <Column header="Week" sortable>
        <template #body="{ data }">
          <span v-if="data.preseason">Pre {{ data.preseason }}</span>
          <span v-else-if="data.gameWeek">Week {{ data.gameWeek }}</span>
          <span v-else>-</span>
        </template>
      </Column>
      
      <!-- Date -->
      <Column field="gameDate" header="Date" sortable>
        <template #body="{ data }">
          <span v-if="data.gameDate">
            {{ new Date(data.gameDate).toLocaleDateString() }}
          </span>
          <span v-else>TBD</span>
        </template>
      </Column>
      
      <!-- Matchup -->
      <Column header="Matchup">
        <template #body="{ data }">
          {{ formatMatchup(data) }}
        </template>
      </Column>
      
      <!-- Score -->
      <Column header="Score">
        <template #body="{ data }">
          <span v-if="data.homeScore !== null && data.awayScore !== null">
            {{ data.awayScore }} - {{ data.homeScore }}
          </span>
          <span v-else class="text-muted">-</span>
        </template>
      </Column>
      
      <!-- Location -->
      <Column field="gameLocation" header="Location">
        <template #body="{ data }">
          <span v-if="data.gameLocation">{{ data.gameLocation }}</span>
          <span v-else-if="data.gameCity && data.gameStateProvince">{{ data.gameCity }}, {{ data.gameStateProvince }}</span>
          <span v-else-if="data.gameCity">{{ data.gameCity }}</span>
          <span v-else-if="data.homeTeam && data.homeTeam.city">{{ data.homeTeam.city }}</span>
          <span v-else class="text-muted">TBD</span>
        </template>
      </Column>
      
      <!-- Status -->
      <Column field="gameStatus" header="Status" sortable>
        <template #body="{ data }">
          <span>{{ data.gameStatus || 'SCHEDULED' }}</span>
        </template>
      </Column>
      
      <!-- Actions -->
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="viewGame(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="editGame(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="deleteGame(data.id)"
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              v-tooltip="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
     <!-- ✅ Create Game Modal -->
    <Dialog
      v-model:visible="showCreateModal"
      modal
      header="Create New Game"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <GameCreateForm 
        @game-created="onGameCreated"
        @cancel="alert('BTN CLICKED!')"
      />
    </Dialog>
  </div>
  
</template>

<style scoped>
.game-list {
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

.text-muted {
  color: #6c757d;
  font-style: italic;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>