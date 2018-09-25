"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
//import * as chalk from 'chalk';
var chalk = require('chalk');
var ib = new (require('..'))({
// clientId: 0,
// host: '127.0.0.1',
// port: 7496
}).on('error', function (err) {
    console.error(chalk.red(err.message));
}).on('historicalData', function (reqId, date, open, high, low, close, volume, barCount, WAP, hasGaps) {
    if (_.includes([-1], open)) {
        console.log('endhistoricalData');
    }
    else {
        console.log('%s %s%d %s%s %s%d %s%d %s%d %s%d %s%d %s%d %s%d %s%d', chalk.cyan('[historicalData]'), chalk.bold('reqId='), reqId, chalk.bold('date='), date, chalk.bold('open='), open, chalk.bold('high='), high, chalk.bold('low='), low, chalk.bold('close='), close, chalk('volume='), volume, chalk.bold('barCount='), barCount, chalk.bold('WAP='), WAP, chalk.bold('hasGaps='), hasGaps);
    }
});
ib.connect();
// tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate
ib.reqHistoricalData(1, ib.contract.stock('SPY', 'SMART', 'USD'), '20160308 12:00:00', '1800 S', '1 secs', 'TRADES', 1, 1, false);
ib.on('historicalData', function (reqId, date, open, high, low, close, volume, barCount, WAP, hasGaps) {
    if (_.includes([-1], open)) {
        //ib.cancelHistoricalData(1);  // tickerId
        ib.disconnect();
    }
});
