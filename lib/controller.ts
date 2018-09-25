import * as _ from 'lodash';
import * as CommandBuffer from 'command-buffer';

import * as C from './constants';
import Socket from './socket';
import Incoming from './incoming';
import Outgoing from './outgoing';
import IB from "./index";

class Controller {
  _ib: IB;
  _serverVersion: number;
  _serverConnectionTime: any;

  _socket: Socket;
  _incoming: Incoming;
  _outgoing: Outgoing;

  _commands: any;
  options: any;

  constructor(ib: IB, options: any) {
    if (!_.isPlainObject(options)) {
      this.options = {};
    } else {
      this.options = {...options};
    }

    _.defaults(this.options, {
      host: C.DEFAULT_HOST,
      port: C.DEFAULT_PORT,
      clientId: C.DEFAULT_CLIENT_ID,
    });

    this._ib = ib;
    this._serverVersion = null;
    this._serverConnectionTime = null;

    this._socket = new Socket(this);
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

  _connect() {
    if (!this._socket._connected) {
      this._socket.connect();
    } else {
      this.emitError('Cannot connect if already connected.');
    }
  };

  _disconnect() {
    if (this._socket._connected) {
      this._socket.disconnect();
    } else {
      this.emitError('Cannot disconnect if already disconnected.');
    }
  };

  _send(data, async) {
    if (this._socket._connected) {

      const constKey = this._ib.util.outgoingToString(data[0]);
      console.log(`>>> ${constKey} ${data} >>>`);

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

    if (args[0] === 'error' && !!args[1] && args[1].message) {
      args[1] = args[1].message;
    }

    this._ib.emit.apply(this._ib, arguments);

    const eventOfArgs = args[0];
    const argsOfArgs = args.slice(1);

    if (!_.includes(['connected', 'disconnected', 'error', 'received', 'sent', 'server'], eventOfArgs)) {
      this._ib.emit('result', eventOfArgs, argsOfArgs);
    }

    this._ib.emit('all', eventOfArgs, argsOfArgs);
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
