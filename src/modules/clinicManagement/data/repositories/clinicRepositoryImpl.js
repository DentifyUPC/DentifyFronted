import { clinicApi } from '../datasource/clinicApi.js';
import { ClinicMapper } from '../mappers/ClinicMapper.js';

export const clinicRepositoryImpl = {
    async getClinicsForRegister() {
        try {
            const data = await clinicApi.getClinicsForRegister();

            if (Array.isArray(data)) {
                return ClinicMapper.toDomainList(data);
            }

            return [ClinicMapper.toDomain(data)];
        } catch (error) {
            console.error('❌ Error al obtener clínicas:', error);
            throw error;
        }
    },
};
