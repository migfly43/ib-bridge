import * as net from 'net';
import * as _ from 'lodash';
import * as C from '../lib/constants';
import Controller from "./controller";
import { format } from 'date-fns';

const EOL = '\0';

class Socket {
  _controller: Controller;
  _client: net.Socket;
  _connected: boolean;
  _dataFragment: string;
  _neverReceived: number;
  _neverSent: boolean;
  _waitingAsync:  boolean;

  constructor(controller: Controller) {
    this._controller = controller;
    this._client = null;
    this._connected = false;
    this._dataFragment = '';
    this._neverReceived = 0;
    this._neverSent = true;
    this._waitingAsync = false;
  }
  
  _onConnect(): void{
    console.log("Srv.Socket._onConnect");
    this._connected = true;
    this._controller.emit('connected');

    this._controller.run('send', [C.SERVER_VERSION]);
    this._controller.run('send', [format(new Date(),"YYYYMMDD HH:mm:ss") + " IST"]);
  }

  _onData(data: any): void{
    const dataWithFragment = this._dataFragment + data.toString();
    console.log(`Srv.Socket._onData`, dataWithFragment);

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

    if (this._neverReceived === 0) {
      this._neverReceived++;
      this._controller._clientVersion = parseInt(this._controller._incoming.dequeue(), 10);
      console.log("Srv.Socket._onData client version", this._controller._clientVersion);
      this._controller.emit('client', this._controller._clientVersion);
    } else if (this._neverReceived === 1) {
      this._neverReceived++;
      this._controller._clientId = parseInt(this._controller._incoming.dequeue(), 10);
      console.log("Srv.Socket._onData clientId", this._controller._clientId);
      this._controller.emit('clientId', this._controller._clientId);
    }

    this._controller._incoming.process();

    // Async
    if (this._waitingAsync) {
      this._waitingAsync = false;
      this._controller.resume();
    }
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

  connect(socket: net.Socket): void{
    const self = this;

    this._controller.pause();

    this._neverReceived = 0;
    this._neverSent = true;

    this._client = socket;
    self._onConnect.apply(self, arguments);

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

    self._controller.resume();
    console.log("Srv.Socket.connect");
  }

  disconnect(): void{
    this._controller.pause();
    this._client.end();
  }

  send(tokens: any, async: any): void{

    console.log("Srv.Socket.send", tokens);
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
