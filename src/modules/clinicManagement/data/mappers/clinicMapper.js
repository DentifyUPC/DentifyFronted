import { Clinic } from '../../domain/entities/Clinic.js';

export const ClinicMapper = {
toDomain(raw) {
if (!raw) return null;

return new Clinic({
id: raw.id ?? null,
name: raw.name ?? '',
ruc: raw.ruc?.ruc ?? '',
businessName: raw.businessName ?? '',
address: raw.address ?? {},
phone: raw.phone?.phone ?? '',
contactEmail: raw.contactEmail?.contactEmail ?? '',
logoUrl: raw.logoUrl ?? '',
paypalEmail: raw.paypalEmail?.paypalEmail ?? '',
payPalMerchantId: raw.payPalMerchantId?.paypalMerchantId ?? '',
});
},

toDomainList(rawList = []) {
return rawList.map((r) => ClinicMapper.toDomain(r));
},
};
