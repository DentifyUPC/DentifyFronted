<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
    <div class="w-full max-w-3xl">
      <!-- Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-semibold text-[#2B6D8C]">Servicios de la Clínica</h1>
        <button
            @click="openServiceList"
            class="bg-[#aacff3] text-black px-4 py-2 rounded-md hover:bg-[#8fc5f0] transition"
        >
          Agregar servicios
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando servicios de la clínica...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-lg text-center py-10">
        ❌ Error al cargar los servicios: {{ error }}
      </div>

      <!-- Lista -->
      <div
          v-else
          class="bg-white rounded-2xl shadow-md divide-y divide-gray-200 overflow-hidden"
      >
        <div
            v-for="svc in services"
            :key="svc.id"
            class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
                class="flex items-center justify-center bg-[#aacff3]/10 rounded-full flex-shrink-0"
                style="width:42px;height:42px;"
            >
              <i class="pi pi-briefcase text-[#2B6D8C] text-lg"></i>
            </div>
            <div class="truncate min-w-0">
              <p
                  class="text-gray-800 font-medium text-lg truncate"
                  :title="svc.displayNameSC()"
              >
                {{ svc.displayNameSC() }}
              </p>
              <p class="text-sm text-gray-500 mt-0.5">
                Total:
                <span class="font-semibold text-gray-800">
                  {{ formatMoney(svc.totalServicePrice) }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
                @click="openUpdateModal(svc)"
                class="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition"
            >
              Actualizar datos
            </button>
            <button
                @click="openDetailsModal(svc)"
                class="text-[#2B6D8C] hover:text-[#1E4F67] text-sm font-semibold transition"
            >
              Ver detalles
            </button>
          </div>
        </div>

        <div v-if="!services.length" class="p-6 text-center text-gray-500">
          No hay servicios asociados a la clínica.
        </div>
      </div>
    </div>

    <!-- Modales -->
    <ServiceListComponent v-if="showServiceList" @close="showServiceList = false" />

    <UpdateServicePerClinicComponent
        v-if="showUpdate"
        :service="serviceToUpdate"
        @close="showUpdate = false"
        @updated="handleServiceUpdated"
    />

    <!-- 🟦 Modal pequeño centrado -->
    <div
        v-if="showDetails"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div
          class="bg-white rounded-xl shadow-xl w-[90%] max-w-xs p-5 relative animate-fadeIn"
      >
        <button
            @click="showDetails = false"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <i class="pi pi-times"></i>
        </button>

        <h2 class="text-lg font-semibold text-[#2B6D8C] mb-3 text-center">
          Detalles
        </h2>

        <div class="space-y-2 text-gray-700 text-sm">
          <p><strong>Nombre:</strong> {{ selectedService?.displayNameSC() }}</p>
          <p><strong>Items:</strong> {{ selectedService?.totalPricePerItems || '—' }}</p>
          <p><strong>Mano de obra:</strong> {{ selectedService?.totalLaborPrice || '—' }}</p>
          <p><strong>Total:</strong> {{ formatMoney(selectedService?.totalServicePrice) }}</p>
        </div>

        <div class="mt-4 text-center">
          <button
              @click="showDetails = false"
              class="bg-[#aacff3] text-black px-4 py-1.5 rounded-md hover:bg-[#8fc5f0] transition text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { useServicePerClinicStore } from '@/modules/clinicManagement/stores/servicePerClinicStore.js';
import ServiceListComponent from '@/modules/services/presentation/components/service-list-component.vue';
import UpdateServicePerClinicComponent from '@/modules/clinicManagement/presentation/components/update-service-per-clinic-component.vue';

const authStore = useAuthStore();
const clinicId = authStore.user?.clinicId ?? null;
const store = useServicePerClinicStore();

const services = ref([]);
const isLoading = ref(true);
const error = ref(null);

const showServiceList = ref(false);
const showUpdate = ref(false);
const showDetails = ref(false);

const serviceToUpdate = ref(null);
const selectedService = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    if (!clinicId) throw new Error('No clinic found for user');
    const data = await store.fetchServicesByClinic(clinicId);
    services.value = data;
  } catch (err) {
    console.error('❌ Error cargando services-per-clinic:', err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
});

const openServiceList = () => (showServiceList.value = true);
const openUpdateModal = (svc) => {
  serviceToUpdate.value = svc;
  showUpdate.value = true;
};
const openDetailsModal = (svc) => {
  selectedService.value = svc;
  showDetails.value = true;
};
const handleServiceUpdated = (updated) => {
  services.value = services.value.map((s) => (s.id === updated.id ? updated : s));
};
const formatMoney = (v) => {
  if (v == null) return '-';
  return Number(v).toFixed(2);
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

.fixed {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(3px);
}
</style>
