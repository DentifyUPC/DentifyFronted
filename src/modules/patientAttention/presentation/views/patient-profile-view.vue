<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-teal-700 mb-4">Perfil del Paciente</h1>

    <div v-if="isLoading">Cargando...</div>

    <div v-else-if="patient">
      <p><strong>DNI / Carnet de Extranjería:</strong> {{ profile.username || '—' }}</p>
      <p><strong>Nombre:</strong> {{ patient.firstName }} {{ patient.lastName }}</p>
      <p><strong>Email:</strong> {{ patient.email || '—' }}</p>
      <p><strong>Teléfono:</strong> {{ patient.phoneNumber || '—' }}</p>
      <p><strong>Fecha de nacimiento:</strong> {{ patient.birthDate || '—' }}</p>
      <p><strong>Edad:</strong> {{ patient.age || '—' }}</p>
      <p><strong>Rol:</strong> {{ roleLabel }}</p>
      <p><strong>Clínica:</strong> {{ clinicName || '—' }}</p>
    </div>

    <div v-else class="text-red-500">
      No se pudo cargar el perfil del paciente.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { patientRepositoryImpl } from "../../data/repositories/patientRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";

const patient = ref(null);
const profile = ref(null);
const clinicName = ref("");
const isLoading = ref(true);

const roleLabel = computed(() => {
  switch (profile.value?.roleId) {
    case 1: return "Administrador";
    case 2: return "Odontólogo";
    case 3: return "Paciente";
    default: return "Desconocido";
  }
});

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    isLoading.value = false;
    return;
  }

  try {

    profile.value = await authRepositoryImpl.getProfile(user.id);
    console.log("✅ Perfil (general):", profile.value);

    patient.value = await patientRepositoryImpl.getProfile(user.id);
    console.log("✅ Datos del paciente:", patient.value);

    if (profile.value.clinicId) {
      try {
        const clinics = await clinicRepositoryImpl.getClinicsForRegister();
        const match = clinics.find(c => Number(c.id) === Number(profile.value.clinicId));
        clinicName.value = match ? match.name : '';
      } catch (err) {
        console.warn("⚠️ No se pudo obtener la lista de clínicas:", err);
      }
    }

  } catch (error) {
    console.error("❌ Error cargando datos del paciente:", error);
    patient.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>
