<template>
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh] flex flex-col"
    >
      <!-- Cerrar -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        {{ patient ? "Actualizar información del paciente" : "Completar información del paciente" }}
      </h2>

      <form
          @submit.prevent="handleUpdate"
          class="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        <div>
          <label class="block text-sm text-gray-600 mb-1">Género</label>
          <select
              v-model="form.gender"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>

          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input
              v-model="form.phoneNumber"
              type="text"
              placeholder="Número de teléfono"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Calle</label>
          <input
              v-model="form.street"
              type="text"
              placeholder="Ej. Av. Primavera 123"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Distrito</label>
          <input
              v-model="form.district"
              type="text"
              placeholder="Distrito"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Provincia</label>
          <input
              v-model="form.province"
              type="text"
              placeholder="Provincia"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Departamento</label>
          <input
              v-model="form.department"
              type="text"
              placeholder="Departamento"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <!-- Botones -->
        <div class="md:col-span-2 flex justify-end gap-3 mt-6">
          <PvButton
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              @click="$emit('close')"
              class="bg-gray-400 border-none hover:bg-gray-500 text-white"
          />
          <PvButton
              type="submit"
              label="Guardar cambios"
              icon="pi pi-check"
              class="bg-teal-600 border-none hover:bg-teal-700 text-white"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { patientRepositoryImpl } from "@/modules/patientAttention/data/repositories/patientRepositoryImpl.js";


const props = defineProps({
  patient: { type: Object, default: null },
  userProfile: { type: Object, required: true },
});
const emit = defineEmits(["close", "updated"]);

const form = ref({
  gender: "",
  street: "",
  district: "",
  department: "",
  province: "",
  phoneNumber: "",
});

onMounted(() => {
  if (props.patient) {
    form.value.gender = props.patient.gender || "";
    form.value.street = props.patient.street || "";
    form.value.district = props.patient.district || "";
    form.value.department = props.patient.department || "";
    form.value.province = props.patient.province || "";
    form.value.phoneNumber = props.patient.phoneNumber || "";
  }
});

const handleUpdate = async () => {
  try {
    const patientId = props.patient?.id;

    if (!patientId) {
      alert("No se encontró el ID del paciente. Recarga la página e inténtalo nuevamente.");
      return;
    }

    const payload = { ...form.value };

    await patientRepositoryImpl.updateProfile(patientId, payload);

    emit("updated");
    alert("Información actualizada correctamente ✅");
    emit("close");
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    alert("Ocurrió un error al guardar los datos del paciente.");
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

