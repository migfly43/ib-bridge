/// <reference types="node" />
import * as events from 'events';
import { IAccountState } from "./account-state";
declare class IBServer extends events.EventEmitter {
    contract: any;
    order: any;
    util: any;
    options: any;
    accountState: IAccountState;
    constructor(options: any);
    startServer(): void;
}
export default IBServer;
