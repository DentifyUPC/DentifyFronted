<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-[#aacff3] mb-8 text-center">
        Pacientes Registrados en la Clínica
      </h1>

      <div v-if="isLoading" class="text-center text-gray-400 animate-pulse">
        Cargando pacientes...
      </div>

      <div v-else-if="patients.length === 0" class="text-center text-gray-500">
        <p class="text-lg">No hay pacientes registrados en esta clínica.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
            v-for="p in patients"
            :key="p.id"
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-gray-100 flex flex-col justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="bg-[#aacff3]/20 text-black p-3 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-user"></i>
            </div>

            <div>
              <p class="text-md font-semibold text-gray-800">
                {{ p.firstName }} {{ p.lastName }}
              </p>
              <p class="text-sm text-gray-500">
                {{ p.email || "Sin correo" }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ p.gender || "Sin género" }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-3">
            <button
                @click="openDetails(p)"
                class="bg-[#aacff3] text-black px-3 py-1.5 rounded-md text-sm hover:bg-[#8fc5f0] transition-shadow shadow-sm"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      <Teleport to="#app">
        <PatientDetailsModal
            v-if="selectedPatient && userProfile"
            :patient="selectedPatient"
            :userProfile="userProfile"
            @close="selectedPatient = null"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { patientRepositoryImpl } from "@/modules/patientAttention/data/repositories/patientRepositoryImpl.js";
import PatientDetailsModal from "@/modules/patientAttention/presentation/components/patient-datails-modal.vue";

const patients = ref([]);
const isLoading = ref(true);
const selectedPatient = ref(null);
const userProfile = ref(null);

const openDetails = (p) => {
  selectedPatient.value = p;
};

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  userProfile.value = user;

  if (!user || !user.clinicId) {
    isLoading.value = false;
    return;
  }

  try {
    patients.value = await patientRepositoryImpl.getAllByClinic(user.clinicId);
  } catch (e) {
    console.error("❌ Error al cargar pacientes:", e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

button {
  font-weight: 500;
}
</style>
