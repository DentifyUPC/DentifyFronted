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
          <span>Volver a Citas</span>
        </button>
      </div>

      <!-- Información del Paciente -->
      <div v-if="isLoadingPatient" class="flex items-center justify-center py-16">
        <PvProgressSpinner />
        <span class="ml-3 text-gray-600">Cargando información del paciente...</span>
      </div>

      <div v-else-if="patientError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ patientError }}
      </div>

      <div v-else-if="patient" class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 class="text-3xl font-bold text-[#2B6D8C] mb-4 flex items-center gap-3">
          <i class="pi pi-user-edit"></i>
          Panel de Control del Paciente
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p class="text-gray-500">Nombre Completo</p>
            <p class="font-semibold text-gray-800">{{ patient.fullName }}</p>
          </div>
          <div>
            <p class="text-gray-500">Email</p>
            <p class="font-semibold text-gray-800">{{ patient.email || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Teléfono</p>
            <p class="font-semibold text-gray-800">{{ patient.phoneNumber || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Navegación de Opciones -->
      <div v-if="patient" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          @click="navigateToAnamnesis"
          class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="bg-[#2B6D8C] p-4 rounded-lg group-hover:bg-[#1E4F67] transition">
              <i class="pi pi-file-medical text-white text-3xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-1">Anamnesis del Paciente</h2>
              <p class="text-gray-600">Gestionar historial médico y antecedentes clínicos</p>
            </div>
          </div>
        </button>

        <button
          @click="navigateToPrescription"
          class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="bg-green-600 p-4 rounded-lg group-hover:bg-green-700 transition">
              <i class="pi pi-file-edit text-white text-3xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-1">Prescripciones del Paciente</h2>
              <p class="text-gray-600">Gestionar recetas y medicamentos del paciente</p>
            </div>
          </div>
        </button>

        <button
          @click="navigateToOdontograma"
          class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="bg-purple-600 p-4 rounded-lg group-hover:bg-purple-700 transition">
              <i class="pi pi-file-image text-white text-3xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-1">Odontograma</h2>
              <p class="text-gray-600">Visualizar y gestionar el odontograma del paciente</p>
            </div>
          </div>
        </button>

        <button
          @click="navigateToClinicalRecord"
          class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="bg-orange-600 p-4 rounded-lg group-hover:bg-orange-700 transition">
              <i class="pi pi-book text-white text-3xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-1">Registro Clínico</h2>
              <p class="text-gray-600">Consultar el historial clínico del paciente</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientRepositoryImpl } from '../../data/repositories/patientRepositoryImpl.js';
import { clinicalRecordApi } from '../../data/datasource/clinicalRecordApi.js';

const route = useRoute();
const router = useRouter();

const patient = ref(null);
const isLoadingPatient = ref(true);
const patientError = ref(null);
const clinicalRecord = ref(null);

onMounted(async () => {
  try {
    const patientId = parseInt(route.params.patientId);
    if (!patientId || isNaN(patientId)) {
      patientError.value = 'ID de paciente inválido';
      isLoadingPatient.value = false;
      return;
    }

    // Obtener información del paciente
    patient.value = await patientRepositoryImpl.getByPatientId(patientId);

    // Obtener registro clínico
    try {
      const response = await clinicalRecordApi.getByPatientId(patientId);
      clinicalRecord.value = response.data || response;
      console.log('Clinical Record cargado:', clinicalRecord.value);
      console.log('Anamnesis ID:', clinicalRecord.value?.anamnesisId);
      console.log('Odontogram ID:', clinicalRecord.value?.odontogramId);
    } catch (err) {
      console.warn('No se pudo obtener el registro clínico:', err);
    }
  } catch (err) {
    patientError.value = err.message || 'Error al cargar información del paciente';
  } finally {
    isLoadingPatient.value = false;
  }
});

const goBack = () => {
  router.push({ name: 'appointment-odontologist' });
};

const navigateToAnamnesis = () => {
  router.push({
    name: 'patient-anamnesis',
    params: { patientId: route.params.patientId }
  });
};

const navigateToPrescription = () => {
  router.push({
    name: 'patient-prescription',
    params: { patientId: route.params.patientId }
  });
};

const navigateToOdontograma = () => {
  router.push({
    name: 'patient-odontograma',
    params: { patientId: route.params.patientId }
  });
};

const navigateToClinicalRecord = () => {
  router.push({
    name: 'patient-clinical-record',
    params: { patientId: route.params.patientId }
  });
};
</script>
