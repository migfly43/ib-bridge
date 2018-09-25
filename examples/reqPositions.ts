import * as _ from 'lodash';
//import chalk from 'chalk';
const chalk = require('chalk');
//import * as net from 'net';
//import {Connection} from "./connection";

var ib = new (require('..'))({
 clientId: 3,
 host: '127.0.0.1',
 port: 7497
}).on('error', function (err) {
    console.error(chalk.red(err.message));
}).on('result', function (event, args) {
    if (!_.includes(['position', 'positionEnd'], event)) {
        console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
    }
}).on('position', function (account, contract, pos, avgCost) {
    console.log('%s %s%s %s%s %s%s %s%s', chalk.cyan('[position]'), chalk.bold('account='), account, chalk.bold('contract='), JSON.stringify(contract), chalk.bold('pos='), pos, chalk.bold('avgCost='), avgCost);
}).on('positionEnd', function () {
    console.log(chalk.cyan('[positionEnd]'));
});
ib.connect();
ib.reqPositions();
ib.on('positionEnd', function () {
    ib.disconnect();
});



