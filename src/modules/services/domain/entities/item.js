export class Item {
    constructor({ id = null, name = '', unitType = '' } = {}) {
        this.id = id;
        this.name = name;
        this.unitType = unitType;
    }

    displayName() {
        return this.name ?? '';
    }

    displayUnit() {
        return this.unitType ?? '';
    }
}
