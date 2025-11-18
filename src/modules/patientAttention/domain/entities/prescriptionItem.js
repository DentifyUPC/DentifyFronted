export class PrescriptionItem {
    constructor({
        id = null,
        medicationName = '',
        description = '',
        prescriptionId = null,
    } = {}) {
        this.id = id;
        this.medicationName = medicationName;
        this.description = description;
        this.prescriptionId = prescriptionId;
    }

    get isValid() {
        return !!(
            this.medicationName &&
            this.medicationName.trim() !== '' &&
            this.description &&
            this.description.trim() !== '' &&
            this.prescriptionId
        );
    }

    get displayName() {
        return this.medicationName || 'Sin nombre';
    }
}
