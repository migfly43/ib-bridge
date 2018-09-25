"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var events = require("events");
var _ = require("lodash");
var order = require("../lib/order");
var C = require("../lib/constants");
var controller_1 = require("./controller");
var chalk_1 = require("chalk");
var account_state_1 = require("./account-state");
var config_1 = require("./config");
var srv = chalk_1.default.black.bgGreen;
var srvError = chalk_1.default.white.bgRed;
var IBServer = /** @class */ (function (_super) {
    __extends(IBServer, _super);
    function IBServer(options) {
        var _this = _super.call(this) || this;
        _this.options = __assign({}, options);
        _this.on('error', function (err) {
            console.log(srvError("Srv->Error"), err);
        });
        _this.on('clientId', function (eventOfArgs, argsOfArgs) {
            console.log("Srv->clientId", eventOfArgs, argsOfArgs);
        });
        _this.on('result', function (eventOfArgs, argsOfArgs) {
            console.log("Srv->Result", eventOfArgs, argsOfArgs);
        });
        _this.on('all', function (eventOfArgs, argsOfArgs) {
            //console.log("Srv->All", eventOfArgs, argsOfArgs);
        });
        _this.contract = require('../lib/contract');
        _this.order = order;
        _this.util = require('../lib/util');
        _this.accountState = account_state_1.accountState();
        config_1.readConfig("./account-config.yml", _this.accountState);
        _.keys(C).forEach(function (key) {
            Object.defineProperty(_this, key, {
                get: function () {
                    return C[key];
                }
            });
        });
        _this.startServer();
        return _this;
    }
    IBServer.prototype.startServer = function () {
        var _this = this;
        var server = net.createServer(function (socket) {
            new controller_1.default(_this, _this.options, socket);
            console.log(srv("SRV->Received new client connection"));
        });
        var port = this.options.port || 7500;
        server.listen(port, '127.0.0.1');
        console.log(srv("SRV->Listen tp port " + port));
    };
    return IBServer;
}(events.EventEmitter));
exports.default = IBServer;
