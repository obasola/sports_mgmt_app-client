<!-- src/components/common/BaseSelect.vue -->
<template>
  <div class="base-select" :class="{ 'base-select--error': error, 'base-select--disabled': disabled }">
    <label v-if="label" class="base-select__label" :for="id">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>
    <div class="base-select__wrapper">
      <select
        :id="id"
        :value="modelValue"
        class="base-select__select"
        :disabled="disabled"
        :required="required"
        @change="handleChange"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="getOptionValue(option)" 
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div class="base-select__icon" v-if="!loading">
        <i class="pi pi-chevron-down"></i>
      </div>
      <div class="base-select__loading" v-else>
        <i class="pi pi-spin pi-spinner"></i>
      </div>
    </div>
    <div v-if="error" class="base-select__error">{{ error }}</div>
    <div v-else-if="hint" class="base-select__hint">{{ hint }}</div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
}

export default defineComponent({
  name: 'BaseSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array as PropType<(SelectOption | string | number)[]>,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: () => `select-${Math.random().toString(36).substring(2, 9)}`
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  methods: {
    handleChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit('update:modelValue', target.value);
    },
    getOptionValue(option: SelectOption | string | number): string | number {
      return typeof option === 'object' ? option.value : option;
    },
    getOptionLabel(option: SelectOption | string | number): string {
      return typeof option === 'object' ? option.label : String(option);
    }
  }
});
</script>
  
<style scoped>
.base-select {
  margin-bottom: 1rem;
}

.base-select__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--light-color);
  font-size: 0.9rem;
}

.base-select__required {
  color: var(--error-color);
  margin-left: 4px;
}

.base-select__wrapper {
  position: relative;
}

.base-select__select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 2px solid rgba(233, 196, 106, 0.3);
  border-radius: 4px;
  appearance: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--dark-text);
  transition: all 0.2s ease;
  cursor: pointer;
  padding-right: 2.5rem; /* Space for the dropdown icon */
}

.base-select__select:focus {
  outline: none;
  border-color: var(--alternate-accent);
  box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.25);
}

.base-select__select:disabled {
  background-color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  border-color: rgba(233, 196, 106, 0.2);
  color: rgba(51, 51, 51, 0.7);
}

.base-select__icon,
.base-select__loading {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  font-size: 1rem;
}

.base-select__loading {
  color: var(--alternate-accent);
}

.base-select--error .base-select__select {
  border-color: var(--error-color);
}

.base-select--error .base-select__select:focus {
  box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.25);
}

.base-select__error {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.base-select__hint {
  color: rgba(233, 196, 106, 0.8);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .base-select__select {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--light-color);
  }
  
  .base-select__select:disabled {
    background-color: rgba(255, 255, 255, 0.05);
    color: rgba(233, 196, 106, 0.5);
  }
  
  .base-select__icon {
    color: var(--light-color);
  }
}

/* Option styling (limited browser support) */
.base-select__select option {
  padding: 0.5rem;
  background-color: var(--white);
  color: var(--dark-text);
}

@media (prefers-color-scheme: dark) {
  .base-select__select option {
    background-color: #2a3b47;
    color: var(--light-color);
  }
}
</style>