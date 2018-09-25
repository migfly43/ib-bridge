import {readConfig} from "../server/config";
import {startDataServer} from "../data-server/incomming-data-server";

var moment = require('moment-timezone');

console.log(new Date());
console.log("zone", moment().zoneAbbr());

//readConfig("./account-config.yml");
startDataServer();