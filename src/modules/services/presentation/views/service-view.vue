<template>
  <div class="p-8 bg-[#AACFF3] min-h-screen flex justify-center items-start">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 mt-10">
      <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">
        Servicios Disponibles
      </h1>

      <!-- Lista de servicios base -->
      <ServiceList @selectService="selectService" />

      <!-- Ítems requeridos y acción -->
      <div v-if="selectedService" class="mt-8 border-t pt-6">
        <h2 class="text-xl font-bold text-gray-700 mb-2">
          {{ selectedService.name }}
        </h2>

        <ItemsPerService :serviceId="selectedService.id" />

        <div class="flex justify-end mt-4">
          <button
              @click="addServiceToClinic"
              :disabled="isSaving"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ isSaving ? 'Agregando...' : 'Agregar servicio a clínica' }}
          </button>
        </div>
      </div>

      <!-- Servicios ya registrados -->
      <div v-if="clinicServices.length" class="mt-10 border-t pt-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Servicios registrados en esta clínica
        </h2>
        <ClinicServicesList :services="clinicServicesWithNames" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ServiceList from '../components/service-list-component.vue';
import ItemsPerService from '../components/item-per-service-list-component.vue';
import ClinicServicesList from '../components/service-list-component.vue';
import { useServicePerClinicStore } from '@/modules/clinicManagement/stores/servicePerClinicStore.js';
import { useItemPerClinicStore } from '@/modules/clinicManagement/stores/itemPerClinicStore.js';
import { useItemPerServiceStore } from '@/modules/services/stores/itemPerServiceStore.js';
import { serviceStore } from '@/modules/services/stores/serviceStore.js';

const servicePerClinicStore = useServicePerClinicStore();
const itemPerClinicStore = useItemPerClinicStore();
const itemPerServiceStore = useItemPerServiceStore();
const servicesCatalog = serviceStore();

const selectedService = ref(null);
const isSaving = ref(false);
const clinicId = 1; // TODO: Reemplazar con userStore.user.clinicId

const selectService = (service) => {
  selectedService.value = service;
};

// 🔹 Cargar servicios existentes en la clínica
const clinicServices = ref([]);

const loadClinicServices = async () => {
  try {
    const res = await servicePerClinicStore.fetchAllByClinic(clinicId);
    clinicServices.value = res || [];
    console.log('✅ Servicios cargados:', res);
  } catch (e) {
    console.error('❌ Error cargando servicios de la clínica:', e);
  }
};


// 🔹 Mostrar nombre del servicio en la lista
const clinicServicesWithNames = computed(() =>
    clinicServices.value.map((svc) => {
      const base = servicesCatalog.services.find(s => s.id === svc.serviceId);
      return {
        ...svc,
        serviceName: base?.name || `Servicio #${svc.serviceId}`,
      };
    })
);

// 🔹 Agregar servicio validando stock
const addServiceToClinic = async () => {
  if (!selectedService.value) return;

  isSaving.value = true;

  await itemPerClinicStore.fetchAllByClinic(clinicId);
  const inventory = itemPerClinicStore.items;
  const requiredItems = itemPerServiceStore.items;

  const missing = requiredItems.filter(req => {
    const found = inventory.find(i => i.itemName === req.name);
    return !found || found.quantity < req.quantityRequired;
  });

  if (missing.length > 0) {
    alert(
        '❌ No hay stock suficiente para agregar el servicio.\nFaltan:\n' +
        missing.map(m => `- ${m.name} (${m.quantityRequired})`).join('\n')
    );
    isSaving.value = false;
    return;
  }

  try {
    await servicePerClinicStore.createServicePerClinic({
      clinicId,
      serviceId: selectedService.value.id,
      totalLaborPrice: 200,
    });
    alert('✅ Servicio agregado correctamente.');
    await loadClinicServices();
  } catch (err) {
    alert('❌ No se pudo agregar: ' + (err.response?.data?.message || err.message));
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await servicesCatalog.fetchAll();
  await loadClinicServices();
});

</script>
