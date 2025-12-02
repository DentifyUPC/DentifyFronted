<template>
  <div class="p-6 space-y-8">

    <!-- Loading -->
    <div v-if="isLoadingAll" class="flex items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-[#2B6D8C]"></i>
      <span class="ml-4 text-lg text-gray-600">Cargando dashboard...</span>
    </div>

    <div v-else>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-[#2B6D8C]">Dashboard Administrativo</h1>
        <span class="text-gray-500 text-sm">Actualizado: {{ currentDate }}</span>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Ingresos Totales -->
        <div class="kpi-card">
          <div class="flex items-center justify-between mb-2">
            <p class="kpi-label">Ingresos Totales</p>
            <i class="pi pi-dollar kpi-icon"></i>
          </div>
          <p class="kpi-value">${{ totalPayments }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ paymentStats.totalCount }} transacciones</p>
        </div>

        <!-- Total Pagos -->
        <div class="kpi-card">
          <div class="flex items-center justify-between mb-2">
            <p class="kpi-label">Total de Pagos</p>
            <i class="pi pi-credit-card text-2xl text-[#2B6D8C]"></i>
          </div>
          <p class="text-3xl font-bold text-[#2B6D8C]">{{ paymentStats.totalCount }}</p>
          <p class="text-xs text-gray-500 mt-2">Registrados</p>
        </div>

        <!-- Items -->
        <div class="kpi-card">
          <div class="flex items-center justify-between mb-2">
            <p class="kpi-label">Items</p>
            <i class="pi pi-box text-2xl text-[#2B6D8C]"></i>
          </div>
          <p class="text-3xl font-bold text-[#2B6D8C]">{{ itemsStore.items.length }}</p>
          <p class="text-xs text-gray-500 mt-2">En stock</p>
        </div>

        <!-- Odontólogos -->
        <div class="kpi-card">
          <div class="flex items-center justify-between mb-2">
            <p class="kpi-label">Odontólogos</p>
            <i class="pi pi-users text-2xl text-[#2B6D8C]"></i>
          </div>
          <p class="text-3xl font-bold text-[#2B6D8C]">{{ odontologistCount }}</p>
          <p class="text-xs text-gray-500 mt-2">Activos</p>
        </div>

      </div>

      <!-- Métricas grandes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <!-- Total Ingresos -->
        <div class="metric-card">
          <p class="kpi-label mb-2">Ingresos Totales</p>
          <h3 class="text-4xl font-bold text-[#2B6D8C]">${{ totalPayments }}</h3>

          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Transacciones</span>
              <span class="font-semibold">{{ paymentStats.totalCount }}</span>
            </div>
          </div>
        </div>

        <!-- Tasa de éxito -->
        <div class="metric-card">
          <p class="kpi-label mb-2">Tasa de Éxito</p>
          <h3 class="text-4xl font-bold text-[#2B6D8C]">{{ percentagePaid }}%</h3>

          <div class="mt-4">
            <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div class="h-3 bg-[#2B6D8C]" :style="{ width: percentagePaid + '%' }"></div>
            </div>
            <p class="text-xs text-gray-600 mt-2 text-center">
              {{ paymentStats.paidCount }} pagados de {{ paymentStats.totalCount }}
            </p>
          </div>
        </div>

        <!-- Promedio por pago -->
        <div class="metric-card">
          <p class="kpi-label mb-2">Promedio por Pago</p>
          <h3 class="text-4xl font-bold text-[#2B6D8C]">
            ${{ (totalPayments / (paymentStats.totalCount || 1)).toFixed(2) }}
          </h3>

          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Monto total</span>
              <span class="font-semibold">${{ totalPayments }}</span>
            </div>
          </div>
        </div>

        <!-- Estado pagos -->
        <div class="metric-card">
          <p class="kpi-label mb-2">Estado de Pagos</p>
          <h3 class="text-2xl font-bold text-[#2B6D8C]">Distribución</h3>

          <div class="space-y-3 mt-4 text-sm">

            <!-- Pagados -->
            <div class="flex justify-between items-center">
              <span class="text-gray-600">✓ Pagados</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-300 rounded-full h-2">
                  <div class="h-2 bg-emerald-500 rounded-full"
                       :style="{ width: percentagePaid + '%' }"></div>
                </div>
                <span class="font-semibold w-10 text-right">{{ paymentStats.paidCount }}</span>
              </div>
            </div>

            <!-- Pendientes -->
            <div class="flex justify-between items-center">
              <span class="text-gray-600">⏱ Pendientes</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-300 rounded-full h-2">
                  <div class="h-2 bg-amber-500 rounded-full"
                       :style="{ width: percentagePending + '%' }"></div>
                </div>
                <span class="font-semibold w-10 text-right">{{ paymentStats.pendingCount }}</span>
              </div>
            </div>

            <!-- Cancelados -->
            <div class="flex justify-between items-center">
              <span class="text-gray-600">✗ Cancelados</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-300 rounded-full h-2">
                  <div class="h-2 bg-red-500 rounded-full"
                       :style="{ width: percentageCancelled + '%' }"></div>
                </div>
                <span class="font-semibold w-10 text-right">{{ paymentStats.cancelledCount }}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Últimos pagos -->
      <div class="bg-white p-6 rounded-lg shadow mt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-[#2B6D8C]">Últimos Pagos</h2>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ paymentStore.payments.length }} total
          </span>
        </div>

        <div v-if="paymentStore.payments.length" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
            <tr class="bg-[#2B6D8C] text-white">
              <th class="text-left py-3 px-4 font-semibold">ID Pago</th>
              <th class="text-left py-3 px-4 font-semibold">Monto</th>
              <th class="text-left py-3 px-4 font-semibold">Fecha</th>
              <th class="text-left py-3 px-4 font-semibold">Estado</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="p in paymentStore.payments.slice(0, 10)"
                :key="p.id"
                class="border-b hover:bg-blue-50 transition">
              <td class="py-3 px-4 font-semibold text-gray-800">#{{ p.id }}</td>
              <td class="py-3 px-4">
                <span class="font-bold text-lg text-[#2B6D8C]">{{ p.formattedAmount }}</span>
              </td>
              <td class="py-3 px-4 text-gray-600 text-sm">{{ p.formattedDate }}</td>
              <td class="py-3 px-4">
                <span
                    :class="p.displayStatus.color"
                    class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                >
                  <i :class="`pi-${p.displayStatus.icon}`" class="pi text-xs"></i>
                  {{ p.displayStatus.label }}
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-12 text-gray-400">
          <i class="pi pi-inbox text-4xl mb-3 block"></i>
          <p class="text-sm">No hay pagos registrados</p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';
