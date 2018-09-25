import * as net from 'net';
import * as events from 'events';
import * as _ from 'lodash';
import * as order from '../lib/order';
import * as C from '../lib/constants';
import Controller from './controller';
import chalk from "chalk";
import {accountState, IAccountState} from "./account-state";
import {readConfig} from "./config";

const srv = chalk.black.bgGreen;
const srvError = chalk.white.bgRed;

class IBServer extends events.EventEmitter {
  contract: any;
  order: any;
  util: any;
  options: any;
  accountState: IAccountState;

  constructor(options) {
    super();

    this.options = {...options};
    this.on('error', function(err) {
      console.log(srvError("Srv->Error"), err);
    });

    this.on('clientId', function(eventOfArgs, argsOfArgs) {
      console.log("Srv->clientId", eventOfArgs, argsOfArgs);
    });

    this.on('result', function(eventOfArgs, argsOfArgs) {
      console.log("Srv->Result", eventOfArgs, argsOfArgs);
    });

    this.on('all', function(eventOfArgs, argsOfArgs) {
      //console.log("Srv->All", eventOfArgs, argsOfArgs);
    });


    this.contract = require('../lib/contract');
    this.order = order;
    this.util = require('../lib/util');

    this.accountState = accountState();
    readConfig("./account-config.yml", this.accountState);

    _.keys(C).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => {
          return C[key];
        }
      });
    });

    this.startServer();
  }

  startServer() {
    const server = net.createServer((socket) => {
      new Controller(this, this.options, socket);
      console.log(srv("SRV->Received new client connection"));
    });

    const port = this.options.port || 7500;
    server.listen(port, '127.0.0.1');
    console.log(srv(`SRV->Listen tp port ${port}`));
  }
}

export default IBServer;
