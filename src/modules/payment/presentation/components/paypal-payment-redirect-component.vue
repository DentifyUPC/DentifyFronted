<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Pagar Cita</h2>
        <button
            @click="$emit('close')"
            :disabled="isProcessing"
            class="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Payment Info -->
      <div class="bg-blue-50 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Cita #</span>
          <span class="font-semibold text-gray-800">{{ payment.appointmentId }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Monto a pagar</span>
          <span class="text-2xl font-bold text-blue-600">
            S/. {{ payment.amount.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
        <i class="pi pi-exclamation-circle text-red-600 text-lg"></i>
        <div>
          <p class="font-semibold text-red-800">Error</p>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Processing -->
      <div v-if="isProcessing" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
        <i class="pi pi-spin pi-spinner text-blue-600 text-lg"></i>
        <p class="text-sm text-blue-700">Creando orden de pago...</p>
      </div>

      <!-- Action Button -->
      <button
          v-if="!isProcessing"
          @click="handlePayment"
          class="w-full bg-[#0070BA] hover:bg-[#005EA6] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <i class="pi pi-paypal text-lg"></i>
        <span>Continuar con PayPal</span>
      </button>

      <!-- Info -->
      <div class="text-center text-xs text-gray-500 mt-4">
        <p>Serás redirigido a PayPal para completar el pago</p>
        <p class="mt-1">Después de pagar, regresa a esta página</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';

const props = defineProps({
  payment: { type: Object, required: true },
});

const emit = defineEmits(['close', 'redirect']);

const paymentStore = usePaymentStore();
const isProcessing = ref(false);
const error = ref(null);

const handlePayment = async () => {
  try {
    isProcessing.value = true;
    error.value = null;

    console.log('🔵 Creando orden PayPal para payment ID:', props.payment.id);

    // Llamar al backend para crear la orden
    const orderData = await paymentStore.createPayPalOrder(props.payment.id);

    console.log('✅ Orden creada:', orderData);
    console.log('📎 Approval URL:', orderData.approvalUrl);

    if (!orderData.approvalUrl) {
      throw new Error('No se recibió URL de aprobación de PayPal');
    }

    // Guardar orderId en localStorage para verificar después
    localStorage.setItem('pendingPayPalOrder', JSON.stringify({
      paymentId: props.payment.id,
      orderId: orderData.orderId,
      timestamp: Date.now(),
    }));

    emit('redirect', orderData);

    // Redirigir al usuario a PayPal
    console.log('🔄 Redirigiendo a PayPal...');
    window.location.href = orderData.approvalUrl;

  } catch (err) {
    console.error('❌ Error creando orden:', err);
    error.value = err.message || 'Error al crear orden de pago';
    isProcessing.value = false;
  }
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

@keyframes fadeOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>