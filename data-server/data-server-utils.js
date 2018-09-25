"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanitize = require("sanitize-filename");
var date_fns_1 = require("date-fns");
exports.getFileName = function (instrument, date) {
    return "./data/" + sanitize(instrument + "-" + date_fns_1.format(date, "YYYYMMDD") + ".rdata");
};
