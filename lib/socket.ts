import * as net from 'net';
import * as _ from 'lodash';
import * as C from './constants';
import Controller from "./controller";

const EOL = '\0';

class Socket {
  _controller: Controller;
  _client: net.Socket;
  _connected: boolean;
  _dataFragment: string;
  _neverReceived: boolean;
  _neverSent: boolean;
  _waitingAsync:  boolean;

  constructor(controller: Controller) {
    this._controller = controller;
    this._client = null;
    this._connected = false;
    this._dataFragment = '';
    this._neverReceived = true;
    this._neverSent = true;
    this._waitingAsync = false;
  }
  
  _onConnect(): void{
    this._connected = true;
    this._controller.emit('connected');

    this._controller.run('sendAsync', [C.CLIENT_VERSION]);
    this._controller.run('sendAsync', [this._controller.options.clientId]);
  }
  _onData(data: any): void{
    const dataWithFragment = this._dataFragment + data.toString();

    let tokens = dataWithFragment.split(EOL);
    if (tokens[tokens.length - 1] !== '') {
      this._dataFragment = tokens[tokens.length - 1];
    } else {
      this._dataFragment = '';
    }
    tokens = tokens.slice(0, -1);
    this._controller.emit('received', tokens.slice(0), data);

    // Process data queue
    this._controller._incoming.enqueue(tokens);

    if (this._neverReceived) {
      this._controller._serverVersion = parseInt(this._controller._incoming.dequeue(), 10);
      this._controller._serverConnectionTime = this._controller._incoming.dequeue();
      this._controller.emit('server', this._controller._serverVersion, this._controller._serverConnectionTime);
    }

    this._controller._incoming.process();

    // Async
    if (this._waitingAsync) {
      this._waitingAsync = false;
      this._controller.resume();
    }

    this._neverReceived = false;
  }

  _onEnd(): void{

    const wasConnected = this._connected;
    this._connected = false;

    if (wasConnected) {
      this._controller.emit('disconnected');
    }

    this._controller.resume();
  }

  _onError(err:any): void{
    this._controller.emit('error', err);
  }

  connect(): void{

    const self = this;

    this._controller.pause();

    this._neverReceived = true;
    this._neverSent = true;

    this._client = net.connect({
      host: this._controller.options.host,
      port: this._controller.options.port
    }, function () {
      self._onConnect.apply(self, arguments);
      self._controller.resume();
    });

    this._client.on('data', function () {
      self._onData.apply(self, arguments);
    });

    this._client.on('close', function () {
      self._onEnd.apply(self, arguments);
    });

    this._client.on('end', function () {
      self._onEnd.apply(self, arguments);
    });

    this._client.on('error', function () {
      self._onError.apply(self, arguments);
    });
  }

  disconnect(): void{
    this._controller.pause();
    this._client.end();
  }

  send(tokens: any, async: any): void{

    if (async) {
      this._waitingAsync = true;
      this._controller.pause();
    }
  
    tokens = _.flatten([tokens]);
  
    _.forEach(tokens, function (value, i) {
      if (_.isBoolean(value)) {
        tokens[i] = value ? 1 : 0;
      }
    });
  
    const data = tokens.join(EOL) + EOL;
    this._client.write(data);
  
    this._controller.emit('sent', tokens, data);
  
    this._neverSent = false;
  }
}

export default Socket;
