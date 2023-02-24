interface TokenManagerContructor {
    getAccessToken: () => Promise<string>;
    getRefreshToken: () => Promise<string>;
    isValidToken: (token: string) => Promise<boolean>;
    isValidRefreshToken: (refresh_token: string) => Promise<boolean>;
    executeRefreshToken: () => Promise<{
        token: string;
        refresh_token: string;
    }>;
    onRefreshTokenSuccess: ({ token, refresh_token }: {
        token: string;
        refresh_token: string;
    }) => void;
    onInvalidRefreshToken: () => void;
    refreshTimeout?: number;
}
export default class TokenManager {
    private event;
    getAccessToken: () => Promise<string>;
    getRefreshToken: () => Promise<string>;
    private onInvalidRefreshToken;
    private isRefreshing;
    private refreshTimeout;
    private isValidRefreshToken;
    private onRefreshTokenSuccess;
    private isValidToken;
    constructor({ getRefreshToken, getAccessToken, isValidToken, refreshTimeout, executeRefreshToken, onInvalidRefreshToken, onRefreshTokenSuccess, isValidRefreshToken, }: TokenManagerContructor);
    getToken(): Promise<unknown>;
    parseJwt(token: string): any;
    isTokenValid(token: string): Promise<boolean>;
}
export {};
