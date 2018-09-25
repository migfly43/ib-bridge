import Socket from './socket';
import Incoming from './incoming';
import Outgoing from './outgoing';
import IB from "./index";
declare class Controller {
    _ib: IB;
    _serverVersion: number;
    _serverConnectionTime: any;
    _socket: Socket;
    _incoming: Incoming;
    _outgoing: Outgoing;
    _commands: any;
    options: any;
    constructor(ib: IB, options: any);
    _api(data: any): any;
    _connect(): void;
    _disconnect(): void;
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
