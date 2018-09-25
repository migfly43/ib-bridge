import * as _ from "lodash";
import * as rateLimit from "function-rate-limit";
import * as C from "../lib/constants";
import {
  IFilter,
  IOutContract,
  ISubscription,
  IUnderComp,
  IExec,
  IOrder,
  IContract
} from "../lib/interfaces";
import Controller from "./controller";

function _nullifyMax(number: number) {
  if (number === Number.MAX_VALUE) {
    return null;
  } else {
    return number;
  }
}

class Outgoing {
  _controller: Controller;
  _send: any;

  constructor(controller: Controller) {
    this._controller = controller;
    const self = this;
    this._send = function() {
      const args = Array.prototype.slice.call(arguments);
      self._controller.run("send", _.flatten(args));
    };
  }

  _ACCT_DOWNLOAD_END(accountName: string) {
    const version = 1;
    this._send(C.INCOMING.ACCT_DOWNLOAD_END, version, accountName);
  }

  _ACCOUNT_SUMMARY_END(version: number, reqId: number) {
    this._send(C.INCOMING.ACCOUNT_SUMMARY_END, version, reqId);
  }

  _ACCOUNT_SUMMARY(
    version: number,
    reqId: number,
    account: string,
    tag: string,
    value: string,
    currency: string
  ) {
    this._send(
      C.INCOMING.ACCOUNT_SUMMARY,
      version,
      reqId,
      account,
      tag,
      value,
      currency
    );
  }

  _ACCOUNT_UPDATE_MULTI_END(reqId: number) {
    const version = 1;
    this._send(C.INCOMING.ACCOUNT_UPDATE_MULTI_END, version, reqId);
  }

  _ACCOUNT_UPDATE_MULTI(
    reqId: number,
    account: string,
    modelCode: string,
    key: string,
    value: string,
    currency: string
  ) {
    const version = 1;
    this._send(
      C.INCOMING.ACCOUNT_UPDATE_MULTI,
      version,
      reqId,
      account,
      modelCode,
      key,
      value,
      currency
    );
  }

  _ACCT_UPDATE_TIME(timeStamp: string) {
    const version = 1;
    this._send(C.INCOMING.ACCT_UPDATE_TIME, version, timeStamp);
  }

  _ACCT_VALUE(key: string, value: string, currency: string) {
    const version = 3;
    const accountName = this._controller._ibServer.accountState.AccountName;
 
    this._send(C.INCOMING.ACCT_VALUE, version, key, value, currency, accountName);
  }

