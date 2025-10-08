<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-teal-700 mb-4">Perfil del Usuario</h1>

    <div v-if="isLoading" class="text-gray-500">
      Cargando perfil...
    </div>

    <div v-else-if="user" class="bg-white p-4 rounded-lg shadow-md">
      <p><strong>Nombre:</strong> {{ user.fullName }}</p>
      <p><strong>DNI / Carnet de Extranjería:</strong> {{ user.username }}</p>
      <p>
        <strong>Rol:</strong>
        <span v-if="user.isAdmin()">Administrador</span>
        <span v-else-if="user.isOdontologist()">Odontólogo</span>
        <span v-else-if="user.isPatient()">Paciente</span>
        <span v-else>Desconocido</span>
      </p>

      <p>
        <strong>Clínica:</strong>
        <span v-if="clinicName">{{ clinicName }}</span>
        <span v-else class="text-gray-500">No asignada</span>
      </p>

      <div class="mt-6 flex gap-4">
        <pv-button
            @click="goToUpdateInfo"
            label="Actualizar Información"
            icon="pi pi-user-edit"
        />
        <pv-button
            @click="goToUpdatePassword"
            label="Cambiar Contraseña"
            icon="pi pi-lock"
        />
      </div>
    </div>

    <div v-else class="text-red-500">
      No se pudo cargar el perfil. Intenta nuevamente.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js"; // 👈 importa esto

const router = useRouter();
const user = ref(null);
const clinicName = ref("");
const isLoading = ref(true);

const goToUpdateInfo = () => router.push("/home/update-information");
const goToUpdatePassword = () => router.push("/home/update-password");

onMounted(async () => {
  try {
    console.log("🔍 Cargando perfil...");
    const profile = await authRepositoryImpl.getProfile();
    user.value = profile;
    localStorage.setItem("user", JSON.stringify(profile));


    const clinics = await clinicRepositoryImpl.getClinicsForRegister();
    const clinic = clinics.find(c => c.id === user.value.clinicId);
    clinicName.value = clinic ? clinic.name : "Desconocida";

    console.log("✅ Clínica asociada:", clinicName.value);
  } catch (error) {
    console.error("❌ Error al cargar el perfil:", error);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>
