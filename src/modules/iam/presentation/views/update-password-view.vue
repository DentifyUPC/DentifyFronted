<template>
  <div class="update-password-container">
    <PvCard class="p-4 shadow-3 w-full md:w-5 lg:w-4 mx-auto">
      <h2 class="text-center mb-3">Actualizar Contraseña</h2>

      <div class="p-fluid">
        <div class="p-field mb-3">
          <label>Contraseña Actual</label>
          <PvPassword v-model="form.oldPassword" toggleMask feedback="false" />
        </div>

        <div class="p-field mb-3">
          <label>Nueva Contraseña</label>
          <PvPassword v-model="form.newPassword" toggleMask />
        </div>

        <div class="p-field mb-3">
          <label>Confirmar Nueva Contraseña</label>
          <PvPassword v-model="form.confirmPassword" toggleMask />
        </div>

        <div class="flex justify-content-end mt-4">
          <PvButton
              label="Actualizar"
              icon="pi pi-lock"
              :loading="loading"
              @click="onUpdatePassword"
          />
        </div>
      </div>
    </PvCard>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { UpdatePasswordUseCase } from '../../domain/usecases/updatePasswordUseCase'
import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl'

const loading = ref(false)
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const updatePasswordUseCase = new UpdatePasswordUseCase(authRepositoryImpl)

const onUpdatePassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    loading.value = true
    await updatePasswordUseCase.execute(form)
    alert('Contraseña actualizada correctamente')
  } catch (e) {
    alert('Error al actualizar contraseña')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.update-password-container {
  padding: 2rem;
}
</style>
