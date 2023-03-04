import EventEmitter from './EventEmitter';

export interface TokenManagerContructor {
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  isValidToken?: (token: string) => Promise<boolean>;
  isValidRefreshToken?: (refresh_token: string) => Promise<boolean>;
  executeRefreshToken?: () => Promise<{ token: string; refresh_token: string }>;
  onRefreshTokenSuccess?: ({ token, refresh_token }: { token: string; refresh_token: string }) => void;
  onInvalidRefreshToken: () => void;
  refreshTimeout?: number;
}

export interface TokenManagerInstance {
  getToken: () => Promise<string>;
}

export type TInjectBearerConfigs = {
  headers?: { Authorization?: string } & {
    [K in string]: any;
  };
};

export type TParseJwt = { exp: number } & {
  [K in string]: any;
};

export const parseJwt = (token: string): Partial<TParseJwt> => {
  try {
    return JSON.parse(Base64.atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
};

export const injectBearer = <TToken extends string, TConfig extends TInjectBearerConfigs>(
  token: TToken,
  configs?: TConfig,
): TConfig => {
  if (!configs) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } as TConfig;
  }

  if (configs?.headers?.Authorization) {
    return {
      ...configs,
      headers: {
        ...configs.headers,
      },
    };
  }

  if (configs?.headers) {
    return {
      ...configs,
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    ...configs,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default class TokenManager {
  private event: EventEmitter;
  public getAccessToken;
  public getRefreshToken;
  private onInvalidRefreshToken;
  private isRefreshing: boolean = false;
  private refreshTimeout: number = 30000;
  private isValidRefreshToken;
  private onRefreshTokenSuccess;
  private isValidToken;
  private executeRefreshToken;

  constructor({
    getRefreshToken,
    getAccessToken,
    isValidToken,
    refreshTimeout = 30000,
    executeRefreshToken,
    onInvalidRefreshToken,
    onRefreshTokenSuccess,
    isValidRefreshToken,
  }: TokenManagerContructor) {
    const event = new EventEmitter();
    this.refreshTimeout = refreshTimeout;
    this.getAccessToken = getAccessToken;
    this.getRefreshToken = getRefreshToken;
    this.onInvalidRefreshToken = onInvalidRefreshToken;
    this.onRefreshTokenSuccess = onRefreshTokenSuccess;
    this.executeRefreshToken = executeRefreshToken;

    if (isValidToken) {
      this.isValidToken = isValidToken;
    } else {
      this.isValidToken = this.isTokenValid;
    }

    if (isValidRefreshToken) {
      this.isValidRefreshToken = isValidRefreshToken;
    } else {
      this.isValidRefreshToken = this.isTokenValid;
    }

    event.on('refreshTokenExpired', () => {
      this.onInvalidRefreshToken && this.onInvalidRefreshToken();
    });

    event.on('refresh', () => {
      (async () => {
        try {
          const refreshToken = await this.getRefreshToken();
          const isRefreshTokenValid = await this.isValidRefreshToken(refreshToken);
          if (!isRefreshTokenValid) {
            event.emit('refreshTokenExpired');
          } else {
            const token = await getAccessToken();
            const isValid: boolean = await this.isValidToken(token);
            if (isValid) {
              event.emit('refreshDone', token);
            } else {
              event.emit('refreshing');
            }
          }
        } catch (e) {}
      })();
    });

    event.on('refreshing', async () => {
      if (this.isRefreshing) {
        return;
      }

      if (!this.executeRefreshToken) {
        return;
      }
      // fetch
      this.isRefreshing = true;

      const evtFire = false;
      const { token, refresh_token } = await this.executeRefreshToken();

      if (token && refresh_token) {
        this.onRefreshTokenSuccess && this.onRefreshTokenSuccess({ token, refresh_token });
      }
      this.event.emit('refreshDone', token);
      this.isRefreshing = false;

      if (this.refreshTimeout) {
        setTimeout(() => {
          if (!evtFire) {
            this.event.emit('refreshDone', null);
            this.isRefreshing = false;
          }
        }, this.refreshTimeout);
      }
    });

    this.event = event;
  }

  getToken(): Promise<string | unknown> {
    return new Promise((resolve) => {
      let isCalled = false;

      const refreshDoneHandler = (token: string) => {
        resolve(token);
        isCalled = true;
      };

      this.event.once('refreshDone', refreshDoneHandler);

      if (!isCalled) {
        this.event.emit('refresh');
      }
    });
  }

  async isTokenValid(token: string) {
    try {
      const decoded = parseJwt(token);
      const { exp } = decoded;

      const currentTime = Date.now() / 1000;

      if (exp && exp - 5 > currentTime) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input: string = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};
