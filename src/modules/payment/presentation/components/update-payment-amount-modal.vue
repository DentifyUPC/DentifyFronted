<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fadeIn">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          :disabled="isSubmitting"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-bold text-[#2B6D8C] mb-6">
        Actualizar Monto del Pago
      </h2>

      <!-- Payment Info -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">ID de Pago:</span>
          <span class="font-semibold text-gray-800">#{{ payment.id }}</span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Cita:</span>
          <span class="font-semibold text-gray-800">#{{ payment.appointmentId }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Monto actual:</span>
          <span class="text-xl font-bold text-gray-800">{{ payment.formattedAmount }}</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nuevo Monto (S/.)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/.</span>
            <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6D8C] focus:border-transparent text-lg font-semibold"
            />
          </div>
          <p class="text-xs text-gray-500 mt-2">
            El monto debe ser mayor a S/. 0.00
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="validationError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-start gap-2">
          <i class="pi pi-exclamation-circle mt-0.5"></i>
          <span>{{ validationError }}</span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
              type="button"
              @click="$emit('close')"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="px-6 py-2 bg-[#2B6D8C] text-white rounded-lg hover:bg-[#1E4F67] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            <span>{{ isSubmitting ? 'Actualizando...' : 'Actualizar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePaymentStore } from '@/modules/payment/stores/paymentStore.js';

const props = defineProps({
  payment: { type: Object, required: true },
});

const emit = defineEmits(['close', 'updated']);

const paymentStore = usePaymentStore();

const form = ref({
  amount: 0,
});

const isSubmitting = ref(false);
const validationError = ref(null);

const isFormValid = computed(() => {
  return form.value.amount > 0;
});

onMounted(() => {
  form.value.amount = props.payment.amount;
});

const handleSubmit = async () => {
  validationError.value = null;

  // Validaciones
  if (form.value.amount <= 0) {
    validationError.value = 'El monto debe ser mayor a S/. 0.00';
    return;
  }

  if (form.value.amount === props.payment.amount) {
    validationError.value = 'El nuevo monto debe ser diferente al actual';
    return;
  }

  try {
    isSubmitting.value = true;

    console.log('Actualizando monto del pago:', {
      paymentId: props.payment.id,
      newAmount: form.value.amount,
      oldAmount: props.payment.amount,
    });

    await paymentStore.updateAmount(props.payment.id, form.value.amount);

    alert('Monto actualizado exitosamente');
    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Error actualizando monto:', error);
    validationError.value = error.message || 'Error al actualizar el monto del pago';
  } finally {
    isSubmitting.value = false;
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