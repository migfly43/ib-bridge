"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yaml = require("js-yaml");
var fs = require("fs");
var _ = require("lodash");
exports.readConfig = function (fileName, accountState) {
    try {
        var doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
        _.merge(accountState, doc);
    }
    catch (e) {
        console.error(e);
    }
};
