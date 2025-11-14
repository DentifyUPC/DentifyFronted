<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fadeIn overflow-y-auto max-h-[85vh]">
      <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-xl font-semibold text-teal-700 mb-4 text-center">
        Actualizar información del odontólogo
      </h2>

      <form @submit.prevent="handleUpdate" class="grid grid-cols-1 gap-4">

        <!-- Género -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Género</label>
          <select v-model="form.gender" class="input-field">
            <option value="">Seleccionar</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Femenino</option>
          </select>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input v-model="form.phoneNumber" type="text" placeholder="Ej. 987654321" class="input-field" />
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Calle</label>
          <input v-model="form.street" type="text" placeholder="Ej. Av. Primavera 123" class="input-field" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Distrito</label>
          <input v-model="form.district" type="text" placeholder="Ej. Surco" class="input-field" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Provincia</label>
          <input v-model="form.province" type="text" placeholder="Ej. Lima" class="input-field" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Departamento</label>
          <input v-model="form.department" type="text" placeholder="Ej. Lima" class="input-field" />
        </div>

        <!-- Profesional -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">N° de Colegiatura</label>
          <input v-model="form.professionalLicenseNumber" type="text" placeholder="Ej. CMP-12345" class="input-field" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Reg. Especialidad</label>
          <input v-model="form.specialtyRegistrationNumber" type="text" placeholder="Ej. RENES-1234" class="input-field" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Especialidad</label>
          <input v-model="form.specialty" type="text" placeholder="Ej. Ortodoncia" class="input-field" />
        </div>

        <!-- Servicio -->
        <div>
          <label class="block text-sm text-black mb-1">Servicio</label>
          <select v-model.number="form.serviceId" class="input-field">
            <option disabled value="">Selecciona un servicio</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </div>

        <!-- Turno -->
        <div>
          <label class="block text-sm text-black mb-1">Turno</label>
          <select v-model="form.shiftName" class="input-field">
            <option disabled value="">Selecciona un turno</option>
            <option v-for="shift in shifts" :key="shift.id" :value="shift.name">
              {{ shift.displayName || shift.name }}
            </option>
          </select>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Estado</label>
          <select v-model="form.isActive" class="input-field">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mt-4">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-500 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { odontologistRepositoryImpl } from "@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js";
import { servicePerClinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/servicePerClinicRepositoryImpl.js";
import { shiftRepositoryImpl } from "@/modules/clinicManagement/data/repositories/shiftRepositoryImpl.js";
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
  shiftName: "",
  isActive: true,
});

const services = ref([]);
const shifts = ref([]);
const authStore = useAuthStore();

onMounted(async () => {
  await loadData();
  if (props.odontologist) Object.assign(form.value, props.odontologist);
});

const loadData = async () => {
  try {
    const clinicId = authStore.user?.clinicId;
    if (!clinicId) return;

    // Servicios
    try {
      const dataServices = await servicePerClinicRepositoryImpl.getAllByClinic(clinicId);
      services.value = Array.isArray(dataServices) ? dataServices : [];
    } catch (err) {
      console.warn("⚠️ No se encontraron servicios para la clínica:", err.message);
      services.value = [];
    }

    // Turnos
    try {
      const dataShifts = await shiftRepositoryImpl.getAllByClinic(clinicId);
      shifts.value = Array.isArray(dataShifts) ? dataShifts : [];
    } catch (err) {
      console.warn("⚠️ No se encontraron turnos para la clínica:", err.message);
      shifts.value = [];
    }

  } catch (e) {
    console.error("Error cargando servicios o turnos:", e);
  }
};

const handleUpdate = async () => {
  try {
    const odontologistId = props.odontologist?.id;
    if (!odontologistId) return alert("No se encontró el ID del odontólogo");

    const updatedData = await odontologistRepositoryImpl.updateProfile(
        odontologistId,
        form.value
    );

    emit("updated", updatedData);
    alert("Información actualizada correctamente");
    emit("close");
  } catch (error) {
    console.error("Error al actualizar odontólogo:", error);
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
