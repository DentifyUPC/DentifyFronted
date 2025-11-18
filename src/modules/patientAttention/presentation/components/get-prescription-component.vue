<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-4 animate-fadeIn max-h-[90vh] overflow-y-auto"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-lg"></i>
      </button>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <i class="pi pi-spin pi-spinner text-xl text-blue-600"></i>
        <span class="ml-2 text-gray-600 text-sm">Cargando receta...</span>
      </div>

      <!-- No Prescription -->
      <div v-else-if="!prescription" class="text-center py-8">
        <i class="pi pi-inbox text-3xl text-gray-400 mb-2 block"></i>
        <h2 class="text-lg font-semibold text-blue-700 mb-2">No hay receta</h2>
        <p class="text-gray-600 text-sm">Esta cita aún no tiene receta asociada</p>
      </div>

      <!-- Prescription Details -->
      <div v-else>
        <h2 class="text-lg font-semibold text-blue-700 mb-3 text-center">
          💊 Receta Médica
        </h2>

        <!-- Prescription ID -->
        <div class="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">ID de Receta</p>
          <p class="text-sm font-semibold text-gray-800">{{ prescription.id }}</p>
        </div>

        <!-- Effects/Indications -->
        <div class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-xs font-semibold text-blue-800 mb-2">Efectos / Indicaciones</p>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ prescription.effects || 'Sin información' }}</p>
        </div>

        <!-- Medications Section -->
        <div class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p class="text-xs font-semibold text-green-800 mb-2">💊 Medicamentos</p>
          
          <!-- Loading Medications -->
          <div v-if="isLoadingMedications" class="flex items-center justify-center py-3">
            <i class="pi pi-spin pi-spinner text-sm text-green-600"></i>
            <span class="ml-2 text-gray-600 text-xs">Cargando...</span>
          </div>

          <!-- Medications List -->
          <div v-else-if="medications.length > 0" class="space-y-2">
            <div
              v-for="med in medications"
              :key="med.id"
              class="bg-white p-2 rounded border border-green-200"
            >
              <p class="text-xs font-semibold text-green-700">{{ med.medicationName }}</p>
              <p class="text-xs text-gray-700 mt-0.5">{{ med.description }}</p>
            </div>
          </div>

          <!-- No Medications -->
          <div v-else class="text-center py-2">
            <p class="text-xs text-gray-600">Sin medicamentos registrados</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-2 bg-red-50 border border-red-200 rounded-lg mb-3">
          <p class="text-red-800 flex items-center gap-1 text-xs">
            <i class="pi pi-exclamation-triangle text-xs"></i>
            <span>{{ error }}</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button
            @click="$emit('close')"
            class="px-3 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-medium transition flex items-center gap-1"
          >
            <i class="pi pi-times text-xs"></i>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { prescriptionRepositoryImpl } from '../../data/repositories/prescriptionRepositoryImpl.js';
import { prescriptionItemRepositoryImpl } from '../../data/repositories/prescriptionItemRepositoryImpl.js';

const props = defineProps({
  appointmentId: { type: Number, required: true },
});

const emit = defineEmits(['close']);

const prescription = ref(null);
const medications = ref([]);
const isLoading = ref(false);
const isLoadingMedications = ref(false);
const error = ref(null);

onMounted(async () => {
  await loadPrescription();
});

const loadPrescription = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    console.log(`💊 Loading prescription for appointment ID: ${props.appointmentId}`);
    const rxData = await prescriptionRepositoryImpl.getByAppointmentId(props.appointmentId);
    prescription.value = rxData;
    console.log('💊 Prescription:', rxData);

    if (rxData?.id) {
      await loadMedications(rxData.id);
    }
  } catch (err) {
    console.error('Error loading prescription:', err);
    // No error message for patient - prescription might not exist
  } finally {
    isLoading.value = false;
  }
};

const loadMedications = async (prescriptionId) => {
  isLoadingMedications.value = true;
  try {
    console.log(`💊 Loading medications for prescription ID: ${prescriptionId}`);
    const meds = await prescriptionItemRepositoryImpl.getByPrescriptionId(prescriptionId);
    medications.value = meds || [];
    console.log('💊 Medications:', meds);
  } catch (err) {
    console.error('Error loading medications:', err);
    medications.value = [];
  } finally {
    isLoadingMedications.value = false;
  }
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
.fixed {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  animation: fadeOverlay 0.25s ease-out;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: fadeInUp 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111827;
}

@keyframes fadeOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
}
</style>
