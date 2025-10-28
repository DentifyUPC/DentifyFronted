<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl animate-fadeIn">
      <h1 class="text-3xl font-semibold text-teal-700 text-center mb-8">
        Perfil del {{ getUserRole(user?.roleId, user?.role?.name) }}
      </h1>

      <div v-if="isLoading" class="text-gray-500 text-center">
        Cargando perfil...
      </div>

      <div v-else-if="user" class="space-y-6">
        <div class="flex items-center gap-5">
          <i class="pi pi-user text-6xl text-teal-600"></i>
          <div>
            <p class="text-xl font-bold text-gray-800">{{ user.fullName }}</p>
            <p class="text-gray-600">{{ user.username }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mt-4">
          <p>
            <strong>Rol:</strong>
            <span>{{ getUserRole(user.roleId) }}</span>
          </p>
          <p><strong>Clínica:</strong> {{ clinicName || "No asignada" }}</p>
        </div>

        <div class="flex justify-center gap-4 mt-6">
          <button
              @click="openUpdatePassword"
              class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <i class="pi pi-lock"></i>
            Cambiar Contraseña
          </button>

          <button
              @click="openUpdateInfo"
              class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <i class="pi pi-user-edit"></i>
            Actualizar Información
          </button>
        </div>
      </div>

      <div v-else class="text-red-500 text-center">
        No se pudo cargar el perfil. Intenta nuevamente.
      </div>

      <!-- Modales -->
      <update-user-info-modal
          v-if="showUpdateInfo"
          @close="showUpdateInfo = false"
          @updated="handleInfoUpdated"
      />

      <update-password-modal
          v-if="showUpdatePassword"
          @close="showUpdatePassword = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";
import UpdateUserInfoModal from "../components/update-user-info-modal.vue";
import UpdatePasswordModal from "../components/update-password-modal.vue";

const user = ref(null);
const clinicName = ref("");
const isLoading = ref(true);
const showUpdateInfo = ref(false);
const showUpdatePassword = ref(false);

const openUpdateInfo = () => (showUpdateInfo.value = true);
const openUpdatePassword = () => (showUpdatePassword.value = true);

const handleInfoUpdated = async (updatedUser) => {
  try {

    const refreshedProfile = await authRepositoryImpl.getProfile();

    user.value = refreshedProfile;
    localStorage.setItem("user", JSON.stringify(refreshedProfile));


    showUpdateInfo.value = false;
  } catch (error) {
    console.error("Error actualizando datos en vista:", error);
  }
};


const getUserRole = (roleId, roleName) => {
  if (roleId) {
    switch (roleId) {
      case 1:
        return "Administrador";
      case 2:
        return "Odontólogo";
      case 3:
        return "Paciente";
      default:
        return "Desconocido";
    }
  }


  return "Desconocido";
};

onMounted(async () => {
  try {
    const profile = await authRepositoryImpl.getProfile();
    console.log("Perfil cargado:", profile);

    user.value = profile;
    localStorage.setItem("user", JSON.stringify(profile));

    const clinics = await clinicRepositoryImpl.getClinicsForRegister();
    const clinic = clinics.find((c) => c.id === user.value.clinicId);
    clinicName.value = clinic ? clinic.name : "Desconocida";
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.fixed {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  animation: fadeOverlay 0.25s ease-out;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: fadeInUp 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111827;
}

@keyframes fadeOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
