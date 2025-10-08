import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import PrimeVue from 'primevue/config'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Image from 'primevue/image'
import Toolbar from 'primevue/toolbar'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import ToggleButton from 'primevue/togglebutton'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import MeterGroup from 'primevue/metergroup'
import ProgressSpinner from 'primevue/progressspinner'
import Chart from 'primevue/chart'
import Carousel from 'primevue/carousel'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'




const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true })

app
    .component('PvButton', Button)
    .component('PvCard', Card)
    .component('PvInputText', InputText)
    .component('PvPassword', Password)
    .component('PvImage', Image)
    .component('PvToolbar', Toolbar)
    .component('PvCalendar', Calendar)
    .component('PvDialog', Dialog)
    .component('PvToggleButton', ToggleButton)
    .component('PvIconField', IconField)
    .component('PvInputIcon', InputIcon)
    .component('PvMeterGroup', MeterGroup)
    .component('PvProgressSpinner', ProgressSpinner)
    .component('PvCarousel', Carousel)
    .component('PvRadioButton', RadioButton)
    .component('PvDropdown', Dropdown)
    .component('PvChart', Chart)


app.mount('#app')
