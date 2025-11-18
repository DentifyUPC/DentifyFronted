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
        <span class="ml-3 text-gray-600">Cargando prescripciones...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else class="bg-white rounded-xl shadow-md p-8">
        <!-- Title -->
        <div class="mb-8">
          <i class="pi pi-file-edit text-green-600 text-5xl mb-4 block"></i>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Prescripciones del Paciente</h1>
          <p class="text-gray-600 text-lg">{{ patientName }}</p>
        </div>

        <!-- Prescriptions List -->
        <div v-if="prescriptions.length > 0" class="mt-8">
          <div class="space-y-4">
            <div
              v-for="prescription in prescriptions"
              :key="prescription.id"
              class="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-lg hover:shadow-md transition"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex-grow">
                  <p class="text-xs text-gray-500 mb-2">Prescripción ID: {{ prescription.id }}</p>
                  <h3 class="text-lg font-semibold text-blue-700 mb-2">💊 Prescripción</h3>
                  <p class="text-gray-800 text-sm">{{ prescription.effects || 'Sin efectos registrados' }}</p>
                </div>
                <button
                  @click="openEditModal(prescription)"
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
          <p class="text-gray-600 font-medium mb-4">No hay prescripciones registradas</p>
          <p class="text-gray-500 text-sm">Las prescripciones aparecerán aquí cuando se creen</p>
        </div>
      </div>
    </div>

    <!-- Update Prescription Modal -->
    <UpdatePrescriptionComponent
      v-if="showUpdateModal && selectedPrescription"
      :prescription="selectedPrescription"
      @close="closeUpdateModal"
      @updated="handlePrescriptionUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientRepositoryImpl } from '../../data/repositories/patientRepositoryImpl.js';
import { clinicalRecordApi } from '../../data/datasource/clinicalRecordApi.js';
import { clinicalRecordEntryRepositoryImpl } from '../../data/repositories/clinicalRecordEntryRepositoryImpl.js';
import { prescriptionRepositoryImpl } from '../../data/repositories/prescriptionRepositoryImpl.js';
import UpdatePrescriptionComponent from '../components/update-prescription-component.vue';

const route = useRoute();
const router = useRouter();

const patientName = ref('');
const prescriptions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showUpdateModal = ref(false);
const selectedPrescription = ref(null);

onMounted(async () => {
  try {
    const patientId = parseInt(route.params.patientId);
    if (!patientId || isNaN(patientId)) {
      error.value = 'ID de paciente inválido';
      return;
    }

    const patient = await patientRepositoryImpl.getByPatientId(patientId);
    patientName.value = patient.fullName || 'Paciente';

    // Obtener el clinical record
    const response = await clinicalRecordApi.getByPatientId(patientId);
    const clinicalRecord = response.data || response;

    console.log('📋 Clinical Record:', clinicalRecord);

    if (clinicalRecord?.id) {
      // Obtener las entradas del registro clínico
      const entries = await clinicalRecordEntryRepositoryImpl.getAllByClinicalRecordId(clinicalRecord.id);
      console.log('📋 Clinical Entries:', entries);

      // Recopilar todos los prescriptionIds únicos
      const prescriptionIds = new Set();
      entries.forEach(entry => {
        if (entry.prescriptionId) {
          prescriptionIds.add(entry.prescriptionId);
        }
      });

      // Obtener los datos de cada prescripción
      for (const prescriptionId of prescriptionIds) {
        try {
          const rxData = await prescriptionRepositoryImpl.getById(prescriptionId);
          prescriptions.value.push(rxData);
          console.log('💊 Prescription:', rxData);
        } catch (err) {
          console.error(`Error loading prescription ${prescriptionId}:`, err);
        }
      }
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar las prescripciones';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const openEditModal = (prescription) => {
  selectedPrescription.value = prescription;
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  selectedPrescription.value = null;
};

const handlePrescriptionUpdated = async () => {
  try {
    // Recargar todas las prescripciones
    const patientId = parseInt(route.params.patientId);
    const response = await clinicalRecordApi.getByPatientId(patientId);
    const clinicalRecord = response.data || response;

    if (clinicalRecord?.id) {
      const entries = await clinicalRecordEntryRepositoryImpl.getAllByClinicalRecordId(clinicalRecord.id);
      
      const prescriptionIds = new Set();
      entries.forEach(entry => {
        if (entry.prescriptionId) {
          prescriptionIds.add(entry.prescriptionId);
        }
      });

      prescriptions.value = [];
      for (const prescriptionId of prescriptionIds) {
        try {
          const rxData = await prescriptionRepositoryImpl.getById(prescriptionId);
          prescriptions.value.push(rxData);
        } catch (err) {
          console.error(`Error loading prescription ${prescriptionId}:`, err);
        }
      }
    }
    closeUpdateModal();
  } catch (err) {
    error.value = 'Error al actualizar las prescripciones';
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
