import * as util from 'util';
import chalk from 'chalk';
import IB from '..';
import IBServer from "../server/index";

const port = 7500;
const server = new IBServer({port});

// can control which command are tested
const commands = [
  "_ACCT_DOWNLOAD_END",
  "_ACCOUNT_SUMMARY_END",
  "_ACCOUNT_SUMMARY",
  "_ACCOUNT_UPDATE_MULTI_END",
  "_ACCOUNT_UPDATE_MULTI",
  "_ACCT_UPDATE_TIME",
  "_ACCT_VALUE",
  "_COMMISSION_REPORT",
  "_BOND_CONTRACT_DATA",
  "_CONTRACT_DATA",
  "_CONTRACT_DATA_END",
  "_CURRENT_TIME",
  "_DELTA_NEUTRAL_VALIDATION",
  "_ERR_MSG",
  "_EXECUTION_DATA",
  "_EXECUTION_DATA_END",
  "_FUNDAMENTAL_DATA",
  "_HISTORICAL_DATA",
  "_HEAD_TIMESTAMP",
  "_MANAGED_ACCTS",
  "_MARKET_DATA_TYPE",
  "_MARKET_DEPTH",
  "_MARKET_DEPTH_L2",
  "_NEWS_BULLETINS",
  "_NEXT_VALID_ID",
  "_OPEN_ORDER",
  "_OPEN_ORDER_END",
  "_ORDER_STATUS",
  "_PORTFOLIO_VALUE",
  "_POSITION",
  "_POSITION_END",
  "_POSITION_MULTI",
  "_POSITION_MULTI_END",
  "_REAL_TIME_BARS",
  "_RECEIVE_FA",
  "_SCANNER_DATA",
  "_SCANNER_PARAMETERS",
  "_SECURITY_DEFINITION_OPTION_PARAMETER",
  "_SECURITY_DEFINITION_OPTION_PARAMETER_END",
  "_TICK_EFP",
  "_TICK_GENERIC",
  "_TICK_OPTION_COMPUTATION",
  "_TICK_PRICE",
  "_TICK_SIZE",
  "_TICK_SNAPSHOT_END",
  "_TICK_STRING",
  "_DISPLAY_GROUP_LIST",
  "_DISPLAY_GROUP_UPDATED"
];
let command = 0;
const nextCommand = ()  => {
  setTimeout(() => {
    ib.debugMsg("send:" + commands[command]);
  }, 1000);
  command++;
};

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

    // doing this so command are sent one by one
    nextCommand();
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
