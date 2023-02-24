"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = require("./EventEmitter");
var TokenManager = /** @class */ (function () {
    function TokenManager(_a) {
        var getRefreshToken = _a.getRefreshToken, getAccessToken = _a.getAccessToken, isValidToken = _a.isValidToken, _b = _a.refreshTimeout, refreshTimeout = _b === void 0 ? 30000 : _b, executeRefreshToken = _a.executeRefreshToken, onInvalidRefreshToken = _a.onInvalidRefreshToken, onRefreshTokenSuccess = _a.onRefreshTokenSuccess, isValidRefreshToken = _a.isValidRefreshToken;
        var _this = this;
        this.isRefreshing = false;
        this.refreshTimeout = 3000;
        var event = new EventEmitter_1.default();
        this.refreshTimeout = refreshTimeout;
        this.getAccessToken = getAccessToken;
        this.getRefreshToken = getRefreshToken;
        this.onInvalidRefreshToken = onInvalidRefreshToken;
        this.isValidRefreshToken = isValidRefreshToken;
        this.onRefreshTokenSuccess = onRefreshTokenSuccess;
        if (isValidToken) {
            this.isValidToken = isValidToken;
        }
        else {
            this.isValidToken = this.isTokenValid;
        }
        event.on('refreshTokenExpired', function () {
            _this.onInvalidRefreshToken && _this.onInvalidRefreshToken();
        });
        event.on('refresh', function () {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var refreshToken, isRefreshTokenValid, token, isValid, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.getRefreshToken()];
                        case 1:
                            refreshToken = _a.sent();
                            return [4 /*yield*/, this.isValidRefreshToken(refreshToken)];
                        case 2:
                            isRefreshTokenValid = _a.sent();
                            if (!!isRefreshTokenValid) return [3 /*break*/, 3];
                            event.emit('refreshTokenExpired');
                            return [3 /*break*/, 6];
                        case 3: return [4 /*yield*/, getAccessToken()];
                        case 4:
                            token = _a.sent();
                            return [4 /*yield*/, this.isValidToken(token)];
                        case 5:
                            isValid = _a.sent();
                            if (isValid) {
                                event.emit('refreshDone', token);
                            }
                            else {
                                event.emit('refreshing');
                            }
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            e_1 = _a.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); })();
        });
        event.on('refreshing', function () { return __awaiter(_this, void 0, void 0, function () {
            var evtFire, _a, token, refresh_token;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isRefreshing) {
                            return [2 /*return*/];
                        }
                        // fetch
                        this.isRefreshing = true;
                        evtFire = false;
                        return [4 /*yield*/, executeRefreshToken()];
                    case 1:
                        _a = _b.sent(), token = _a.token, refresh_token = _a.refresh_token;
                        if (token && refresh_token) {
                            this.onRefreshTokenSuccess && this.onRefreshTokenSuccess({ token: token, refresh_token: refresh_token });
                        }
                        this.event.emit('refreshDone', token);
                        this.isRefreshing = false;
                        if (this.refreshTimeout) {
                            setTimeout(function () {
                                if (!evtFire) {
                                    _this.event.emit('refreshDone', null);
                                    _this.isRefreshing = false;
                                }
                            }, this.refreshTimeout);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        this.event = event;
    }
    TokenManager.prototype.getToken = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var isCalled = false;
            var refreshDoneHandler = function (token) {
                resolve(token);
                isCalled = true;
            };
            _this.event.once('refreshDone', refreshDoneHandler);
            if (!isCalled) {
                _this.event.emit('refresh');
            }
        });
    };
    TokenManager.prototype.parseJwt = function (token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        }
        catch (e) {
            return null;
        }
    };
    TokenManager.prototype.isTokenValid = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, exp, currentTime;
            return __generator(this, function (_a) {
                try {
                    decoded = this.parseJwt(token);
                    exp = decoded.exp;
                    currentTime = Date.now() / 1000;
                    if (exp - 5 > currentTime) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                }
                catch (error) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    return TokenManager;
}());
exports.default = TokenManager;
