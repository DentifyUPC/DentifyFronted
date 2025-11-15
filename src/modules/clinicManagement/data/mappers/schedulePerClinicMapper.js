import { SchedulePerClinic } from "@/modules/clinicManagement/domain/entities/schedulePerClinic.js";

export class SchedulePerClinicMapper {
    static toDomain(dto) {
        if (!dto) return null;

        return new SchedulePerClinic({
            id: dto.id,
            startTime: dto.startTime,
            endTime: dto.endTime,
            clinicId: dto.clinicId,
        });
    }

    static toDto(domain) {
        if (!domain) return null;

        return {
            startTime: domain.startTime,
            endTime: domain.endTime,
            clinicId: domain.clinicId,
        };
    }

    static toCreatePayload(data) {
        return {
            startTime: data.startTime,
            endTime: data.endTime,
            clinicId: data.clinicId,
        };
    }

    static toUpdatePayload(data) {
        return {
            startTime: data.startTime,
            endTime: data.endTime,
        };
    }
}