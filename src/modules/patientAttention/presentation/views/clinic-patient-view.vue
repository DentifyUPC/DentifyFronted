<template>
  <div class="min-h-screen bg-gray-50 py-10 px-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-teal-700 mb-8 text-center">
        Pacientes Registrados en la Clínica
      </h1>

      <!-- Estado: Cargando -->
      <div v-if="isLoading" class="text-center text-gray-500 animate-pulse">
        Cargando pacientes...
      </div>

      <!-- Estado: Sin resultados -->
      <div v-else-if="patients.length === 0" class="text-center text-gray-600">
        <p class="text-lg">No hay pacientes registrados en esta clínica.</p>
      </div>

      <!-- Lista -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="p in patients"
            :key="p.id"
            class="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100 flex flex-col justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="bg-teal-100 text-teal-700 p-4 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-2xl"></i>
            </div>

            <div>
              <p class="text-lg font-semibold text-gray-800">
                {{ p.firstName }} {{ p.lastName }}
              </p>
              <p class="text-sm text-gray-600">
                {{ p.email || "Sin correo" }}
              </p>
              <p class="text-sm mt-1 text-gray-500">
                {{ p.gender || "Sin género" }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
                @click="openDetails(p)"
                class="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Detalles -->
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
</style>
