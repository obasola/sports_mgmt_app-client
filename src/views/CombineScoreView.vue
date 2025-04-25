<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Combine Scores Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && scoreId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <CombineScoreView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Combine Score</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <CombineScoreForm @save="createCombineScore" @cancel="goToList" />
        </div>
        <div v-else>
          <CombineScoreList
            @view="viewCombineScore"
            @edit="editCombineScore"
            @create="isCreating = true"
            @deleted="combineScoreDeleted"
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
import { useCombineScoreStore } from '@/stores/combineScore'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import CombineScoreList from '@/components/combinescore/CombineScoreList.vue'
import CombineScoreView from '@/components/combinescore/CombineScoreView.vue'
import CombineScoreForm from '@/components/combinescore/CombineScoreForm.vue'
import type { CombineScore } from '@/domain/models/CombineScore'

const router = useRouter()
const route = useRoute()
const combineScoreStore = useCombineScoreStore()
const toast = useToast()

const isCreating = ref(false)

const scoreId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!scoreId.value)

const viewCombineScore = (id: number) => {
  router.push(`/combine-scores/${id}`)
}

const editCombineScore = (id: number) => {
  router.push(`/combine-scores/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/combine-scores')
}

const createCombineScore = async (combineScore: CombineScore) => {
  try {
    const newScore = await combineScoreStore.createCombineScore(combineScore)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Combine score created successfully`,
      life: 3000
    })
    goToList()
    // View the new combine score
    if (newScore && newScore.id) {
      viewCombineScore(newScore.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create combine score',
      life: 3000
    })
  }
}

const combineScoreDeleted = () => {
  // Refresh the combine score list
  combineScoreStore.fetchCombineScores()
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
