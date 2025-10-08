export class Clinic {
    constructor({
                    id = null,
                    name = '',
                    ruc = '',
                    businessName = '',
                    address = {},
                    phone = '',
                    contactEmail = '',
                    logoUrl = '',
                    paypalEmail = '',
                    payPalMerchantId = ''
                } = {}) {
        this.id = id;
        this.name = name;
        this.ruc = ruc;
        this.businessName = businessName;
        this.address = {
            street: address.street ?? '',
            number: address.number ?? '',
            district: address.district ?? '',
            province: address.province ?? '',
            department: address.department ?? '',
        };
        this.phone = phone;
        this.contactEmail = contactEmail;
        this.logoUrl = logoUrl;
        this.paypalEmail = paypalEmail;
        this.payPalMerchantId = payPalMerchantId;
    }

    displayName() {
        return this.name;
    }

    displayAddress() {
        const { street, number, district, province } = this.address;
        return [street, number, district, province].filter(Boolean).join(', ');
    }
}
