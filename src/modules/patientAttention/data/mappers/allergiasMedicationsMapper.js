import { AllergiasMedications } from '@/modules/patientAttention/domain/entities/allergiasMedications.js';

export class AllergiasMedicationsMapper {
    static toDomain(dto) {
        if (!dto) return null;

        return new AllergiasMedications({
            id: dto.id,
            medicationName: dto.medicationName,
            clinicalRecordId: dto.clinicalRecordId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        });
    }

    static toDomainList(dtoList) {
        if (!Array.isArray(dtoList)) return [];
        return dtoList.map(dto => this.toDomain(dto));
    }

    static toDto(domain) {
        if (!domain) return null;

        return {
            id: domain.id,
            medicationName: domain.medicationName,
            clinicalRecordId: domain.clinicalRecordId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    static toCreatePayload(data) {
        return {
            medicationName: data.medicationName,
            clinicalRecordId: data.clinicalRecordId,
        };
    }

    static toUpdatePayload(data) {
        return {
            medicationName: data.medicationName,
        };
    }
}
