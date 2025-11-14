<template>
  <div class="min-h-screen bg-[#E6F0FA] flex flex-col items-center py-10 px-6">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-[#2B6D8C]">Inventario de la Clínica</h1>
        <button
            @click="showAddModal = true"
            class="bg-[#2B6D8C] hover:bg-[#1E4F67] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          + Agregar Ítem
        </button>
      </div>

      <div v-if="store.isLoading || itemsStore.isLoading" class="text-center text-gray-500 py-4">
        Cargando inventario...
      </div>

      <div v-else-if="store.error || itemsStore.error" class="text-center text-gray-500 py-4">
        No tiene itemes agregado, agregue uno
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-[#AACFF3] text-[#2B6D8C]">
        <tr>
          <th class="py-3 px-4">Nombre del Ítem</th>
          <th class="py-3 px-4">Stock</th>
          <th class="py-3 px-4">Precio</th>
          <th class="py-3 px-4">Unidad</th>
          <th class="py-3 px-4 text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in inventoryWithNames"
            :key="item.id"
            class="border-b hover:bg-[#F8FBFF] transition"
        >
          <td class="py-3 px-4 font-medium text-gray-800">{{ item.itemName }}</td>
          <td class="py-3 px-4 text-gray-600">{{ item.stockInfo }}</td>
          <td class="py-3 px-4 text-gray-700 font-semibold">{{ item.priceFormatted }}</td>
          <td class="py-3 px-4 text-gray-500">{{ item.unitTypeName }}</td>
          <td class="py-3 px-4 text-center">
            <button
                @click="openUpdateModal(item)"
                class="bg-[#2B6D8C] text-white px-3 py-1 rounded-lg hover:bg-[#1E4F67] transition"
            >
              Editar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modales -->
    <AddItemModal
        v-if="showAddModal"
        :visible="showAddModal"
        :clinic-id="clinicId"
        @close="showAddModal = false"
    />

    <UpdateItemModal
        v-if="showUpdateModal"
        :visible="showUpdateModal"
        :item="selectedItem"
        @close="showUpdateModal = false"
        @updated="refreshData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useItemPerClinicStore } from "@/modules/clinicManagement/stores/itemPerClinicStore.js";
import { useItemsStore } from "@/modules/services/stores/itemStore.js";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";
import AddItemModal from "@/modules/clinicManagement/presentation/components/add-item-component.vue";
import UpdateItemModal from "@/modules/clinicManagement/presentation/components/update-item-component.vue";

const store = useItemPerClinicStore();
const itemsStore = useItemsStore();
const authStore = useAuthStore();

const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedItem = ref(null);

const clinicId = computed(() => authStore.user?.clinicId ?? null);

async function refreshData() {
  await store.fetchAllByClinic(clinicId.value);
}

function openUpdateModal(item) {
  selectedItem.value = item;
  showUpdateModal.value = true;
}

onMounted(async () => {
  if (!clinicId.value) {
    console.warn("⚠️ No se encontró clinicId en el usuario logueado");
    return;
  }

  await Promise.all([store.fetchAllByClinic(clinicId.value), itemsStore.fetchAll()]);
});

const inventoryWithNames = computed(() =>
    store.items.map((item) => {
      const relatedItem = itemsStore.items.find((it) => Number(it.id) === Number(item.itemId));

      return {
        ...item,
        itemName: relatedItem?.name || `Item #${item.itemId}`,
        unitTypeName: relatedItem?.unitType || "—",
        priceFormatted: `S/. ${Number(item.price ?? 0).toFixed(2)}`,
        stockInfo: `${item.availableStock ?? 0}/${item.minimumStock ?? 0}`,
      };
    })
);
</script>
