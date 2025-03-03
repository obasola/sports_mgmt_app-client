<!-- src/components/common/Navbar.vue -->
<template>
  <div class="navbar">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <div class="logo">
          <router-link to="/">
            <h1>Sports Management</h1>
          </router-link>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    to: '/',
    class: 'menu-item'
  },
  {
    label: 'Teams',
    icon: 'pi pi-users',
    to: '/teams',
    class: 'menu-item'
  },
  {
    label: 'Players',
    icon: 'pi pi-user',
    to: '/players',
    class: 'menu-item'
  },
  {
    label: 'Player Awards',
    icon: 'pi pi-trophy',
    to: '/player-awards',
    class: 'menu-item'
  },
  {
    label: 'Schedules',
    icon: 'pi pi-calendar',
    to: '/schedules',
    class: 'menu-item'
  }
]);
</script>

<style scoped>
.navbar {
  width: 100%;
}

.logo {
  margin-right: 1rem;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--primary-color);
}

a {
  text-decoration: none;
}

/* Custom styling for menu items with spacing */
:deep(.custom-menubar .p-menubar-root-list) {
  gap: 1rem; /* Adds space between menu items */
}

:deep(.custom-menubar .p-menuitem) {
  margin-right: 0.5rem; /* Additional right margin for menu items */
}

:deep(.custom-menubar .p-menuitem-link) {
  padding: 0.75rem 1rem; /* Increase padding for better touch targets */
  border-radius: 4px; /* Optional: adds rounded corners */
}

:deep(.custom-menubar .p-menuitem-link:hover) {
  background-color: var(--surface-hover); /* Consistent hover effect */
}

:deep(.custom-menubar .p-menuitem-icon) {
  margin-right: 0.5rem; /* Space between icon and text */
}
</style>
