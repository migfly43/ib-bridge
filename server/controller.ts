import * as net from 'net';
import * as _ from 'lodash';
import * as CommandBuffer from 'command-buffer';

import * as C from '../lib/constants';
import Socket from './socket';
import Incoming from './incoming';
import Outgoing from './outgoing';
import IBServer from "./index";

class Controller {
  _ibServer: IBServer;
  _clientVersion: number;
  _clientId: number;

  _socket: Socket;
  _incoming: Incoming;
  _outgoing: Outgoing;

  _commands: any;
  options: any;

  constructor(ibServer: IBServer, options: any, socket: net.Socket) {
    if (!_.isPlainObject(options)) {
      this.options = {};
    } else {
      this.options = {...options};
    }

    this._ibServer = ibServer;
    this._clientVersion = null;
    this._clientId = null;

    this._incoming = new Incoming(this);
    this._outgoing = new Outgoing(this);

    this._commands = new CommandBuffer((type, data) => {
      const funcName = '_' + type;
      if (_.has(this.constructor.prototype, funcName) && _.isFunction(this[funcName])) {
        this[funcName](data);
      } else {
        throw new Error('Missing function - ' + funcName);
      }
    }, this);

    this._socket = new Socket(this);
    this._socket.connect(socket);
  }

  _api(data) {
    let func;
    if (_.has(this._outgoing.constructor.prototype, data.func)) {
      func = this._outgoing[data.func];
      if (_.isFunction(func)) {
        return func.apply(this._outgoing, data.args);
      }
    }
    throw new Error('Unknown outgoing func - ' + data.func);
  };

  _send(data, async) {
    if (this._socket._connected) {
      this._socket.send(data, async);
    } else {
      this.emitError('Cannot send data when disconnected.');
    }
  };

  _sendAsync(data) {
    this._send(data, true);
  };

  emit(...args2: any[]) {
    const args = Array.prototype.slice.call(args2);
    //console.log("Srv.Ctrl.Emit", args);

    if (args[0] === 'error' && !!args[1] && args[1].message) {
      args[1] = args[1].message;
    }

    this._ibServer.emit.apply(this._ibServer, args2);

    const eventOfArgs = args[0];
    const argsOfArgs = args.slice(1);

    if (eventOfArgs === "clientId") {
      // send
      this._outgoing._MANAGED_ACCTS();

      const orderId = this._ibServer.accountState.nextOrderId;
      this._outgoing._NEXT_VALID_ID(orderId);
    }

    if (!_.includes(['connected', 'disconnected', 'error', 'received', 'sent', 'client', 'clientId'], eventOfArgs)) {
      this._ibServer.emit('result', eventOfArgs, argsOfArgs);
    }

    this._ibServer.emit('all', eventOfArgs, argsOfArgs);
  };

  emitError(errMsg:string, data?:any) {
    this.emit('error', new Error(errMsg), data);
  };

  pause(...args: any[]) {
    this._commands.pause.apply(this._commands, args);
  };

  resume(...args: any[]) {
    this._commands.resume.apply(this._commands, args);
  };

  run(...args: any[]) {
    this._commands.run.apply(this._commands, args);
  };

  schedule(...args: any[]) {
    this._commands.schedule.apply(this._commands, args);
  };
}

export default Controller;
