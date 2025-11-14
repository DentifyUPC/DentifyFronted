import { servicePerClinicApi } from '../datasource/servicePerClinicApi.js';
import { ServicePerClinicMapper } from '../mappers/ServicePerClinicMapper.js';

export class ServicePerClinicRepositoryImpl {
    async create({ clinicId, serviceId, totalLaborPrice }) {
        try {
            const raw = await servicePerClinicApi.create({ clinicId, serviceId, totalLaborPrice });
            return ServicePerClinicMapper.toDomain(raw);
        } catch (error) {
            console.error('Error creando service-per-clinic:', error);
            throw error;
        }
    }

    async update(id, totalLaborPrice) {
        try {
            const payload = { totalLaborPrice };
            const raw = await servicePerClinicApi.update(id, payload);
            return ServicePerClinicMapper.toDomain(raw);
        } catch (error) {
            console.error('Error actualizando service-per-clinic:', error);
            throw error;
        }
    }

    async getAllByClinic(clinicId) {
        try {
            const rawList = await servicePerClinicApi.getAllByClinic(clinicId);
            return ServicePerClinicMapper.toDomainList(rawList);
        } catch (error) {
            console.error('Error obteniendo servicios por clínica:', error);
            throw error;
        }
    }
}

export const servicePerClinicRepositoryImpl = new ServicePerClinicRepositoryImpl();
