import { ServicePerClinic } from '../../domain/entities/ServicePerClinic';

export const ServicePerClinicMapper = {
    toDomain(raw) {
        if (!raw) return null;
        return new ServicePerClinic({
            id: raw.id,
            clinicId: raw.clinicId,
            serviceId: raw.serviceId,
            totalPricePerItems: raw.totalPricePerItems,
            totalLaborPrice: raw.totalLaborPrice,
            totalServicePrice: raw.totalServicePrice,
        });
    },
};
