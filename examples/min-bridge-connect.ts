import * as util from 'util';
import chalk from 'chalk';
import IB from '..';
import IBServer from "../server/index";

const port = 7500;
const server = new IBServer({port});

const ib = new IB({
  clientId: 0,
  host: '127.0.0.1',
  port
}).on('connected', function () {
    console.log(chalk.inverse('CONNECTED'));
}).on('disconnected', function () {
    console.log(chalk.inverse('DISCONNECTED'));
}).on('received', function (tokens?) {
    console.info('%s %s', chalk.cyan('<<< RECV <<<'), JSON.stringify(tokens));
}).on('sent', function (tokens?) {
    console.info('%s %s', chalk.yellow('>>> SENT >>>'), JSON.stringify(tokens));
}).on('server', function (version?, connectionTime?) {
    console.log(chalk.inverse(util.format('Server Version: %s', version)));
    console.log(chalk.inverse(util.format('Server Connection Time: %s', connectionTime)));
}).on('error', function (err?) {
    console.error(chalk.red(util.format('@@@ ERROR: %s @@@', err.message)));
}).on('result', function (event?, args?) {
    console.log(chalk.green(util.format('======= %s =======', event)));
    args.forEach(function (arg?, i?) {
        console.log('%s %s', chalk.green(util.format('[%d]', i + 1)), JSON.stringify(arg));
    });
});

//server.on('all', function(){} );

ib.connect();
ib.debugMsg("connect");
ib.reqAccountSummary(12345, 'All', 'AccountType,NetLiquidation,TotalCashValue,SettledCash,AccruedCash,BuyingPower,EquityWithLoanValue,PreviousEquityWithLoanValue,GrossPositionValue,RegTEquity,RegTMargin,SMA,InitMarginReq,MaintMarginReq,AvailableFunds,ExcessLiquidity,Cushion,FullInitMarginReq,FullMaintMarginReq,FullAvailableFunds,FullExcessLiquidity,LookAheadNextChange,LookAheadInitMarginReq,LookAheadMaintMarginReq,LookAheadAvailableFunds,LookAheadExcessLiquidity,HighestSeverity,DayTradesRemaining,Leverage'); // reqId, group, tags
ib.debugMsg("reqAccountSummary");
ib.reqAccountUpdates(true, 'U1234567'); // subscribe, acctCode
ib.debugMsg("reqAccountUpdates");


ib.calculateImpliedVolatility(12345, {
    currency: 'USD',
    exchange: 'SMART',
    expiry: '20140118',
    right: 'C',
    secType: 'OPT',
    strike: 40.00,
    symbol: 'QQQQ'
}, 12.34, 56.78); // reqId, contract, optionPrice, underPrice
ib.debugMsg("calculateImpliedVolatility");

ib.calculateOptionPrice(12345, {
    currency: 'USD',
    exchange: 'SMART',
    expiry: '20140118',
    right: 'C',
    secType: 'OPT',
    strike: 40.00,
    symbol: 'QQQQ'
}, 12.34, 56.78); // reqId, contract, volatility, underPrice
ib.debugMsg("calculateOptionPrice");

ib.cancelAccountSummary(12345);
ib.debugMsg("cancelAccountSummary");
ib.cancelCalculateImpliedVolatility(12345); // reqId
ib.debugMsg("cancelCalculateImpliedVolatility");
ib.cancelFundamentalData(12345); // reqId
ib.debugMsg("cancelFundamentalData");
ib.cancelHistoricalData(12345); // tickerId
ib.debugMsg("cancelHistoricalData");
ib.cancelMktData(12345); // tickerId
ib.debugMsg("cancelMktData");
ib.cancelMktDepth(12345); // tickerId
ib.debugMsg("cancelMktDepth");
ib.cancelNewsBulletins();
ib.debugMsg("cancelNewsBulletins");
ib.cancelOrder(12345); // id
ib.debugMsg("cancelOrder");
ib.cancelPositions();
ib.debugMsg("cancelPositions");
ib.cancelRealTimeBars(12345); // tickerId
ib.debugMsg("cancelRealTimeBars");
ib.cancelScannerSubscription(12345); // tickerId
ib.debugMsg("cancelScannerSubscription");
ib.exerciseOptions(12345, {
    currency: 'USD',
    exchange: 'SMART',
    expiry: '20140118',
    right: 'C',
    secType: 'OPT',
    strike: 40.00,
    symbol: 'QQQQ'
}, ib.EXERCISE_ACTION.EXERCISE, 10, 'U1234567', 0); // tickerId, contract, exerciseAction, exerciseQuantity, account, override
ib.debugMsg("exerciseOptions");
// ib.placeOrder(id, contract, order);
ib.replaceFA(ib.FA_DATA_TYPE.GROUPS, '<?xml version="1.0" encoding="UTF-8"?>'); // faDataType, xml
ib.debugMsg("replaceFA");
ib.reqAllOpenOrders();
ib.debugMsg("reqAllOpenOrders");
ib.reqAutoOpenOrders(true); // bAutoBind
ib.debugMsg("reqAutoOpenOrders");
ib.reqContractDetails(101, {
    currency: 'USD',
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: 'EUR'
}); // reqId, contract
ib.debugMsg("reqContractDetails");
ib.reqCurrentTime();
ib.debugMsg("reqCurrentTime");
ib.reqExecutions(12345, {
    // clientId: '',
    // acctCode: '',
    // time: '',
    // symbol: '',
    // secType: '',
    // exchange: '',
    // side: ''
    }); // reqId, filter
