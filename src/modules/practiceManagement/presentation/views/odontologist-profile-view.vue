<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div v-if="isLoading" class="text-center text-gray-500 animate-pulse">
      Cargando información del perfil...
    </div>

    <div v-else>

      <div
          v-if="odontologist"
          class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold text-teal-700">
            Perfil del Odontólogo
          </h1>
          <button
              @click="onChangePassword"
              class="bg-teal-600 text-white px-5 py-2 rounded-xl hover:bg-teal-700 transition font-medium"
          >
            Actualizar contraseña
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p><strong>Nombre:</strong> {{ odontologist.fullName }}</p>
            <p><strong>Correo:</strong> {{ odontologist.email }}</p>
            <p><strong>Teléfono:</strong> {{ odontologist.phoneNumber || "—" }}</p>
            <p><strong>Edad:</strong> {{ odontologist.age || "—" }}</p>
          </div>

          <div>
            <p><strong>Especialidad:</strong> {{ odontologist.specialty || "—" }}</p>
            <p><strong>Colegiatura:</strong> {{ odontologist.professionalLicenseNumber || "—" }}</p>
            <p><strong>Registro de Especialidad:</strong> {{ odontologist.specialtyRegistrationNumber || "—" }}</p>
            <p><strong>Clínica:</strong> {{ clinicName || "—" }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-6 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><strong>Departamento:</strong> {{ odontologist.department || "—" }}</p>
          <p><strong>Distrito:</strong> {{ odontologist.district || "—" }}</p>
          <p><strong>Dirección:</strong> {{ odontologist.street || "—" }}</p>
        </div>
      </div>


      <div
          v-else
          class="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow text-center border border-gray-100"
      >
        <h2 class="text-2xl font-semibold text-teal-700 mb-3">
          Aún no has completado tu información
        </h2>
        <p class="text-gray-600 mb-6">
          Cuando tu perfil esté completo, podrás ver aquí tus datos personales.
        </p>
        <button
            @click="onChangePassword"
            class="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 transition font-medium"
        >
          Actualizar contraseña
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { odontologistRepositoryImpl } from "../../data/repositories/odontologistRepositoryImpl.js";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";

const odontologist = ref(null);
const userProfile = ref(null);
const clinicName = ref("");
const isLoading = ref(true);

onMounted(async () => {
  console.log("Cargando perfil del odontólogo...");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    console.warn("⚠ No hay usuario logueado en localStorage");
    isLoading.value = false;
    return;
  }

  try {
    odontologist.value = await odontologistRepositoryImpl.getProfile(user.id);
    console.log(" Odontólogo cargado:", odontologist.value);

    userProfile.value = await authRepositoryImpl.getProfile(user.id);
    console.log(" Perfil IAM cargado:", userProfile.value);

    const clinics = await clinicRepositoryImpl.getClinicsForRegister();
    const clinic = clinics.find(c => c.id === odontologist.value.clinicId);
    clinicName.value = clinic ? clinic.name : "Desconocida";
  } catch (err) {
    const status = err.response?.status;
    console.error(" Error al cargar datos:", err);
    if (status === 403 || status === 404) odontologist.value = null;
  } finally {
    isLoading.value = false;
  }
});

const onChangePassword = () => {
  console.log(" Botón 'Actualizar contraseña' presionado — sin acción aún.");

};
</script>

<style scoped>
body {
  overflow-x: hidden;
}
</style>
