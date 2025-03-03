// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

// PrimeVue styles
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

// Create app instance
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

// Mount the app
app.mount('#app');
