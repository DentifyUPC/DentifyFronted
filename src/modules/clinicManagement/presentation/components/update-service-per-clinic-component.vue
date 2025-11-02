<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fadeInUp">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">Actualizar Mano de Obra</h2>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-gray-600 font-medium mb-2" for="price">
            Nuevo monto de mano de obra (S/.)
          </label>
          <input
              id="price"
              type="number"
              v-model.number="totalLaborPrice"
              min="0"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#aacff3]"
          />
        </div>

        <div class="flex justify-center gap-3">
          <button type="button" @click="$emit('close')" class="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button type="submit" class="bg-[#aacff3] text-black px-6 py-2 rounded-lg hover:bg-[#8fc5f0] transition">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useServicePerClinicStore } from "@/modules/clinicManagement/stores/servicePerClinicStore.js";

const props = defineProps({ service: { type: Object, required: true } });
const emit = defineEmits(["close", "updated"]);
const store = useServicePerClinicStore();

const totalLaborPrice = ref(props.service.totalLaborPrice ?? 0);

async function submit() {
  try {
    const updated = await store.updateServicePerClinic(props.service.id, totalLaborPrice.value);
    emit("updated", updated);
    emit("close");
  } catch (err) {
    console.error("❌ Error al actualizar:", err);
    alert("No se pudo actualizar el servicio.");
  }
}
</script>
<style scoped>
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


.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: fadeInUp 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}


.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111827;
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
</style>