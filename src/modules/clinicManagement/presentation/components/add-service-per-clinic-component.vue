<template>
  <div
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fadeInUp"
    >
      <!-- Botón cerrar -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        Agregar Servicio a Clínica
      </h2>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label
              class="block text-gray-600 font-medium mb-2"
              for="totalLaborPrice"
          >
            Monto total de mano de obra (S/.)
          </label>
          <input
              id="totalLaborPrice"
              type="number"
              min="0"
              step="0.01"
              v-model="totalLaborPrice"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B6D8C]"
              placeholder="Ejemplo: 150.00"
              required
          />
        </div>

        <!-- Mensajes -->
        <p v-if="error" class="text-red-500 text-sm text-center">
          ❌ {{ error }}
        </p>
        <p v-if="success" class="text-green-600 text-sm text-center">
          ✅ Servicio agregado correctamente
        </p>

        <!-- Botón -->
        <div class="flex justify-center">
          <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#2B6D8C] text-white px-6 py-2 rounded-lg hover:bg-[#1E4F67] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
            {{ isLoading ? "Agregando..." : "Agregar Servicio" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { servicePerClinicRepositoryImpl } from "../../data/repositories/servicePerClinicRepositoryImpl.js";

const emit = defineEmits(["close", "added"]);

const props = defineProps({
  clinicId: { type: Number, required: true },
  serviceId: { type: Number, required: true },
});

const totalLaborPrice = ref("");
const isLoading = ref(false);
const error = ref(null);
const success = ref(false);

const handleSubmit = async () => {
  if (!totalLaborPrice.value || totalLaborPrice.value <= 0) {
    error.value = "El monto debe ser mayor que 0.";
    return;
  }

  isLoading.value = true;
  error.value = null;
  success.value = false;

  try {
    await servicePerClinicRepositoryImpl.create({
      clinicId: props.clinicId,
      serviceId: props.serviceId,
      totalLaborPrice: parseFloat(totalLaborPrice.value),
    });

    success.value = true;
    setTimeout(() => {
      success.value = false;
      emit("added");
      emit("close");
    }, 1200);
  } catch (err) {
    console.error("❌ Error al agregar servicio a clínica:", err);
    error.value = err.response?.data?.message || "No se pudo agregar el servicio.";
  } finally {
    isLoading.value = false;
  }
};
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
