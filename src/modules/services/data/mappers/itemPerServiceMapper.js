import { ItemPerService } from '../../domain/entities/itemsPerService.js';

export const ItemPerServiceMapper = {
    toDomain(raw) {
        if (!raw) return null;
        return new ItemPerService({
            id: raw.id ?? null,
            name: raw.name ?? '',
            unitType: raw.unitType ?? '',
            quantityRequired: raw.quantityRequired ?? 0,
        });
    },

    toDomainList(rawList = []) {
        return rawList.map(ItemPerServiceMapper.toDomain);
    },
};
