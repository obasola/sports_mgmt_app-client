# Team,PlayerAward, CombineScore, Prospect, DraftPick, Schedule, TeamNeed, PostSeasonResult
Build PlayerTeam module using this template:

# Sports Management App - Domain Module Template & Patterns

## 🎯 **Project Overview**

**Architecture:** Vue 3 + Vite + TypeScript + Pinia + PrimeVue  
**Pattern:** Domain-Driven Design (DDD) + SOLID Principles  
**Data Flow:** `Component → Store → Service → Server`  
**Styling:** Custom theme (#003049 bg, #780000 text)  
**No local storage** - All data via REST API

## 📋 **Established Specifications**

### Core Requirements
- ✅ Use `<script setup lang="ts">` everywhere
- ✅ No props/emits - use Pinia for data sharing  
- ✅ Views delegate to components (no inline code)
- ✅ Separate CRUD components for each operation
- ✅ Collapsible panels for relationships (Accordion/Panel)
- ✅ Full CRUD via Axios with REST endpoints
- ✅ Prettier formatting + ESLint

### Technology Stack
```json
{
  "vue": "^3.4.21",
  "vue-router": "^4.3.0", 
  "pinia": "^2.1.7",
  "primevue": "3.50.0",
  "primeicons": "^7.0.0",
  "axios": "^1.6.8"
}
```

## 🏗️ **Module Structure Pattern**

For each domain (Team, Prospect, DraftPick, etc.), create:

```
src/
├── services/
│   └── {domain}Service.ts        # API calls
├── stores/
│   └── {domain}Store.ts          # State management
├── components/{domain}/
│   ├── {Domain}ReadOnly.vue      # Display with relationships
│   ├── {Domain}CreateForm.vue    # Creation form
│   ├── {Domain}EditForm.vue      # Edit form
│   └── {Domain}List.vue          # DataTable listing
├── views/
│   └── {Domain}Detail.vue        # Route coordinator
└── router/index.ts               # Add routes
```

## 🔄 **Proven Patterns (from Player Module)**

### 1. Service Layer Pattern

```typescript
// src/services/{domain}Service.ts
import { apiService } from './api'
import type { {Domain} } from '@/types'

export class {Domain}Service {
  private readonly endpoint = '/{domains}'

  async getAll(): Promise<{Domain}[]> {
    const response = await apiService.get<{Domain}[]>(this.endpoint)
    return response.data
  }

  async getById(id: number): Promise<{Domain}> {
    const response = await apiService.get<{Domain}>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByName(name: string): Promise<{Domain}[]> {
    const response = await apiService.get<{Domain}[]>(
      `${this.endpoint}/filter?name=${name}`
    )
    return response.data
  }

  async create(data: Omit<{Domain}, 'id'>): Promise<{Domain}> {
    const response = await apiService.post<{Domain}>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<{Domain}>): Promise<{Domain}> {
    const response = await apiService.put<{Domain}>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const {domain}Service = new {Domain}Service()
```

### 2. Store Pattern (No Persistence)

```typescript
// src/stores/{domain}Store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { {domain}Service } from '@/services/{domain}Service'
import type { {Domain}, CrudMode } from '@/types'

export const use{Domain}Store = defineStore('{domain}', () => {
  // State - in memory only, fetched from server
  const {domains} = ref<{Domain}[]>([])
  const current{Domain} = ref<{Domain} | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const get{Domain}ById = computed(() => {
    return (id: number) => {domains}.value.find((item) => item.id === id)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if ({domains}.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      {domains}.value = await {domain}Service.getAll()
    } catch (err) {
      error.value = 'Failed to fetch {domains} from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = get{Domain}ById.value(id)
      if (cached) {
        current{Domain}.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      current{Domain}.value = await {domain}Service.getById(id)
      
      const index = {domains}.value.findIndex((item) => item.id === id)
      if (index !== -1 && current{Domain}.value) {
        {domains}.value[index] = current{Domain}.value
      }
      
      return current{Domain}.value
    } catch (err) {
      error.value = 'Failed to fetch {domain} from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Omit<{Domain}, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const new{Domain} = await {domain}Service.create(data)
      {domains}.value.push(new{Domain})
      current{Domain}.value = new{Domain}
      return new{Domain}
    } catch (err) {
      error.value = 'Failed to create {domain} on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<{Domain}>) => {
    loading.value = true
    error.value = null
    try {
      const updated{Domain} = await {domain}Service.update(id, data)
      const index = {domains}.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        {domains}.value[index] = updated{Domain}
      }
      current{Domain}.value = updated{Domain}
      return updated{Domain}
    } catch (err) {
      error.value = 'Failed to update {domain} on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await {domain}Service.delete(id)
      {domains}.value = {domains}.value.filter((item) => item.id !== id)
      if (current{Domain}.value?.id === id) {
        current{Domain}.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete {domain} on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setMode = (newMode: CrudMode) => {
    mode.value = newMode
  }

  const clearCurrent = () => {
    current{Domain}.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    {domains},
    current{Domain},
    loading,
    error,
    mode,
    // Getters  
    get{Domain}ById,
    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})
```

### 3. List Component Pattern

```vue
<!-- src/components/{domain}/{Domain}List.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { use{Domain}Store } from '@/stores/{domain}Store'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const {domain}Store = use{Domain}Store()
const router = useRouter()

onMounted(() => {
  {domain}Store.fetchAll()
})

const view{Domain} = (id: number) => {
  router.push(`/{domains}/${id}?mode=read`)
}

const edit{Domain} = (id: number) => {
  router.push(`/{domains}/${id}?mode=edit`)
}

const create{Domain} = () => {
  router.push('/{domains}?mode=create')
}

const delete{Domain} = async (id: number) => {
  if (confirm('Are you sure you want to delete this {domain}?')) {
    await {domain}Store.remove(id)
  }
}
</script>

<template>
  <div class="{domain}-list">
    <div class="list-header">
      <h2>{Domains}</h2>
      <Button
        @click="create{Domain}"
        label="Create {Domain}"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="{domain}Store.{domains}"
      :loading="{domain}Store.loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
    >
      <!-- Add columns based on domain fields -->
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="view{Domain}(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="edit{Domain}(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="delete{Domain}(data.id)"
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              v-tooltip="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.{domain}-list {
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
</style>
```

### 4. ReadOnly Component Pattern

```vue
<!-- src/components/{domain}/{Domain}ReadOnly.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { use{Domain}Store } from '@/stores/{domain}Store'
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const {domain}Store = use{Domain}Store()

const {domain} = computed(() => {domain}Store.current{Domain})

onMounted(async () => {
  // Load any related data
})
</script>

<template>
  <Card v-if="{domain}" class="{domain}-details">
    <template #title>
      {/* Display title based on domain fields */}
    </template>

    <template #content>
      <div class="{domain}-info-grid">
        {/* Add info sections based on domain fields */}
      </div>

      <Accordion class="relationships-accordion">
        {/* Add relationship tabs based on domain */}
      </Accordion>
    </template>
  </Card>
</template>

<style scoped>
.{domain}-details {
  max-width: 1000px;
  margin: 0 auto;
}

.{domain}-info-grid {
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
```

### 5. Create/Edit Form Pattern

```vue
<!-- src/components/{domain}/{Domain}CreateForm.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { use{Domain}Store } from '@/stores/{domain}Store'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const {domain}Store = use{Domain}Store()
const router = useRouter()
const toast = useToast()

const form = reactive({
  // Initialize form fields based on domain
})

const onSubmit = async () => {
  try {
    await {domain}Store.create(form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: '{Domain} created successfully',
    })
    router.push('/{domains}')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create {domain}',
    })
  }
}

const onCancel = () => {
  router.push('/{domains}')
}
</script>

<template>
  <Card class="create-form">
    <template #title>Create New {Domain}</template>

    <template #content>
      <form @submit.prevent="onSubmit" class="{domain}-form">
        <div class="form-grid">
          {/* Add form sections based on domain fields */}
        </div>

        <div class="form-actions">
          <Button
            type="button"
            @click="onCancel"
            label="Cancel"
            class="p-button-secondary"
          />
          <Button
            type="submit"
            label="Create {Domain}"
            :loading="{domain}Store.loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.create-form {
  max-width: 1000px;
  margin: 0 auto;
}

.{domain}-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.form-row {
  margin-bottom: 1rem;
}

.form-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>
```

### 6. Detail View Pattern

```vue
<!-- src/views/{Domain}Detail.vue -->
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { use{Domain}Store } from '@/stores/{domain}Store'
import AppLayout from '@/components/ui/AppLayout.vue'
import {Domain}List from '@/components/{domain}/{Domain}List.vue'
import {Domain}ReadOnly from '@/components/{domain}/{Domain}ReadOnly.vue'
import {Domain}CreateForm from '@/components/{domain}/{Domain}CreateForm.vue'
import {Domain}EditForm from '@/components/{domain}/{Domain}EditForm.vue'

const route = useRoute()
const router = useRouter()
const {domain}Store = use{Domain}Store()

const {domain}Id = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const mode = computed(() => {
  return (route.query.mode as string) || 'read'
})

onMounted(async () => {
  {domain}Store.setMode(mode.value as any)
  if ({domain}Id.value) {
    await {domain}Store.fetchById({domain}Id.value)
  }
})

watch(
  () => route.query.mode,
  (newMode) => {
    if (newMode) {
      {domain}Store.setMode(newMode as any)
    }
  }
)

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await {domain}Store.fetchById(parseInt(newId as string))
    } else {
      {domain}Store.clearCurrent()
    }
  }
)
</script>

<template>
  <AppLayout>
    <div class="{domain}-detail-view">
      <!-- Show list when no ID -->
      <{Domain}List v-if="!{domain}Id" />

      <!-- Show create form -->
      <{Domain}CreateForm v-else-if="mode === 'create'" />

      <!-- Show edit form -->
      <{Domain}EditForm v-else-if="mode === 'edit'" />

      <!-- Show read-only view -->
      <{Domain}ReadOnly v-else />
    </div>
  </AppLayout>
</template>

<style scoped>
.{domain}-detail-view {
  width: 100%;
}
</style>
```

### 7. Route Configuration

```typescript
// Add to src/router/index.ts
{
  path: '/{domains}/:id?',
  name: '{Domain}Detail',
  component: () => import('@/views/{Domain}Detail.vue'),
}
```

## 📊 **Domain-Specific Data Models**

### Team
```typescript
interface Team {
  id?: number
  name: string
  city: string
  state: string
  conference: string
  division: string
  stadium: string
  country: string
  scheduleId?: number
}
```

### Prospect  
```typescript
interface Prospect {
  id?: number
  firstName: string
  lastName: string
  position: string
  college: string
  height: number
  weight: number
  handSize?: number
  armLength?: number
  homeCity?: string
  homeState?: string
  fortyTime?: number
  tenYardSplit?: number
  verticalLeap?: number
  broadJump?: number
  threeCone?: number
  twentyYardShuttle?: number
  benchPress?: number
  drafted: boolean
  draftYear?: number
  teamId?: number
  draftPickId?: number
  createdAt?: Date
  updatedAt?: Date
}
```

### DraftPick
```typescript
interface DraftPick {
  id?: number
  draftYear: number
  round: number
  pickNumber: number
  playerId?: number
  teamId: number | undefined
  playerFirstName?: string
  playerLastName?: string
  pickFrom: number
  pickTo: number
  combineScore: number
}
```

### PlayerAward
```typescript
interface PlayerAward {
  id?: number | undefined
  playerId: number | undefined
  awardName: string
  awardYear: number
  awardDescription?: string
}
```

### CombineScore
```typescript
interface CombineScore {
  id?: number
  playerId: number
  fortyTime: number
  tenYardSplit: number
  verticalLeap: number
  broadJump: number
  threeCone: number
  twentyYardShuttle: number
  benchPress: number
}
```

### Schedule
```typescript
interface Schedule {
  id?: number
  teamId?: number
  seasonYear: string
  oppTeamId: number
  oppTeamConference?: string
  oppTeamDivision?: string
  scheduleWeek?: number
  gameDate?: Date
  gameCity?: string
  gameStateProvince?: string
  gameCountry?: string
  gameLocation?: string
  wonLostFlag?: string
  homeOrAway?: string
  oppTeamScore?: number
  teamScore: number
  result?: string
}
```

### TeamNeed
```typescript
interface TeamNeed {
  id: number
  teamId: number
  draftYear: Date
  position: string
  priority: number
  createdDate: Date
  updatedAt: Date
}
```

### PostSeasonResult  
```typescript
interface PostSeasonResult {
  id: number
  playoffYear: number
  lastRoundReached?: string
  winLose?: string
  opponentScore?: number
  teamScore?: number
  teamId?: number
}
```

## 🎯 **Recommended Development Order**

1. **Team** - Foundational entity, referenced by others
2. **PlayerAward** - Simple relationship pattern
3. **CombineScore** - Simple 1:1 relationship  
4. **Prospect** - More complex entity
5. **DraftPick** - Complex relationships
6. **Schedule** - Team relationships
7. **TeamNeed** - Team-specific entity
8. **PostSeasonResult** - Final complex entity

## 🚀 **Usage Instructions**

### For Each New Chat:
1. Copy this entire template
2. Replace `{Domain}`, `{domain}`, `{domains}` with actual names
3. Customize fields based on the specific domain model
4. Build → Test → Move to next domain

### Build/Test Cycle:
```bash
# After each domain completion
npm run build
npm run dev
# Test CRUD operations
# Verify relationships  
# Check styling/UX
```

This systematic approach ensures consistency and allows testing at each step!
