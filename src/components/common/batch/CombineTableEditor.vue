// CombineTableEditor.vue
<template>
  <div>
    <DataTable :value="scores" class="p-datatable-sm" editable>
      <Column field="playerId" header="Player ID" :editor="numberEditor" />
      <Column field="fortyTime" header="40 Time" :editor="numberEditor" />
      <Column field="tenYardSplit" header="10-Yard Split" :editor="numberEditor" />
      <Column field="twentyYardShuttle" header="20-Yard Shuttle" :editor="numberEditor" />
      <Column field="threeCone" header="3 Cone" :editor="numberEditor" />
      <Column field="verticalLeap" header="Vertical Leap" :editor="numberEditor" />
      <Column field="broadJump" header="Broad Jump" :editor="numberEditor" />
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { watch, h } from 'vue';

import InputText from 'primevue/inputtext';
import type { CombineScore } from '@/domain/models/CombineScore';

const props = defineProps<{ scores: CombineScore[] }>();
const emitUpdated = defineModel<CombineScore[]>();

//const editingRows = ref([]);

watch(
  () => props.scores,
  (newVal) => {
    emitUpdated.value = [...newVal];
  },
  { deep: true }
);

function numberEditor(slotProps: any) {
    return h(InputText, {
        type: 'number',
        modelValue: slotProps.data[slotProps.field],
        'onUpdate:modelValue': (value: number) => {
        slotProps.data[slotProps.field] = value;
        }
    });
}

</script>

<style scoped>
.p-datatable-sm .p-inputtext {
  width: 100%;
}
</style>
