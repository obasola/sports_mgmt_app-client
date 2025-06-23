<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const teamStore = useTeamStore()

const team = computed(() => teamStore.currentTeam)

onMounted(async () => {
  // Load any related data like players, schedule, etc.
})
</script>

<template>
  <Card v-if="team" class="team-details">
    <template #title>
      {{ team.name }}
    </template>
    <template #subtitle>
      {{ team.city }}, {{ team.state }} - {{ team.conference }} {{ team.division }}
    </template>

    <template #content>
      <div class="team-info-grid">
        <div class="info-section">
          <h3>Team Information</h3>
          <div class="info-row">
            <span class="label">Team Name:</span>
            <span>{{ team.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">City:</span>
            <span>{{ team.city }}</span>
          </div>
          <div class="info-row">
            <span class="label">State:</span>
            <span>{{ team.state }}</span>
          </div>
          <div class="info-row">
            <span class="label">Country:</span>
            <span>{{ team.country }}</span>
          </div>
          <div class="info-row">
            <span class="label">Stadium:</span>
            <span>{{ team.stadium }}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>League Information</h3>
          <div class="info-row">
            <span class="label">Conference:</span>
            <span>{{ team.conference }}</span>
          </div>
          <div class="info-row">
            <span class="label">Division:</span>
            <span>{{ team.division }}</span>
          </div>
          <div class="info-row" v-if="team.scheduleId">
            <span class="label">Schedule ID:</span>
            <span>{{ team.scheduleId }}</span>
          </div>
        </div>
      </div>

      <Accordion class="relationships-accordion">
        <AccordionTab header="Players">
          <p>Players roster will be displayed here when player relationships are implemented.</p>
        </AccordionTab>
        
        <AccordionTab header="Schedule">
          <p>Team schedule will be displayed here when schedule relationships are implemented.</p>
        </AccordionTab>
        
        <AccordionTab header="Draft Picks">
          <p>Team draft history will be displayed here when draft pick relationships are implemented.</p>
        </AccordionTab>
        
        <AccordionTab header="Team Needs">
          <p>Team draft needs will be displayed here when team needs relationships are implemented.</p>
        </AccordionTab>
        
        <AccordionTab header="Playoff Results">
          <p>Playoff history will be displayed here when post-season results are implemented.</p>
        </AccordionTab>
      </Accordion>
    </template>
  </Card>
</template>

<style scoped>
.team-details {
  max-width: 1000px;
  margin: 0 auto;
}

.team-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-section h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.label {
  font-weight: bold;
  color: var(--text-primary);
}

.relationships-accordion {
  margin-top: 2rem;
}
</style>