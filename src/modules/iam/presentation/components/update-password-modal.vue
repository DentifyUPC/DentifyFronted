<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-xl shadow-lg w-full max-w-xs p-5 animate-fadeIn">

      <!-- Botón cerrar -->
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition">
        <i class="pi pi-times text-lg"></i>
      </button>

      <!-- Título -->
      <h2 class="text-lg font-semibold text-gray-800 mb-4 text-center">
        Cambiar Contraseña
      </h2>

      <!-- Formulario -->
      <form @submit.prevent="handleChangePassword" class="space-y-3">

        <!-- Contraseña actual -->
        <div class="relative">
          <label class="block text-xs text-gray-600 mb-1">Contraseña actual</label>
          <input
              v-model="form.currentPassword"
              :type="showCurrent ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              class="w-full p-2 pr-8 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
          <button
              type="button"
              @click="showCurrent = !showCurrent"
              class="absolute right-2 top-[26px] text-gray-400 hover:text-gray-600 text-xs"
          >
            <i :class="showCurrent ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <!-- Nueva contraseña -->
        <div class="relative">
          <label class="block text-xs text-gray-600 mb-1">Nueva contraseña</label>
          <input
              v-model="form.newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="Nueva contraseña"
              required
              autocomplete="new-password"
              class="w-full p-2 pr-8 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
          <button
              type="button"
              @click="showNew = !showNew"
              class="absolute right-2 top-[26px] text-gray-400 hover:text-gray-600 text-xs"
          >
            <i :class="showNew ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <!-- Confirmar nueva contraseña -->
        <div class="relative">
          <label class="block text-xs text-gray-600 mb-1">Confirmar nueva contraseña</label>
          <input
              v-model="form.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Confirmar contraseña"
              required
              autocomplete="new-password"
              class="w-full p-2 pr-8 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
          <button
              type="button"
              @click="showConfirm = !showConfirm"
              class="absolute right-2 top-[26px] text-gray-400 hover:text-gray-600 text-xs"
          >
            <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-4">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 text-sm transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="bg-[#4a89c5] text-white px-3 py-1.5 rounded-md hover:bg-[#3a75ab] text-sm shadow-sm transition"
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
import { profileApi } from "@/modules/iam/data/datasource/profileApi.js";

const emit = defineEmits(["close", "updated"]);

const form = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});


const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const handleChangePassword = async () => {
  try {
    const { currentPassword, newPassword, confirmPassword } = form.value;

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      oldPassword: currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    };

    await profileApi.updatePassword(payload);

    alert("Contraseña actualizada correctamente");
    emit("updated");
    emit("close");
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    alert("No se pudo actualizar la contraseña. Verifica los datos.");
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

@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
