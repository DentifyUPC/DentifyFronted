import { Service } from '../../domain/entities/Service.js';

export const ServiceMapper = {
    toDomain(raw) {
        if (!raw) return null;
        return new Service({
            id: raw.id ?? null,
            name: raw.name ?? '',
        });
    },

    toDomainList(rawList = []) {
        return rawList.map((r) => ServiceMapper.toDomain(r));
    },
};
