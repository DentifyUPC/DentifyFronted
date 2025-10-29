<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div
        class="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-4xl animate-fadeIn z-10"
    >

      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-semibold text-[#4a89c5] mb-2">
          Perfil del {{ getUserRole(user?.roleId, user?.role?.name) }}
        </h1>
        <p class="text-gray-500 text-sm md:text-base">
          Administra tu información personal y de la clínica
        </p>
      </div>


      <div v-if="isLoading" class="text-gray-500 text-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-[#4a89c5]"></i>
        <p class="mt-2">Cargando perfil...</p>
      </div>


      <div v-else-if="user" class="space-y-8">

        <div
            class="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#e4f0fb] to-[#f1f7fd] rounded-2xl p-6 shadow-inner"
        >
          <div
              class="flex items-center justify-center bg-white shadow-md rounded-full w-24 h-24 sm:w-28 sm:h-28 border border-[#c8e0f7]"
          >
            <i class="pi pi-user text-5xl sm:text-6xl text-[#4a89c5]"></i>
          </div>

          <div class="text-center sm:text-left">
            <p class="text-2xl font-bold text-gray-800">
              {{ user.fullName }}
            </p>
            <p class="text-gray-500 text-sm">{{ user.username }}</p>

            <div
                class="mt-2 flex justify-center sm:justify-start gap-3 flex-wrap"
            >
              <span
                  class="bg-[#d9ebfb] text-[#356ca8] text-sm font-medium px-3 py-1 rounded-full"
              >
                {{ getUserRole(user.roleId) }}
              </span>
              <span
                  class="bg-[#e8f3fe] text-[#3c7ac2] text-sm font-medium px-3 py-1 rounded-full"
              >
                {{ clinicName || "Sin clínica" }}
              </span>
            </div>
          </div>
        </div>


        <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 bg-white rounded-xl p-6 shadow-sm"
        >
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Nombre completo</p>
            <p class="font-semibold">{{ user.fullName }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Usuario</p>
            <p class="font-semibold">{{ user.username }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Rol</p>
            <p class="font-semibold">{{ getUserRole(user.roleId) }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Clínica</p>
            <p class="font-semibold">{{ clinicName || "No asignada" }}</p>
          </div>
        </div>


        <div
            class="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4 relative z-20"
        >
          <button
              @click="openUpdatePassword"
              class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#aacff3] to-[#9ac8f0] text-white px-6 py-3 rounded-lg hover:from-[#8ebfea] hover:to-[#75b0e6] active:scale-95 transition-all shadow-md w-full sm:w-auto focus:ring-2 focus:ring-[#9ac8f0] focus:outline-none"
          >
            <i class="pi pi-lock"></i>
            Cambiar Contraseña
          </button>

          <button
              @click="openUpdateInfo"
              class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#9ac8f0] to-[#83baf0] text-white px-6 py-3 rounded-lg hover:from-[#7ab0e9] hover:to-[#68a3e3] active:scale-95 transition-all shadow-md w-full sm:w-auto focus:ring-2 focus:ring-[#83baf0] focus:outline-none"
          >
            <i class="pi pi-user-edit"></i>
            Actualizar Información
          </button>
        </div>
      </div>


      <div v-else class="text-red-500 text-center py-6">
        No se pudo cargar el perfil. Intenta nuevamente.
      </div>


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

const handleInfoUpdated = async () => {
  try {
    const refreshedProfile = await authRepositoryImpl.getProfile();
    user.value = refreshedProfile;
    localStorage.setItem("user", JSON.stringify(refreshedProfile));
    showUpdateInfo.value = false;
  } catch (error) {
    console.error("Error actualizando datos:", error);
  }
};

const getUserRole = (roleId) => {
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
};

onMounted(async () => {
  try {
    const profile = await authRepositoryImpl.getProfile();
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
  animation: fadeIn 0.4s ease-out;
}
</style>
