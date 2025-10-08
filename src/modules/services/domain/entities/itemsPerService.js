export class ItemPerService {
    constructor({ id = null, name = '', unitType = '', quantityRequired = 0 } = {}) {
        this.id = id;
        this.name = name;
        this.unitType = unitType;
        this.quantityRequired = quantityRequired;
    }

    displayName() {
        return this.name ?? '';
    }
}
