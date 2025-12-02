<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 border border-gray-100">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#2B6D8C]">Mis Pagos</h1>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20 text-[#2B6D8C]">
        <i class="pi pi-spin pi-spinner text-3xl"></i>
        <span class="ml-3 text-gray-600">Cargando pagos...</span>
      </div>

      <div v-else-if="error" class="text-red-500 text-center text-lg py-10">
        {{ error }}
      </div>

      <div v-else-if="payments.length === 0" class="text-center py-16">
        <i class="pi pi-wallet text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg mb-6">No tienes pagos registrados</p>
      </div>

      <div v-else class="space-y-4">
        <div
            v-for="payment in payments"
            :key="payment.id"
            class="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-5 border border-gray-200"
        >
          <div class="flex flex-col flex-grow">
            <span class="text-sm text-gray-500">Pago #{{ payment.id }}</span>
            <span class="text-lg font-semibold text-gray-800">
              Cita #{{ payment.appointmentId }}
            </span>
            <span class="text-sm text-gray-600 mt-1">
              Monto: {{ payment.formattedAmount }}
            </span>
            <span v-if="payment.formattedDate !== '--/--/----'" class="text-xs text-gray-500 mt-1">
              Fecha de pago: {{ payment.formattedDate }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button
                v-if="payment.canBePaid"
                @click="openPaymentModal(payment)"
                class="px-4 py-2 text-sm bg-[#0070BA] hover:bg-[#005EA6] text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <i class="pi pi-paypal text-sm"></i>
              <span>Pagar</span>
            </button>

            <span
                class="px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                :class="payment.displayStatus.color"
            >
              <i :class="`pi ${payment.displayStatus.icon} mr-1`"></i>
              {{ payment.displayStatus.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Pago con PayPal -->
    <PayPalPaymentRedirectComponent
        v-if="showPaymentModal && selectedPayment"
        :payment="selectedPayment"
        @close="showPaymentModal = false"
        @redirect="handlePaymentRedirect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';
import { patientApi } from '@/modules/patientAttention/data/datasource/patientApi.js';
import PayPalPaymentRedirectComponent from '@/modules/payment/presentation/components/paypal-payment-redirect-component.vue';

const authStore = useAuthStore();
const paymentStore = usePaymentStore();

const showPaymentModal = ref(false);
const selectedPayment = ref(null);
const isLoading = ref(true);
const error = ref(null);
const payments = ref([]);
const patientId = ref(null);

const loadPayments = async () => {
  isLoading.value = true;
  try {
    const user = authStore.user;
    if (!user) throw new Error("Usuario no autenticado.");

    const patientResponse = await patientApi.getByUserId(user.id);
    const patient = patientResponse.data || patientResponse;
    if (!patient?.id) throw new Error("No se encontró el paciente.");

    patientId.value = patient.id;

    // Obtener pagos del paciente
    payments.value = await paymentStore.fetchByPatientId(patient.id);

  } catch (err) {
    console.error('Error cargando pagos:', err);
    error.value = "No se pudieron obtener los pagos del paciente.";
  } finally {
    isLoading.value = false;
  }
};

// Computed properties para el resumen
const pendingCount = computed(() => {
  return payments.value.filter(p => p.isPending).length;
});

const paidCount = computed(() => {
  return payments.value.filter(p => p.isPaid).length;
});

const totalPaid = computed(() => {
  return payments.value
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);
});

onMounted(async () => {
  await loadPayments();
});

const openPaymentModal = (payment) => {
  selectedPayment.value = payment;
  showPaymentModal.value = true;
};

const handlePaymentRedirect = (orderData) => {
  console.log('Redirigiendo a PayPal:', orderData);
  showPaymentModal.value = false;
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
</style>