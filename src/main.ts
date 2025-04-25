import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

// PrimeVue styles
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Custom Icons
import '@fortawesome/fontawesome-free/css/all.css' // <- this loads FA icons

// Custom styles
import './assets/main.css'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Panel from 'primevue/panel'
import Toast from 'primevue/toast'
import Calendar from 'primevue/calendar'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

// Register PrimeVue components globally
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Panel', Panel)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Calendar', Calendar)

app.mount('#app')
