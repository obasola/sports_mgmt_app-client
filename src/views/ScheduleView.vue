<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Schedule Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && scheduleId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <ScheduleView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Game</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <ScheduleForm @save="createSchedule" @cancel="goToList" />
        </div>
        <div v-else>
          <ScheduleList
            @view="viewSchedule"
            @edit="editSchedule"
            @create="isCreating = true"
            @deleted="scheduleDeleted"
          />
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScheduleStore } from '@/stores/schedule'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ScheduleList from '@/components/schedule/ScheduleList.vue'
import ScheduleView from '@/components/schedule/ScheduleView.vue'
import ScheduleForm from '@/components/schedule/ScheduleForm.vue'
import type { Schedule } from '@/domain/models/Schedule'

const router = useRouter()
const route = useRoute()
const scheduleStore = useScheduleStore()
const toast = useToast()

const isCreating = ref(false)

const scheduleId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!scheduleId.value)

const viewSchedule = (id: number) => {
  router.push(`/schedules/${id}`)
}

const editSchedule = (id: number) => {
  router.push(`/schedules/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/schedules')
}

const createSchedule = async (schedule: Schedule) => {
  try {
    const newSchedule = await scheduleStore.createSchedule(schedule)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game created successfully',
      life: 3000
    })
    goToList()
    // View the new schedule
    if (newSchedule && newSchedule.id) {
      viewSchedule(newSchedule.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create game',
      life: 3000
    })
  }
}

const scheduleDeleted = () => {
  // Refresh the schedule list
  scheduleStore.fetchSchedules()
}
</script>

<style scoped>
.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title h1 {
  margin: 0;
  color: var(--primary-text);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: var(--primary-text);
}
</style>
