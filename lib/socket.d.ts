/// <reference types="node" />
import * as net from 'net';
import Controller from "./controller";
declare class Socket {
    _controller: Controller;
    _client: net.Socket;
    _connected: boolean;
    _dataFragment: string;
    _neverReceived: boolean;
    _neverSent: boolean;
    _waitingAsync: boolean;
    constructor(controller: Controller);
    _onConnect(): void;
    _onData(data: any): void;
    _onEnd(): void;
    _onError(err: any): void;
    connect(): void;
    disconnect(): void;
    send(tokens: any, async: any): void;
}
export default Socket;
