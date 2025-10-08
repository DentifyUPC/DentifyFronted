import { defineStore } from 'pinia';
import { TokenStorage } from '@/core/network/tokenStorage.js';
import { authRepositoryImpl } from '../data/repositories/authRepositoryImpl.js';

const USER_KEY = 'user';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
        error: null,
        isLoading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user?.accessToken,
    },

    actions: {
        async login(username, password) {
            try {
                this.isLoading = true;
                this.error = null;

                const user = await authRepositoryImpl.login(username, password);

                if (user?.accessToken) {
                    this.setUser(user);
                    return true;
                } else {
                    this.logout();
                    throw new Error('Login inválido: no se recibió token');
                }
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    error.message ||
                    'Error al iniciar sesión';
                this.user = null;
                this.logout();
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async registerPatient(payload) {
            try {
                await authRepositoryImpl.registerPatient(payload);
                return true;
            } catch (error) {
                console.error("❌ Error en registro:", error);
                return false;
            }
        },

        setUser(userData) {
            this.user = userData;
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            TokenStorage.setAccessToken(userData.accessToken);
            TokenStorage.setRefreshToken(userData.refreshToken);
        },

        logout() {
            this.user = null;
            this.error = null;
            localStorage.removeItem(USER_KEY);
            TokenStorage.clearAccessToken();
        },
    },
});
