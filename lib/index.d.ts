interface TokenManagerContructor {
    getAccessToken: () => Promise<string>;
    getRefreshToken: () => Promise<string>;
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
    refreshTimeout: number;
}
export default class TokenManager {
    private event;
    private getAccessToken;
    private getRefreshToken;
    private onInvalidRefreshToken;
    private isRefreshing;
    private refreshTimeout;
    private isValidRefreshToken;
    private onRefreshTokenSuccess;
    constructor({ getRefreshToken, getAccessToken, refreshTimeout, executeRefreshToken, onInvalidRefreshToken, onRefreshTokenSuccess, isValidRefreshToken, }: TokenManagerContructor);
    getToken(): Promise<unknown>;
    parseJwt(token: string): any;
    isTokenValid(): Promise<boolean>;
}
export {};
