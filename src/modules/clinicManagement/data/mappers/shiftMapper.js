import { Shift } from "../../domain/entities/shift.js";

export class ShiftMapper {

    static toDomain(dto) {
        if (!dto) return null;
        return new Shift({
            id: dto.id,
            name: dto.name,
            startTime: dto.startTime?.slice(0, 5) || "",
            endTime: dto.endTime?.slice(0, 5) || "",
            clinicId: dto.clinicId || null,
        });
    }

    static toDomainList(dtoList) {
        if (!Array.isArray(dtoList)) return [];
        return dtoList.map((dto) => this.toDomain(dto));
    }


    static toCreatePayload(form) {
        return {
            name: form.name,
            startTime: form.startTime?.slice(0, 5), // Asegura formato HH:mm
            endTime: form.endTime?.slice(0, 5),
            clinicId: form.clinicId,
        };
    }


    static toUpdatePayload(form) {
        return {
            name: form.name,
            startTime: form.startTime?.slice(0, 5),
            endTime: form.endTime?.slice(0, 5),
        };
    }
}
