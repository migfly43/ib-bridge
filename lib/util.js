"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var C = require("./constants");
function _findKeyForValue(object, value) {
    for (var key in object) {
        if (object[key] === value) {
            return key;
        }
    }
    return C.TICK_TYPE.UNKNOWN;
}
function incomingToString(incoming) {
    return _findKeyForValue(C.INCOMING, incoming);
}
exports.incomingToString = incomingToString;
function numberToString(number) {
    if (number === Number.MAX_VALUE) {
        return 'MAX';
    }
    else if (number === Number.MIN_VALUE) {
        return 'MIN';
    }
    else {
        return number.toString();
    }
}
exports.numberToString = numberToString;
function outgoingToString(outgoing) {
    return _findKeyForValue(C.OUTGOING, outgoing);
}
exports.outgoingToString = outgoingToString;
function tickTypeToString(tickType) {
    return _findKeyForValue(C.TICK_TYPE, tickType);
}
exports.tickTypeToString = tickTypeToString;
