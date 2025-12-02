<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <!-- RECIBO ESTILO TICKET -->
    <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
      <!-- BOTÓN CERRAR -->
      <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        <i class="pi pi-times text-lg"></i>
      </button>

      <!-- LOADING STATE -->
      <div v-if="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-[#2B6D8C]"></i>
        <p class="text-sm text-gray-500 mt-2">Cargando información...</p>
      </div>

      <!-- RECIBO COMPLETO -->
      <div v-else>
        <!-- ENCABEZADO DE LA CLÍNICA -->
         <div class="text-center pb-2 border-b border-dashed border-gray-300">
           <h1 class="text-base font-bold text-[#2B6D8C]">{{ clinicName || 'CLINIC CODE' }}</h1>
           <p class="text-[10px] text-gray-600">Recibo de Pago</p>
           <p class="text-[10px] text-gray-400" v-if="clinicRuc">RUC: {{ clinicRuc }}</p>
         </div>

        <!-- INFORMACIÓN DEL RECIBO -->
        <div class="mt-2 space-y-0.5 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-600">Recibo N°:</span>
            <strong class="text-gray-800">#{{ payment.id }}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fecha de emisión:</span>
            <strong class="text-gray-800">{{ payment.formattedDate }}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Cita asociada:</span>
            <strong class="text-gray-800">#{{ payment.appointmentId }}</strong>
          </div>
        </div>

        <div class="border-b border-dashed border-gray-300 my-2"></div>

        <!-- INFORMACIÓN DEL PACIENTE -->
        <div class="mb-2">
          <p class="text-xs font-bold text-gray-700 mb-1 uppercase">Datos del Paciente</p>

          <div v-if="patientError" class="text-xs text-red-600 bg-red-50 p-2 rounded">
            {{ patientError }}
          </div>

          <div v-else class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Nombre:</span>
              <strong class="text-gray-800 text-[10px]">{{ patientInfo.fullName }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <strong class="text-gray-800 text-[9px]">{{ patientInfo.email }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Teléfono:</span>
              <strong class="text-gray-800 text-[10px]">{{ patientInfo.phone }}</strong>
            </div>
          </div>
          </div>

          <div class="border-b border-dashed border-gray-300 my-2"></div>

          <!-- DETALLE DEL PAGO -->
          <div class="mb-2">
          <p class="text-xs font-bold text-gray-700 mb-1 uppercase">Detalle del Pago</p>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Concepto:</span>
              <strong class="text-gray-800 text-[10px]">Consulta Odontológica</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Estado:</span>
              <span
                  class="px-1.5 py-0.5 rounded-full text-[9px] font-semibold inline-flex items-center gap-1"
                  :class="payment.displayStatus.color"
              >
                <i :class="`pi ${payment.displayStatus.icon}`"></i>
                {{ payment.displayStatus.label }}
              </span>
            </div>
          </div>
          </div>

          <!-- TOTAL -->
          <div class="bg-[#2B6D8C]/10 rounded-lg p-2 mb-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-700">TOTAL</span>
            <strong class="text-lg font-bold text-[#2B6D8C]">{{ payment.formattedAmount }}</strong>
          </div>
          </div>

          <!-- INFORMACIÓN DE PAYPAL (si existe) -->
          <div v-if="payment.paypalOrderId || payment.paypalCaptureId" class="bg-gray-50 rounded-lg p-2 mb-2">
          <p class="text-[10px] font-semibold text-gray-700 mb-1">PayPal</p>
          <div v-if="payment.paypalOrderId" class="mb-1">
            <p class="text-[10px] text-gray-500">Order ID:</p>
            <p class="font-mono text-[9px] text-gray-700 break-all">{{ payment.paypalOrderId }}</p>
          </div>
          <div v-if="payment.paypalCaptureId">
            <p class="text-[10px] text-gray-500">Capture ID:</p>
            <p class="font-mono text-[9px] text-gray-700 break-all">{{ payment.paypalCaptureId }}</p>
            </div>
            </div>

            <div class="border-b border-dashed border-gray-300 my-2"></div>

            <!-- FOOTER -->
            <div class="text-center text-[9px] text-gray-500 mb-2">
            <p>Comprobante válido de pago</p>
            </div>

            <!-- BOTONES DE ACCIÓN -->
            <div class="flex gap-2">
            <button
              @click="printReceipt"
              class="flex-1 px-3 py-1.5 bg-[#2B6D8C] text-white rounded-lg hover:bg-[#1E4F67] transition text-xs font-medium flex items-center justify-center gap-1"
            >
            <i class="pi pi-print text-xs"></i>
            <span>Imprimir</span>
            </button>
            <button
              @click="$emit('close')"
              class="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-xs font-medium"
            >
            Cerrar
            </button>
            </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { patientRepositoryImpl } from '@/modules/patientAttention/data/repositories/patientRepositoryImpl.js';
import { clinicRepositoryImpl } from '@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js';

const props = defineProps({
  payment: { type: Object, required: true },
});

defineEmits(['close']);

const isLoading = ref(true);
const patientData = ref(null);
const patientError = ref(null);
const clinicName = ref('');
const clinicRuc = ref('');

const patientInfo = computed(() => {
  if (!patientData.value) {
    return {
      fullName: 'Cargando...',
      email: '---',
      phone: '---'
    };
  }

  return {
    fullName: patientData.value.fullName || 'N/A',
    email: patientData.value.email || 'No registrado',
    phone: patientData.value.phoneNumber || 'No registrado'
  };
});

onMounted(async () => {
  try {
    isLoading.value = true;

    // Obtener usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar datos del paciente
    console.log('🔍 Cargando datos del paciente ID:', props.payment.patientId);
    patientData.value = await patientRepositoryImpl.getByPatientId(props.payment.patientId);
    console.log('✅ Datos del paciente cargados:', patientData.value);

    // Cargar datos de la clínica usando clinicId del usuario
    if (user.clinicId) {
      const clinics = await clinicRepositoryImpl.getClinicsForRegister();
      const clinic = clinics.find((c) => c.id === user.clinicId);
      if (clinic) {
        clinicName.value = clinic.name;
        clinicRuc.value = clinic.ruc;
      }
    }

  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    patientError.value = 'No se pudo cargar la información del paciente';
  } finally {
    isLoading.value = false;
  }
});

const printReceipt = () => {
  window.print();
};
</script>

<style scoped>
@import "primeicons/primeicons.css";

/* Overlay con backdrop blur */
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

/* Animación del modal */
.animate-fadeIn {
  animation: fadeInUp 0.3s ease-out;
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

/* Estilos para impresión */
@media print {
  body {
    background: white;
  }

  .fixed {
    position: static;
    background: white;
    backdrop-filter: none;
    display: block;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  .animate-fadeIn {
    width: 100%;
    max-width: 100%;
    max-height: none;
    overflow: visible;
    box-shadow: none;
    page-break-inside: avoid;
    background: white;
    position: relative;
    margin: 0;
    border: none;
  }

  button {
    display: none;
  }
}
</style>