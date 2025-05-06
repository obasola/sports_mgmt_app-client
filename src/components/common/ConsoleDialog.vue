<!-- ConsoleDialog.vue -->
<template>
  <Transition name="fade">
    <div v-if="isVisible" class="console-overlay" @click.self="close">
      <div class="console-dialog">
        <div class="console-header">
          <h3>Console Output</h3>
          <div class="console-controls">
            <button @click="clear" class="btn-clear">Clear</button>
            <button @click="close" class="btn-close">×</button>
          </div>
        </div>
        <div class="console-content" ref="consoleContent">
          <pre><code v-html="formattedOutput"></code></pre>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';

interface ConsoleDialogProps {
  modelValue: boolean;
  output: string[];
}

const props = defineProps<ConsoleDialogProps>();
const emit = defineEmits(['update:modelValue', 'clear']);

const consoleContent = ref<HTMLElement | null>(null);

const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  }
});

const formattedOutput = computed(() => {
  return props.output.map(line => {
    // Color code different types of logs
    if (line.startsWith('Error:')) {
      return `<span class="error-log">${line}</span>`;
    } else if (line.startsWith('Warning:')) {
      return `<span class="warning-log">${line}</span>`;
    } else if (line.startsWith('Info:')) {
      return `<span class="info-log">${line}</span>`;
    }
    return line;
  }).join('\n');
});

const close = () => {
  isVisible.value = false;
};

const clear = () => {
  emit('clear');
};

// Auto-scroll to bottom when new content is added
watch(() => props.output, () => {
  nextTick(() => {
    if (consoleContent.value) {
      consoleContent.value.scrollTop = consoleContent.value.scrollHeight;
    }
  });
});
</script>

<style scoped>
.console-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.console-dialog {
  background-color: #1e1e1e;
  border-radius: 8px;
  width: 80%;
  max-width: 900px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #333;
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.console-header h3 {
  margin: 0;
  font-size: 16px;
}

.console-controls {
  display: flex;
  gap: 10px;
}

.btn-clear {
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-clear:hover {
  background-color: #595959;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.console-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  color: #f8f8f2;
  background-color: #282a36;
}

.console-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.console-content code {
  color: #f8f8f2;
}

/* Syntax highlighting */
.error-log {
  color: #ff5555;
  font-weight: bold;
}

.warning-log {
  color: #f1fa8c;
}

.info-log {
  color: #8be9fd;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
