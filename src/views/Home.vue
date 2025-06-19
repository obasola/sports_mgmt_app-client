
<!-- src/views/Home.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useTeamStore } from '@/stores/teamStore'
import AppLayout from '@/components/ui/AppLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()

onMounted(async () => {
  await Promise.all([playerStore.fetchAll(), teamStore.fetchAll()])
})

const quickActions = [
  {
    label: 'Manage Players',
    icon: 'pi pi-users',
    route: '/players',
    description: 'View, create, and manage player profiles',
  },
  {
    label: 'Manage Teams',
    icon: 'pi pi-flag',
    route: '/teams',
    description: 'View, create, and manage team information',
  },
  {
    label: 'View Prospects',
    icon: 'pi pi-star',
    route: '/prospects',
    description: 'Manage upcoming draft prospects',
  },
  {
    label: 'Draft Picks',
    icon: 'pi pi-list',
    route: '/draft-picks',
    description: 'Manage draft selections and trades',
  },
  {
    label: 'Combine Scores',
    icon: 'pi pi-chart-bar',
    route: '/combine-scores',
    description: 'View and manage NFL combine results',
  },
  {
    label: 'Schedules',
    icon: 'pi pi-calendar',
    route: '/schedules',
    description: 'Manage team schedules and game results',
  },
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <AppLayout>
    <div class="home-view">
      <div class="welcome-section">
        <h1>Sports Management System</h1>
        <p>Comprehensive management solution for professional sports teams</p>
      </div>

      <div class="stats-overview">
         <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-users stat-icon"></i>
              <div class="stat-info">
                <h3>{{ playerStore.players.length }}</h3>
                <span>Total Players</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card clickable-card" @click="navigateTo('/teams')">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-flag stat-icon"></i>
              <div class="stat-info">
                <h3>{{ teamStore.teams.length }}</h3>
                <span>Total Teams</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <Card
            v-for="action in quickActions"
            :key="action.route"
            class="action-card"
            @click="navigateTo(action.route)"
          >
            <template #content>
              <div class="action-content">
                <i :class="action.icon" class="action-icon"></i>
                <h3>{{ action.label }}</h3>
                <p>{{ action.description }}</p>
                <Button
                  label="Go"
                  icon="pi pi-arrow-right"
                  class="p-button-sm"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.welcome-section p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  cursor: pointer !important;
}

.clickable-card {
  cursor: pointer !important;
}

.clickable-card * {
  cursor: pointer !important;  /* Apply to all child elements */
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  color: var(--text-primary);
}

.stat-info h3 {
  font-size: 2rem;
  margin: 0;
  color: var(--text-primary);
}

.stat-info span {
  color: var(--text-secondary);
}

.quick-actions h2 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.action-content {
  text-align: center;
}

.action-icon {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.action-content h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.action-content p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}
</style>