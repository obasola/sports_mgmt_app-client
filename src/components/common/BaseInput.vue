<!-- src/components/common/BaseInput.vue -->
<template>
    <div class="base-input" :class="{ 'base-input--error': error, 'base-input--disabled': disabled }">
      <label v-if="label" class="base-input__label" :for="id">
        {{ label }}
        <span v-if="required" class="base-input__required">*</span>
      </label>
      <div class="base-input__wrapper">
        <input
          :id="id"
          :value="modelValue"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :min="min"
          :max="max"
          :step="step"
          class="base-input__input"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @change="$emit('change', $event)"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
        />
        <div v-if="$slots.append" class="base-input__append">
          <slot name="append"></slot>
        </div>
      </div>
      <div v-if="error" class="base-input__error">{{ error }}</div>
      <div v-else-if="hint" class="base-input__hint">{{ hint }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'BaseInput',
    props: {
      modelValue: {
        type: [String, Number],
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substring(2, 9)}`
      },
      type: {
        type: String,
        default: 'text',
        validator: (value: string) => {
          return [
            'text', 'password', 'email', 'number', 'tel', 'url', 
            'date', 'datetime-local', 'month', 'week', 'time',
            'search', 'color'
          ].includes(value);
        }
      },
      placeholder: {
        type: String,
        default: ''
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
      min: {
        type: [String, Number],
        default: undefined
      },
      max: {
        type: [String, Number],
        default: undefined
      },
      step: {
        type: [String, Number],
        default: undefined
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue', 'change', 'focus', 'blur']
  });
  </script>
  
  <style scoped>
  .base-input {
    margin-bottom: 1rem;
  }
  
  .base-input__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--light-color);
    font-size: 0.9rem;
  }
  
  .base-input__required {
    color: var(--error-color);
    margin-left: 4px;
  }
  
  .base-input__wrapper {
    position: relative;
    display: flex;
  }
  
  .base-input__input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 1rem;
    border: 2px solid rgba(233, 196, 106, 0.3);
    border-radius: 4px;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--dark-text);
  }
  
  .base-input__input:focus {
    outline: none;
    border-color: var(--alternate-accent);
    box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.25);
  }
  
  .base-input__input:disabled {
    background-color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    border-color: rgba(233, 196, 106, 0.2);
    color: rgba(51, 51, 51, 0.7);
  }
  
  .base-input--error .base-input__input {
    border-color: var(--error-color);
  }
  
  .base-input--error .base-input__input:focus {
    box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.25);
  }
  
  .base-input__error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
  }
  
  .base-input__hint {
    color: rgba(233, 196, 106, 0.8);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .base-input__append {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: #666;
  }
  
  /* Specific input type styles */
  .base-input__input[type="date"],
  .base-input__input[type="datetime-local"],
  .base-input__input[type="month"],
  .base-input__input[type="week"],
  .base-input__input[type="time"] {
    min-height: 38px;
  }
  
  .base-input__input[type="color"] {
    min-height: 40px;
    padding: 2px;
  }
  
  /* Dark theme adjustments */
  @media (prefers-color-scheme: dark) {
    .base-input__input {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--light-color);
    }
    
    .base-input__input::placeholder {
      color: rgba(233, 196, 106, 0.5);
    }
    
    .base-input__input:disabled {
      background-color: rgba(255, 255, 255, 0.05);
      color: rgba(233, 196, 106, 0.5);
    }
  }
  </style>