import { reactive } from 'vue'
import { LoginUseCase } from '../../domain/usecases/loginUseCase'
import { RegisterPatientUseCase } from '../../domain/usecases/registerPatientUseCase'
import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl'

export const authState = reactive({
    user: null,
    loading: false,
    error: null,
})

const loginUseCase = new LoginUseCase(authRepositoryImpl)
const registerUseCase = new RegisterPatientUseCase(authRepositoryImpl)

export const authViewModel = {
    async login(username, password) {
        try {
            authState.loading = true
            const response = await loginUseCase.execute(username, password)
            authState.user = response
            localStorage.setItem('token', response.accessToken)
            return response
        } catch (e) {
            authState.error = e.message
            throw e
        } finally {
            authState.loading = false
        }
    },

    async registerPatient(payload) {
        try {
            authState.loading = true
            const response = await registerUseCase.execute(payload)
            authState.user = response
            return response
        } catch (e) {
            authState.error = e.message
            throw e
        } finally {
            authState.loading = false
        }
    },
}
