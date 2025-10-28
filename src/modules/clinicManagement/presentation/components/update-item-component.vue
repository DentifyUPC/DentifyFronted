<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
      <h2 class="text-2xl font-bold text-[#2B6D8C] mb-6 text-center">
        Actualizar Ítem del Inventario
      </h2>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
          <input
              v-model.number="form.availableStock"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#AACFF3]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
          <input
              v-model.number="form.minimumStock"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#AACFF3]"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
        <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#AACFF3]"
        />
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Cancelar</button>
        <button
            @click="updateItem"
            class="px-4 py-2 rounded-lg bg-[#2B6D8C] text-white hover:bg-[#1E4F67]"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useItemPerClinicStore } from "@/modules/clinicManagement/stores/itemPerClinicStore.js";

const props = defineProps({
  visible: Boolean,
  item: Object, // itemPerClinic completo
});
const emit = defineEmits(["close", "updated"]);

const store = useItemPerClinicStore();

const form = reactive({
  availableStock: 0,
  minimumStock: 0,
  price: 0,
});


watch(
    () => props.item,
    (newVal) => {
      if (newVal) {
        form.availableStock = newVal.availableStock;
        form.minimumStock = newVal.minimumStock;
        form.price = newVal.price;
      }
    },
    { immediate: true }
);

async function updateItem() {
  try {
    await store.updateItem(props.item.id, {
      availableStock: form.availableStock,
      minimumStock: form.minimumStock,
      price: form.price,
    });
    emit("updated");
    emit("close");
  } catch (err) {
    console.error("❌ Error al actualizar ítem:", err);
  }
}
</script>
