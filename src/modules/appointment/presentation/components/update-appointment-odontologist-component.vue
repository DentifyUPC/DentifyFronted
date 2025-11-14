<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fadeInUp">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        Actualizar Estado de Cita
      </h2>

      <div class="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
        <p><strong>ID:</strong> {{ appointment.id }}</p>
        <p><strong>Fecha:</strong> {{ appointment.formattedDate }}</p>
        <p><strong>Horario:</strong> {{ appointment.timeRange }}</p>
        <p><strong>Turno:</strong> {{ appointment.shiftName }}</p>
        <p><strong>Paciente:</strong> {{ appointment.patientFullName }}</p>
        <p><strong>Estado actual:</strong> <span class="font-semibold">{{ appointment.state }}</span></p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm text-gray-600 mb-2">Nuevo Estado</label>
          <select
              v-model="form.state"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6D8C]"
          >
            <option value="PENDING">Pendiente</option>
            <option value="ASSISTED">Asistio</option>
            <option value="ABSENT">Ausente</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">Estado seleccionado: {{ form.state }}</p>
        </div>

        <div v-if="validationError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {{ validationError }}
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-[#2B6D8C] text-white px-6 py-2 rounded-lg hover:bg-[#1E4F67] transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '@/modules/appointment/stores/appointmentStore.js';

const props = defineProps({
  appointment: { type: Object, required: true },
});

const emit = defineEmits(['close', 'updated']);
const appointmentStore = useAppointmentStore();

const form = ref({
  state: '',
});

const isSubmitting = ref(false);
const validationError = ref(null);

onMounted(() => {
  console.log('=== COMPONENT MOUNTED ===');
  console.log('Appointment completo:', props.appointment);
  console.log('Appointment ID:', props.appointment.id);
  console.log('Appointment state actual:', props.appointment.state);

  form.value.state = props.appointment.state || 'PENDING';
});

const handleSubmit = async () => {
  validationError.value = null;

  console.log('=== HANDLE SUBMIT ===');
  console.log('Appointment ID:', props.appointment.id);
  console.log('Estado a enviar:', form.value.state);

  if (!props.appointment.id) {
    validationError.value = 'ID de cita no valido';
    console.error('ERROR: Appointment ID es undefined o null');
    return;
  }

  if (!['PENDING', 'ASSISTED', 'ABSENT'].includes(form.value.state)) {
    validationError.value = 'Estado no valido. Debe ser PENDING, ASSISTED o ABSENT';
    console.error('ERROR: Estado invalido:', form.value.state);
    return;
  }

  try {
    isSubmitting.value = true;

    const payload = {
      state: form.value.state,
    };

    console.log('Payload final:', payload);

    await appointmentStore.updateAppointment(props.appointment.id, payload);

    alert('Estado de cita actualizado exitosamente');
    emit('updated');
  } catch (error) {
    console.error('=== ERROR EN SUBMIT ===');
    console.error('Error completo:', error);
    console.error('Error response:', error.response);
    console.error('Error response data:', error.response?.data);

    validationError.value = error.response?.data?.error || error.message || 'Error al actualizar estado';
  } finally {
    isSubmitting.value = false;
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