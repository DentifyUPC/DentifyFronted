export class ClinicalRecord {
    constructor({
        id = null,
        patientId = null,
        anamnesisId = null,
        odontogramId = null,
    } = {}) {
        this.id = id;
        this.patientId = patientId;
        this.anamnesisId = anamnesisId;
        this.odontogramId = odontogramId;
    }
}