ib.debugMsg("reqExecutions");
ib.reqFundamentalData(201, {
    currency: 'USD',
    exchange: 'SMART',
    primaryExch: 'NASDAQ',
    secType: 'STK',
    symbol: 'AMZN'
}, 'Estimates'); // reqId, contract, reportType
ib.debugMsg("reqFundamentalData");
ib.reqFundamentalData(202, {
    currency: 'USD',
    exchange: 'SMART',
    primaryExch: 'NASDAQ',
    secType: 'STK',
    symbol: 'AMZN'
}, 'Financial Statements'); // reqId, contract, reportType
ib.debugMsg("reqFundamentalData2");
ib.reqFundamentalData(203, {
    currency: 'USD',
    exchange: 'SMART',
    primaryExch: 'NASDAQ',
    secType: 'STK',
    symbol: 'AMZN'
}, 'Summary'); // reqId, contract, reportType
ib.debugMsg("reqFundamentalData3");
ib.reqGlobalCancel();
ib.debugMsg("reqGlobalCancel");
//ib.reqHistoricalData(12345, {}, ...);  // tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate
ib.debugMsg("reqHistoricalData");
ib.reqIds(1); // numIds
ib.debugMsg("reqIds");
ib.reqManagedAccts();
ib.debugMsg("reqManagedAccts");
ib.reqMarketDataType(1); // marketDataType (1 or 2)
ib.debugMsg("reqMarketDataType");
ib.reqMktData(301, {
    currency: 'USD',
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: 'EUR'
}, 's', false, false); // tickerId, contract, genericTickList, snapshot
ib.debugMsg("reqMktData");
ib.reqMktData(302, {
    currency: 'CAD',
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: 'USD'
}, 's', false, false); // tickerId, contract, genericTickList, snapshot
ib.debugMsg("reqMktData1");
ib.reqMktData(303, {
    currency: 'USD',
    exchange: 'SMART',
    primaryExch: 'NASDAQ',
    secType: 'STK',
    symbol: 'AMZN'
}, 's', false, false); // tickerId, contract, genericTickList, snapshot
ib.debugMsg("reqMktData2");
ib.reqMktDepth(12345, {
    currency: 'CAD',
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: 'USD'
}, 10); // tickerId, contract, numRows
ib.debugMsg("reqMktDepth");
ib.reqNewsBulletins(true); // allMsgs
ib.debugMsg("reqNewsBulletins");
ib.reqOpenOrders();
ib.debugMsg("reqOpenOrders");
ib.reqPositions();
ib.debugMsg("reqPositions");
ib.reqRealTimeBars(12345, {
    currency: 'USD',
    exchange: 'SMART',
    primaryExch: 'NASDAQ',
    secType: 'STK',
    symbol: 'AMZN'
}, 5, 'TRADES', false); // tickerId, contract, barSize, whatToShow, useRTH
ib.debugMsg("reqRealTimeBars");
ib.reqScannerParameters();
ib.debugMsg("reqScannerSubscription");
ib.reqScannerSubscription(12345, {
    instrument: 'STK',
    locationCode: 'STK.NASDAQ.NMS',
    numberOfRows: 5,
    scanCode: 'TOP_PERC_GAIN',
    stockTypeFilter: 'ALL'
}); // tickerId, subscription
ib.debugMsg("reqScannerSubscription");
ib.requestFA(ib.FA_DATA_TYPE.GROUPS); // faDataType
ib.debugMsg("requestFA");
ib.requestFA(ib.FA_DATA_TYPE.PROFILES); // faDataType
ib.debugMsg("requestFA");
// ib.requestFA(ib.FA_DATA_TYPE.ALIASES);  // faDataType
//ib.debugMsg("requestFA");
ib.setServerLogLevel(ib.LOG_LEVEL.WARN); // logLevel
ib.debugMsg("setServerLogLevel");
