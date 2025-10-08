import { defineStore } from 'pinia'
import api from '@/core/network/api.js'

export const useItemPerServiceStore = defineStore('itemPerService', {
    state: () => ({
        items: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchByService(serviceId) {
            this.isLoading = true
            this.error = null

            try {
                // ✅ Usa el cliente global 'api' que ya incluye el token en headers
                const { data } = await api.get(`/items-per-services/${serviceId}`)

                this.items = data
            } catch (err) {
                console.error('❌ Error al obtener ítems por servicio:', err)
                this.error = err.response?.data?.error || err.message
                this.items = []
            } finally {
                this.isLoading = false
            }
        }
    }
})
