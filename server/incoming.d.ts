import Controller from "./controller";
declare class Incoming {
    _controller: Controller;
    _dataQueue: string[];
    _emitQueue: any[];
    constructor(controller: Controller);
    _emit(...args: any[]): void;
    dequeue(): string;
    dequeueBool(): boolean;
    dequeueFloat(): number;
    dequeueInt(): number;
    enqueue(tokens: any): void;
    process(): void;
    _REQ_ACCOUNT_SUMMARY(): void;
    _REQ_ACCOUNT_DATA(): void;
    _REQ_CALC_IMPLIED_VOLAT(): void;
    _REQ_CALC_OPTION_PRICE(): void;
    _CANCEL_ACCOUNT_SUMMARY(): void;
    _CANCEL_CALC_IMPLIED_VOLAT(): void;
    _CANCEL_FUNDAMENTAL_DATA(): void;
    _CANCEL_HISTORICAL_DATA(): void;
    _CANCEL_MKT_DATA(): void;
    _CANCEL_MKT_DEPTH(): void;
    _CANCEL_NEWS_BULLETINS(): void;
    _CANCEL_ORDER(): void;
    _CANCEL_POSITIONS(): void;
    _CANCEL_REAL_TIME_BARS(): void;
    _CANCEL_SCANNER_SUBSCRIPTION(): void;
    _EXERCISE_OPTIONS(): void;
    _PLACE_ORDER(): void;
    _REPLACE_FA(): void;
    _REQ_ALL_OPEN_ORDERS(): void;
    _REQ_AUTO_OPEN_ORDERS(): void;
    _REQ_CONTRACT_DATA(): void;
    _REQ_CURRENT_TIME(): void;
    _REQ_EXECUTIONS(): void;
    _REQ_FUNDAMENTAL_DATA(): void;
    _REQ_GLOBAL_CANCEL(): void;
    _REQ_HISTORICAL_DATA(): void;
    _REQ_IDS(): void;
    _REQ_MANAGED_ACCTS(): void;
    _REQ_MARKET_DATA_TYPE(): void;
    _REQ_MKT_DATA(): void;
    _REQ_MKT_DEPTH(): void;
    _REQ_NEWS_BULLETINS(): void;
    _REQ_OPEN_ORDERS(): void;
    _REQ_POSITIONS(): void;
    _REQ_POSITIONS_MULTI(): void;
    _REQ_REAL_TIME_BARS(): void;
    _REQ_SCANNER_PARAMETERS(): void;
    _REQ_SCANNER_SUBSCRIPTION(): void;
    _REQ_FA(): void;
    _SET_SERVER_LOGLEVEL(): void;
    _REQ_SEC_DEF_OPT_PARAMS(): void;
    _REQ_HEAD_TIMESTAMP(): void;
    _REQ_ACCOUNT_UPDATES_MULTI(): void;
    _CANCEL_CALC_OPTION_PRICE(): void;
    _CANCEL_POSITIONS_MULTI(): void;
    _CANCEL_ACCOUNT_UPDATES_MULTI(): void;
    _DEBUG_MSG(): void;
}
export default Incoming;