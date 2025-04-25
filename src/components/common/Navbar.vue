<template>
  <div class="navbar">
    <Menubar :model="items" class="p-menubar-custom" :router="true">
      <template #start>
        <div class="logo">
          <router-link to="/">
            <h1>Sports Management App</h1>
          </router-link>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import { useNavigation } from '@/composables/useNavigation' // or wherever it's defined

const { goToPage } = useNavigation()

const items = ref([
  {
    label: 'Teams',
    icon: 'pi pi-users',
    styleClass: 'green-icon',
    command: () => goToPage('teams'),
    to: { name: 'teams' }
  },
  {
    label: 'Players',
    icon: 'fa fa-users',
    styleClass: 'green-icon',
    command: () => goToPage('players'),
    to: { name: 'players' }
  },
  {
    label: 'Schedule',
    icon: 'pi pi-calendar',
    styleClass: 'green-icon',
    command: () => goToPage('schedules'),
    to: { name: 'shedules' }
  },
  {
    label: 'Draft',
    icon: 'pi pi-list',
    styleClass: 'green-icon',
    command: () => goToPage('draft-picks'),
    to: { name: 'draft-picks' }
  },
  {
    label: 'Awards',
    icon: 'fa fa-trophy',
    styleClass: 'green-icon', // <- Font Awesome trophy icon
    command: () => goToPage('player-awards'),
    to: { name: 'player-awards' }
  },
  {
    label: 'Combine',
    icon: 'pi pi-stopwatch',
    styleClass: 'green-icon',
    command: () => goToPage('combine-scores'),
    to: { name: 'combine-scores' }
  },
  {
    label: 'Draft',
    icon: 'pi pi-stopwatch',
    styleClass: 'green-icon',
    command: () => goToPage('draft'),
    to: { name: 'draft' }
  },
  {
    label: 'Track Draft',
    icon: 'pi pi-stopwatch',
    styleClass: 'green-icon',
    command: () => goToPage('draft-tracker'),
    to: { name: 'draft-tracker' }
  },
  {
    label: 'Batch',
    icon: 'pi pi-upload',
    items: [
      {
        label: 'Upload Prospects',
        icon: 'pi pi-user-plus',
        command: () => goToPage('upload-prospects'),
        to: { name: 'upload-prospects' },
      },
      {
        label: 'Upload Combine Scores',
        icon: 'pi pi-file-excel',
        to: { name: 'upload-combine-scores' },
        command: () => goToPage('upload-combine-scores'),
      },
    ],
  },
])
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.p-menubar-custom {
  background-color: var(--secondary-bg);
  color: var(--light-text);
  margin-right: 0.75rem !important;
  padding: 0.5rem 1rem;
}

.p-menubar-custom :deep(.p-menuitem-link) {
  margin-right: 0.75rem !important;
  color: var(--light-text) !important;
}

.p-menubar-custom :deep(.p-menuitem-link:hover) {
  background-color: var(--secondary-text);
  margin-right: 0.7em;
}

.p-menubar .p-menubar-root-list > .p-menuitem {
  margin-right: 5rem; /* Adjust this value to control spacing */
}


.logo {
  margin-right: 1rem;
}

.logo h1 {
  font-size: 1.5rem;
  color: var(--light-text);
  margin: 0;
}

.logo a {
  text-decoration: none;
}
</style>

<script setup lang="ts"></script>
