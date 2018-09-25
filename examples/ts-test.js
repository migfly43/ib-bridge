"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var incomming_data_server_1 = require("../data-server/incomming-data-server");
var moment = require('moment-timezone');
console.log(new Date());
console.log("zone", moment().zoneAbbr());
//readConfig("./account-config.yml");
incomming_data_server_1.startDataServer();
