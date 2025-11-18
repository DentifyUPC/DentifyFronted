<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-7xl mx-auto">
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
        <span class="ml-3 text-gray-600">Cargando odontograma...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else class="bg-white rounded-xl shadow-md p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <i class="pi pi-file-image text-[#2B6D8C] text-5xl mb-4 block"></i>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Odontograma del Paciente</h1>
            <p class="text-gray-600 text-lg">{{ patientName }}</p>
          </div>
          <button
            @click="openUpdateModal"
            class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <i class="pi pi-pencil"></i>
            <span>Editar Estados</span>
          </button>
        </div>

        <!-- Odontogram Grid Display -->
        <div v-if="odontogramItems.length > 0" class="mt-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Estado de los Dientes</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="item in odontogramItems"
              :key="item.id"
              class="p-4 border-2 border-teal-300 rounded-lg bg-gradient-to-br from-teal-50 to-white hover:shadow-md transition"
            >
              <div class="text-xs font-bold text-teal-700 mb-2 line-clamp-2">{{ getTeethName(item.teethCode) }}</div>
              <div class="flex flex-wrap justify-center gap-1">
                <span class="inline-block px-3 py-1 bg-teal-600 text-white text-xs rounded-full font-medium">
                  {{ item.toothStatusName || 'Sin estado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Info -->
        <div v-if="isDataComplete" class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 flex items-center gap-2">
            <i class="pi pi-check-circle"></i>
            <span>Odontograma completado. Puedes editar los estados en cualquier momento.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Update Odontogram Modal -->
    <UpdateOdontogramaComponent
      v-if="showUpdateModal"
      :odontogramId="odontogramId"
      :odontogramItems="odontogramItems"
      @close="closeUpdateModal"
      @updated="handleOdontogramUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientRepositoryImpl } from '../../data/repositories/patientRepositoryImpl.js';
import { odontogramItemRepositoryImpl } from '../../data/repositories/odontogramItemRepositoryImpl.js';
import { clinicalRecordApi } from '../../data/datasource/clinicalRecordApi.js';
import { getTeethName } from '../../data/constants/teeth-mapping.js';
import UpdateOdontogramaComponent from '../components/update-odontograma-component.vue';

const route = useRoute();
const router = useRouter();
const patientName = ref('');
const odontogramId = ref(null);
const odontogramItems = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showUpdateModal = ref(false);

const isDataComplete = computed(() => {
  return (
    odontogramItems.value.length > 0 &&
    odontogramItems.value.every(item => item.toothStatusName && item.toothStatusName.trim() !== '')
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
    odontogramId.value = clinicalRecord?.odontogramId;
    
    console.log('🦷 Odontograma View - Patient ID:', patientId);
    console.log('🦷 Odontograma View - Odontogram ID:', odontogramId.value);

    if (odontogramId.value) {
      const odontogramData = await odontogramItemRepositoryImpl.getAllByOdontogramId(odontogramId.value);
      odontogramItems.value = odontogramData;
      console.log('🦷 Odontogram Items:', odontogramData);
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar el odontograma';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const openUpdateModal = () => {
  console.log('📝 Opening odontogram modal');
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  console.log('📝 Closing odontogram modal');
  showUpdateModal.value = false;
};

const handleOdontogramUpdated = async () => {
  try {
    const odontogramData = await odontogramItemRepositoryImpl.getAllByOdontogramId(odontogramId.value);
    odontogramItems.value = odontogramData;
    closeUpdateModal();
  } catch (err) {
    error.value = 'Error al actualizar el odontograma';
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
