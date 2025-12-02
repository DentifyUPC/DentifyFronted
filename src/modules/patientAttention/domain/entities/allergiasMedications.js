export class AllergiasMedications {
    constructor({
        id = null,
        medicationName = null,
        clinicalRecordId = null,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.medicationName = medicationName;
        this.clinicalRecordId = clinicalRecordId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get isValid() {
        return !!(this.medicationName && this.clinicalRecordId);
    }

    get formattedCreatedAt() {
        if (!this.createdAt) return '--/--/----';
        const date = new Date(this.createdAt);
        return date.toLocaleDateString('es-PE');
    }

    get formattedUpdatedAt() {
        if (!this.updatedAt) return '--/--/----';
        const date = new Date(this.updatedAt);
        return date.toLocaleDateString('es-PE');
    }
}
