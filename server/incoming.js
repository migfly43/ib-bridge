"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var C = require("../lib/constants");
var errors = require("../lib/errors");
var chalk_1 = require("chalk");
var Incoming = /** @class */ (function () {
    function Incoming(controller) {
        this._dataQueue = [];
        this._emitQueue = [];
        this._controller = controller;
        this._dataQueue = [];
        this._emitQueue = [];
    }
    Incoming.prototype._emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._emitQueue.push(args);
    };
    Incoming.prototype.dequeue = function () {
        if (this._dataQueue.length === 0) {
            throw new errors.UnderrunError("");
        }
        return this._dataQueue.shift();
    };
    Incoming.prototype.dequeueBool = function () {
        return !!parseInt(this.dequeue(), 10);
    };
    Incoming.prototype.dequeueFloat = function () {
        return parseFloat(this.dequeue());
    };
    Incoming.prototype.dequeueInt = function () {
        return parseInt(this.dequeue(), 10);
    };
    Incoming.prototype.enqueue = function (tokens) {
        this._dataQueue = this._dataQueue.concat(tokens);
    };
    Incoming.prototype.process = function () {
        var _this = this;
        var constKey;
        var token;
        var dataQueueSnapshot;
        while (true) {
            dataQueueSnapshot = this._dataQueue.slice();
            try {
                // Clear the Emit Queue; if this doesn't get cleared, it piles up whenever there's an error (added by heberallred)
                this._emitQueue = [];
                token = this.dequeueInt();
                constKey = this._controller._ibServer.util.outgoingToString(token);
                if (constKey &&
                    _.has(this.constructor.prototype, "_" + constKey) &&
                    _.isFunction(this["_" + constKey])) {
                    this["_" + constKey]();
                }
                else {
                    this._controller.emitError("Unknown incoming first token: " + token + " " + constKey);
                }
            }
            catch (e) {
                if (!(e instanceof errors.UnderrunError)) {
                    throw e;
                }
                // Put data back in the queue, and don't emit any events.
                this._dataQueue = this._dataQueue.concat(dataQueueSnapshot);
                return;
            }
            // Drain _emitQueue.
            var toEmit = this._emitQueue;
            this._emitQueue = [];
            _.forEach(toEmit, function (payload) {
                _this._controller.emit.apply(_this._controller, payload);
            });
        }
    };
    Incoming.prototype._REQ_ACCOUNT_SUMMARY = function () {
        var _this = this;
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var group = this.dequeue();
        var tags = this.dequeue();
        console.log("_REQ_ACCOUNT_SUMMARY", version, reqId, group, tags);
        var account = this._controller._ibServer.accountState.AccountName;
        var values = this._controller._ibServer.accountState.AccountSummary;
        var nonUSD = ["LookAheadNextChange", "DayTradesRemaining", "Cushion", "AccountType"];
        tags.split(",").forEach(function (tag) {
            var isUSD = nonUSD.indexOf(tag) < 0;
            var value = values[tag] || "0";
            _this._controller._outgoing._ACCOUNT_SUMMARY(version, reqId, account, tag, value, isUSD ? "USD" : "");
        });
        this._controller._outgoing._ACCOUNT_SUMMARY_END(version, reqId);
    };
    ;
    /*
      from ../lib/outgoing
      took the variant where _serverVersion = 76
      so original code from ../lib/outgoing
  
      reqAccountUpdates(subscribe, acctCode) {
        const version = 2;
  
        if (C.SERVER_VERSION >= 9) {
          this._send(C.OUTGOING.REQ_ACCOUNT_DATA, version, subscribe, acctCode);
        } else {
          this._send(C.OUTGOING.REQ_ACCOUNT_DATA, version, subscribe);
        }
      };
  
      so we take
      this._send(C.OUTGOING.REQ_ACCOUNT_DATA, version, subscribe, acctCode);
  
      and convert it to incoming code
    */
    Incoming.prototype._REQ_ACCOUNT_DATA = function () {
        var version = this.dequeueInt();
        var subscribe = this.dequeueBool();
        var acctCode = this.dequeue();
        //for now no real implementation, just logs that command was received
        console.log("_REQ_ACCOUNT_DATA", version, subscribe, acctCode);
    };
    // ../lib/outgoing see above _REQ_ACCOUNT_DATA as example
    Incoming.prototype._REQ_CALC_IMPLIED_VOLAT = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var contract = {};
        // contract.comboLegs = this.dequeue();
        contract.conId = this.dequeueInt();
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.exchange = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        // contract.includeExpired = this.dequeue();
        // contract.primaryExchange = this.dequeue();    
        // contract.secId = this.dequeue();
        // contract.secIdType = this.dequeue();
        // contract.lastTradeDateOrContractMonth = this.dequeue();
        // const iundercomp : IUnderComp = {};
        // iundercomp.conId = this.dequeueInt();
        // iundercomp.delta = this.dequeueInt();
        // iundercomp.price = this.dequeueFloat();
        // contract.underComp = iundercomp;    
        var optionPrice = this.dequeueFloat();
        var underPrice = this.dequeueFloat();
        console.log('_REQ_CALC_IMPLIED_VOLAT = ', version, reqId, contract, optionPrice, underPrice);
        //this._controller._outgoing._CALC_IMPLIED_VOLAT(reqId, contract, optionPrice, underPrice);
    };
    ;
    Incoming.prototype._REQ_CALC_OPTION_PRICE = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var contract = {};
        contract.conId = this.dequeueInt();
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.exchange = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        var volatility = this.dequeueFloat();
        var underPrice = this.dequeueFloat();
        console.log('_REQ_CALC_OPTION_PRICE = ', version, reqId, contract, volatility, underPrice);
    };
    Incoming.prototype._CANCEL_ACCOUNT_SUMMARY = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_ACCOUNT_SUMMARY", version, reqId);
    };
    Incoming.prototype._CANCEL_CALC_IMPLIED_VOLAT = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_CALC_IMPLIED_VOLAT", version, reqId);
    };
    Incoming.prototype._CANCEL_FUNDAMENTAL_DATA = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_FUNDAMENTAL_DATA", version, reqId);
    };
    Incoming.prototype._CANCEL_HISTORICAL_DATA = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        console.log("_CANCEL_HISTORICAL_DATA", version, tickerId);
    };
    Incoming.prototype._CANCEL_MKT_DATA = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        console.log("_CANCEL_MKT_DATA", version, tickerId);
    };
    Incoming.prototype._CANCEL_MKT_DEPTH = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        console.log("_CANCEL_MKT_DEPTH", version, tickerId);
    };
    Incoming.prototype._CANCEL_NEWS_BULLETINS = function () {
        var version = this.dequeueInt();
        console.log("_CANCEL_NEWS_BULLETINS", version);
    };
    Incoming.prototype._CANCEL_ORDER = function () {
        var version = this.dequeueInt();
        var id = this.dequeueInt();
        console.log("_CANCEL_ORDER", version, id);
    };
    Incoming.prototype._CANCEL_POSITIONS = function () {
        var version = this.dequeueInt();
        console.log("_CANCEL_POSITIONS", version);
    };
    Incoming.prototype._CANCEL_REAL_TIME_BARS = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        console.log("_CANCEL_REAL_TIME_BARS", version, tickerId);
    };
    Incoming.prototype._CANCEL_SCANNER_SUBSCRIPTION = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        console.log("_CANCEL_SCANNER_SUBSCRIPTION", version, tickerId);
    };
    Incoming.prototype._EXERCISE_OPTIONS = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.exchange = this.dequeue();
        //contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        var exerciseAction = this.dequeueInt();
        var exerciseQuantity = this.dequeueInt();
        var account = this.dequeue();
        var override = this.dequeueInt();
        console.log('_EXERCISE_OPTIONS = ', version, tickerId, contract, exerciseAction, exerciseQuantity, account, override);
    };
    Incoming.prototype._PLACE_ORDER = function () {
        var version = this.dequeueInt();
        var id = this.dequeueInt();
        var contract = {};
        var order = {};
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        if (C.SERVER_VERSION >= 15) {
            contract.multiplier = this.dequeue();
        }
        contract.exchange = this.dequeue();
        if (C.SERVER_VERSION >= 14) {
            contract.primaryExch = this.dequeue();
        }
        contract.currency = this.dequeue();
        if (C.SERVER_VERSION >= 2) {
            contract.localSymbol = this.dequeue();
        }
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
            contract.secIdType = this.dequeue();
            contract.secId = this.dequeue();
        }
        order.action = this.dequeue();
        order.totalQuantity = this.dequeueInt();
        order.orderType = this.dequeue();
        order.lmtPrice = this.dequeueFloat();
        order.auxPrice = this.dequeueFloat();
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
            }
            else {
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
            if (C.SERVER_VERSION === 51) {
                this.dequeueInt(); // exemptCode
            }
            else if (version >= 23) {
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
        var receivedInt;
        if (version >= 11) {
            order.volatility = this.dequeueFloat() || Number.MAX_VALUE;
            order.volatilityType = this.dequeueInt();
            if (version === 11) {
                receivedInt = this.dequeueInt();
                order.deltaNeutralOrderType = receivedInt === 0 ? "NONE" : "MKT";
            }
            else {
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
            if (C.SERVER_VERSION === 26) {
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
        }
        var comboLeg;
        var comboLegsCount;
        var orderComboLeg;
        var orderComboLegsCount;
        var price;
        if (version >= 29) {
            comboLegsCount = this.dequeueInt();
            // if (comboLegsCount > 0) {
            //   for (var i = 0; i < comboLegsCount; ++i) {
            //     const comboLeg: IComboLeg = {};
            //     comboLeg.conId = this.dequeueInt();
            //     comboLeg.ratio = this.dequeueInt();
            //     comboLeg.action = this.dequeue();
            //     comboLeg.exchange = this.dequeue();
            //     comboLeg.openClose = this.dequeueInt();
            //     comboLeg.shortSaleSlot = this.dequeueInt();
            //     comboLeg.designatedLocation = this.dequeue();
            //     comboLeg.exemptCode = this.dequeueInt();       
            //   }
            // }
            orderComboLegsCount = this.dequeueInt();
            if (orderComboLegsCount > 0) {
                order.orderComboLegs = [];
                for (var i = 0; i < orderComboLegsCount; ++i) {
                    orderComboLeg = {};
                    order.price = this.dequeueFloat() || Number.MAX_VALUE;
                    order.orderComboLegs.push(orderComboLeg);
                }
            }
        }
        var smartComboRoutingParamsCount;
        var tagValue;
        if (version >= 26) {
            smartComboRoutingParamsCount = this.dequeueInt();
            if (smartComboRoutingParamsCount > 0) {
                order.smartComboRoutingParams = [];
                for (var i = 0; i < smartComboRoutingParamsCount; ++i) {
                    var tagValue_1 = {};
                    tagValue_1.tag = this.dequeue();
                    tagValue_1.value = this.dequeue();
                    order.smartComboRoutingParams.push(tagValue_1);
                }
            }
        }
        if (version >= 15) {
            if (version >= 20) {
                order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
                order.scaleSubsLevelSize = this.dequeueInt() || Number.MAX_VALUE;
            }
            else {
                var notSuppScaleNumComponents = this.dequeueInt() || Number.MAX_VALUE;
                order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
            }
            order.scalePriceIncrement = this.dequeueFloat() || Number.MAX_VALUE;
        }
        if (version >= 28 &&
            order.scalePriceIncrement > 0.0 &&
            order.scalePriceIncrement !== Number.MAX_VALUE) {
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
        var underComp;
        if (version >= 20) {
            if (this.dequeueBool()) {
                underComp = {};
                underComp.conId = this.dequeueInt();
                underComp.delta = this.dequeueFloat();
                underComp.price = this.dequeueFloat();
                contract.underComp = underComp;
            }
        }
        var algoParamsCount;
        if (version >= 21) {
            order.algoStrategy = this.dequeue();
            if (!_.isEmpty(order.algoStrategy)) {
                algoParamsCount = this.dequeueInt();
                if (algoParamsCount > 0) {
                    order.algoParams = [];
                    for (var i = 0; i < algoParamsCount; ++i) {
                        var tagValue_2 = {};
                        tagValue_2.tag = this.dequeue();
                        tagValue_2.value = this.dequeue();
                        order.algoParams.push(tagValue_2);
                    }
                }
            }
        }
        console.log('_PLACE_ORDER = ', id, contract, order);
    };
    Incoming.prototype._REPLACE_FA = function () {
        var version = this.dequeueInt();
        var faDataType = this.dequeueInt();
        var xml = this.dequeue();
        console.log("_REPLACE_FA", version, faDataType, xml);
    };
    Incoming.prototype._REQ_ALL_OPEN_ORDERS = function () {
        var version = this.dequeueInt();
        console.log("_REQ_ALL_OPEN_ORDERS", version);
    };
    Incoming.prototype._REQ_AUTO_OPEN_ORDERS = function () {
        var version = this.dequeueInt();
        var bAutoBind = this.dequeueBool();
        console.log("_REQ_AUTO_OPEN_ORDERS", version, bAutoBind);
    };
    Incoming.prototype._REQ_CONTRACT_DATA = function () {
        var version = this.dequeueInt();
        var contract = {};
        // if (C.SERVER_VERSION >= C.MIN_SERVER_VER.CONTRACT_DATA_CHAIN) {
        var reqId = this.dequeueInt();
        //}
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.CONTRACT_CONID) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        if (C.SERVER_VERSION >= 15) {
            contract.multiplier = this.dequeue();
        }
        contract.exchange = this.dequeue();
        //contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        if (C.SERVER_VERSION >= 31) {
            contract.includeExpired = this.dequeue();
        }
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
            contract.secIdType = this.dequeue();
            contract.secId = this.dequeue();
        }
        console.log('_REQ_CONTRACT_DATA = ', version, reqId, contract);
    };
    Incoming.prototype._REQ_CURRENT_TIME = function () {
        var version = this.dequeueInt();
        console.log("_REQ_CURRENT_TIME", version);
    };
    Incoming.prototype._REQ_EXECUTIONS = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var filter = {
            clientId: this.dequeue(),
            acctCode: this.dequeue(),
            time: this.dequeue(),
            symbol: this.dequeue(),
            secType: this.dequeue(),
            exchange: this.dequeue(),
            side: this.dequeue()
        };
        console.log("_REQ_EXECUTIONS", version, reqId, filter);
    };
    Incoming.prototype._REQ_FUNDAMENTAL_DATA = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.exchange = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        var reportType = this.dequeue();
        console.log('_REQ_FUNDAMENTAL_DATA = ', version, reqId, contract, reportType);
    };
    Incoming.prototype._REQ_GLOBAL_CANCEL = function () {
        var version = this.dequeueInt();
        console.log("_REQ_GLOBAL_CANCEL", version);
    };
    Incoming.prototype._REQ_HISTORICAL_DATA = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.CONTRACT_CONID) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.exchange = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        if (C.SERVER_VERSION >= 31) {
            contract.includeExpired = this.dequeue();
        }
        var endDateTime = this.dequeue();
        var durationStr = this.dequeue();
        var barSizeSetting = this.dequeue();
        var whatToShow = this.dequeue();
        var useRTH = this.dequeue();
        var formatDate = this.dequeue();
        var keepUpToDate = this.dequeue();
        console.log('_REQ_HISTORICAL_DATA = ', version, tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate);
    };
    Incoming.prototype._REQ_IDS = function () {
        var version = this.dequeueInt();
        var numIds = this.dequeueInt();
        console.log("_REQ_IDS", numIds);
    };
    Incoming.prototype._REQ_MANAGED_ACCTS = function () {
        var version = this.dequeueInt();
        console.log("_REQ_MANAGED_ACCTS", version);
    };
    Incoming.prototype._REQ_MARKET_DATA_TYPE = function () {
        var version = this.dequeueInt();
        var marketDataType = this.dequeueInt();
        console.log("_REQ_MARKET_DATA_TYPE", version, marketDataType);
    };
    Incoming.prototype._REQ_MKT_DATA = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.REQ_MKT_DATA_CONID) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        if (C.SERVER_VERSION >= 15) {
            contract.multiplier = this.dequeue();
        }
        contract.exchange = this.dequeue();
        if (C.SERVER_VERSION >= 14) {
            contract.primaryExch = this.dequeue();
        }
        contract.currency = this.dequeue();
        if (C.SERVER_VERSION >= 2) {
            contract.localSymbol = this.dequeue();
        }
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        if (C.SERVER_VERSION >= 31) {
            contract.includeExpired = this.dequeue();
        }
        var genericTickList = this.dequeue();
        var snapshot = this.dequeueBool();
        var regulatorySnapshot = this.dequeueBool();
        console.log('_REQ_MKT_DATA = ', version, tickerId, contract, genericTickList, snapshot, regulatorySnapshot);
    };
    Incoming.prototype._REQ_MKT_DEPTH = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        if (C.SERVER_VERSION >= 15) {
            contract.multiplier = this.dequeue();
        }
        contract.exchange = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        var numRows = this.dequeueInt();
        console.log('_REQ_MKT_DEPTH = ', version, tickerId, contract, numRows);
    };
    Incoming.prototype._REQ_NEWS_BULLETINS = function () {
        var version = this.dequeueInt();
        var allMsgs = this.dequeueBool();
        console.log("_REQ_MARKET_DATA_TYPE", version, allMsgs);
    };
    Incoming.prototype._REQ_OPEN_ORDERS = function () {
        var version = this.dequeueInt();
        console.log("_REQ_OPEN_ORDERS", version);
    };
    Incoming.prototype._REQ_POSITIONS = function () {
        var version = this.dequeueInt();
        console.log("_REQ_POSITIONS", version);
    };
    Incoming.prototype._REQ_POSITIONS_MULTI = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var account = this.dequeue();
        var modelCode = this.dequeue();
        console.log("_REQ_POSITIONS_MULTI", version, reqId, account, modelCode);
    };
    Incoming.prototype._REQ_REAL_TIME_BARS = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var contract = {};
        // send contract fields
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.conId = this.dequeueInt();
        }
        contract.symbol = this.dequeue();
        contract.secType = this.dequeue();
        contract.expiry = this.dequeue();
        contract.strike = this.dequeue();
        contract.right = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.exchange = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.currency = this.dequeue();
        contract.localSymbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        var barSize = this.dequeueInt();
        var whatToShow = this.dequeue();
        var useRTH = this.dequeueBool();
        console.log('_REQ_REAL_TIME_BARS = ', version, tickerId, contract, barSize, whatToShow, useRTH);
    };
    Incoming.prototype._REQ_SCANNER_PARAMETERS = function () {
        var version = this.dequeueInt();
        console.log("_REQ_SCANNER_PARAMETERS", version);
    };
    Incoming.prototype._REQ_SCANNER_SUBSCRIPTION = function () {
        var version = this.dequeueInt();
        var tickerId = this.dequeueInt();
        var subscription = {
            numberOfRows: this.dequeueInt(),
            instrument: this.dequeue(),
            locationCode: this.dequeue(),
            scanCode: this.dequeue(),
            abovePrice: this.dequeueFloat(),
            belowPrice: this.dequeueFloat(),
            aboveVolume: this.dequeueInt(),
            marketCapAbove: this.dequeueInt(),
            marketCapBelow: this.dequeueInt(),
            moodyRatingAbove: this.dequeue(),
            moodyRatingBelow: this.dequeue(),
            spRatingAbove: this.dequeue(),
            spRatingBelow: this.dequeue(),
            maturityDateAbove: this.dequeue(),
            maturityDateBelow: this.dequeue(),
            couponRateAbove: this.dequeueFloat(),
            couponRateBelow: this.dequeueFloat(),
            excludeConvertible: this.dequeue(),
            averageOptionVolumeAbove: this.dequeueInt(),
            scannerSettingPairs: this.dequeue(),
            stockTypeFilter: this.dequeue(),
        };
        console.log("_REQ_SCANNER_SUBSCRIPTION", version, tickerId, subscription);
    };
    Incoming.prototype._REQ_FA = function () {
        var version = this.dequeueInt();
        var faDataType = this.dequeueInt();
        console.log("_REQ_FA", version, faDataType);
    };
    Incoming.prototype._SET_SERVER_LOGLEVEL = function () {
        var version = this.dequeueInt();
        var logLevel = this.dequeueInt();
        console.log("_SET_SERVER_LOGLEVEL", version, logLevel);
    };
    Incoming.prototype._REQ_SEC_DEF_OPT_PARAMS = function () {
        var reqId = this.dequeueInt();
        var underlyingSymbol = this.dequeue();
        var futFopExchange = this.dequeueFloat();
        var underlyingSecType = this.dequeue();
        var underlyingConId = this.dequeueInt();
        console.log("_REQ_SEC_DEF_OPT_PARAMS", reqId, underlyingSymbol, futFopExchange, underlyingSecType, underlyingConId);
    };
    Incoming.prototype._REQ_HEAD_TIMESTAMP = function () {
        var reqId = this.dequeueInt();
        var contract = {};
        var useRTH = this.dequeueBool();
        var whatToShow = this.dequeue();
        var formatDate = this.dequeue();
        contract.comboLegs = this.dequeue();
        contract.conId = this.dequeueInt();
        contract.currency = this.dequeue();
        contract.exchange = this.dequeue();
        contract.expiry = this.dequeue();
        contract.includeExpired = this.dequeue();
        contract.localSymbol = this.dequeue();
        contract.multiplier = this.dequeue();
        contract.primaryExch = this.dequeue();
        contract.primaryExchange = this.dequeue();
        contract.right = this.dequeue();
        contract.secId = this.dequeue();
        contract.secIdType = this.dequeue();
        contract.secType = this.dequeue();
        contract.strike = this.dequeue();
        contract.symbol = this.dequeue();
        if (C.SERVER_VERSION >= C.MIN_SERVER_VER.TRADING_CLASS) {
            contract.tradingClass = this.dequeue();
        }
        contract.lastTradeDateOrContractMonth = this.dequeue();
        var iundercomp = {};
        iundercomp.conId = this.dequeueInt();
        iundercomp.delta = this.dequeueInt();
        iundercomp.price = this.dequeueFloat();
        contract.underComp = iundercomp;
        console.log('_REQ_HEAD_TIMESTAMP = ', reqId, contract, useRTH, whatToShow, formatDate);
    };
    Incoming.prototype._REQ_ACCOUNT_UPDATES_MULTI = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        var acctCode = this.dequeue();
        var modelCode = this.dequeue();
        var ledgerAndNLV = this.dequeue();
        console.log("_REQ_ACCOUNT_UPDATES_MULTI", version, reqId, acctCode, modelCode, ledgerAndNLV);
    };
    Incoming.prototype._CANCEL_CALC_OPTION_PRICE = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_CALC_OPTION_PRICE", version, reqId);
    };
    Incoming.prototype._CANCEL_POSITIONS_MULTI = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_POSITIONS_MULTI", version, reqId);
    };
    Incoming.prototype._CANCEL_ACCOUNT_UPDATES_MULTI = function () {
        var version = this.dequeueInt();
        var reqId = this.dequeueInt();
        console.log("_CANCEL_ACCOUNT_UPDATES_MULTI", version, reqId);
    };
    Incoming.prototype._DEBUG_MSG = function () {
        var msg = this.dequeue();
        console.log(chalk_1.default.black.bgGreen("_DEBUG_MSG: " + msg));
        var val_IContract = {
            summary: {}
        };
        var val_IContract_all = {
            summary: {},
            cusip: '',
            coupon: 0,
            maturity: '',
            marketName: '',
            minTick: 0,
            orderTypes: '',
            validExchanges: '',
            priceMagnifier: 0,
            underConId: 0,
            longName: '',
            contractMonth: '',
            industry: '',
            category: '',
            subcategory: '',
            timeZoneId: '',
            tradingHours: '',
            liquidHours: '',
            evRule: '',
            evMultiplier: 0,
            issueDate: '',
            ratings: '',
            // bondType: '',
            // couponType:'',
            // convertible:false,
            // callable: false,
            // putable: false,
            // descAppend: '',
            secIdList: []
        };
        var val_IUnderComp = {};
        var val_IExec = {};
        var val_IOrder = {};
        var out = this._controller._outgoing;
        var srv = chalk_1.default.blue;
        if (msg.startsWith("send:")) {
            console.log(srv("Srv-Send-Begin " + msg));
        }
        if (msg === "send:_ACCT_DOWNLOAD_END")
            out._ACCT_DOWNLOAD_END("STR:1");
        if (msg === "send:_ACCOUNT_SUMMARY_END")
            out._ACCOUNT_SUMMARY_END(2, 3);
        if (msg === "send:_ACCOUNT_SUMMARY")
            out._ACCOUNT_SUMMARY(4, 5, "STR:6", "STR:7", "STR:8", "STR:9");
        if (msg === "send:_ACCOUNT_UPDATE_MULTI_END")
            out._ACCOUNT_UPDATE_MULTI_END(10);
        if (msg === "send:_ACCOUNT_UPDATE_MULTI")
            out._ACCOUNT_UPDATE_MULTI(11, "STR:12", "STR:13", "STR:14", "STR:15", "STR:16");
        if (msg === "send:_ACCT_UPDATE_TIME")
            out._ACCT_UPDATE_TIME("STR:17");
        if (msg === "send:_ACCT_VALUE")
            out._ACCT_VALUE("STR:18", "STR:19", "STR:20");
        if (msg === "send:_COMMISSION_REPORT")
            out._COMMISSION_REPORT("STR:21", 22, "STR:23", 24, 25, 26);
        if (msg === "send:_BOND_CONTRACT_DATA")
            out._BOND_CONTRACT_DATA(27, val_IContract);
        if (msg === "send:_CONTRACT_DATA")
            out._CONTRACT_DATA(29, val_IContract);
        if (msg === "send:_CONTRACT_DATA_END")
            out._CONTRACT_DATA_END(32);
        if (msg === "send:_CURRENT_TIME")
            out._CURRENT_TIME(33);
        if (msg === "send:_DELTA_NEUTRAL_VALIDATION")
            out._DELTA_NEUTRAL_VALIDATION(34, val_IUnderComp);
        if (msg === "send:_ERR_MSG")
            out._ERR_MSG(36, "STR:37", 38);
        if (msg === "send:_EXECUTION_DATA")
            out._EXECUTION_DATA(39, val_IContract, val_IExec);
        if (msg === "send:_EXECUTION_DATA_END")
            out._EXECUTION_DATA_END(42);
        if (msg === "send:_FUNDAMENTAL_DATA")
            out._FUNDAMENTAL_DATA(43, "STR:44");
        if (msg === "send:_HISTORICAL_DATA")
            out._HISTORICAL_DATA(45, "STR:46", "STR:47", 48, null);
        if (msg === "send:_HEAD_TIMESTAMP")
            out._HEAD_TIMESTAMP(50, "STR:51");
        if (msg === "send:_MANAGED_ACCTS")
            out._MANAGED_ACCTS();
        if (msg === "send:_MARKET_DATA_TYPE")
            out._MARKET_DATA_TYPE(52, 53);
        if (msg === "send:_MARKET_DEPTH")
            out._MARKET_DEPTH(54, 55, 56, 57, 58, 59);
        if (msg === "send:_MARKET_DEPTH_L2")
            out._MARKET_DEPTH_L2(60, 61, "STR:62", 63, 64, 65, 66);
        if (msg === "send:_NEWS_BULLETINS")
            out._NEWS_BULLETINS(67, 68, "STR:69", "STR:70");
        if (msg === "send:_NEXT_VALID_ID")
            out._NEXT_VALID_ID(71);
        if (msg === "send:_OPEN_ORDER")
            out._OPEN_ORDER(val_IOrder, val_IContract);
        if (msg === "send:_OPEN_ORDER_END")
            out._OPEN_ORDER_END();
        if (msg === "send:_ORDER_STATUS")
            out._ORDER_STATUS(74, "STR:75", 76, 77, 78, 79, 80, 81, 82);
        if (msg === "send:_PORTFOLIO_VALUE")
            out._PORTFOLIO_VALUE(val_IContract, 84, 85, 86, 87, 88, 89, "STR:90");
        if (msg === "send:_POSITION")
            out._POSITION("STR:91", val_IContract, 93, 94);
        if (msg === "send:_POSITION_END")
            out._POSITION_END();
        if (msg === "send:_POSITION_MULTI")
            out._POSITION_MULTI(95, "STR:96", val_IContract, 98, 99);
        if (msg === "send:_POSITION_MULTI_END")
            out._POSITION_MULTI_END(100);
        if (msg === "send:_REAL_TIME_BARS")
            out._REAL_TIME_BARS(101, 102, 103, 104, 105, 106, 107, 108, 109);
        if (msg === "send:_RECEIVE_FA")
            out._RECEIVE_FA(110, "STR:111");
        if (msg === "send:_SCANNER_DATA")
            out._SCANNER_DATA(112, 113, null);
        if (msg === "send:_SCANNER_PARAMETERS")
            out._SCANNER_PARAMETERS("STR:115");
        if (msg === "send:_SECURITY_DEFINITION_OPTION_PARAMETER")
            out._SECURITY_DEFINITION_OPTION_PARAMETER(116, "STR:117", 118, "STR:119", "STR:120", 121, null, 123, null);
        if (msg === "send:_SECURITY_DEFINITION_OPTION_PARAMETER_END")
            out._SECURITY_DEFINITION_OPTION_PARAMETER_END(125);
        if (msg === "send:_TICK_EFP")
            out._TICK_EFP(126, 127, 128, "STR:129", 130, 131, "STR:132", 133, 134);
        if (msg === "send:_TICK_GENERIC")
            out._TICK_GENERIC(135, 136, 137);
        if (msg === "send:_TICK_OPTION_COMPUTATION")
            out._TICK_OPTION_COMPUTATION(138, 139, 140, 141, 142, 143, 144, 145, 146);
        if (msg === "send:_TICK_PRICE")
            out._TICK_PRICE(147, 148, 149);
        if (msg === "send:_TICK_SIZE")
            out._TICK_SIZE(150, 151, 152);
        if (msg === "send:_TICK_SNAPSHOT_END")
            out._TICK_SNAPSHOT_END(153);
        if (msg === "send:_TICK_STRING")
            out._TICK_STRING(154, 155, "STR:156");
        if (msg === "send:_DISPLAY_GROUP_LIST")
            out._DISPLAY_GROUP_LIST(157, "STR:158");
        if (msg === "send:_DISPLAY_GROUP_UPDATED")
            out._DISPLAY_GROUP_UPDATED(159, "STR:160");
        if (msg.startsWith("send:")) {
            console.log(srv("Srv-Send-End" + msg));
        }
    };
    return Incoming;
}());
exports.default = Incoming;
