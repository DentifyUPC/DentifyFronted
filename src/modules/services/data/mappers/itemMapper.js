import { Item } from '../../domain/entities/Item.js';

export const ItemMapper = {
    toDomain(raw) {
        if (!raw) return null;

        return new Item({
            id: raw.id ?? null,
            name: raw.name ?? '',
            unitType: raw.unitType?.name ?? raw.unitType ?? raw.unitTypeName ?? '—',
        });
    },

    toDomainList(rawList = []) {
        return rawList.map(r => ItemMapper.toDomain(r));
    },
};
