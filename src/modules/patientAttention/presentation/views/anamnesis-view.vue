<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header con botón volver -->
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
        <span class="ml-3 text-gray-600">Cargando anamnesis...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Contenido -->
      <div v-else class="bg-white rounded-xl shadow-md p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <i class="pi pi-file-medical text-[#2B6D8C] text-5xl mb-4 block"></i>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Anamnesis del Paciente</h1>
            <p class="text-gray-600 text-lg">{{ patientName }}</p>
          </div>
          <button
            v-if="!isDataComplete"
            @click="openUpdateModal"
            class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <i class="pi pi-pencil"></i>
            <span>Completar Información</span>
          </button>
        </div>

        <!-- Anamnesis Data Display -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Antecedentes Clínicos</p>
            <p class="text-gray-800 font-semibold">{{ anamnesis?.clinicalBackground || 'No registrado' }}</p>
          </div>

          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Medicamentos Actuales</p>
            <p class="text-gray-800 font-semibold">{{ anamnesis?.currentMedications || 'No registrado' }}</p>
          </div>

          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Presión Baja</p>
            <div class="flex items-center gap-2">
              <span v-if="anamnesis?.lowBloodPressure" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <i class="pi pi-check mr-1"></i> Sí
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="pi pi-times mr-1"></i> No
              </span>
            </div>
          </div>

          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Presión Alta</p>
            <div class="flex items-center gap-2">
              <span v-if="anamnesis?.highBloodPressure" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <i class="pi pi-check mr-1"></i> Sí
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="pi pi-times mr-1"></i> No
              </span>
            </div>
          </div>

          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Fumador</p>
            <div class="flex items-center gap-2">
              <span v-if="anamnesis?.smoke" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <i class="pi pi-check mr-1"></i> Sí
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="pi pi-times mr-1"></i> No
              </span>
            </div>
          </div>

          <div class="border-l-4 border-teal-500 pl-4 py-2">
            <p class="text-sm text-gray-500 mb-1">Contacto de Emergencia</p>
            <p class="text-gray-800 font-semibold">{{ anamnesis?.emergencyContact || 'No registrado' }}</p>
          </div>
        </div>

        <!-- Empty State Message -->
        <div v-if="!isDataComplete" class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-yellow-800 flex items-center gap-2">
            <i class="pi pi-info-circle"></i>
            <span>La anamnesis necesita ser completada. Haz clic en "Completar Información" para agregar los datos.</span>
          </p>
        </div>

        <!-- Allergias Section -->
        <div class="mt-8">
          <AllergiasMedicationsComponent 
            v-if="clinicalRecordId"
            :clinical-record-id="clinicalRecordId"
          />
        </div>
      </div>
    </div>

    <!-- Update Anamnesis Modal -->
    <UpdateAnamnesisComponent 
      v-if="showUpdateModal"
      :anamnesis="anamnesis"
      :anamnesisId="anamnesisId"
      @close="closeUpdateModal"
      @updated="handleAnamnesisUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientRepositoryImpl } from '../../data/repositories/patientRepositoryImpl.js';
import { anamnesisRepositoryImpl } from '../../data/repositories/anamnesisRepositoryImpl.js';
import { clinicalRecordApi } from '../../data/datasource/clinicalRecordApi.js';
import UpdateAnamnesisComponent from '../components/update-anamnesis-component.vue';
import AllergiasMedicationsComponent from '../components/allergias-medications-component.vue';

const route = useRoute();
const router = useRouter();
const patientName = ref('');
const anamnesisId = ref(null);
const clinicalRecordId = ref(null);
const anamnesis = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showUpdateModal = ref(false);

const isDataComplete = computed(() => {
  if (!anamnesis.value) return false;
  return (
    anamnesis.value.clinicalBackground &&
    anamnesis.value.currentMedications &&
    anamnesis.value.emergencyContact &&
    anamnesis.value.lowBloodPressure !== null &&
    anamnesis.value.highBloodPressure !== null &&
    anamnesis.value.smoke !== null
  );
});

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
    const clinicalRecord = response.data || response;
    anamnesisId.value = clinicalRecord?.anamnesisId;
    clinicalRecordId.value = clinicalRecord?.id;
    
    console.log('🏥 Anamnesis View - Patient ID:', patientId);
    console.log('🏥 Anamnesis View - Clinical Record ID:', clinicalRecordId.value);
    console.log('🏥 Anamnesis View - Anamnesis ID:', anamnesisId.value);

    if (anamnesisId.value) {
      const anamnesisData = await anamnesisRepositoryImpl.getById(anamnesisId.value);
      anamnesis.value = anamnesisData;
      console.log('🏥 Anamnesis Data:', anamnesisData);
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar la anamnesis';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const openUpdateModal = () => {
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

const handleAnamnesisUpdated = async () => {
  try {
    const anamnesisData = await anamnesisRepositoryImpl.getById(anamnesisId.value);
    anamnesis.value = anamnesisData;
    closeUpdateModal();
  } catch (err) {
    error.value = 'Error al actualizar la anamnesis';
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
