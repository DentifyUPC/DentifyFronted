import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/modules/iam/presentation/views/login-view.vue'
import RegisterPatientView from '@/modules/iam/presentation/views/register-patient-view.vue'
import AdminProfileView from '@/modules/iam/presentation/views/profile-view.vue'
import OdontologistProfileView from '@/modules/practiceManagement/presentation/views/odontologist-profile-view.vue'
import PatientProfileView from '@/modules/patientAttention/presentation/views/patient-profile-view.vue'
import UpdatePasswordView from '@/modules/iam/presentation/views/update-password-view.vue'
import ToolbarLayout from '@/public/layout/main-layout.component.vue'
import AdminInventoryView from '@/modules/services/presentation/views/inventory-view.vue'
import AdminServicesView from '@/modules/services/presentation/views/service-view.vue'
import NotFound from "@/public/not-found.component.vue";
import ClinicOdontologistsView from "@/modules/practiceManagement/presentation/views/clinic-odontologists-view.vue";
import { useAuthStore } from '@/modules/iam/stores/authStore.js'
import ClinicPatientView from "@/modules/patientAttention/presentation/views/clinic-patient-view.vue";


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


            { path: 'update-password', name: 'update-password', component: UpdatePasswordView },
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
