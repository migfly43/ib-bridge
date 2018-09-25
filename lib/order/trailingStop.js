"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _ = require("lodash");
module.exports = function (action, quantity, auxPrice, tif, transmitOrder, parentId) {
    assert(_.isString(action), 'Action must be a string.');
    assert(_.isNumber(quantity), 'Quantity must be a number.');
    assert(_.isNumber(auxPrice), 'Price must be a number.');
    return {
        action: action,
        totalQuantity: quantity,
        orderType: 'TRAIL',
        auxPrice: auxPrice,
        tif: tif,
        transmit: transmitOrder || true,
        parentId: parentId || 0
    };
};
