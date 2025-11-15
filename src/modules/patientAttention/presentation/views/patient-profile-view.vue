<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div
        class="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-4xl animate-fadeIn z-10"
    >
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-semibold text-[#4a89c5] mb-1">
          Perfil del Paciente
        </h1>
        <p class="text-gray-500 text-sm md:text-base">
          Consulta y actualiza tu información personal
        </p>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500 py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-[#4a89c5]"></i>
        <p class="mt-2">Cargando...</p>
      </div>

      <div v-else>

        <div v-if="patient" class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
          <div class="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#e4f0fb] to-[#f1f7fd] rounded-2xl p-6 shadow-inner mb-4">
            <div class="flex items-center justify-center bg-white shadow-md rounded-full w-24 h-24 sm:w-28 sm:h-28 border border-[#c8e0f7]">
              <i class="pi pi-user text-5xl sm:text-6xl text-[#4a89c5]"></i>
            </div>

            <div class="text-center sm:text-left">
              <p class="text-2xl font-bold text-gray-800">
                {{ patient.firstName }} {{ patient.lastName }}
              </p>
              <p class="text-gray-500 text-sm">{{ patient.email }}</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold text-teal-700 mb-4">Información</h2>

          <div class="space-y-2 text-gray-700">
            <p><strong>Nombre:</strong> {{ patient.firstName }}</p>
            <p><strong>Apellido:</strong> {{ patient.lastName }}</p>
            <p><strong>Correo:</strong> {{ patient.email }}</p>
            <p><strong>Género:</strong> {{ patient.gender || "—" }}</p>
            <p><strong>Teléfono:</strong> {{ patient.phoneNumber || "—" }}</p>
            <p>
              <strong>Dirección:</strong>
              {{ patient.street || "—" }}, {{ patient.district || "" }}, {{ patient.province || "" }}, {{ patient.department || "" }}
            </p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
                @click="openUpdateForm"
                class="flex items-center gap-2 bg-gradient-to-r from-[#c9e0f9] to-[#a9d0f4] text-black px-4 py-2 rounded-lg hover:from-[#b6d5f5] hover:to-[#91c3f0] transition"
            >
              <i class="pi pi-user-edit"></i>
              Actualizar información
            </button>
            <button
                @click="openUpdatePassword"
                class="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <i class="pi pi-lock"></i>
              Cambiar contraseña
            </button>
          </div>
        </div>

        <div
            v-else
            class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow text-center mt-8"
        >
          <h2 class="text-xl font-semibold text-teal-700 mb-4">
            Aún no has completado tu información
          </h2>
          <p class="text-gray-600 mb-6">
            Por favor completa tus datos personales.
          </p>
          <button
              @click="openUpdateForm"
              class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Completar información
          </button>
        </div>


        <Teleport to="body">
          <updatePatientProfileComponent
              v-if="showUpdateForm"
              :user-profile="userProfile"
              :patient="patient"
              @close="showUpdateForm = false"
              @updated="handleProfileUpdated"
          />

          <update-password-modal
              v-if="showUpdatePassword"
              @close="showUpdatePassword = false"
          />
        </Teleport>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { patientRepositoryImpl } from "../../data/repositories/patientRepositoryImpl.js";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";
import updatePatientProfileComponent from "@/modules/patientAttention/presentation/components/update-patient-profile-component.vue";
import UpdatePasswordModal from "@/modules/iam/presentation/components/update-password-modal.vue";

const patient = ref(null);
const userProfile = ref(null);
const isLoading = ref(true);
const showUpdateForm = ref(false);
const showUpdatePassword = ref(false);

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    isLoading.value = false;
    return;
  }

  try {
    patient.value = await patientRepositoryImpl.getProfile(user.id);
  } catch (err) {
    const status = err.response?.status;
    if (status === 403 || status === 404) {
      patient.value = null;
    } else {
      throw err;
    }
  }

  try {
    userProfile.value = await authRepositoryImpl.getProfile(user.id);
  } catch (error) {
    console.error("Error al cargar perfil:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleProfileUpdated = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return;
  patient.value = await patientRepositoryImpl.getProfile(user.id);
  showUpdateForm.value = false;
};

const openUpdateForm = () => {
  showUpdateForm.value = true;
};

const openUpdatePassword = () => {
  showUpdatePassword.value = true;
};
</script>

<style scoped>
body {
  overflow-x: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}
</style>
