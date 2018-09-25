"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _ = require("lodash");
function default_1(symbol, exchange, currency) {
    assert(_.isString(symbol), 'Symbol must be a string.');
    return {
        currency: currency || 'USD',
        exchange: exchange || 'SMART',
        secType: 'STK',
        symbol: symbol
    };
}
exports.default = default_1;
;
