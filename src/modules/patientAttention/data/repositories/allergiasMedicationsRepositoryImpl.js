import { allergiasMedicationsApi } from '../datasource/allergiasMedicationsApi.js';
import { AllergiasMedicationsMapper } from '../mappers/allergiasMedicationsMapper.js';

class AllergiasMedicationsRepositoryImpl {
    async create(data) {
        const payload = AllergiasMedicationsMapper.toCreatePayload(data);
        const response = await allergiasMedicationsApi.create(payload);
        return AllergiasMedicationsMapper.toDomain(response);
    }

    async getById(allergiaMedicationId) {
        const response = await allergiasMedicationsApi.getById(allergiaMedicationId);
        return AllergiasMedicationsMapper.toDomain(response);
    }

    async getByClinicalRecordId(clinicalRecordId) {
        const response = await allergiasMedicationsApi.getByClinicalRecordId(clinicalRecordId);
        return AllergiasMedicationsMapper.toDomainList(response);
    }

    async update(allergiaMedicationId, data) {
        const payload = AllergiasMedicationsMapper.toUpdatePayload(data);
        const response = await allergiasMedicationsApi.update(allergiaMedicationId, payload);
        return AllergiasMedicationsMapper.toDomain(response);
    }

    async delete(allergiaMedicationId) {
        await allergiasMedicationsApi.delete(allergiaMedicationId);
        return true;
    }
}

export const allergiasMedicationsRepositoryImpl = new AllergiasMedicationsRepositoryImpl();
