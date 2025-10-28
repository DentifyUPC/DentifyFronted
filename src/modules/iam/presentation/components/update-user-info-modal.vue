<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 animate-fadeIn">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Actualizar Información
      </h2>

      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nombre</label>
          <input v-model="form.firstName" type="text" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"/>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Apellido</label>
          <input v-model="form.lastName" type="text" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"/>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500">
            Cancelar
          </button>
          <button type="submit" class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700">
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
