"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var CommandBuffer = require("command-buffer");
var C = require("./constants");
var socket_1 = require("./socket");
var incoming_1 = require("./incoming");
var outgoing_1 = require("./outgoing");
var Controller = /** @class */ (function () {
    function Controller(ib, options) {
        var _this = this;
        if (!_.isPlainObject(options)) {
            this.options = {};
        }
        else {
            this.options = __assign({}, options);
        }
        _.defaults(this.options, {
            host: C.DEFAULT_HOST,
            port: C.DEFAULT_PORT,
            clientId: C.DEFAULT_CLIENT_ID,
        });
        this._ib = ib;
        this._serverVersion = null;
        this._serverConnectionTime = null;
        this._socket = new socket_1.default(this);
        this._incoming = new incoming_1.default(this);
        this._outgoing = new outgoing_1.default(this);
        this._commands = new CommandBuffer(function (type, data) {
            var funcName = '_' + type;
            if (_.has(_this.constructor.prototype, funcName) && _.isFunction(_this[funcName])) {
                _this[funcName](data);
            }
            else {
                throw new Error('Missing function - ' + funcName);
            }
        }, this);
    }
    Controller.prototype._api = function (data) {
        var func;
        if (_.has(this._outgoing.constructor.prototype, data.func)) {
            func = this._outgoing[data.func];
            if (_.isFunction(func)) {
                return func.apply(this._outgoing, data.args);
            }
        }
        throw new Error('Unknown outgoing func - ' + data.func);
    };
    ;
    Controller.prototype._connect = function () {
        if (!this._socket._connected) {
            this._socket.connect();
        }
        else {
            this.emitError('Cannot connect if already connected.');
        }
    };
    ;
    Controller.prototype._disconnect = function () {
        if (this._socket._connected) {
            this._socket.disconnect();
        }
        else {
            this.emitError('Cannot disconnect if already disconnected.');
        }
    };
    ;
    Controller.prototype._send = function (data, async) {
        if (this._socket._connected) {
            var constKey = this._ib.util.outgoingToString(data[0]);
            console.log(">>> " + constKey + " " + data + " >>>");
            this._socket.send(data, async);
        }
        else {
            this.emitError('Cannot send data when disconnected.');
        }
    };
    ;
    Controller.prototype._sendAsync = function (data) {
        this._send(data, true);
    };
    ;
    Controller.prototype.emit = function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        var args = Array.prototype.slice.call(args2);
        if (args[0] === 'error' && !!args[1] && args[1].message) {
            args[1] = args[1].message;
        }
        this._ib.emit.apply(this._ib, arguments);
        var eventOfArgs = args[0];
        var argsOfArgs = args.slice(1);
        if (!_.includes(['connected', 'disconnected', 'error', 'received', 'sent', 'server'], eventOfArgs)) {
            this._ib.emit('result', eventOfArgs, argsOfArgs);
        }
        this._ib.emit('all', eventOfArgs, argsOfArgs);
    };
    ;
    Controller.prototype.emitError = function (errMsg, data) {
        this.emit('error', new Error(errMsg), data);
    };
    ;
    Controller.prototype.pause = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._commands.pause.apply(this._commands, args);
    };
    ;
    Controller.prototype.resume = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._commands.resume.apply(this._commands, args);
    };
    ;
    Controller.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._commands.run.apply(this._commands, args);
    };
    ;
    Controller.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._commands.schedule.apply(this._commands, args);
    };
    ;
    return Controller;
}());
exports.default = Controller;
