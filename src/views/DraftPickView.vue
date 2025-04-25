<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Draft Picks Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && draftPickId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <DraftPickView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Draft Pick</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <DraftPickForm @save="createDraftPick" @cancel="goToList" />
        </div>
        <div v-else>
          <DraftPickList
            @view="viewDraftPick"
            @edit="editDraftPick"
            @create="isCreating = true"
            @deleted="draftPickDeleted"
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
import { useDraftPickStore } from '@/stores/draftPick'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import DraftPickList from '@/components/draftpick/DraftPickList.vue'
import DraftPickView from '@/components/draftpick/DraftPickView.vue'
import DraftPickForm from '@/components/draftpick/DraftPickForm.vue'
import type { DraftPick } from '@/domain/models/DraftPick'

const router = useRouter()
const route = useRoute()
const draftPickStore = useDraftPickStore()
const toast = useToast()

const isCreating = ref(false)

const draftPickId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!draftPickId.value)

const viewDraftPick = (id: number) => {
  router.push(`/draft-picks/${id}`)
}

const editDraftPick = (id: number) => {
  router.push(`/draft-picks/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/draft-picks')
}

const createDraftPick = async (draftPick: DraftPick) => {
  try {
    const newDraftPick = await draftPickStore.createDraftPick(draftPick)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Draft pick created successfully`,
      life: 3000
    })
    goToList()
    // View the new draft pick
    if (newDraftPick && newDraftPick.id) {
      viewDraftPick(newDraftPick.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create draft pick',
      life: 3000
    })
  }
}

const draftPickDeleted = () => {
  // Refresh the draft pick list
  draftPickStore.fetchDraftPicks()
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
