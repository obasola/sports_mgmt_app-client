<!-- src/components/common/DuplicateEntityAlert.vue -->
<template>
    <div v-if="error" class="duplicate-alert">
      <div class="duplicate-alert__content">
        <i class="pi pi-exclamation-triangle duplicate-alert__icon"></i>
        <div class="duplicate-alert__message">
          <p>{{ error }}</p>
          <div class="duplicate-alert__actions">
            <BaseButton 
              v-if="duplicateId && showViewAction" 
              variant="secondary" 
              @click="$emit('view-duplicate', duplicateId)"
            >
              View Existing {{ entityType }}
            </BaseButton>
            <BaseButton 
              v-if="duplicateId && showUpdateAction" 
              variant="primary" 
              @click="$emit('update-duplicate', duplicateId)"
            >
              Update Existing {{ entityType }}
            </BaseButton>
            <BaseButton 
              v-if="showSmartSaveAction" 
              variant="accent" 
              @click="$emit('smart-save')"
            >
              Smart Save (Create or Update)
            </BaseButton>
            <BaseButton 
              variant="text" 
              @click="$emit('dismiss')"
            >
              Dismiss
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import BaseButton from './BaseButton.vue';
  
  export default defineComponent({
    name: 'DuplicateEntityAlert',
    components: {
      BaseButton
    },
    props: {
      error: {
        type: String,
        default: ''
      },
      duplicateId: {
        type: Number,
        default: null
      },
      entityType: {
        type: String,
        default: 'Entity'
      },
      showViewAction: {
        type: Boolean,
        default: true
      },
      showUpdateAction: {
        type: Boolean,
        default: true
      },
      showSmartSaveAction: {
        type: Boolean,
        default: true
      }
    },
    emits: ['view-duplicate', 'update-duplicate', 'smart-save', 'dismiss']
  });
  </script>
  
  <style scoped>
  .duplicate-alert {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: rgba(244, 162, 97, 0.2);
    border-left: 4px solid var(--alternate-accent);
    border-radius: 4px;
  }
  
  .duplicate-alert__content {
    display: flex;
    gap: 1rem;
  }
  
  .duplicate-alert__icon {
    font-size: 1.5rem;
    color: var(--alternate-accent);
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  .duplicate-alert__message {
    flex: 1;
  }
  
  .duplicate-alert__message p {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--light-color);
  }
  
  .duplicate-alert__actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: 640px) {
    .duplicate-alert__content {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .duplicate-alert__actions {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>