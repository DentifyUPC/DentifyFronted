export class ClinicalRecordEntry {
    constructor({
        id = null,
        evolution = null,
        observation = null,
        odontologistId = null,
        clinicalRecordId = null,
        appointmentId = null,
        prescriptionId = null,
    } = {}) {
        this.id = id;
        this.evolution = evolution;
        this.observation = observation;
        this.odontologistId = odontologistId;
        this.clinicalRecordId = clinicalRecordId;
        this.appointmentId = appointmentId;
        this.prescriptionId = prescriptionId;
    }

    get hasEvolution() {
        return !!this.evolution && this.evolution.trim() !== '';
    }

    get hasObservation() {
        return !!this.observation && this.observation.trim() !== '';
    }
}
