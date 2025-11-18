export class OdontogramItem {
    constructor({
        id = null,
        teethCode = null,
        toothStatusName = null,
        odontogramId = null,
    } = {}) {
        this.id = id;
        this.teethCode = teethCode;
        this.toothStatusName = toothStatusName;
        this.odontogramId = odontogramId;
    }
}
