<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

      <!-- Processing -->
      <div v-if="isProcessing" class="text-center">
        <i class="pi pi-spin pi-spinner text-5xl text-blue-600 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Procesando pago...
        </h2>
        <p class="text-gray-600">
          Por favor espera mientras verificamos tu pago con PayPal
        </p>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="text-center">
        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-check text-4xl text-green-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-green-800 mb-2">
          ¡Pago exitoso!
        </h2>
        <p class="text-gray-600 mb-4">
          Tu pago ha sido procesado correctamente
        </p>
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-600">ID de pago:</span>
            <span class="font-semibold">{{ paymentData?.id }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-600">Monto:</span>
            <span class="font-semibold">S/. {{ paymentData?.amount?.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Estado:</span>
            <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
              Pagado
            </span>
          </div>
        </div>
        <button
            @click="goToAppointments"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Ver mis citas
        </button>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center">
        <div class="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-times text-4xl text-red-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-red-800 mb-2">
          Error en el pago
        </h2>
        <p class="text-gray-600 mb-6">
          {{ error }}
        </p>
        <div class="flex gap-3">
          <button
              @click="retry"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Reintentar
          </button>
          <button
              @click="goToAppointments"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>

      <!-- Cancelled -->
      <div v-else-if="cancelled" class="text-center">
        <div class="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-exclamation-triangle text-4xl text-yellow-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-yellow-800 mb-2">
          Pago cancelado
        </h2>
        <p class="text-gray-600 mb-6">
          Has cancelado el proceso de pago. Puedes intentar nuevamente cuando lo desees.
        </p>
        <button
            @click="goToAppointments"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Volver a mis citas
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';

const router = useRouter();
const route = useRoute();
const paymentStore = usePaymentStore();

const isProcessing = ref(false);
const success = ref(false);
const error = ref(null);
const cancelled = ref(false);
const paymentData = ref(null);

onMounted(async () => {
  // Verificar si el usuario viene de PayPal
  const token = route.query.token; // PayPal approval token
  const payerId = route.query.PayerID;

  console.log('🔍 Query params:', route.query);

  // Si el usuario canceló en PayPal
  if (route.query.cancelled === 'true') {
    cancelled.value = true;
    localStorage.removeItem('pendingPayPalOrder');
    return;
  }

  // Si no hay token, revisar localStorage
  if (!token) {
    error.value = 'No se encontró información de pago pendiente';
    return;
  }

  // Obtener datos de pago pendiente desde localStorage
  const pendingOrderStr = localStorage.getItem('pendingPayPalOrder');

  if (!pendingOrderStr) {
    error.value = 'No se encontró orden de pago pendiente';
    return;
  }

  try {
    const pendingOrder = JSON.parse(pendingOrderStr);
    console.log('📦 Orden pendiente:', pendingOrder);

    // Verificar que no sea muy antigua (30 minutos)
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() - pendingOrder.timestamp > thirtyMinutes) {
      throw new Error('La orden de pago ha expirado. Por favor intenta nuevamente.');
    }

    isProcessing.value = true;

    // Capturar el pago
    console.log('🟢 Capturando pago...');
    const capturedPayment = await paymentStore.capturePayPalOrder(
        pendingOrder.paymentId,
        pendingOrder.orderId
    );

    console.log('✅ Pago capturado:', capturedPayment);

    paymentData.value = capturedPayment;
    success.value = true;

    // Limpiar localStorage
    localStorage.removeItem('pendingPayPalOrder');

  } catch (err) {
    console.error('❌ Error procesando pago:', err);
    error.value = err.message || 'No se pudo procesar el pago. Por favor contacta con soporte.';
  } finally {
    isProcessing.value = false;
  }
});

const goToAppointments = () => {
  router.push({ name: 'appointment-patients' }); // Ajusta el nombre de la ruta
};

const retry = () => {
  localStorage.removeItem('pendingPayPalOrder');
  goToAppointments();
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
</style>