export class User {
    constructor({ id, username, fullName, roleId, clinicId, accessToken, refreshToken, email }) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.roleId = roleId;
        this.clinicId = clinicId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.email = email;
    }

    isAdmin() {
        return this.roleId === 1;
    }

    isPatient() {
        return this.roleId === 3;
    }

    isOdontologist() {
        return this.roleId === 2;
    }
}
