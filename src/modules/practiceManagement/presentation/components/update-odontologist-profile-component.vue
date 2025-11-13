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

        <!-- Campo Service (nombre visible, id enviado) -->
        <div>
          <label class="block text-sm text-black mb-1">Servicio</label>
          <select
              v-model.number="form.serviceId"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            <option disabled value="">Selecciona un servicio</option>
            <option
                v-for="service in services"
                :key="service.id"
                :value="service.id"
            >
              {{ service.name }}
            </option>
          </select>
        </div>

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
              class="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="bg-teal-500 text-black px-5 py-2 rounded-lg hover:bg-teal-600 transition"
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
import { servicePerClinicApi } from "@/modules/clinicManagement/data/datasource/servicePerClinicApi.js";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";

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
  serviceId: "",
  isActive: true,
});

const services = ref([]);
const authStore = useAuthStore();

onMounted(async () => {
  // Cargar servicios de la clínica
  try {
    const clinicId = authStore.user?.clinicId;
    if (clinicId) {
      const data = await servicePerClinicApi.getAllByClinic(clinicId);
      services.value = data;
    }
  } catch (e) {
    console.error("❌ Error cargando servicios:", e);
  }

  // Inicializar formulario con los datos del odontólogo
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
      serviceId: props.odontologist.serviceId || "",
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

    emit("updated", updatedData);
    alert("Información actualizada correctamente ✅");
    emit("close");
  } catch (error) {
    console.error("❌ Error al actualizar odontólogo:", error);
    alert("Ocurrió un error al guardar los datos.");
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
}
</style>
