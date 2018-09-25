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
var socket_1 = require("./socket");
var incoming_1 = require("./incoming");
var outgoing_1 = require("./outgoing");
var Controller = /** @class */ (function () {
    function Controller(ibServer, options, socket) {
        var _this = this;
        if (!_.isPlainObject(options)) {
            this.options = {};
        }
        else {
            this.options = __assign({}, options);
        }
        this._ibServer = ibServer;
        this._clientVersion = null;
        this._clientId = null;
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
        this._socket = new socket_1.default(this);
        this._socket.connect(socket);
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
    Controller.prototype._send = function (data, async) {
        if (this._socket._connected) {
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
        //console.log("Srv.Ctrl.Emit", args);
        if (args[0] === 'error' && !!args[1] && args[1].message) {
            args[1] = args[1].message;
        }
        this._ibServer.emit.apply(this._ibServer, args2);
        var eventOfArgs = args[0];
        var argsOfArgs = args.slice(1);
        if (eventOfArgs === "clientId") {
            // send
            this._outgoing._MANAGED_ACCTS();
            var orderId = this._ibServer.accountState.nextOrderId;
            this._outgoing._NEXT_VALID_ID(orderId);
        }
        if (!_.includes(['connected', 'disconnected', 'error', 'received', 'sent', 'client', 'clientId'], eventOfArgs)) {
            this._ibServer.emit('result', eventOfArgs, argsOfArgs);
        }
        this._ibServer.emit('all', eventOfArgs, argsOfArgs);
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
