<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-xl shadow-lg w-full max-w-xs p-5 animate-fadeIn">

      <!-- Cerrar -->
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition">
        <i class="pi pi-times text-lg"></i>
      </button>

      <!-- Título -->
      <h2 class="text-lg font-semibold text-gray-800 mb-4 text-center">
        Actualizar Información
      </h2>

      <!-- Formulario -->
      <form @submit.prevent="handleUpdate" class="space-y-3">
        <div>
          <label class="block text-xs text-gray-600 mb-1">Nombre</label>
          <input
              v-model="form.firstName"
              type="text"
              placeholder="Tu nombre"
              class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs text-gray-600 mb-1">Apellido</label>
          <input
              v-model="form.lastName"
              type="text"
              placeholder="Tu apellido"
              class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-3">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 text-sm transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm shadow-sm transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";

const emit = defineEmits(["close", "updated"]);
const form = ref({ firstName: "", lastName: "" });

const handleUpdate = async () => {
  try {
    const updated = await authRepositoryImpl.updateInformation(form.value);
    alert("✅ Información actualizada correctamente");
    emit("updated", updated);
  } catch (error) {
    console.error("❌ Error al actualizar información:", error);
    alert("Ocurrió un error al actualizar los datos.");
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
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
