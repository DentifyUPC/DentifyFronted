<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div v-if="isLoading" class="text-center text-gray-500">Cargando...</div>

    <div v-else>
      <!-- Perfil mostrado -->
      <div v-if="patient" class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 class="text-2xl font-bold text-teal-700 mb-4">Perfil del Paciente</h1>

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
              class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Actualizar información
          </button>
          <button
              @click="openUpdatePassword"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      <!-- Mensaje cuando no hay datos -->
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

      <!-- ✅ Modal con Teleport -->
      <Teleport to="body">
        <updatePatientProfileComponent
            v-if="showUpdateForm"
            :user-profile="userProfile"
            :patient="patient"
            @close="showUpdateForm = false"
            @updated="handleProfileUpdated"
        />

        <!-- ✅ Modal de cambiar contraseña -->
        <update-password-modal
            v-if="showUpdatePassword"
            @close="showUpdatePassword = false"
        />
      </Teleport>
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
    console.error("❌ Error al cargar perfil:", error);
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

// ✅ Nueva función: abrir modal de cambio de contraseña
const openUpdatePassword = () => {
  showUpdatePassword.value = true;
};
</script>

<style scoped>

body {
  overflow-x: hidden;
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

