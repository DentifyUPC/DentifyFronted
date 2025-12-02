<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-[#2B6D8C]">Gestión de Pagos</h1>
          <p class="text-gray-600 mt-1">Administra todos los pagos de la clínica</p>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2">
          <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B6D8C] focus:border-transparent"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PAID">Pagados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando pagos...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-lg text-center py-10">
        Error al cargar pagos: {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPayments.length === 0" class="text-center py-16">
        <i class="pi pi-wallet text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No hay pagos registrados</p>
      </div>

      <!-- Payments Table -->
      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#AACFF3] text-[#2B6D8C]">
            <tr>
              <th class="py-3 px-4 text-left">ID Pago</th>
              <th class="py-3 px-4 text-left">Cita</th>
              <th class="py-3 px-4 text-left">Paciente</th>
              <th class="py-3 px-4 text-left">Monto</th>
              <th class="py-3 px-4 text-left">Fecha de Pago</th>
              <th class="py-3 px-4 text-left">Estado</th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="payment in filteredPayments"
                :key="payment.id"
                class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-3 px-4 font-medium text-gray-800">#{{ payment.id }}</td>
              <td class="py-3 px-4 text-gray-600">Cita #{{ payment.appointmentId }}</td>
              <td class="py-3 px-4 text-gray-600">{{ patientCache[payment.patientId] || `Paciente #${payment.patientId}` }}</td>
              <td class="py-3 px-4 font-semibold text-gray-800">{{ payment.formattedAmount }}</td>
              <td class="py-3 px-4 text-gray-600">
                {{ payment.formattedDate }}
              </td>
              <td class="py-3 px-4">
                  <span
                      class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                      :class="payment.displayStatus.color"
                  >
                    <i :class="`pi ${payment.displayStatus.icon}`"></i>
                    {{ payment.displayStatus.label }}
                  </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center gap-2 justify-center">
                  <button
                      @click="viewDetails(payment)"
                      class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                  >
                    <i class="pi pi-eye text-xs"></i>
                    <span>Ver</span>
                  </button>
                  <button
                      v-if="payment.isPending"
                      @click="openUpdateModal(payment)"
                      class="bg-[#2B6D8C] text-white px-3 py-1 rounded-lg hover:bg-[#1E4F67] transition text-sm flex items-center gap-1"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                    <span>Editar</span>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>

    <!-- Modal de Detalles -->
    <PaymentDetailsModal
        v-if="showDetailsModal && selectedPayment"
        :payment="selectedPayment"
        @close="showDetailsModal = false"
    />

    <!-- Modal de Actualizar Monto -->
    <UpdatePaymentAmountModal
        v-if="showUpdateModal && selectedPayment"
        :payment="selectedPayment"
        @close="showUpdateModal = false"
        @updated="handlePaymentUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';
import { patientRepositoryImpl } from '@/modules/patientAttention/data/repositories/patientRepositoryImpl.js';
import PaymentDetailsModal from '@/modules/payment/presentation/components/payment-details-modal.vue';
import UpdatePaymentAmountModal from '@/modules/payment/presentation/components/update-payment-amount-modal.vue';

const paymentStore = usePaymentStore();

const showDetailsModal = ref(false);
const showUpdateModal = ref(false);
const selectedPayment = ref(null);
const isLoading = ref(true);
const error = ref(null);
const filterStatus = ref('ALL');
const patientCache = ref({});

const payments = computed(() => paymentStore.payments);

const filteredPayments = computed(() => {
  if (filterStatus.value === 'ALL') {
    return payments.value;
  }
  return payments.value.filter(p => p.state === filterStatus.value);
});

const pendingCount = computed(() => {
  return payments.value.filter(p => p.isPending).length;
});

const paidCount = computed(() => {
  return payments.value.filter(p => p.isPaid).length;
});

const totalRevenue = computed(() => {
  return payments.value
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);
});

const loadPatientNames = async () => {
  const uniquePatientIds = [...new Set(payments.value.map(p => p.patientId))];
  
  for (const patientId of uniquePatientIds) {
    if (patientCache.value[patientId]) continue;
    
    try {
      const patient = await patientRepositoryImpl.getByPatientId(patientId);
      if (patient && patient.fullName) {
        patientCache.value[patientId] = patient.fullName;
      }
    } catch (err) {
      console.error(`Error cargando paciente ${patientId}:`, err);
    }
  }
};

onMounted(async () => {
  try {
    await paymentStore.fetchAll();
    await loadPatientNames();
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});

const viewDetails = (payment) => {
  selectedPayment.value = payment;
  showDetailsModal.value = true;
};

const openUpdateModal = (payment) => {
  selectedPayment.value = payment;
  showUpdateModal.value = true;
};

const handlePaymentUpdated = async () => {
  showUpdateModal.value = false;
  await paymentStore.fetchAll();
  await loadPatientNames();
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
</style>