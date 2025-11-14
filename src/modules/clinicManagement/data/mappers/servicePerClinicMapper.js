import { ServicePerClinic } from '../../domain/entities/ServicePerClinic';

export const ServicePerClinicMapper = {
    toDomain(raw) {
        if (!raw) return null;
        return new ServicePerClinic({
            id: raw.id ?? null,
            clinicId: raw.clinicId ?? null,
            serviceId: raw.serviceId ?? null,
            name: raw.name ?? '', // viene desde el campo external.name en el back
            totalPricePerItems: raw.totalPricePerItems ?? 0,
            totalLaborPrice: raw.totalLaborPrice ?? 0,
            totalServicePrice: raw.totalServicePrice ?? 0,
        });
    },

    toDomainList(rawList = []) {
        return rawList.map(raw => this.toDomain(raw));
    },
};
