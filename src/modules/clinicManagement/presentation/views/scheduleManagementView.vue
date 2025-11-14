<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-[#2B6D8C] mb-8 text-center">
        Gestion de Horarios y Turnos
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-[#aacff3]/20 p-3 rounded-full">
              <i class="pi pi-clock text-[#2B6D8C] text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Horario de la Clinica</h2>
              <p class="text-sm text-gray-500">Configura el horario general</p>
            </div>
          </div>
          <button
              @click="openScheduleModal"
              class="w-full bg-[#aacff3] text-black px-4 py-2 rounded-lg hover:bg-[#8fc5f0] transition font-medium"
          >
            Administrar Horario
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-[#aacff3]/20 p-3 rounded-full">
              <i class="pi pi-calendar text-[#2B6D8C] text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Turnos de la Clinica</h2>
              <p class="text-sm text-gray-500">Gestiona los turnos disponibles</p>
            </div>
          </div>
          <button
              @click="openShiftsModal"
              class="w-full bg-[#aacff3] text-black px-4 py-2 rounded-lg hover:bg-[#8fc5f0] transition font-medium"
          >
            Administrar Turnos
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Citas Agendadas</h2>
        <p class="text-gray-500 text-center py-10">Proximamente: Vista de citas agendadas</p>
      </div>
    </div>

    <SchedulePerClinicManagementComponent
        v-if="showScheduleModal"
        @close="showScheduleModal = false"
    />

    <ShiftManagementComponent
        v-if="showShiftsModal"
        @close="showShiftsModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SchedulePerClinicManagementComponent from '@/modules/clinicManagement/presentation/components/schedule-per-clinic-management-component.vue';
import ShiftManagementComponent from '@/modules/clinicManagement/presentation/components/shift-management-component.vue';

const showScheduleModal = ref(false);
const showShiftsModal = ref(false);

const openScheduleModal = () => {
  showScheduleModal.value = true;
};

const openShiftsModal = () => {
  showShiftsModal.value = true;
};
</script>