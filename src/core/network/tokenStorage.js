const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const TokenStorage = {
    setAccessToken(token) {
        if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token.replace(/"/g, ''));
    },
    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    setRefreshToken(token) {
        if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token.replace(/"/g, ''));
    },
    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    clearAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};
