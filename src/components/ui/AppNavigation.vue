<!-- src/components/ui/AppNavigation.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menu from 'primevue/menu'

const router = useRouter()

const menuItems = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-chart-line',
    command: () => router.push('/'),
  },
  {
    label: 'Games',
    icon: 'pi pi-calendar',
    command: () => router.push('/games'),
  },
  {
    label: 'Players',
    icon: 'pi pi-users',
    command: () => router.push('/players'),
  },
  {
    label: 'Teams',
    icon: 'pi pi-flag',
    command: () => router.push('/teams'),
  },
  {
    label: 'Prospects',
    icon: 'pi pi-star',
    command: () => router.push('/prospects'),
  },
  {
    label: 'Draft Picks',
    icon: 'pi pi-list',
    command: () => router.push('/draft-picks'),
  },
  {
    label: 'Combine Scores',
    icon: 'pi pi-chart-bar',
    command: () => router.push('/combine-scores'),
  },
  {
    label: 'Schedules',
    icon: 'pi pi-calendar',
    command: () => router.push('/schedules'),
  },
  {
    label: 'Player Awards',
    icon: 'pi pi-trophy',
    command: () => router.push('/player-awards'),
  },
  {
    label: 'Player Teams',
    icon: 'pi pi-users',
    command: () => router.push('/player-teams'),
  },  
  {
    label: 'Team Needs',
    icon: 'pi pi-exclamation-triangle',
    command: () => router.push('/team-needs'),
  },
  {
    label: 'Post Season Results',
    icon: 'pi pi-crown',
    command: () => router.push('/post-season-results'),
  },
])
</script>

<template>
  <nav class="app-navigation">
    <Menu :model="menuItems" class="nav-menu" />
  </nav>
</template>

<style scoped>
.app-navigation {
  width: 250px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  padding: 1rem;
}

:deep(.nav-menu) {
  border: none;
  background: transparent;
}

:deep(.nav-menu .p-menuitem-link) {
  color: var(--text-primary);
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

:deep(.nav-menu .p-menuitem-link:hover) {
  background-color: rgba(120, 0, 0, 0.1);
}

:deep(.nav-menu .p-menuitem-icon) {
  color: var(--text-primary);
}
</style>