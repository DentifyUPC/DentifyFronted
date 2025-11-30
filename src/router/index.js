import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/modules/iam/presentation/views/login-view.vue'
import RegisterPatientView from '@/modules/iam/presentation/views/register-patient-view.vue'
import AdminProfileView from '@/modules/iam/presentation/views/profile-view.vue'
import OdontologistProfileView from '@/modules/practiceManagement/presentation/views/odontologist-profile-view.vue'
import PatientProfileView from '@/modules/patientAttention/presentation/views/patient-profile-view.vue'
import ToolbarLayout from '@/public/layout/main-layout.component.vue'
import AdminInventoryView from '@/modules/services/presentation/views/inventory-view.vue'
import AdminServicesView from '@/modules/services/presentation/views/service-view.vue'
import NotFound from "@/public/not-found.component.vue";
import ClinicOdontologistsView from "@/modules/practiceManagement/presentation/views/clinic-odontologists-view.vue";
import { useAuthStore } from '@/modules/iam/stores/authStore.js'
import ClinicPatientView from "@/modules/patientAttention/presentation/views/clinic-patient-view.vue";
import ScheduleManagementView from "@/modules/clinicManagement/presentation/views/scheduleManagementView.vue";
import AppointmentOdontologistView from "@/modules/appointment/presentation/views/appointment-odontologist-view.vue";
import AppointmentPatientView from "@/modules/appointment/presentation/views/appointment-patient-view.vue";
import ToothStatusView from "@/modules/patientAttention/presentation/views/tooth-status-view.vue";
import PatientControlPanelView from "@/modules/patientAttention/presentation/views/patient-control-panel-view.vue";
import AnamnesisView from "@/modules/patientAttention/presentation/views/anamnesis-view.vue";
import PrescriptionView from "@/modules/patientAttention/presentation/views/prescription-view.vue";
import OdontogramaView from "@/modules/patientAttention/presentation/views/odontograma-view.vue";
import ClinicalRecordView from "@/modules/patientAttention/presentation/views/clinical-record-view.vue";
import OdontologistScheduleView from "@/modules/practiceManagement/presentation/views/odontologist-schedule-view.vue";


const routes = [
    { path: '/', redirect: '/login' },

    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterPatientView },

    {
        path: '/home',
        component: ToolbarLayout,
        meta: { requiresAuth: true },
        children: [

            { path: 'admin-profile', name: 'admin-profile', component: AdminProfileView },
            { path: 'odontologist-profile', name: 'odontologist-profile', component: OdontologistProfileView },
            { path: 'patient-profile', name: 'patient-profile', component: PatientProfileView },
            { path: 'admin-inventory', name: 'admin-inventory', component: AdminInventoryView },
            { path: 'admin-services', name: 'admin-services', component: AdminServicesView },
            {path: 'clinic-odontologist', name : 'clinic-odontologist', component: ClinicOdontologistsView  },
            {path: 'clinic-patients', name: 'clinic-patients', component: ClinicPatientView },
            {path: 'schedule-management', name: 'schedule-management', component: ScheduleManagementView },
            {path: 'appointment-odontologist', name: 'appointment-odontologist', component: AppointmentOdontologistView},
            {path: 'appointment-patients', name: 'appointment-patients', component: AppointmentPatientView },
            {path: 'tooth-status', name: 'tooth-status', component: ToothStatusView },
            {path: 'patient-control/:patientId', name: 'patient-control-panel', component: PatientControlPanelView },
            {path: 'patient-anamnesis/:patientId', name: 'patient-anamnesis', component: AnamnesisView},
            {path: 'patient-prescription/:patientId', name: 'patient-prescription', component: PrescriptionView},
            {path: 'patient-odontograma/:patientId', name: 'patient-odontograma', component: OdontogramaView},
            {path: 'patient-clinical-record/:patientId', name: 'patient-clinical-record', component: ClinicalRecordView},
            {path: 'odontologist-schedule', name: 'odontologist-schedule', component: OdontologistScheduleView},

        ],
    },


    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 🧩 Middleware de autenticación
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const user = JSON.parse(localStorage.getItem('user'))

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' })
    } else if (to.path === '/home/profile' && user) {

        switch (user.roleId) {
            case 1:
                next({ name: 'admin-profile' })
                break
            case 2:
                next({ name: 'odontologist-profile' })
                break
            case 3:
                next({ name: 'patient-profile' })
                break
            default:
                next()
        }
    } else {
        next()
    }
})

export default router
