<template>
  <div class="home-page">
    <Card class="welcome-card">
      <template #title>
        <h1>Sports Management Application</h1>
      </template>
      <template #content>
        <p>
          Welcome to the Sports Management Application. This system helps you manage teams, players,
          schedules, draft picks, and more.
        </p>

        <div class="quick-links mt-4">
          <h2>Quick Links</h2>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3 p-2">
              <Card class="link-card">
                <template #header>
                  <div class="card-icon">
                    <i class="pi pi-users"></i>
                  </div>
                </template>
                <template #title>Teams</template>
                <template #content>
                  <p>Manage team information, view players, and schedules.</p>
                </template>
                <template #footer>
                  <Button
                    label="View Teams"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="navigateTo('/teams')"
                  />
                </template>
              </Card>
            </div>
            <div class="col-12 md:col-6 lg:col-3 p-2">
              <Card class="link-card">
                <template #header>
                  <div class="card-icon">
                    <i class="fa fa-users"></i>
                  </div>
                </template>
                <template #title>Players</template>
                <template #content>
                  <p>View player information, stats, and awards.</p>
                </template>
                <template #footer>
                  <Button
                    label="View Players"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="navigateTo('/players')"
                  />
                </template>
              </Card>
            </div>
            <div class="col-12 md:col-6 lg:col-3 p-2">
              <Card class="link-card">
                <template #header>
                  <div class="card-icon">
                    <i class="pi pi-calendar"></i>
                  </div>
                </template>
                <template #title>Schedule</template>
                <template #content>
                  <p>View and manage team schedules and game information.</p>
                </template>
                <template #footer>
                  <Button
                    label="View Schedule"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="navigateTo('/schedules')"
                  />
                </template>
              </Card>
            </div>
            <div class="col-12 md:col-6 lg:col-3 p-2">
              <Card class="link-card">
                <template #header>
                  <div class="card-icon">
                    <i class="pi pi-list"></i>
                  </div>
                </template>
                <template #title>Draft</template>
                <template #content>
                  <p>View and manage draft picks and prospect information.</p>
                </template>
                <template #footer>
                  <Button
                    label="View Draft"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="navigateTo('/draft-picks')"
                  />
                </template>
              </Card>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.welcome-card {
  margin-bottom: 2rem;
  background-color: var(--light-bg);
}

.welcome-card ::v-deep(.p-card-title) {
  color: var(--primary-text);
}

.welcome-card ::v-deep(.p-card-content) {
  color: var(--primary-text);
}

.link-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--light-bg);
}

.link-card ::v-deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link-card ::v-deep(.p-card-content) {
  flex: 1;
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.card-icon i {
  font-size: 2rem;
  color: var(--accent);
}

.quick-links h2 {
  color: var(--primary-text);
  margin-bottom: 1rem;
}
</style>
