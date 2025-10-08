export class Patient {
    constructor({
                    id,
                    firstName,
                    lastName,
                    birthDate,
                    email,
                    phoneNumber,
                    gender,
                    clinicId,
                    userId,
                    age,
                    street,
                    district,
                    province,
                    department,
                }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.clinicId = clinicId;
        this.userId = userId;
        this.age = age;
        this.street = street;
        this.district = district;
        this.province = province;
        this.department = department;
    }

    get fullName() {
        return `${this.firstName || ""} ${this.lastName || ""}`.trim();
    }
}
