"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype._getEventListByName = function (eventName) {
        if (typeof this.events[eventName] === 'undefined') {
            this.events[eventName] = new Set();
        }
        return this.events[eventName];
    };
    EventEmitter.prototype.on = function (eventName, fn) {
        var _a;
        (_a = this._getEventListByName(eventName)) === null || _a === void 0 ? void 0 : _a.add(fn);
    };
    EventEmitter.prototype.once = function (eventName, fn) {
        var _this = this;
        var onceFn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.removeListener(eventName, onceFn);
            fn.apply(_this, args);
        };
        this.on(eventName, onceFn);
    };
    EventEmitter.prototype.emit = function (eventName) {
        var _this = this;
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this._getEventListByName(eventName)) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) {
            fn === null || fn === void 0 ? void 0 : fn.apply(_this, args);
        });
    };
    EventEmitter.prototype.removeListener = function (eventName, fn) {
        var _a;
        (_a = this._getEventListByName(eventName)) === null || _a === void 0 ? void 0 : _a.delete(fn);
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
