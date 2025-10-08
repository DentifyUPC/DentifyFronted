export class ItemPerClinic {
    constructor({
                    id = null,
                    availableStock = 0,
                    minimumStock = 0,
                    price = 0,
                    item = null,
                    itemId = null,
                    clinicId = null,
                } = {}) {
        this.id = id;
        this.availableStock = availableStock;
        this.minimumStock = minimumStock;
        this.price = price;
        this.item = item;
        this.itemId = itemId;
        this.clinicId = clinicId;
    }

    stockDescription() {
        return `${this.availableStock}/${this.minimumStock}`;
    }

    priceDescription() {
        return `S/. ${this.price.toFixed(2)}`;
    }

    displayName() {
        return this.item ? this.item.displayName() : 'Sin nombre';
    }

    displayQuantity() {
        return `${this.availableStock} unidades`;
    }
}
