export interface TokenManagerContructor {
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  isValidToken?: (token: string) => Promise<boolean>;
  isValidRefreshToken?: (refresh_token: string) => Promise<boolean>;
  executeRefreshToken: () => Promise<{
    token: string;
    refresh_token: string;
  }>;
  onRefreshTokenSuccess: ({ token, refresh_token }: { token: string; refresh_token: string }) => void;
  onInvalidRefreshToken: () => void;
  refreshTimeout?: number;
}

export type TInjectBearerConfigs = {
  headers?: {
    Authorization?: string;
  } & {
    [K in string]: any;
  };
};
export type TParseJwt = {
  exp: number;
} & {
  [K in string]: any;
};
export declare const parseJwt: (token: string) => Partial<TParseJwt>;
export declare const injectBearer: <TToken extends string, TConfig extends TInjectBearerConfigs>(
  token: TToken,
  configs?: TConfig | undefined,
) => TConfig;
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
  constructor({
    getRefreshToken,
    getAccessToken,
    isValidToken,
    refreshTimeout,
    executeRefreshToken,
    onInvalidRefreshToken,
    onRefreshTokenSuccess,
    isValidRefreshToken,
  }: TokenManagerContructor);
  getToken(): Promise<string | unknown>;
  isTokenValid(token: string): Promise<boolean>;
}
