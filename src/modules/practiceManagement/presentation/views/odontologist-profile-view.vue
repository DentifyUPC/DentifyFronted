<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div
        class="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-4xl animate-fadeIn z-10"
    >
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-semibold text-[#4a89c5] mb-1">
          Perfil del Odontólogo
        </h1>
        <p class="text-gray-500 text-sm md:text-base">
          Consulta y actualiza tu información profesional
        </p>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500 py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-[#4a89c5]"></i>
        <p class="mt-2">Cargando...</p>
      </div>

      <div v-else>
        <div v-if="odontologist" class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
          <div
              class="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#e4f0fb] to-[#f1f7fd] rounded-2xl p-6 shadow-inner mb-4"
          >
            <div
                class="flex items-center justify-center bg-white shadow-md rounded-full w-24 h-24 sm:w-28 sm:h-28 border border-[#c8e0f7]"
            >
              <i class="pi pi-user text-5xl sm:text-6xl text-[#4a89c5]"></i>
            </div>

            <div class="text-center sm:text-left">
              <p class="text-2xl font-bold text-gray-800">
                {{ odontologist.fullName }}
              </p>
              <p class="text-gray-500 text-sm">{{ odontologist.email }}</p>
              <p class="text-gray-500 text-sm">
                <strong>Teléfono:</strong> {{ odontologist.phoneNumber || "—" }}
              </p>
              <p class="text-gray-500 text-sm">
                <strong>Edad:</strong> {{ odontologist.age || "—" }}
              </p>
            </div>
          </div>

          <h2 class="text-xl font-semibold text-[#4a89c5] mb-4">
            Información Profesional
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-gray-700">
            <p><strong>Especialidad:</strong> {{ odontologist.specialty || "—" }}</p>
            <p><strong>Colegiatura:</strong> {{ odontologist.professionalLicenseNumber || "—" }}</p>
            <p><strong>Registro de Especialidad:</strong> {{ odontologist.specialtyRegistrationNumber || "—" }}</p>
            <p><strong>Turno:</strong> {{ odontologist.shiftName || "—" }}</p>
            <p><strong>Clínica:</strong> {{ clinicName || "—" }}</p>
          </div>

          <h2 class="text-xl font-semibold text-[#4a89c5] mt-6 mb-4">
            Dirección
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
            <p><strong>Departamento:</strong> {{ odontologist.department || "—" }}</p>
            <p><strong>Distrito:</strong> {{ odontologist.district || "—" }}</p>
            <p><strong>Dirección:</strong> {{ odontologist.street || "—" }}</p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
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
          <h2 class="text-xl font-semibold text-[#4a89c5] mb-4">
            Aún no has completado tu información
          </h2>
          <p class="text-gray-600 mb-6">
            Por favor completa tus datos profesionales.
          </p>
          <button
              @click="openUpdatePassword"
              class="bg-[#4a89c5] text-white px-6 py-2 rounded-lg hover:bg-[#3a75ab] transition"
          >
            Actualizar contraseña
          </button>
        </div>

        <Teleport to="body">
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
import { odontologistRepositoryImpl } from "../../data/repositories/odontologistRepositoryImpl.js";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";
import UpdatePasswordModal from "@/modules/iam/presentation/components/update-password-modal.vue";

const odontologist = ref(null);
const userProfile = ref(null);
const clinicName = ref("");
const isLoading = ref(true);
const showUpdatePassword = ref(false);

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    isLoading.value = false;
    return;
  }

  try {
    odontologist.value = await odontologistRepositoryImpl.getProfile(user.id);
    userProfile.value = await authRepositoryImpl.getProfile(user.id);

    const clinics = await clinicRepositoryImpl.getClinicsForRegister();
    const clinic = clinics.find((c) => c.id === odontologist.value.clinicId);
    clinicName.value = clinic ? clinic.name : "Desconocida";
  } catch (err) {
    const status = err.response?.status;
    if (status === 403 || status === 404) odontologist.value = null;
  } finally {
    isLoading.value = false;
  }
});

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
</style>
