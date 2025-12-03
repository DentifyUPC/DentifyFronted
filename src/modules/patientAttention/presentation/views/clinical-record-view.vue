<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <i class="pi pi-arrow-left"></i>
          <span>Volver al Panel de Control</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando registro clínico...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else class="bg-white rounded-xl shadow-md p-8">
        <div class="mb-6">
          <i class="pi pi-book text-[#2B6D8C] text-5xl mb-4 block"></i>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Registro Clínico</h1>
          <p class="text-gray-600 text-lg">{{ patientName }}</p>
        </div>

        <!-- Clinical Entries List -->
        <div v-if="clinicalEntries.length > 0" class="mt-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Historial Clínico</h2>
          <div class="space-y-4">
            <div
              v-for="entry in clinicalEntries"
              :key="entry.id"
              class="border-l-4 border-teal-500 bg-teal-50 p-4 rounded-lg hover:shadow-md transition"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-grow">

                  <h3 class="text-lg font-semibold text-teal-700 mb-2">Evolución</h3>
                  <p class="text-gray-800 text-sm mb-4">{{ entry.evolution || 'Sin descripción' }}</p>
                  
                  <h3 class="text-lg font-semibold text-teal-700 mb-2">Observación</h3>
                  <p class="text-gray-800 text-sm">{{ entry.observation || 'Sin observación' }}</p>
                </div>
                <button
                  @click="openEditModal(entry)"
                  class="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2 transition flex-shrink-0"
                >
                  <i class="pi pi-pencil text-xs"></i>
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="mt-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <i class="pi pi-inbox text-4xl text-gray-400 mb-3 block"></i>
          <p class="text-gray-600 font-medium mb-4">No hay entradas de registro clínico</p>
          <p class="text-gray-500 text-sm">Haz clic en "Agregar Entrada" para crear la primera entrada</p>
        </div>
      </div>
    </div>

    <!-- Update Clinical Record Modal -->
    <UpdateClinicalRecordComponent
      v-if="showUpdateModal && selectedEntry"
      :entry="selectedEntry"
      :clinicalRecordId="clinicalRecord?.id"
      @close="closeUpdateModal"
      @updated="handleEntryUpdated"
    />


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientRepositoryImpl } from '../../data/repositories/patientRepositoryImpl.js';
import { clinicalRecordApi } from '../../data/datasource/clinicalRecordApi.js';
import { clinicalRecordEntryRepositoryImpl } from '../../data/repositories/clinicalRecordEntryRepositoryImpl.js';
import UpdateClinicalRecordComponent from '../components/update-clinical-record-component.vue';

const route = useRoute();
const router = useRouter();
const patientName = ref('');
const clinicalRecord = ref(null);
const clinicalEntries = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showUpdateModal = ref(false);
const selectedEntry = ref(null);

onMounted(async () => {
  try {
    const patientId = parseInt(route.params.patientId);
    if (!patientId || isNaN(patientId)) {
      error.value = 'ID de paciente inválido';
      return;
    }

    const patient = await patientRepositoryImpl.getByPatientId(patientId);
    patientName.value = patient.fullName || 'Paciente';

    const response = await clinicalRecordApi.getByPatientId(patientId);
    clinicalRecord.value = response.data || response;
    
    console.log('📋 Clinical Record View - Patient ID:', patientId);
    console.log('📋 Clinical Record:', clinicalRecord.value);

    if (clinicalRecord.value?.id) {
      const entries = await clinicalRecordEntryRepositoryImpl.getAllByClinicalRecordId(clinicalRecord.value.id);
      clinicalEntries.value = entries;
      console.log('📋 Clinical Entries:', entries);
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar el registro clínico';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const openEditModal = (entry) => {
  selectedEntry.value = entry;
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  selectedEntry.value = null;
};

const handleEntryUpdated = async () => {
  try {
    const entries = await clinicalRecordEntryRepositoryImpl.getAllByClinicalRecordId(clinicalRecord.value.id);
    clinicalEntries.value = entries;
    closeUpdateModal();
  } catch (err) {
    error.value = 'Error al actualizar el registro clínico';
    console.error('Error:', err);
  }
};

const goBack = () => {
  router.push({ 
    name: 'patient-control-panel', 
    params: { patientId: route.params.patientId } 
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