import { useItemsStore } from '@/modules/services/stores/itemStore.js';
import { useServicePerClinicStore } from '@/modules/clinicManagement/stores/servicePerClinicStore.js';
import { useOdontologistStore } from '@/modules/practiceManagement/stores/odontologistStore.js';

// Stores
const paymentStore = usePaymentStore();
const itemsStore = useItemsStore();
const servicePerClinicStore = useServicePerClinicStore();
const odontologistStore = useOdontologistStore();

// Reactive state
const isLoadingAll = ref(true);
const currentDate = ref('');
const clinicId = ref(1);
const servicesPerClinic = ref([]);

const payments = computed(() => paymentStore.payments);

// Computed properties
const paymentStats = computed(() => {
  const all = paymentStore.payments;
  return {
    totalCount: all.length,
    paidCount: all.filter(p => p.isPaid).length,
    pendingCount: all.filter(p => p.isPending).length,
    cancelledCount: all.filter(p => p.isCancelled).length,
  };
});

const totalPayments = computed(() => {
  return paymentStore.payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2);
});

const percentagePaid = computed(() => {
  if (paymentStats.value.totalCount === 0) return 0;
  return Math.round((paymentStats.value.paidCount / paymentStats.value.totalCount) * 100);
});

const percentagePending = computed(() => {
  if (paymentStats.value.totalCount === 0) return 0;
  return Math.round((paymentStats.value.pendingCount / paymentStats.value.totalCount) * 100);
});

const percentageCancelled = computed(() => {
  if (paymentStats.value.totalCount === 0) return 0;
  return Math.round((paymentStats.value.cancelledCount / paymentStats.value.totalCount) * 100);
});

const servicesCount = computed(() => {
  return new Set(servicesPerClinic.value.map(s => s.serviceId)).size;
});

const stockVariations = computed(() => {
  return itemsStore.items.map(item => ({
    id: item.id,
    name: item.name,
    unitTypeName: item.unitTypeName,
    minStock: item.minStock || 0,
    maxStock: item.maxStock || 0,
    variation: (item.maxStock || 0) - (item.minStock || 0),
  })).sort((a, b) => b.variation - a.variation);
});

const itemsVariation = computed(() => {
  if (!itemsStore.items.length) return 0;
  return itemsStore.items.reduce((sum, item) => {
    return sum + ((item.maxStock || 0) - (item.minStock || 0));
  }, 0);
});

const incomeVariation = computed(() => {
  if (paymentStats.value.totalCount === 0) return 0;
  const successRate = (paymentStats.value.paidCount / paymentStats.value.totalCount) * 100;
  return Math.round(successRate - 50); // Variación respecto a 50% base
});

const odontologistCount = computed(() => odontologistStore.odontologists.length);
const itemsCount = computed(() => itemsStore.items.length);
const clinicsCount = computed(() => new Set(servicesPerClinic.value.map(s => s.clinicId)).size);

// Initialization
onMounted(async () => {
  try {
    // Cargar datos en paralelo
    await Promise.all([
      paymentStore.fetchAll().catch(err => console.error('Error pagos:', err)),
      itemsStore.fetchAll().catch(err => console.error('Error items:', err)),
      servicePerClinicStore.fetchAll().catch(err => console.error('Error servicios:', err)),
      odontologistStore.fetchAllByClinic(clinicId.value).catch(err => console.error('Error odontólogos:', err)),
    ]);

    servicesPerClinic.value = servicePerClinicStore.servicesPerClinic || [];

    // Actualizar fecha
    const now = new Date();
    currentDate.value = now.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    console.error('Error cargando dashboard:', err);
  } finally {
    isLoadingAll.value = false;
  }
});
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(43, 109, 140, 0.3);
  border-radius: 3px;
}

/* No animaciones globales */
div { animation: none !important; }

/* Card simple, limpia y uniforme */
.kpi-card {
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: transform .15s ease, box-shadow .15s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.kpi-label {
  color: #4b5563;
  font-size: 0.75rem;
  font-weight: 600;
}
.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2B6D8C;
}
.kpi-icon {
  font-size: 1.8rem;
  color: #2B6D8C;
}

/* métricas grandes */
.metric-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  min-height: 160px;
}
</style>


