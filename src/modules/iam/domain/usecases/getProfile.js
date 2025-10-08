export class GetProfile {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(token) {
        return await this.authRepository.getProfile(token);
    }
}
