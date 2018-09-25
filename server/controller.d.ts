/// <reference types="node" />
import * as net from 'net';
import Socket from './socket';
import Incoming from './incoming';
import Outgoing from './outgoing';
import IBServer from "./index";
declare class Controller {
    _ibServer: IBServer;
    _clientVersion: number;
    _clientId: number;
    _socket: Socket;
    _incoming: Incoming;
    _outgoing: Outgoing;
    _commands: any;
    options: any;
    constructor(ibServer: IBServer, options: any, socket: net.Socket);
    _api(data: any): any;
    _send(data: any, async: any): void;
    _sendAsync(data: any): void;
    emit(...args2: any[]): void;
    emitError(errMsg: string, data?: any): void;
    pause(...args: any[]): void;
    resume(...args: any[]): void;
    run(...args: any[]): void;
    schedule(...args: any[]): void;
}
export default Controller;
