import { AuthRepository } from '../../domain/repositories/AuthRepository.js';
import { authApi } from '../datasource/authApi.js';
import { profileApi } from '../datasource/profileApi.js';
import { UserMapper } from '../mappers/UserMapper.js';
import {TokenStorage} from "@/core/network/tokenStorage.js";

export class AuthRepositoryImpl extends AuthRepository {
    async login(username, password) {
        const data = await authApi.login(username, password);
        const user = UserMapper.toDomain(data);

        // 🧩 Guardamos token y refreshToken
        if (user.accessToken) {
            TokenStorage.setAccessToken(user.accessToken);
            // 🔥 Reinyectamos el header para el cliente actual
            import('@/core/network/api.js').then(({ default: api }) => {
                api.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
            });
        }

        if (user.refreshToken) {
            TokenStorage.setRefreshToken(user.refreshToken);
        }

        // 🧩 Guardamos user completo (para el menú y roles)
        localStorage.setItem("user", JSON.stringify(user));

        return user;
    }


    async registerPatient(data) {

        let formattedDate = data.birthDate;

        if (data.birthDate instanceof Date) {
            formattedDate = format(data.birthDate, 'dd/MM/yyyy');
        } else if (typeof data.birthDate === 'string' && data.birthDate.includes('-')) {

            const [year, month, day] = data.birthDate.split('-');
            formattedDate = `${day}/${month}/${year}`;
        }

        const body = {
            ...data,
            birthDate: formattedDate,
            roleId: 3
        };

        const res = await authApi.registerPatient(body);
        return UserMapper.toDomain(res);
    }


    async getProfile() {
        try {
            const data = await profileApi.getProfile();
            console.log('🌐 Respuesta cruda del backend:', data);
            return UserMapper.toDomain(data);
        } catch (error) {
            console.error('❌ Error al obtener perfil:', error);
            throw error;
        }
    }
    async updateInformation(data) {
        const res = await profileApi.updateInformation(data);
        return UserMapper.toDomain(res);
    }

    async updatePassword(data) {
        return await profileApi.updatePassword(data);
    }
}

export const authRepositoryImpl = new AuthRepositoryImpl();
