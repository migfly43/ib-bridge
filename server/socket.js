"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var C = require("../lib/constants");
var date_fns_1 = require("date-fns");
var EOL = '\0';
var Socket = /** @class */ (function () {
    function Socket(controller) {
        this._controller = controller;
        this._client = null;
        this._connected = false;
        this._dataFragment = '';
        this._neverReceived = 0;
        this._neverSent = true;
        this._waitingAsync = false;
    }
    Socket.prototype._onConnect = function () {
        console.log("Srv.Socket._onConnect");
        this._connected = true;
        this._controller.emit('connected');
        this._controller.run('send', [C.SERVER_VERSION]);
        this._controller.run('send', [date_fns_1.format(new Date(), "YYYYMMDD HH:mm:ss") + " IST"]);
    };
    Socket.prototype._onData = function (data) {
        var dataWithFragment = this._dataFragment + data.toString();
        console.log("Srv.Socket._onData", dataWithFragment);
        var tokens = dataWithFragment.split(EOL);
        if (tokens[tokens.length - 1] !== '') {
            this._dataFragment = tokens[tokens.length - 1];
        }
        else {
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
        }
        else if (this._neverReceived === 1) {
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
    };
    Socket.prototype._onEnd = function () {
        var wasConnected = this._connected;
        this._connected = false;
        if (wasConnected) {
            this._controller.emit('disconnected');
        }
        this._controller.resume();
    };
    Socket.prototype._onError = function (err) {
        this._controller.emit('error', err);
    };
    Socket.prototype.connect = function (socket) {
        var self = this;
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
    };
    Socket.prototype.disconnect = function () {
        this._controller.pause();
        this._client.end();
    };
    Socket.prototype.send = function (tokens, async) {
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
        var data = tokens.join(EOL) + EOL;
        this._client.write(data);
        this._controller.emit('sent', tokens, data);
        this._neverSent = false;
    };
    return Socket;
}());
exports.default = Socket;
