// PlayerTableEditor.vue
<template>
  <div>
    <DataTable 
          v-model:editingRows="editingRows" 
          :value="players" 
          editMode="row" 
          dataKey="lastName" 
          class="p-datatable-sm"
          @rowEditInit="onRowEditInit"
          @rowEditSave="onRowEditSave"
          :emptyMessage="'Upload a file to preview players.'"
    >
      <Column field="firstName" header="First Name" :editor="textEditor" />
      <Column field="lastName" header="Last Name" :editor="textEditor" />
      <Column field="university" header="University" :editor="textEditor" />
      <Column field="height" header="Height" :editor="textEditor" />
      <Column field="weight" header="Weight" :editor="textEditor" />
      <Column field="handSize" header="Hand Size" :editor="textEditor" />
      <Column field="armLength" header="Arm Length" :editor="textEditor" />
      <Column field="position" header="Position" :editor="textEditor" />
      <Column field="age" header="Age" :editor="textEditor" />
      <Column :rowEditor="true" headerStyle="width:10%" />
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';

import InputText from 'primevue/inputtext';
import type { Player } from '@/domain/models/Player';

const props = defineProps<{ players: Player[] }>();

const editingRows = ref([]);

const emit = defineEmits<{
  (e: 'update:players', value: Player[]): void;
}>();




function textEditor(slotProps: any) {
  return h(InputText, {
    modelValue: slotProps.data[slotProps.field],
    'onUpdate:modelValue': (val: any) => {
      slotProps.data[slotProps.field] = val;
    },
    class: 'w-full'
  });
}

function onRowEditInit(event: any) {
  // No-op or add your own logic here
  console.log("event: "+event);
}

function onRowEditSave(event: any) {
  const updatedPlayer = event.newData;
  const index = props.players.findIndex(p => p.lastName === updatedPlayer.lastName); // ideally use `id`
  if (index !== -1) {
    const updatedList = [...props.players];
    updatedList[index] = { ...updatedPlayer };
    emit('update:players', updatedList);
  }
}

</script>

<style scoped>
</style>
