<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition">
        <i class="pi pi-times text-lg"></i>
      </button>

      <h2 class="text-lg font-semibold text-gray-800 mb-5 text-center">
        Crear Cita
      </h2>

      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="block text-xs text-gray-600 mb-1">Turno</label>
          <select
              v-model="selectedShift"
              @change="onShiftChange"
              required
              class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-[#4a89c5] outline-none"
          >
            <option disabled value="">Seleccione un turno</option>
            <option v-for="shift in shifts" :key="shift.name" :value="shift.name">
              {{ shift.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-gray-600 mb-1">Odontólogo</label>
          <select
              v-model="selectedOdontologist"
              :disabled="odontologists.length === 0"
              required
              class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-[#4a89c5] outline-none disabled:bg-gray-100"
          >
            <option disabled value="">Seleccione un odontólogo</option>
            <option v-for="odon in odontologists" :key="odon.id" :value="odon.id">
              {{ odon.fullName }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-gray-600 mb-1">Fecha</label>
          <input
              v-model="form.appointmentDate"
              type="date"
              required
              class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-[#4a89c5] outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Hora de inicio</label>
            <input
                v-model="form.startTime"
                type="time"
                required
                class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-[#4a89c5] outline-none"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-1">Hora de fin</label>
            <input
                v-model="form.endTime"
                type="time"
                required
                class="w-full p-2 rounded-md border border-gray-300 text-gray-800 text-sm focus:ring-1 focus:ring-blue-200 focus:border-[#4a89c5] outline-none"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm text-center mt-2">
          {{ errorMessage }}
        </p>

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
              :disabled="loading"
              class="bg-[#4a89c5] text-white px-3 py-1.5 rounded-md hover:bg-[#3a75ab] text-sm shadow-sm transition"
          >
            {{ loading ? "Guardando..." : "Guardar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";
import { patientApi } from "@/modules/patientAttention/data/datasource/patientApi.js";
import { odontologistRepositoryImpl } from "@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js";
import { appointmentRepositoryImpl } from "@/modules/appointment/data/repositories/appointmentRepositoryImpl.js";

const emit = defineEmits(["close", "created"]);
const authStore = useAuthStore();

const patientId = ref(null);
const clinicId = ref(null);
const loading = ref(false);
const errorMessage = ref("");

const form = ref({
  appointmentDate: "",
  startTime: "",
  endTime: "",
});

const shifts = ref([
  { name: "MORNING" },
  { name: "AFTERNOON" },
  { name: "EVENING" },
  { name: "NIGHT" },
]);

const odontologists = ref([]);
const selectedShift = ref("");
const selectedOdontologist = ref("");

onMounted(async () => {
  try {
    const user = authStore?.user;
    if (!user || !user.id) {
      errorMessage.value = "Usuario no autenticado correctamente.";
      return;
    }

    clinicId.value = user.clinicId ?? null;

    const patient = await patientApi.getByUserId(user.id);
    if (!patient || !patient.id) {
      errorMessage.value = "No se encontró el paciente asociado al usuario.";
      return;
    }
    patientId.value = patient.id;
  } catch (err) {
    console.error("Error inicial obteniendo usuario/paciente:", err);
    errorMessage.value = "No se pudieron obtener los datos del paciente o la clínica.";
  }
});

const onShiftChange = async () => {
  if (!selectedShift.value) return;
  odontologists.value = [];
  try {
    odontologists.value = await odontologistRepositoryImpl.getByShiftName(selectedShift.value);
  } catch (e) {
    console.error("Error cargando odontólogos por turno:", e);
    errorMessage.value = "No se pudieron cargar los odontólogos del turno seleccionado.";
  }
};

const toDDMMYYYY = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const handleCreate = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    if (!patientId.value || !clinicId.value) {
      errorMessage.value = "Faltan datos del paciente o la clínica.";
      return;
    }

    if (!selectedOdontologist.value) {
      errorMessage.value = "Seleccione un odontólogo.";
      return;
    }


    const appointmentDateFormatted = toDDMMYYYY(form.value.appointmentDate);

    const payload = {
      patientId: patientId.value,
      odontologistId: selectedOdontologist.value,
      appointmentDate: appointmentDateFormatted,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      shiftName: selectedShift.value,
      clinicId: clinicId.value,
    };

    console.log("Payload crear cita:", payload);

    await appointmentRepositoryImpl.create(payload);
    emit("created");
    emit("close");
  } catch (error) {
    console.error("Error creando cita:", error);

    const serverMsg = error?.response?.data?.error || error?.response?.data || error.message;
    errorMessage.value = typeof serverMsg === "string" ? serverMsg : "No se pudo crear la cita. Verifique los datos.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
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
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
}
</style>