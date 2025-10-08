import {ItemPerClinic} from "@/modules/clinicManagement/domain/entities/itemPerClinic.js";

export const ItemPerClinicMapper = {
    toDomain(raw) {
        if (!raw) return null;
        return new ItemPerClinic({
            id: raw.id,
            availableStock: raw.availableStock,
            minimumStock: raw.minimumStock,
            price: raw.price,
            itemId: raw.itemId,
            clinicId: raw.clinicId,
        });
    },


    toDomainList(rawList = []) {
        return rawList.map(r => ItemPerClinicMapper.toDomain(r));
    },


    toPersistence(domain) {
        return {
            id: domain.id,
            availableStock: domain.availableStock,
            minimumStock: domain.minimumStock,
            price: domain.price,
            clinicId: domain.clinicId,
            itemId: domain.item?.id || domain.itemId, // importante!
        };
    }
};
