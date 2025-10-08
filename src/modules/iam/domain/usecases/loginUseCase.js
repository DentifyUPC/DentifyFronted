export class LoginUser {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(username, password) {
        return await this.authRepository.login(username, password);
    }
}
