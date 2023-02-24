### Introduction

This package help you do refresh token brainlessly

#### Flow

- Checking refresh token -> expired -> onInvalidRefreshToken -> clear token on your storage -> logout
- Valid token -> return token -> run as normal
- Token in valid -> refresh token -> onRefreshToken success -> save token and refresh token to storage -> perform request

```javascript
import { extend } from 'umi-request';
import TokenManager, { injectBearer, parseJwt } from 'brainless-token-manager';

// Can implement by umi-request, axios, fetch....
export const requestNew = extend({
  prefix: process.env.VITE_APP_API,
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error) => {
    throw error?.data || error?.response;
  },
});

const tokenManager = new TokenManager({
  getAccessToken: async () => {
    const token = localStorage.getItem('accessToken');
    return `${token}`;
  },
  getRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    return `${refreshToken}`;
  },
  onInvalidRefreshToken: () => {
    // Logout, redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  isValidToken: async (token) => {
    try {
      const decoded = parseJwt(token);
      const { exp } = decoded;

      const currentTime = Date.now() / 1000;

      if (exp - 5 > currentTime) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  },
  isValidRefreshToken: async (refreshToken) => {
    try {
      const decoded = parseJwt(refreshToken);
      const { exp } = decoded;

      const currentTime = Date.now() / 1000;

      if (exp - 5 > currentTime) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  },
  executeRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return {
        token: '',
        refresh_token: '',
      };
    }

    const r = await requestNew.post('/auth/refresh-token', {
      data: {
        refreshToken: refreshToken,
      },
    });

    return {
      token: r?.accessToken,
      refresh_token: r?.refreshToken,
    };
  },
  onRefreshTokenSuccess: ({ token, refresh_token }) => {
    if (token && refresh_token) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refresh_token);
    }
  },
});

export const privateRequest = async (request: any, suffixUrl: string, configs?: any) => {
  try {
    const token: string = await tokenManager.getAccessToken();

    return request(suffixUrl, injectBearer(token, configs));
  } catch (error) {
    console.log(error);
  }
};

privateRequest(axios.get, 'example', { data: { foo: 'bar' } });
```
