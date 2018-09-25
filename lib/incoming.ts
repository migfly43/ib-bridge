import * as _ from "lodash";

import * as C from "./constants";
import errors = require("./errors");
import {IComboLeg, IContract, ITagValue, IUnderComp, IExec, IOrder, IOrderState} from "./interfaces";
import Controller from "./controller";

class Incoming {
  _controller: Controller;
  _dataQueue: string[] = [];
  _emitQueue = [];

  constructor(controller: Controller) {
    this._controller = controller;

    this._dataQueue = [];
    this._emitQueue = [];
  }

  _ACCT_DOWNLOAD_END() {
    const version = this.dequeueInt();
    const accountName = this.dequeue();

    this._emit("accountDownloadEnd", accountName);
  }

  _ACCOUNT_SUMMARY() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const account = this.dequeue();
    const tag = this.dequeue();
    const value = this.dequeue();
    const currency = this.dequeue();

    this._emit("accountSummary", reqId, account, tag, value, currency);
  }

  _ACCOUNT_UPDATE_MULTI_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeue();

    this._emit("accountUpdateMultiEnd", reqId);
  }

  _ACCOUNT_UPDATE_MULTI() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const account = this.dequeue();
    const modelCode = this.dequeue();
    const key = this.dequeue();
    const value = this.dequeue();
    const currency = this.dequeue();

    this._emit(
      "accountUpdateMulti",
      reqId,
      account,
      modelCode,
      key,
      value,
      currency
    );
  }

  _ACCOUNT_SUMMARY_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    this._emit("accountSummaryEnd", reqId);
  }

  _ACCT_UPDATE_TIME() {
    const version = this.dequeueInt();
    const timeStamp = this.dequeue();

    this._emit("updateAccountTime", timeStamp);
  }

  _ACCT_VALUE() {
    const version = this.dequeueInt();
    const key = this.dequeue();
    const value = this.dequeue();
    const currency = this.dequeue();
    let accountName = null;

    if (version >= 2) {
      accountName = this.dequeue();
    }

    this._emit("updateAccountValue", key, value, currency, accountName);
  }

  _COMMISSION_REPORT() {
    const version = this.dequeueInt();
    let commissionReport = {
      execId: this.dequeue(),
      commission: this.dequeueFloat(),
      currency: this.dequeue(),
      realizedPNL: this.dequeueFloat(),
      yield: this.dequeueFloat(),
      yieldRedemptionDate: this.dequeueInt()
    };

    this._emit("commissionReport", commissionReport);
  }

  _BOND_CONTRACT_DATA() {
    const version = this.dequeueInt();
    let reqId = -1;
    let i;

    if (version >= 3) {
      reqId = this.dequeueInt();
    }

    const contract: IContract = {
      summary: {}
    };

    contract.summary.symbol = this.dequeue();
    contract.summary.secType = this.dequeue();
    contract.cusip = this.dequeue();
    contract.coupon = this.dequeueFloat();
    contract.maturity = this.dequeue();
    contract.issueDate = this.dequeue();
    contract.ratings = this.dequeue();
    contract.bondType = this.dequeue();
    contract.couponType = this.dequeue();
    contract.convertible = this.dequeueBool();
    contract.callable = this.dequeueBool();
    contract.putable = this.dequeueBool();
    contract.descAppend = this.dequeue();
    contract.summary.exchange = this.dequeue();
    contract.summary.currency = this.dequeue();
    contract.marketName = this.dequeue();
    contract.summary.tradingClass = this.dequeue();
    contract.summary.conId = this.dequeueInt();
    contract.minTick = this.dequeueFloat();
    contract.orderTypes = this.dequeue();
    contract.validExchanges = this.dequeue();

    if (version >= 2) {
      contract.nextOptionDate = this.dequeue();
      contract.nextOptionType = this.dequeue();
      contract.nextOptionPartial = this.dequeueBool();
      contract.notes = this.dequeue();
    }

    if (version >= 4) {
      contract.longName = this.dequeue();
    }

    if (version >= 6) {
      contract.evRule = this.dequeue();
      contract.evMultiplier = this.dequeueFloat();
    }

    let secIdListCount;
    let tagValue;

    if (version >= 5) {
      secIdListCount = this.dequeueInt();

      if (secIdListCount > 0) {
        contract.secIdList = [];

        while (secIdListCount--) {
          const tagValue: ITagValue = {};
          tagValue.tag = this.dequeue();
          tagValue.value = this.dequeue();
          contract.secIdList.push(tagValue);
        }
      }
    }

    this._emit("bondContractDetails", reqId, contract);
  }

  _CONTRACT_DATA() {
    const version = this.dequeueInt();
    let reqId = -1;

    if (version >= 3) {
      reqId = this.dequeueInt();
    }

    const contract: IContract = {
      summary: {}
    };

    contract.summary.symbol = this.dequeue();
    contract.summary.secType = this.dequeue();
    contract.summary.expiry = this.dequeue();
    contract.summary.strike = this.dequeueFloat();
    contract.summary.right = this.dequeue();
    contract.summary.exchange = this.dequeue();
    contract.summary.currency = this.dequeue();
    contract.summary.localSymbol = this.dequeue();
    contract.marketName = this.dequeue();
    contract.summary.tradingClass = this.dequeue();
    contract.summary.conId = this.dequeueInt();
    contract.minTick = this.dequeueFloat();
    contract.summary.multiplier = this.dequeue();
    contract.orderTypes = this.dequeue();
    contract.validExchanges = this.dequeue();

    if (version >= 2) {
      contract.priceMagnifier = this.dequeueInt();
    }

    if (version >= 4) {
      contract.underConId = this.dequeueInt();
    }

    if (version >= 5) {
      contract.longName = this.dequeue();
      contract.summary.primaryExch = this.dequeue();
    }

    if (version >= 6) {
      contract.contractMonth = this.dequeue();
      contract.industry = this.dequeue();
      contract.category = this.dequeue();
      contract.subcategory = this.dequeue();
      contract.timeZoneId = this.dequeue();
      contract.tradingHours = this.dequeue();
      contract.liquidHours = this.dequeue();
    }

    if (version >= 8) {
      contract.evRule = this.dequeue();
      contract.evMultiplier = this.dequeueFloat();
    }

    let secIdListCount;
    let tagValue;
    let i;

    if (version >= 7) {
      secIdListCount = this.dequeueInt();      
      if (secIdListCount > 0) {
        contract.secIdList = [];
        for (i = 0; i < secIdListCount; ++i) {
          tagValue = {};
          tagValue.tag = this.dequeue();
          tagValue.value = this.dequeue();
          contract.secIdList.push(tagValue);
        }
      }
    }

    this._emit("contractDetails", reqId, contract);
  }

  _CONTRACT_DATA_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    this._emit("contractDetailsEnd", reqId);
  }

  _CURRENT_TIME() {
    const version = this.dequeueInt();
    const time = this.dequeueInt();

    this._emit("currentTime", time);
  }

  _DELTA_NEUTRAL_VALIDATION() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    const underComp: IUnderComp = {};
    underComp.conId = this.dequeueInt();
    underComp.delta = this.dequeueFloat();
    underComp.price = this.dequeueFloat();

    this._emit("deltaNeutralValidation", reqId, underComp);
  }

  _ERR_MSG() {
    let errorCode;
    let errorMsg;
    let id;
    const version = this.dequeueInt();

    if (version < 2) {
      errorMsg = this.dequeue();
      this._controller.emitError(errorMsg);
    } else {
      id = this.dequeueInt();
      errorCode = this.dequeueInt();
      errorMsg = this.dequeue();
      this._controller.emitError(errorMsg, {
        id: id,
        code: errorCode
      });
    }
  }

  _EXECUTION_DATA() {
    const version = this.dequeueInt();

    let reqId = -1;

    if (version >= 7) {
      reqId = this.dequeueInt();
    }

    const orderId = this.dequeueInt();

    const contract: IContract = {
      summary: {}
    };

    if (version >= 5) {
      contract.conId = this.dequeueInt();
    }

    contract.symbol = this.dequeue();
    contract.secType = this.dequeue();
    contract.expiry = this.dequeue();
    contract.strike = this.dequeueFloat();
    contract.right = this.dequeue();

    if (version >= 9) {
      contract.multiplier = this.dequeue();
    }

    contract.exchange = this.dequeue();
    contract.currency = this.dequeue();
    contract.localSymbol = this.dequeue();

    if (version >= 10) {
      contract.tradingClass = this.dequeue();
    }

    const exec: IExec = {};

    exec.orderId = orderId;
    exec.execId = this.dequeue();
    exec.time = this.dequeue();
    exec.acctNumber = this.dequeue();
    exec.exchange = this.dequeue();
    exec.side = this.dequeue();
    exec.shares = this.dequeue();
    exec.price = this.dequeueFloat();

    if (version >= 2) {
      exec.permId = this.dequeueInt();
    }

    if (version >= 3) {
      exec.clientId = this.dequeueInt();
    }

    if (version >= 4) {
      exec.liquidation = this.dequeueInt();
    }

    if (version >= 6) {
      exec.cumQty = this.dequeueInt();
      exec.avgPrice = this.dequeueFloat();
    }

    if (version >= 8) {
      exec.orderRef = this.dequeue();
    }

    if (version >= 9) {
      exec.evRule = this.dequeue();
      exec.evMultiplier = this.dequeueFloat();
    }

    this._emit("execDetails", reqId, contract, exec);
  }

  _EXECUTION_DATA_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    this._emit("execDetailsEnd", reqId);
  }

  _FUNDAMENTAL_DATA() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const data = this.dequeue();

    this._emit("fundamentalData", reqId, data);
  }

  _HISTORICAL_DATA() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    let completedIndicator = "finished";
    let startDateStr;
    let endDateStr;

    if (version >= 2) {
      startDateStr = this.dequeue();
      endDateStr = this.dequeue();
      completedIndicator += "-" + startDateStr + "-" + endDateStr;
    }

    let itemCount = this.dequeueInt();
    let date;
    let open;
    let high;
    let low;
    let close;
    let volume;
    let WAP;
    let hasGaps;
    let barCount;

    while (itemCount--) {
      date = this.dequeue();
      open = this.dequeueFloat();
      high = this.dequeueFloat();
      low = this.dequeueFloat();
      close = this.dequeueFloat();
      volume = this.dequeueInt();
      WAP = this.dequeueFloat();
      hasGaps = this.dequeueBool();
      barCount = -1;

      if (version >= 3) {
        barCount = this.dequeueInt();
      }

      this._emit(
        "historicalData",
        reqId,
        date,
        open,
        high,
        low,
        close,
        volume,
        barCount,
        WAP,
        hasGaps
      );
    }

    // send end of dataset marker
    this._emit(
      "historicalData",
      reqId,
      completedIndicator,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      false
    );
  }

  _HEAD_TIMESTAMP() {
    const reqId = this.dequeueInt();
    const headTimestamp = this.dequeue();
    this._emit("headTimestamp", reqId, headTimestamp);
  }

  _MANAGED_ACCTS() {
    const version = this.dequeueInt();
    const accountsList = this.dequeue();

    this._emit("managedAccounts", accountsList);
  }

  _MARKET_DATA_TYPE() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const marketDataType = this.dequeueInt();

    this._emit("marketDataType", reqId, marketDataType);
  }

  _MARKET_DEPTH() {
    const version = this.dequeueInt();
    const id = this.dequeueInt();
    const position = this.dequeueInt();
    const operation = this.dequeueInt();
    const side = this.dequeueInt();
    const price = this.dequeueFloat();
    const size = this.dequeueInt();

    this._emit("updateMktDepth", id, position, operation, side, price, size);
  }

  _MARKET_DEPTH_L2() {
    const version = this.dequeueInt();
    const id = this.dequeueInt();
    const position = this.dequeueInt();
    const marketMaker = this.dequeue();
    const operation = this.dequeueInt();
    const side = this.dequeueInt();
    const price = this.dequeueFloat();
    const size = this.dequeueInt();

    this._emit(
      "updateMktDepthL2",
      id,
      position,
      marketMaker,
      operation,
      side,
      price,
      size
    );
  }

  _NEWS_BULLETINS() {
    const version = this.dequeueInt();
    const newsMsgId = this.dequeueInt();
    const newsMsgType = this.dequeueInt();
    const newsMessage = this.dequeue();
    const originatingExch = this.dequeue();

    this._emit(
      "updateNewsBulletin",
      newsMsgId,
      newsMsgType,
      newsMessage,
      originatingExch
    );
  }

  _NEXT_VALID_ID() {
    const version = this.dequeueInt();
    const orderId = this.dequeueInt();

    this._emit("nextValidId", orderId);
  }

  _OPEN_ORDER() {
    let i;

    // read version
    const version = this.dequeueInt();

    const order: IOrder = {};
    order.orderId = this.dequeueInt();

    // read contract fields
    const contract: IContract = {
      summary: {}
    };
    if (version >= 17) {
      contract.conId = this.dequeueInt();
    }

    contract.symbol = this.dequeue();
    contract.secType = this.dequeue();
    contract.expiry = this.dequeue();
    contract.strike = this.dequeueFloat();
    contract.right = this.dequeue();

    if (version >= 32) {
      contract.multiplier = this.dequeue();
    }

    contract.exchange = this.dequeue();
    contract.currency = this.dequeue();

    if (version >= 2) {
      contract.localSymbol = this.dequeue();
    }

    if (version >= 32) {
      contract.tradingClass = this.dequeue();
    }

    // read order fields
    order.action = this.dequeue();
    order.totalQuantity = this.dequeueInt();
    order.orderType = this.dequeue();

    if (version < 29) {
      order.lmtPrice = this.dequeueFloat();
    } else {
      order.lmtPrice = this.dequeueFloat() || Number.MAX_VALUE;
    }

    if (version < 30) {
      order.auxPrice = this.dequeueFloat();
    } else {
      order.auxPrice = this.dequeueFloat() || Number.MAX_VALUE;
    }

    order.tif = this.dequeue();
    order.ocaGroup = this.dequeue();
    order.account = this.dequeue();
    order.openClose = this.dequeue();
    order.origin = this.dequeueInt();
    order.orderRef = this.dequeue();

    if (version >= 3) {
      order.clientId = this.dequeueInt();
    }

    if (version >= 4) {
      order.permId = this.dequeueInt();

      if (version < 18) {
        // will never happen
        /* order.ignoreRth = */
        this.dequeueBool();
      } else {
        order.outsideRth = this.dequeueBool();
      }

      order.hidden = this.dequeueBool();
      order.discretionaryAmt = this.dequeueFloat();
    }

    if (version >= 5) {
      order.goodAfterTime = this.dequeue();
    }

    if (version >= 6) {
      // skip deprecated sharesAllocation field
      this.dequeue();
    }

    if (version >= 7) {
      order.faGroup = this.dequeue();
      order.faMethod = this.dequeue();
      order.faPercentage = this.dequeue();
      order.faProfile = this.dequeue();
    }

    if (version >= 8) {
      order.goodTillDate = this.dequeue();
    }

    if (version >= 9) {
      order.rule80A = this.dequeue();
      order.percentOffset = this.dequeueFloat() || Number.MAX_VALUE;
      order.settlingFirm = this.dequeue();
      order.shortSaleSlot = this.dequeueInt();
      order.designatedLocation = this.dequeue();

      if (this._controller._serverVersion === 51) {
        this.dequeueInt(); // exemptCode
      } else if (version >= 23) {
        order.exemptCode = this.dequeueInt();
      }

      order.auctionStrategy = this.dequeueInt();
      order.startingPrice = this.dequeueFloat() || Number.MAX_VALUE;
      order.stockRefPrice = this.dequeueFloat() || Number.MAX_VALUE;
      order.delta = this.dequeueFloat() || Number.MAX_VALUE;
      order.stockRangeLower = this.dequeueFloat() || Number.MAX_VALUE;
      order.stockRangeUpper = this.dequeueFloat() || Number.MAX_VALUE;
      order.displaySize = this.dequeueInt();

      if (version < 18) {
        // will never happen
        /* order.rthOnly = */
        this.dequeueBool();
      }

      order.blockOrder = this.dequeueBool();
      order.sweepToFill = this.dequeueBool();
      order.allOrNone = this.dequeueBool();
      order.minQty = this.dequeueInt() || Number.MAX_VALUE;
      order.ocaType = this.dequeueInt();
      order.eTradeOnly = this.dequeueBool();
      order.firmQuoteOnly = this.dequeueBool();
      order.nbboPriceCap = this.dequeueFloat() || Number.MAX_VALUE;
    }

    if (version >= 10) {
      order.parentId = this.dequeueInt();
      order.triggerMethod = this.dequeueInt();
    }

    let receivedInt;

    if (version >= 11) {
      order.volatility = this.dequeueFloat() || Number.MAX_VALUE;
      order.volatilityType = this.dequeueInt();

      if (version === 11) {
        receivedInt = this.dequeueInt();
        order.deltaNeutralOrderType = receivedInt === 0 ? "NONE" : "MKT";
      } else {
        // version 12 and up
        order.deltaNeutralOrderType = this.dequeue();
        order.deltaNeutralAuxPrice = this.dequeueFloat() || Number.MAX_VALUE;

        if (version >= 27 && !_.isEmpty(order.deltaNeutralOrderType)) {
          order.deltaNeutralConId = this.dequeueInt();
          order.deltaNeutralSettlingFirm = this.dequeue();
          order.deltaNeutralClearingAccount = this.dequeue();
          order.deltaNeutralClearingIntent = this.dequeue();
        }

        if (version >= 31 && !_.isEmpty(order.deltaNeutralOrderType)) {
          order.deltaNeutralOpenClose = this.dequeue();
          order.deltaNeutralShortSale = this.dequeueBool();
          order.deltaNeutralShortSaleSlot = this.dequeueInt();
          order.deltaNeutralDesignatedLocation = this.dequeue();
        }
      }

      order.continuousUpdate = this.dequeueInt();

      if (this._controller._serverVersion === 26) {
        order.stockRangeLower = this.dequeueFloat();
        order.stockRangeUpper = this.dequeueFloat();
      }

      order.referencePriceType = this.dequeueInt();
    }

    if (version >= 13) {
      order.trailStopPrice = this.dequeueFloat() || Number.MAX_VALUE;
    }

    if (version >= 30) {
      order.trailingPercent = this.dequeueFloat() || Number.MAX_VALUE;
    }

    if (version >= 14) {
      order.basisPoints = this.dequeueFloat() || Number.MAX_VALUE;
      order.basisPointsType = this.dequeueInt() || Number.MAX_VALUE;
      contract.comboLegsDescrip = this.dequeue();
    }

    let comboLeg;
    let comboLegsCount;
    let orderComboLeg;
    let orderComboLegsCount;
    let price;

    if (version >= 29) {
      comboLegsCount = this.dequeueInt();

      if (comboLegsCount > 0) {
        contract.comboLegs = [];

        for (i = 0; i < comboLegsCount; ++i) {
          const comboLeg: IComboLeg = {};
          comboLeg.conId = this.dequeueInt();
          comboLeg.ratio = this.dequeueInt();
          comboLeg.action = this.dequeue();
          comboLeg.exchange = this.dequeue();
          comboLeg.openClose = this.dequeueInt();
          comboLeg.shortSaleSlot = this.dequeueInt();
          comboLeg.designatedLocation = this.dequeue();
          comboLeg.exemptCode = this.dequeueInt();
          contract.comboLegs.push(comboLeg);
        }
      }

      orderComboLegsCount = this.dequeueInt();

      if (orderComboLegsCount > 0) {
        order.orderComboLegs = [];

        for (i = 0; i < orderComboLegsCount; ++i) {
          orderComboLeg = {};
          order.price = this.dequeueFloat() || Number.MAX_VALUE;
          order.orderComboLegs.push(orderComboLeg);
        }
      }
    }

    let smartComboRoutingParamsCount;
    let tagValue;

    if (version >= 26) {
      smartComboRoutingParamsCount = this.dequeueInt();
      if (smartComboRoutingParamsCount > 0) {
        order.smartComboRoutingParams = [];

        for (i = 0; i < smartComboRoutingParamsCount; ++i) {
          const tagValue: ITagValue = {};
          tagValue.tag = this.dequeue();
          tagValue.value = this.dequeue();
          order.smartComboRoutingParams.push(tagValue);
        }
      }
    }

    if (version >= 15) {
      if (version >= 20) {
        order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
        order.scaleSubsLevelSize = this.dequeueInt() || Number.MAX_VALUE;
      } else {
        const notSuppScaleNumComponents = this.dequeueInt() || Number.MAX_VALUE;
        order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
      }
      order.scalePriceIncrement = this.dequeueFloat() || Number.MAX_VALUE;
    }

    if (
      version >= 28 &&
      order.scalePriceIncrement > 0.0 &&
      order.scalePriceIncrement !== Number.MAX_VALUE
    ) {
      order.scalePriceAdjustValue = this.dequeueFloat() || Number.MAX_VALUE;
      order.scalePriceAdjustInterval = this.dequeueInt() || Number.MAX_VALUE;
      order.scaleProfitOffset = this.dequeueFloat() || Number.MAX_VALUE;
      order.scaleAutoReset = this.dequeueBool();
      order.scaleInitPosition = this.dequeueInt() || Number.MAX_VALUE;
      order.scaleInitFillQty = this.dequeueInt() || Number.MAX_VALUE;
      order.scaleRandomPercent = this.dequeueBool();
    }

    if (version >= 24) {
      order.hedgeType = this.dequeue();

      if (!_.isEmpty(order.hedgeType)) {
        order.hedgeParam = this.dequeue();
      }
    }

    if (version >= 25) {
      order.optOutSmartRouting = this.dequeueBool();
    }

    if (version >= 19) {
      order.clearingAccount = this.dequeue();
      order.clearingIntent = this.dequeue();
    }

    if (version >= 22) {
      order.notHeld = this.dequeueBool();
    }

    let underComp;

    if (version >= 20) {
      if (this.dequeueBool()) {
        underComp = {};
        underComp.conId = this.dequeueInt();
        underComp.delta = this.dequeueFloat();
        underComp.price = this.dequeueFloat();
        contract.underComp = underComp;
      }
    }

    let algoParamsCount;

    if (version >= 21) {
      order.algoStrategy = this.dequeue();

      if (!_.isEmpty(order.algoStrategy)) {
        algoParamsCount = this.dequeueInt();

        if (algoParamsCount > 0) {
          order.algoParams = [];

          for (i = 0; i < algoParamsCount; ++i) {
            const tagValue: ITagValue = {};
            tagValue.tag = this.dequeue();
            tagValue.value = this.dequeue();
            order.algoParams.push(tagValue);
          }
        }
      }
    }

    const orderState: IOrderState = {};

    if (version >= 16) {
      order.whatIf = this.dequeueBool();
      orderState.status = this.dequeue();
      orderState.initMargin = this.dequeue();
      orderState.maintMargin = this.dequeue();
      orderState.equityWithLoan = this.dequeue();
      orderState.commission = this.dequeueFloat() || Number.MAX_VALUE;
      orderState.minCommission = this.dequeueFloat() || Number.MAX_VALUE;
      orderState.maxCommission = this.dequeueFloat() || Number.MAX_VALUE;
      orderState.commissionCurrency = this.dequeue();
      orderState.warningText = this.dequeue();
    }

    this._emit("openOrder", order.orderId, contract, order, orderState);
  }

  _OPEN_ORDER_END() {
    const version = this.dequeueInt();

    this._emit("openOrderEnd");
  }

  _ORDER_STATUS() {
    const version = this.dequeueInt();
    const id = this.dequeueInt();
    const status = this.dequeue();
    const filled = this.dequeueInt();
    const remaining = this.dequeueInt();
    const avgFillPrice = this.dequeueFloat();

    let permId = 0;

    if (version >= 2) {
      permId = this.dequeueInt();
    }

    let parentId = 0;

    if (version >= 3) {
      parentId = this.dequeueInt();
    }

    let lastFillPrice = 0;

    if (version >= 4) {
      lastFillPrice = this.dequeueFloat();
    }

    let clientId = 0;

    if (version >= 5) {
      clientId = this.dequeueInt();
    }

    let whyHeld = null;

    if (version >= 6) {
      whyHeld = this.dequeue();
    }

    this._emit(
      "orderStatus",
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

  _PORTFOLIO_VALUE() {
    const version = this.dequeueInt();

    const contract: IContract = {
      summary: {}
    };

    if (version >= 6) {
      contract.conId = this.dequeueInt();
    }

    contract.symbol = this.dequeue();
    contract.secType = this.dequeue();
    contract.expiry = this.dequeue();
    contract.strike = this.dequeueFloat();
    contract.right = this.dequeue();

    if (version >= 7) {
      contract.multiplier = this.dequeue();
      contract.primaryExch = this.dequeue();
    }

    contract.currency = this.dequeue();

    if (version >= 2) {
      contract.localSymbol = this.dequeue();
    }

    if (version >= 8) {
      contract.tradingClass = this.dequeue();
    }

    const position = this.dequeueInt();
    const marketPrice = this.dequeueFloat();
    const marketValue = this.dequeueFloat();
    let averageCost = 0.0;
    let unrealizedPNL = 0.0;
    let realizedPNL = 0.0;

    if (version >= 3) {
      averageCost = this.dequeueFloat();
      unrealizedPNL = this.dequeueFloat();
      realizedPNL = this.dequeueFloat();
    }

    let accountName = null;

    if (version >= 4) {
      accountName = this.dequeue();
    }

    if (version === 6 && this._controller._serverVersion === 39) {
      contract.primaryExch = this.dequeue();
    }

    this._emit(
      "updatePortfolio",
      contract,
      position,
      marketPrice,
      marketValue,
      averageCost,
      unrealizedPNL,
      realizedPNL,
      accountName
    );
  }

  _POSITION() {
    const version = this.dequeueInt();
    const account = this.dequeue();

    const contract: IContract = {
      summary: {}
    };

    contract.conId = this.dequeueInt();
    contract.symbol = this.dequeue();
    contract.secType = this.dequeue();
    contract.expiry = this.dequeue();
    contract.strike = this.dequeueFloat();
    contract.right = this.dequeue();
    contract.multiplier = this.dequeue();
    contract.exchange = this.dequeue();
    contract.currency = this.dequeue();
    contract.localSymbol = this.dequeue();
    if (version >= 2) {
      contract.tradingClass = this.dequeue();
    }

    const pos = this.dequeueInt();
    let avgCost = 0;
    if (version >= 3) {
      avgCost = this.dequeueFloat();
    }

    this._emit("position", account, contract, pos, avgCost);
  }

  _POSITION_END() {
    const version = this.dequeueInt();

    this._emit("positionEnd");
  }

  _POSITION_MULTI() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const account = this.dequeue();
    const modelCode = null;

    const contract: IContract = {
      summary: {}
    };

    contract.conId = this.dequeueInt();
    contract.symbol = this.dequeue();
    contract.secType = this.dequeue();
    contract.expiry = this.dequeue();
    contract.strike = this.dequeueFloat();
    contract.right = this.dequeue();
    contract.multiplier = this.dequeue();
    contract.exchange = this.dequeue();
    contract.currency = this.dequeue();
    contract.localSymbol = this.dequeue();
    contract.tradingClass = this.dequeue();

    const pos = this.dequeueInt();
    let avgCost = 0;
    avgCost = this.dequeueFloat();

    this._emit(
      "positionMulti",
      reqId,
      account,
      modelCode,
      contract,
      pos,
      avgCost
    );
  }

  _POSITION_MULTI_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    this._emit("positionMultiEnd", reqId);
  }

  _REAL_TIME_BARS() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const time = this.dequeueInt();
    const open = this.dequeueFloat();
    const high = this.dequeueFloat();
    const low = this.dequeueFloat();
    const close = this.dequeueFloat();
    const volume = this.dequeueInt();
    const wap = this.dequeueFloat();
    const count = this.dequeueInt();

    this._emit(
      "realtimeBar",
      reqId,
      time,
      open,
      high,
      low,
      close,
      volume,
      wap,
      count
    );
  }

  _RECEIVE_FA() {
    const version = this.dequeueInt();
    const faDataType = this.dequeueInt();
    const xml = this.dequeue();

    this._emit("receiveFA", faDataType, xml);
  }

  _SCANNER_DATA() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    let numberOfElements = this.dequeueInt();

    let rank;

    while (numberOfElements--) {
      const contract: IContract = {
        summary: {}
      };
      rank = this.dequeueInt();
      if (version >= 3) {
        contract.summary.conId = this.dequeueInt();
      }

      contract.summary.symbol = this.dequeue();
      contract.summary.secType = this.dequeue();
      contract.summary.expiry = this.dequeue();
      contract.summary.strike = this.dequeueFloat();
      contract.summary.right = this.dequeue();
      contract.summary.exchange = this.dequeue();
      contract.summary.currency = this.dequeue();
      contract.summary.localSymbol = this.dequeue();
      contract.marketName = this.dequeue();
      contract.summary.tradingClass = this.dequeue();

      const distance = this.dequeue();
      const benchmark = this.dequeue();
      const projection = this.dequeue();
      let legsStr = null;

      if (version >= 2) {
        legsStr = this.dequeue();
      }

      this._emit(
        "scannerData",
        tickerId,
        rank,
        contract,
        distance,
        benchmark,
        projection,
        legsStr
      );
    }

    this._emit("scannerDataEnd", tickerId);
  }

  _SCANNER_PARAMETERS() {
    const version = this.dequeueInt();
    const xml = this.dequeue();

    this._emit("scannerParameters", xml);
  }

  _SECURITY_DEFINITION_OPTION_PARAMETER() {
    const reqId = this.dequeueInt();
    const exchange = this.dequeue();
    const underlyingConId = this.dequeueInt();
    const tradingClass = this.dequeue();
    const multiplier = this.dequeue();
    const expCount = this.dequeueInt();
    let expirations = [];

    for (let i = 0; i < expCount; i++) {
      expirations.push(this.dequeue());
    }

    const strikeCount = this.dequeueInt();
    const strikes = [];
    for (let j = 0; j < strikeCount; j++) {
      strikes.push(this.dequeueFloat());
    }

    this._emit(
      "securityDefinitionOptionParameter",
      reqId,
      exchange,
      underlyingConId,
      tradingClass,
      multiplier,
      expirations,
      strikes
    );
  }

  _SECURITY_DEFINITION_OPTION_PARAMETER_END() {
    const reqId = this.dequeueInt();
    this._emit("securityDefinitionOptionParameterEnd", reqId);
  }

  _TICK_EFP() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    const basisPoints = this.dequeueFloat();
    const formattedBasisPoints = this.dequeue();
    const impliedFuturesPrice = this.dequeueFloat();
    const holdDays = this.dequeueInt();
    const futureExpiry = this.dequeue();
    const dividendImpact = this.dequeueFloat();
    const dividendsToExpiry = this.dequeueFloat();

    this._emit(
      "tickEFP",
      tickerId,
      tickType,
      basisPoints,
      formattedBasisPoints,
      impliedFuturesPrice,
      holdDays,
      futureExpiry,
      dividendImpact,
      dividendsToExpiry
    );
  }

  _TICK_GENERIC() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    const value = this.dequeueFloat();

    this._emit("tickGeneric", tickerId, tickType, value);
  }

  _TICK_OPTION_COMPUTATION() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    let impliedVol = this.dequeueFloat();

    if (impliedVol < 0) {
      // -1 is the "not yet computed" indicator
      impliedVol = Number.MAX_VALUE;
    }

    let delta = this.dequeueFloat();

    if (Math.abs(delta) > 1) {
      // -2 is the "not yet computed" indicator
      delta = Number.MAX_VALUE;
    }

    let optPrice = Number.MAX_VALUE;
    let pvDividend = Number.MAX_VALUE;
    let gamma = Number.MAX_VALUE;
    let vega = Number.MAX_VALUE;
    let theta = Number.MAX_VALUE;
    let undPrice = Number.MAX_VALUE;

    if (version >= 6 || tickType === C.TICK_TYPE.MODEL_OPTION) {
      // introduced in version == 5
      optPrice = this.dequeueFloat();

      if (optPrice < 0) {
        // -1 is the "not yet computed" indicator
        optPrice = Number.MAX_VALUE;
      }

      pvDividend = this.dequeueFloat();

      if (pvDividend < 0) {
        // -1 is the "not yet computed" indicator
        pvDividend = Number.MAX_VALUE;
      }
    }

    if (version >= 6) {
      gamma = this.dequeueFloat();

      if (Math.abs(gamma) > 1) {
        // -2 is the "not yet computed" indicator
        gamma = Number.MAX_VALUE;
      }

      vega = this.dequeueFloat();

      if (Math.abs(vega) > 1) {
        // -2 is the "not yet computed" indicator
        vega = Number.MAX_VALUE;
      }

      theta = this.dequeueFloat();

      if (Math.abs(theta) > 1) {
        // -2 is the "not yet computed" indicator
        theta = Number.MAX_VALUE;
      }

      undPrice = this.dequeueFloat();

      if (undPrice < 0) {
        // -1 is the "not yet computed" indicator
        undPrice = Number.MAX_VALUE;
      }
    }

    this._emit(
      "tickOptionComputation",
      tickerId,
      tickType,
      impliedVol,
      delta,
      optPrice,
      pvDividend,
      gamma,
      vega,
      theta,
      undPrice
    );
  }

  _TICK_PRICE() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    const price = this.dequeueFloat();
    let size = 0;

    if (version >= 2) {
      size = this.dequeueInt();
    }

    let canAutoExecute = false;

    if (version >= 3) {
      canAutoExecute = this.dequeueBool();
    }

    this._emit("tickPrice", tickerId, tickType, price, canAutoExecute);

    let sizeTickType = -1;

    if (version >= 2) {
      sizeTickType = -1; // not a tick

      switch (tickType) {
        case 1: // BID
          sizeTickType = 0; // BID_SIZE
          break;
        case 2: // ASK
          sizeTickType = 3; // ASK_SIZE
          break;
        case 4: // LAST
          sizeTickType = 5; // LAST_SIZE
          break;
        default:
          break;
      }

      if (sizeTickType !== -1) {
        this._emit("tickSize", tickerId, sizeTickType, size);
      }
    }
  }

  _TICK_SIZE() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    const size = this.dequeueInt();

    this._emit("tickSize", tickerId, tickType, size);
  }

  _TICK_SNAPSHOT_END() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();

    this._emit("tickSnapshotEnd", reqId);
  }

  _TICK_STRING() {
    const version = this.dequeueInt();
    const tickerId = this.dequeueInt();
    const tickType = this.dequeueInt();
    const value = this.dequeue();

    this._emit("tickString", tickerId, tickType, value);
  }

  _DISPLAY_GROUP_LIST() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const list = this.dequeue();

    this._emit("displayGroupList", reqId, list);
  }

  _DISPLAY_GROUP_UPDATED() {
    const version = this.dequeueInt();
    const reqId = this.dequeueInt();
    const contractInfo = this.dequeue();

    this._emit("displayGroupUpdated", reqId, contractInfo);
  }

  _emit(...args: any[]) {
    this._emitQueue.push(args);
  }

  dequeue(): string {
    if (this._dataQueue.length === 0) {
      throw new errors.UnderrunError("");
    }
    return this._dataQueue.shift();
  }

  dequeueBool(): boolean {
    return !!parseInt(this.dequeue(), 10);
  }

  dequeueFloat(): number {
    return parseFloat(this.dequeue());
  }

  dequeueInt(): number {
    return parseInt(this.dequeue(), 10);
  }

  enqueue(tokens) {
    this._dataQueue = this._dataQueue.concat(tokens);
  }

  process() {
    let constKey;
    let token;
    let dataQueueSnapshot;

    while (true) {
      dataQueueSnapshot = this._dataQueue.slice();

      try {
        // Clear the Emit Queue; if this doesn't get cleared, it piles up whenever there's an error (added by heberallred)
        this._emitQueue = [];

        token = this.dequeueInt();
        constKey = this._controller._ib.util.incomingToString(token);

        if (
          constKey &&
          _.has(this.constructor.prototype, "_" + constKey) &&
          _.isFunction(this["_" + constKey])
        ) {
          console.log();
          this["_" + constKey]();
        } else {
          this._controller.emitError("Unknown incoming first token: " + token);
        }
      } catch (e) {
        if (!(e instanceof errors.UnderrunError)) {
          throw e;
        }
        // Put data back in the queue, and don't emit any events.
        this._dataQueue = this._dataQueue.concat(dataQueueSnapshot);
        return;
      }
      // Drain _emitQueue.
      const toEmit = this._emitQueue;
      this._emitQueue = [];
      _.forEach(toEmit, payload => {
        this._controller.emit.apply(this._controller, payload);
      });
    }
  }
}
export default Incoming;
