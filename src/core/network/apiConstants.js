export const ApiConstants = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
    },
    PROFILE: {
        ME: "/api/v1/profile",
        UPDATE_INFO: "/api/v1/profile/update-information",
        UPDATE_PASSWORD: "/api/v1/profile/update-password",
    },
};
