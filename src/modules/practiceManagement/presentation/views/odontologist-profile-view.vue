<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-teal-700 mb-4">Perfil del Odontólogo</h1>

    <div v-if="isLoading">Cargando...</div>

    <div v-else-if="odontologist">
      <p><strong>DNI / Carnet de Extranjería:</strong> {{ username || '—' }}</p>
      <p><strong>Nombre:</strong> {{ odontologist.fullName || '—' }}</p>
      <p><strong>Email:</strong> {{ odontologist.email || '—' }}</p>
      <p><strong>Especialidad:</strong> {{ odontologist.specialty || '—' }}</p>
      <p><strong>Colegiatura:</strong> {{ odontologist.professionalLicenseNumber || '—' }}</p>
      <p><strong>Teléfono:</strong> {{ odontologist.phoneNumber || '—' }}</p>
      <p><strong>Rol:</strong> {{ roleLabel }}</p>
      <p><strong>Clínica:</strong> {{ clinicName || odontologist.clinicId || '—' }}</p>
    </div>

    <div v-else class="text-red-500">No se pudo cargar el perfil.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { odontologistRepositoryImpl } from "../../data/repositories/odontologistRepositoryImpl.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";

const odontologist = ref(null);
const clinicName = ref('');
const isLoading = ref(true);
const username = ref('');
const roleId = ref(null);


const roleLabel = computed(() => {
  switch (roleId.value) {
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


  username.value = user.username;
  roleId.value = user.roleId;

  try {

    const od = await odontologistRepositoryImpl.getProfile(user.id);
    console.log("✅ Perfil del odontólogo:", od);
    odontologist.value = od;


    try {
      const clinics = await clinicRepositoryImpl.getClinicsForRegister();
      const match = clinics.find(c => Number(c.id) === Number(od.clinicId));
      clinicName.value = match ? match.name : '';
    } catch (err) {
      console.warn("No se pudo obtener lista de clínicas:", err);
      clinicName.value = '';
    }

  } catch (error) {
    console.error("❌ Error cargando odontólogo:", error);
    odontologist.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>
