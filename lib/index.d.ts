export interface TokenManagerContructor {
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
export declare const parseJwt: (token: string) => any;
export declare const injectBearer: (token: string, configs: any) => any;
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
    isTokenValid(token: string): Promise<boolean>;
}
