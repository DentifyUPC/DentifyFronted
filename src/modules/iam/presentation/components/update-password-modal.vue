<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 animate-fadeIn">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Cambiar Contraseña
      </h2>

      <form @submit.prevent="handleUpdatePassword" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Contraseña Actual</label>
          <input v-model="form.oldPassword" type="password" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"/>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Nueva Contraseña</label>
          <input v-model="form.newPassword" type="password" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"/>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Confirmar Nueva Contraseña</label>
          <input v-model="form.confirmNewPassword" type="password" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"/>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500">
            Cancelar
          </button>
          <button type="submit" class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700">
            Cambiar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authRepositoryImpl } from "@/modules/iam/data/repositories/authRepositoryImpl.js";

const emit = defineEmits(["close"]);

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const handleUpdatePassword = async () => {
  if (form.value.newPassword !== form.value.confirmNewPassword) {
    alert("❌ Las contraseñas no coinciden.");
    return;
  }

  try {
    await authRepositoryImpl.updatePassword(form.value);
    alert("✅ Contraseña actualizada correctamente");
    emit("close");
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    alert("Ocurrió un error al cambiar la contraseña.");
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
