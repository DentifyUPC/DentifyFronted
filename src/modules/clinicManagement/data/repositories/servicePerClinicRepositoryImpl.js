    import { servicePerClinicApi } from '../datasource/servicePerClinicApi.js';
    import { ServicePerClinicMapper } from '../mappers/ServicePerClinicMapper.js';

    export class ServicePerClinicRepositoryImpl {
        async create({ clinicId, serviceId, totalLaborPrice }) {
            try {
                const raw = await servicePerClinicApi.create({
                    clinicId,
                    serviceId,
                    totalLaborPrice,
                });
                return ServicePerClinicMapper.toDomain(raw);
            } catch (error) {
                console.error('❌ Error creating service-per-clinic:', error);
                throw error;
            }
        }
    }

    export const servicePerClinicRepositoryImpl = new ServicePerClinicRepositoryImpl();
