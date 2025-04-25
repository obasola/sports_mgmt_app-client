// PlayerCsvUpload.vue
<template>
  <div class="space-y-2">
    <FileUpload 
      mode="advanced" 
      chooseLabel="Choose CSV File"
      uploadLabel="Parse CSV"
      cancelLabel="Reset Selection"
      :auto="false"
      customUpload
      @select="handleFileSelect"
      @uploader="onUpload"
    />
  </div>
</template>

<script setup lang="ts">
import Papa from 'papaparse';
import FileUpload from 'primevue/fileupload';
import type { Player } from '@/domain/models/Player';

defineProps<{
  players: Player[];
}>();

const emit = defineEmits<{
                (e: 'update:players', value: Player[]): void;
              }>();

function onUpload(event: any) {
  // You can even call handleFileSelect here if needed:

  handleFileSelect({ files: event.files });
}

function handleFileSelect(event: any) {
  const file = event.files[0];

  if (!file) return Promise.reject(new Error("No file selected"));

  const positionFromFilename = file.name.split('_').pop()?.replace('.csv', '').trim().toUpperCase() || 'UNKNOWN';

  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        const rows = results.data as string[][];
        const parsedPlayers: Player[] = rows.map((row) => {
          const fullname = row[0]?.replace('NAME:', '').trim();
          const university = row[1]?.replace('SCHOOL:', '').trim();
          const height = parseFloat(row[2]) || 0;
          const weight = parseFloat(row[3]) || 0;
          const handSize = parseFloat(row[4]) || 0;
          const armLength = parseFloat(row[5]) || 0;

          const [firstName, ...rest] = fullname.split(' ');
          const lastName = rest.join(' ') || 'Unknown';
      //    alert("Returning data for: "+ fullname);
          return {
            firstName,
            lastName,
            age: 0,
            university,
            height,
            weight,
            handSize,
            armLength,
            position: positionFromFilename,
            homeCity: '',
            homeState: '',
            yearEnteredLeague: new Date(),

          } satisfies Player;
        });
        //alert("calling resolve");
        emit('update:players', parsedPlayers);  
               
      } catch (e) {
        console.error("Processing error:", e);
        alert("error attempting to resolve");
      }
    },
    error: (err: Error) => {
      console.error("CSV parse error:", err);
      alert("CSV parse error");
    }
  });
}


</script>

<style scoped>
</style>