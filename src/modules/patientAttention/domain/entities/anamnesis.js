export class Anamnesis {
    constructor({
        id = null,
        clinicalBackground = null,
        lowBloodPressure = false,
        highBloodPressure = false,
        smoke = false,
        currentMedications = null,
        emergencyContact = null,
    } = {}) {
        this.id = id;
        this.clinicalBackground = clinicalBackground;
        this.lowBloodPressure = lowBloodPressure;
        this.highBloodPressure = highBloodPressure;
        this.smoke = smoke;
        this.currentMedications = currentMedications;
        this.emergencyContact = emergencyContact;
    }

    get hasBloodPressureIssues() {
        return this.lowBloodPressure || this.highBloodPressure;
    }

    get isSmoker() {
        return this.smoke === true;
    }
}
