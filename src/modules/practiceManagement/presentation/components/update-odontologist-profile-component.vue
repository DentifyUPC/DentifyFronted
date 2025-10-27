<template>
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh]"
    >
      <!-- Botón cerrar -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Actualizar información del odontólogo
      </h2>

      <form @submit.prevent="handleUpdate" class="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div>
          <label class="block text-sm text-gray-600 mb-1">N° de Colegiatura</label>
          <input
              v-model="form.professionalLicenseNumber"
              type="text"
              placeholder="Ej. CMP-12345"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Reg. Especialidad</label>
          <input
              v-model="form.specialtyRegistrationNumber"
              type="text"
              placeholder="Ej. RENES-1234"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Especialidad</label>
          <input
              v-model="form.specialty"
              type="text"
              placeholder="Ej. Ortodoncia"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <!-- Campo activo/inactivo -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Estado</label>
          <select
              v-model="form.isActive"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="md:col-span-2 flex justify-end gap-3 mt-6">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { odontologistRepositoryImpl } from "@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js";

const props = defineProps({
  odontologist: { type: Object, required: true },
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
  professionalLicenseNumber: "",
  specialtyRegistrationNumber: "",
  specialty: "",
  serviceId: 1,
  isActive: true,
});

onMounted(() => {
  if (props.odontologist) {
    Object.assign(form.value, {
      gender: props.odontologist.gender || "",
      street: props.odontologist.street || "",
      district: props.odontologist.district || "",
      department: props.odontologist.department || "",
      province: props.odontologist.province || "",
      phoneNumber: props.odontologist.phoneNumber || "",
      professionalLicenseNumber: props.odontologist.professionalLicenseNumber || "",
      specialtyRegistrationNumber: props.odontologist.specialtyRegistrationNumber || "",
      specialty: props.odontologist.specialty || "",
      serviceId: props.odontologist.serviceId || 1,
      isActive: props.odontologist.isActive ?? true,
    });
  }
});

const handleUpdate = async () => {
  try {
    const odontologistId = props.odontologist?.id;
    if (!odontologistId) {
      alert("No se encontró el ID del odontólogo.");
      return;
    }

    const updatedData = await odontologistRepositoryImpl.updateProfile(
        odontologistId,
        form.value
    );

    emit("updated", updatedData); // ← envía los datos actualizados al padre
    alert("Información actualizada correctamente ✅");
    emit("close");
  } catch (error) {
    console.error("❌ Error al actualizar odontólogo:", error);
    alert("Ocurrió un error al guardar los datos.");
  }
};
</script>
<style scoped>
/* Fondo negro translúcido y centrado */
.fixed {
  position: fixed;
  inset: 0;
  z-index: 9999; /* Encima de todo */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.7); /* bg-black bg-opacity-70 */
  backdrop-filter: blur(4px);
  animation: fadeOverlay 0.25s ease-out;
}

/* Caja principal del modal */
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

/* Botón cerrar */
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

/* Animaciones */
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
