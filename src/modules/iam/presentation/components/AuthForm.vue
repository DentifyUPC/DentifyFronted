<template>
  <form @submit.prevent="submitForm" class="p-fluid">
    <div class="p-field mb-3">
      <label for="username">Usuario</label>
      <PvInputText id="username" v-model="form.username" required />
    </div>

    <div class="p-field mb-3">
      <label for="password">Contraseña</label>
      <PvPassword id="password" v-model="form.password" toggleMask required />
    </div>

    <template v-if="mode === 'register'">
      <div class="p-field mb-3">
        <label for="email">Correo</label>
        <PvInputText id="email" v-model="form.email" type="email" required />
      </div>

      <div class="p-field mb-3">
        <label for="fullName">Nombre Completo</label>
        <PvInputText id="fullName" v-model="form.fullName" required />
      </div>
    </template>

    <div class="mt-4">
      <PvButton
          :label="mode === 'login' ? 'Iniciar Sesión' : 'Registrar'"
          icon="pi pi-sign-in"
          :loading="loading"
          type="submit"
          class="w-full"
      />
    </div>

    <div v-if="error" class="text-red-500 text-sm mt-2 text-center">
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'login' }, // 'login' | 'register'
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['submit'])

const form = reactive({
  username: '',
  password: '',
  email: '',
  fullName: '',
})

const submitForm = () => {
  emit('submit', { ...form })
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
