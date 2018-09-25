import * as util from 'util';
import chalk from 'chalk';
import IB from '..';


const ib = new IB({
  clientId: 0,
  host: '127.0.0.1',
  port: 7497
}).on('connected', function () {
    console.log(chalk.inverse('CONNECTED'));
}).on('disconnected', function () {
    console.log(chalk.inverse('DISCONNECTED'));
}).on('received', function (tokens?) {
    console.info('%s %s', chalk.cyan('<<< RECV <<<'), JSON.stringify(tokens));
}).on('sent', function (tokens?) {
    //console.info('%s %s', chalk.yellow('>>> SENT >>>'), JSON.stringify(tokens));
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

ib.connect();
ib.reqAccountSummary(12345, 'All', 'AccountType,NetLiquidation,TotalCashValue,SettledCash,AccruedCash,BuyingPower,EquityWithLoanValue,PreviousEquityWithLoanValue,GrossPositionValue,RegTEquity,RegTMargin,SMA,InitMarginReq,MaintMarginReq,AvailableFunds,ExcessLiquidity,Cushion,FullInitMarginReq,FullMaintMarginReq,FullAvailableFunds,FullExcessLiquidity,LookAheadNextChange,LookAheadInitMarginReq,LookAheadMaintMarginReq,LookAheadAvailableFunds,LookAheadExcessLiquidity,HighestSeverity,DayTradesRemaining,Leverage'); // reqId, group, tags
ib.reqAccountUpdates(true, 'U1234567'); // subscribe, acctCode