  _COMMISSION_REPORT(
    execId: string,
    commission: number,
    currency: string,
    realizedPNL: number,
    field: number,
    yieldRedemptionDate: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.COMMISSION_REPORT,
      version,
      execId,
      commission,
      currency,
      realizedPNL,
      field,
      yieldRedemptionDate
    );
  }

  _BOND_CONTRACT_DATA(reqId: number, contract: IContract) {
    const version = 1;
    const args: any[] = [C.INCOMING.BOND_CONTRACT_DATA, version];    
    if (version >= 3) {
      args.push(reqId);
    }
    args.push( contract.summary.symbol );
    args.push( contract.summary.secType );
    args.push( contract.cusip );
    args.push( contract.coupon );
    args.push( contract.maturity );
    args.push( contract.issueDate );
    args.push( contract.ratings );
    args.push( contract.bondType );
    args.push( contract.couponType );
    args.push( contract.convertible );
    args.push( contract.callable );
    args.push( contract.putable );
    args.push( contract.descAppend );
    args.push( contract.summary.exchange );
    args.push( contract.summary.currency );
    args.push( contract.marketName );
    args.push( contract.summary.tradingClass );
    args.push( contract.summary.conId );
    args.push( contract.minTick );
    args.push( contract.orderTypes );
    args.push( contract.validExchanges );
    if (version >= 2) {
      args.push( contract.nextOptionDate );
      args.push( contract.nextOptionType );
      args.push( contract.nextOptionPartial );
      args.push( contract.notes );
    }
    if (version >= 4) {
      args.push(contract.longName);
    }
    if (version >= 6) {
      args.push(contract.evRule);
      args.push(contract.evMultiplier);
    }       
    
    if (version >= 5 && contract.secIdList) {
      let secID_length = Object.keys(contract.secIdList).length;
      args.push(secID_length);
      if(secID_length>0){
        for(let i =0 ; i< secID_length; ++i){
          args.push(contract.secIdList[i].tag);
          args.push(contract.secIdList[i].value);
        }
      }      
    }

    this._send(args);
  }

  _CONTRACT_DATA(reqId: number, contract: IContract) {
    const version = 1;
    const args: any[] = [C.INCOMING.CONTRACT_DATA, version];
    if (version >= 3) {
      args.push(reqId);
    }

    args.push( contract.summary.symbol );
    args.push( contract.summary.secType );
    args.push( contract.summary.expiry );
    args.push( contract.summary.strike );
    args.push( contract.summary.right );
    args.push( contract.summary.exchange );
    args.push( contract.summary.currency );
    args.push( contract.summary.localSymbol );
    args.push( contract.marketName );
    args.push( contract.summary.tradingClass );
    args.push( contract.summary.conId );
    args.push( contract.minTick );
    args.push( contract.summary.multiplier );
    args.push( contract.orderTypes );
    args.push( contract.validExchanges );

    if (version >= 2) {
      args.push(contract.priceMagnifier);
    }
    if (version >= 4) {
      args.push(contract.underConId);
    }
    if (version >= 5) {
      args.push(contract.longName);
      args.push(contract.summary.primaryExch);
    }
    if (version >= 6) {
      args.push(contract.contractMonth);
      args.push(contract.industry);
      args.push(contract.category);
      args.push(contract.subcategory);
      args.push(contract.timeZoneId);
      args.push(contract.tradingHours);
      args.push(contract.liquidHours);
    }

    if (version >= 8) {
      args.push(contract.evRule);
      args.push(contract.evMultiplier);
    }
    
    if (version >= 7 && contract.secIdList) {
      let secID_length = Object.keys(contract.secIdList).length;
      args.push(secID_length);
      if(secID_length>0){
        for(let i =0 ; i< secID_length; ++i){
          args.push(contract.secIdList[i].tag);
          args.push(contract.secIdList[i].value);
        }
      }      
    }
    
    this._send(args);
  }

  _CONTRACT_DATA_END(reqId: number) {
    const version = 1;
    this._send(C.INCOMING.CONTRACT_DATA_END, version, reqId);
  }

  _CURRENT_TIME(time: number) {
    const version = 1;
    this._send(C.INCOMING.CURRENT_TIME, version, time);
  }

  _DELTA_NEUTRAL_VALIDATION(reqId: number, underComp: IUnderComp) {
    const version = 1;
    const args: any[] = [C.INCOMING.DELTA_NEUTRAL_VALIDATION, version, reqId];
    args.push(underComp.conId);
    args.push(underComp.delta);
    args.push(underComp.price);

    this._send(args);
  }

  _ERR_MSG(errorCode: number, errorMsg: string, id: number) {
    const version = 2;
    if(version < 2){
      this._send(C.INCOMING.ERR_MSG, version, errorMsg);
    }else{
      this._send(C.INCOMING.ERR_MSG, version, errorCode, errorMsg, id);
    }    
  }

  _EXECUTION_DATA(reqId: number, contract: IContract, exec: IExec) {
    const version = 1;
    const args: any[] = [C.INCOMING.EXECUTION_DATA, version, reqId];
    args.push(contract.summary.conId);
    args.push(contract.summary.currency);
    args.push(contract.summary.exchange);
    args.push(contract.summary.expiry);
    args.push(contract.summary.localSymbol);
    if (C.SERVER_VERSION >= 15) {
      args.push(contract.summary.multiplier);
    }
    args.push(contract.summary.primaryExch);
    args.push(contract.summary.right);

    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
      args.push(contract.summary.secType);
    }
    args.push(contract.summary.strike);
    args.push(contract.summary.symbol);
    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
      args.push(contract.summary.tradingClass);
    }

    for (let key in exec) {
      args.push(exec[key]);
    }
  }

  _EXECUTION_DATA_END(reqId: number) {
    const version = 1;
    this._send(C.INCOMING.EXECUTION_DATA_END, version, reqId);
  }

  _FUNDAMENTAL_DATA(reqId: number, data: string) {
    const version = 1;
    this._send(C.INCOMING.FUNDAMENTAL_DATA, version, reqId, data);
  }

  //todo: Have exact type for historical:object
  //This is general comment for this code style, need to fix all
  _HISTORICAL_DATA(
    reqId: number,
    startDateStr: string,
    endDateStr: string,
    itemCount: number,
    historical: object
  ) {
    const version = 1;
    const args: any[] = [
      C.INCOMING.HISTOGRAM_DATA,
      version,
      startDateStr,
      endDateStr,
      itemCount
    ];
    // historical.date;
    // historical.open;
    // historical.high;
    // historical.low;
    // historical.close;
    // historical.volume;
    // historical.WAP;
    // historical.hasGaps;
    // historical.barCount;
    if (itemCount > 0 && Object.keys(historical).length > 0) {
      //Todo: this will not work as you cannot be sure about the order of properties
      //This is general comment for this code style, need to fix all
      for (let key in historical) {
        args.push(historical[key]);
      }
    }
    this._send(args);
  }

  _HEAD_TIMESTAMP(reqId: number, headTimestamp: string) {
    this._send(C.INCOMING.HEAD_TIMESTAMP, reqId, headTimestamp);
  }

  _MANAGED_ACCTS() {
    const version = 1;
    const accountsList = this._controller._ibServer.accountState.AccountName;

    this._send(C.INCOMING.MANAGED_ACCTS, version, accountsList);
  }

  _MARKET_DATA_TYPE(reqId: number, marketDataType: number) {
    const version = 1;
    this._send(C.INCOMING.MARKET_DATA_TYPE, version, reqId, marketDataType);
  }

  _MARKET_DEPTH(
    id: number,
    position: number,
    operation: number,
    side: number,
    price: number,
    size: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.MARKET_DEPTH,
      version,
      id,
      position,
      operation,
      side,
      price,
      size
    );
  }

  _MARKET_DEPTH_L2(
    id: number,
    position: number,
    marketMaker: string,
    operation: number,
    side: number,
    price: number,
    size: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.MARKET_DEPTH_L2,
      version,
      id,
      position,
      marketMaker,
      operation,
      side,
      price,
      size
    );
  }

  _NEWS_BULLETINS(
    newsMsgId: number,
    newsMsgType: number,
    newsMessage: string,
    originatingExch: string
  ) {
    const version = 1;

    this._send(
      C.INCOMING.NEWS_BULLETINS,
      version,
      newsMsgId,
      newsMsgType,
      newsMessage,
      originatingExch
    );
  }

  _NEXT_VALID_ID(orderId: number) {
    const version = 1;

    this._send(C.INCOMING.NEXT_VALID_ID, version, orderId);
  }

  _OPEN_ORDER(order: IOrder, contract: IContract) {
    const version = 1;
    const args: any[] = [C.INCOMING.OPEN_ORDER, version];
    for (let key in order) {
      args.push(order[key]);
    }
    args.push(contract.summary.conId);
    args.push(contract.summary.currency);
    args.push(contract.summary.exchange);
    args.push(contract.summary.expiry);
    args.push(contract.summary.localSymbol);
    if (C.SERVER_VERSION >= 15) {
      args.push(contract.summary.multiplier);
    }
    args.push(contract.summary.primaryExch);
    args.push(contract.summary.right);

    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
      args.push(contract.summary.secType);
    }
    args.push(contract.summary.strike);
    args.push(contract.summary.symbol);
    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
      args.push(contract.summary.tradingClass);
    }

    this._send(args);
  }

  _OPEN_ORDER_END() {
    const version = 1;

    this._send(C.INCOMING.OPEN_ORDER_END);
  }

  _ORDER_STATUS(
    id: number,
    status: string,
    filled: number,
    remaining: number,
    avgFillPrice: number,
    permId: number,
    parentId: number,
    lastFillPrice: number,
    whyHeld: number
  ) {
    const version = 1;
    const clientId = this._controller._clientId;
    this._send(
      C.INCOMING.ORDER_STATUS,
      version,
      id,
      status,
      filled,
      remaining,
      avgFillPrice,
      permId,
      parentId,
      lastFillPrice,
      clientId,
      whyHeld
    );
  }

  _PORTFOLIO_VALUE(
    contract: IContract,
    position: number,
    marketPrice: number,
    marketValue: number,
    averageCost: number,
    unrealizedPNL: number,
    realizedPNL: number,
    primaryExch: string
  ) {
    const version = 1;
    const args: any[] = [C.INCOMING.PORTFOLIO_VALUE, version];

    args.push(contract.summary.conId);
    args.push(contract.summary.currency);
    args.push(contract.summary.exchange);
    args.push(contract.summary.expiry);
    args.push(contract.summary.localSymbol);
    if (C.SERVER_VERSION >= 15) {
      args.push(contract.summary.multiplier);
    }
    args.push(contract.summary.primaryExch);
    args.push(contract.summary.right);

    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
      args.push(contract.summary.secType);
    }
    args.push(contract.summary.strike);
    args.push(contract.summary.symbol);
    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
      args.push(contract.summary.tradingClass);
    }
    args.push(position);
    args.push(marketPrice);
    args.push(marketValue);
    args.push(averageCost);
    args.push(unrealizedPNL);
    args.push(realizedPNL);
    args.push(this._controller._ibServer.accountState.AccountName);
    args.push(primaryExch);

    this._send(args);
  }

  _POSITION(
    account: string,
    contract: IContract,
    pos: number,
    avgCost: number
  ) {
    const version = 1;
    const args: any[] = [C.INCOMING.POSITION, version, account];

    args.push(contract.summary.conId);
    args.push(contract.summary.currency);
    args.push(contract.summary.exchange);
    args.push(contract.summary.expiry);
    args.push(contract.summary.localSymbol);
    if (C.SERVER_VERSION >= 15) {
      args.push(contract.summary.multiplier);
    }
    args.push(contract.summary.primaryExch);
    args.push(contract.summary.right);

    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
      args.push(contract.summary.secType);
    }
    args.push(contract.summary.strike);
    args.push(contract.summary.symbol);
    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
      args.push(contract.summary.tradingClass);
    }

    args.push(pos);
    args.push(avgCost);

    this._send(args);
  }

  _POSITION_END() {
    const version = 1;

    this._send(C.INCOMING.POSITION_END, version);
  }

  _POSITION_MULTI(
    reqId: number,
    account: string,
    contract: IContract,
    pos: number,
    avgCost: number
  ) {
    const version = 1;
    const args: any[] = [C.INCOMING.POSITION_MULTI, version, reqId, account];
    args.push(contract.summary.conId);
    args.push(contract.summary.currency);
    args.push(contract.summary.exchange);
    args.push(contract.summary.expiry);
    args.push(contract.summary.localSymbol);
    if (C.SERVER_VERSION >= 15) {
      args.push(contract.summary.multiplier);
    }
    args.push(contract.summary.primaryExch);
    args.push(contract.summary.right);

    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
      args.push(contract.summary.secType);
    }
    args.push(contract.summary.strike);
    args.push(contract.summary.symbol);
    if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
      args.push(contract.summary.tradingClass);
    }

    args.push(pos);
    args.push(avgCost);

    this._send(args);
  }

  _POSITION_MULTI_END(reqId: number) {
    const version = 1;

    this._send(C.INCOMING.POSITION_MULTI_END, version, reqId);
  }

  _REAL_TIME_BARS(
    reqId: number,
    time: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volumn: number,
    wap: number,
    count: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.POSITION_MULTI_END,
      version,
      reqId,
      time,
      open,
      high,
      low,
      close,
      volumn,
      wap,
      count
    );
  }

  _RECEIVE_FA(faDataType: number, xml: string) {
    const version = 1;

    this._send(C.INCOMING.RECEIVE_FA, version, faDataType, xml);
  }

  //Todo: have exact type for scannerData:object
  _SCANNER_DATA(
    tickerId: number,
    numberOfElements: number,
    scannerData: object
  ) {
    const version = 1;
    const args: any[] = [
      C.INCOMING.SCANNER_DATA,
      version,
      tickerId,
      numberOfElements
    ];

    if (numberOfElements > 0 && Object.keys(scannerData).length > 0) {
      for (let key in scannerData) {
        args.push(scannerData[key]);
        // args.push(distance);
        // args.push(benchmark);
        // args.push(projection);
        // args.push(legsStr);
      }
    }

    this._send(args);
  }

  _SCANNER_PARAMETERS(xml: string) {
    const version = 1;

    this._send(C.INCOMING.SCANNER_PARAMETERS, version, xml);
  }

  _SECURITY_DEFINITION_OPTION_PARAMETER(
    reqId: number,
    exchange: string,
    underlyingConId: number,
    tradingClass: string,
    multiplier: string,
    expCount: number,
    expData: object,
    strikeCount: number,
    strikeData: object
  ) {
    const args: any[] = [
      C.INCOMING.SECURITY_DEFINITION_OPTION_PARAMETER,
      reqId,
      exchange,
      underlyingConId,
      tradingClass,
      multiplier,
      expCount
    ];

    if (expCount > 0 && Object.keys(expData).length > 0) {
      for (let key in expData) {
        args.push(expData[key]);
      }
    }
    args.push(strikeCount);
    if (strikeCount > 0 && Object.keys(strikeData).length > 0) {
      for (let key in strikeData) {
        args.push(strikeData[key]);
      }
    }

    this._send(args);
  }

  _SECURITY_DEFINITION_OPTION_PARAMETER_END(reqId: number) {
    this._send(C.INCOMING.SECURITY_DEFINITION_OPTION_PARAMETER_END, reqId);
  }

  _TICK_EFP(
    tickerId: number,
    tickType: number,
    basisPoints: number,
    formattedBasisPoints: string,
    impliedFuturesPrice: number,
    holdDays: number,
    futureExpiry: string,
    dividendImpact: number,
    dividendsToExpiry: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.TICK_EFP,
      version,
      tickerId,
      tickType,
      basisPoints,
      formattedBasisPoints,
      impliedFuturesPrice,
      impliedFuturesPrice,
      holdDays,
      futureExpiry,
      dividendImpact,
      dividendsToExpiry
    );
  }

  _TICK_GENERIC(tickerId: number, tickType: number, value: number) {
    const version = 1;

    this._send(C.INCOMING.TICK_GENERIC, version, tickerId, tickType, value);
  }

  _TICK_OPTION_COMPUTATION(
    tickerId: number,
    tickType: number,
    delta: number,
    optPrice: number,
    pvDividend: number,
    gamma: number,
    vega: number,
    theta: number,
    undPrice: number
  ) {
    const version = 1;

    this._send(
      C.INCOMING.TICK_OPTION_COMPUTATION,
      version,
      tickerId,
      tickType,
      delta,
      optPrice,
      pvDividend,
      gamma,
      vega,
      theta,
      undPrice
    );
  }

  _TICK_PRICE(tickerId: number, tickType: number, price: number) {
    const version = 1;

    this._send(C.INCOMING.TICK_PRICE, version, tickerId, tickType, price);
  }

  _TICK_SIZE(tickerId: number, tickType: number, size: number) {
    const version = 1;

    this._send(C.INCOMING.TICK_SIZE, version, tickerId, tickType, size);
  }

  _TICK_SNAPSHOT_END(reqId: number) {
    const version = 1;

    this._send(C.INCOMING.TICK_SNAPSHOT_END, version, reqId);
  }

  _TICK_STRING(tickerId: number, tickType: number, value: string) {
    const version = 1;

    this._send(C.INCOMING.TICK_STRING, version, tickerId, tickType, value);
  }

  _DISPLAY_GROUP_LIST(reqId: number, list: string) {
    const version = 1;

    this._send(C.INCOMING.DISPLAY_GROUP_LIST, version, reqId, list);
  }

  _DISPLAY_GROUP_UPDATED(reqId: number, contractInfo: string) {
    const version = 1;

    this._send(C.INCOMING.DISPLAY_GROUP_UPDATED, version, reqId, contractInfo);
  }
}

export default Outgoing;
