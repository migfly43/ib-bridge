"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var C = require("../lib/constants");
function _nullifyMax(number) {
    if (number === Number.MAX_VALUE) {
        return null;
    }
    else {
        return number;
    }
}
var Outgoing = /** @class */ (function () {
    function Outgoing(controller) {
        this._controller = controller;
        var self = this;
        this._send = function () {
            var args = Array.prototype.slice.call(arguments);
            self._controller.run("send", _.flatten(args));
        };
    }
    Outgoing.prototype._ACCT_DOWNLOAD_END = function (accountName) {
        var version = 1;
        this._send(C.INCOMING.ACCT_DOWNLOAD_END, version, accountName);
    };
    Outgoing.prototype._ACCOUNT_SUMMARY_END = function (version, reqId) {
        this._send(C.INCOMING.ACCOUNT_SUMMARY_END, version, reqId);
    };
    Outgoing.prototype._ACCOUNT_SUMMARY = function (version, reqId, account, tag, value, currency) {
        this._send(C.INCOMING.ACCOUNT_SUMMARY, version, reqId, account, tag, value, currency);
    };
    Outgoing.prototype._ACCOUNT_UPDATE_MULTI_END = function (reqId) {
        var version = 1;
        this._send(C.INCOMING.ACCOUNT_UPDATE_MULTI_END, version, reqId);
    };
    Outgoing.prototype._ACCOUNT_UPDATE_MULTI = function (reqId, account, modelCode, key, value, currency) {
        var version = 1;
        this._send(C.INCOMING.ACCOUNT_UPDATE_MULTI, version, reqId, account, modelCode, key, value, currency);
    };
    Outgoing.prototype._ACCT_UPDATE_TIME = function (timeStamp) {
        var version = 1;
        this._send(C.INCOMING.ACCT_UPDATE_TIME, version, timeStamp);
    };
    Outgoing.prototype._ACCT_VALUE = function (key, value, currency) {
        var version = 3;
        var accountName = this._controller._ibServer.accountState.AccountName;
        this._send(C.INCOMING.ACCT_VALUE, version, key, value, currency, accountName);
    };
    Outgoing.prototype._COMMISSION_REPORT = function (execId, commission, currency, realizedPNL, field, yieldRedemptionDate) {
        var version = 1;
        this._send(C.INCOMING.COMMISSION_REPORT, version, execId, commission, currency, realizedPNL, field, yieldRedemptionDate);
    };
    Outgoing.prototype._BOND_CONTRACT_DATA = function (reqId, contract) {
        var version = 1;
        var args = [C.INCOMING.BOND_CONTRACT_DATA, version];
        if (version >= 3) {
            args.push(reqId);
        }
        args.push(contract.summary.symbol);
        args.push(contract.summary.secType);
        args.push(contract.cusip);
        args.push(contract.coupon);
        args.push(contract.maturity);
        args.push(contract.issueDate);
        args.push(contract.ratings);
        args.push(contract.bondType);
        args.push(contract.couponType);
        args.push(contract.convertible);
        args.push(contract.callable);
        args.push(contract.putable);
        args.push(contract.descAppend);
        args.push(contract.summary.exchange);
        args.push(contract.summary.currency);
        args.push(contract.marketName);
        args.push(contract.summary.tradingClass);
        args.push(contract.summary.conId);
        args.push(contract.minTick);
        args.push(contract.orderTypes);
        args.push(contract.validExchanges);
        if (version >= 2) {
            args.push(contract.nextOptionDate);
            args.push(contract.nextOptionType);
            args.push(contract.nextOptionPartial);
            args.push(contract.notes);
        }
        if (version >= 4) {
            args.push(contract.longName);
        }
        if (version >= 6) {
            args.push(contract.evRule);
            args.push(contract.evMultiplier);
        }
        if (version >= 5 && contract.secIdList) {
            var secID_length = Object.keys(contract.secIdList).length;
            args.push(secID_length);
            if (secID_length > 0) {
                for (var i = 0; i < secID_length; ++i) {
                    args.push(contract.secIdList[i].tag);
                    args.push(contract.secIdList[i].value);
                }
            }
        }
        this._send(args);
    };
    Outgoing.prototype._CONTRACT_DATA = function (reqId, contract) {
        var version = 1;
        var args = [C.INCOMING.CONTRACT_DATA, version];
        if (version >= 3) {
            args.push(reqId);
        }
        args.push(contract.summary.symbol);
        args.push(contract.summary.secType);
        args.push(contract.summary.expiry);
        args.push(contract.summary.strike);
        args.push(contract.summary.right);
        args.push(contract.summary.exchange);
        args.push(contract.summary.currency);
        args.push(contract.summary.localSymbol);
        args.push(contract.marketName);
        args.push(contract.summary.tradingClass);
        args.push(contract.summary.conId);
        args.push(contract.minTick);
        args.push(contract.summary.multiplier);
        args.push(contract.orderTypes);
        args.push(contract.validExchanges);
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
            var secID_length = Object.keys(contract.secIdList).length;
            args.push(secID_length);
            if (secID_length > 0) {
                for (var i = 0; i < secID_length; ++i) {
                    args.push(contract.secIdList[i].tag);
                    args.push(contract.secIdList[i].value);
                }
            }
        }
        this._send(args);
    };
    Outgoing.prototype._CONTRACT_DATA_END = function (reqId) {
        var version = 1;
        this._send(C.INCOMING.CONTRACT_DATA_END, version, reqId);
    };
    Outgoing.prototype._CURRENT_TIME = function (time) {
        var version = 1;
        this._send(C.INCOMING.CURRENT_TIME, version, time);
    };
    Outgoing.prototype._DELTA_NEUTRAL_VALIDATION = function (reqId, underComp) {
        var version = 1;
        var args = [C.INCOMING.DELTA_NEUTRAL_VALIDATION, version, reqId];
        args.push(underComp.conId);
        args.push(underComp.delta);
        args.push(underComp.price);
        this._send(args);
    };
    Outgoing.prototype._ERR_MSG = function (errorCode, errorMsg, id) {
        var version = 2;
        if (version < 2) {
            this._send(C.INCOMING.ERR_MSG, version, errorMsg);
        }
        else {
            this._send(C.INCOMING.ERR_MSG, version, errorCode, errorMsg, id);
        }
    };
    Outgoing.prototype._EXECUTION_DATA = function (reqId, contract, exec) {
        var version = 1;
        var args = [C.INCOMING.EXECUTION_DATA, version, reqId];
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
        for (var key in exec) {
            args.push(exec[key]);
        }
    };
    Outgoing.prototype._EXECUTION_DATA_END = function (reqId) {
        var version = 1;
        this._send(C.INCOMING.EXECUTION_DATA_END, version, reqId);
    };
    Outgoing.prototype._FUNDAMENTAL_DATA = function (reqId, data) {
        var version = 1;
        this._send(C.INCOMING.FUNDAMENTAL_DATA, version, reqId, data);
    };
    //todo: Have exact type for historical:object
    //This is general comment for this code style, need to fix all
    Outgoing.prototype._HISTORICAL_DATA = function (reqId, startDateStr, endDateStr, itemCount, historical) {
        var version = 1;
        var args = [
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
            for (var key in historical) {
                args.push(historical[key]);
            }
        }
        this._send(args);
    };
    Outgoing.prototype._HEAD_TIMESTAMP = function (reqId, headTimestamp) {
        this._send(C.INCOMING.HEAD_TIMESTAMP, reqId, headTimestamp);
    };
    Outgoing.prototype._MANAGED_ACCTS = function () {
        var version = 1;
        var accountsList = this._controller._ibServer.accountState.AccountName;
        this._send(C.INCOMING.MANAGED_ACCTS, version, accountsList);
    };
    Outgoing.prototype._MARKET_DATA_TYPE = function (reqId, marketDataType) {
        var version = 1;
        this._send(C.INCOMING.MARKET_DATA_TYPE, version, reqId, marketDataType);
    };
    Outgoing.prototype._MARKET_DEPTH = function (id, position, operation, side, price, size) {
        var version = 1;
        this._send(C.INCOMING.MARKET_DEPTH, version, id, position, operation, side, price, size);
    };
    Outgoing.prototype._MARKET_DEPTH_L2 = function (id, position, marketMaker, operation, side, price, size) {
        var version = 1;
        this._send(C.INCOMING.MARKET_DEPTH_L2, version, id, position, marketMaker, operation, side, price, size);
    };
    Outgoing.prototype._NEWS_BULLETINS = function (newsMsgId, newsMsgType, newsMessage, originatingExch) {
        var version = 1;
        this._send(C.INCOMING.NEWS_BULLETINS, version, newsMsgId, newsMsgType, newsMessage, originatingExch);
    };
    Outgoing.prototype._NEXT_VALID_ID = function (orderId) {
        var version = 1;
        this._send(C.INCOMING.NEXT_VALID_ID, version, orderId);
    };
    Outgoing.prototype._OPEN_ORDER = function (order, contract) {
        var version = 1;
        var args = [C.INCOMING.OPEN_ORDER, version];
        for (var key in order) {
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
    };
    Outgoing.prototype._OPEN_ORDER_END = function () {
        var version = 1;
        this._send(C.INCOMING.OPEN_ORDER_END);
    };
    Outgoing.prototype._ORDER_STATUS = function (id, status, filled, remaining, avgFillPrice, permId, parentId, lastFillPrice, whyHeld) {
        var version = 1;
        var clientId = this._controller._clientId;
        this._send(C.INCOMING.ORDER_STATUS, version, id, status, filled, remaining, avgFillPrice, permId, parentId, lastFillPrice, clientId, whyHeld);
    };
    Outgoing.prototype._PORTFOLIO_VALUE = function (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, primaryExch) {
        var version = 1;
        var args = [C.INCOMING.PORTFOLIO_VALUE, version];
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
    };
    Outgoing.prototype._POSITION = function (account, contract, pos, avgCost) {
        var version = 1;
        var args = [C.INCOMING.POSITION, version, account];
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
    };
    Outgoing.prototype._POSITION_END = function () {
        var version = 1;
        this._send(C.INCOMING.POSITION_END, version);
    };
    Outgoing.prototype._POSITION_MULTI = function (reqId, account, contract, pos, avgCost) {
        var version = 1;
        var args = [C.INCOMING.POSITION_MULTI, version, reqId, account];
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
    };
    Outgoing.prototype._POSITION_MULTI_END = function (reqId) {
        var version = 1;
        this._send(C.INCOMING.POSITION_MULTI_END, version, reqId);
    };
    Outgoing.prototype._REAL_TIME_BARS = function (reqId, time, open, high, low, close, volumn, wap, count) {
        var version = 1;
        this._send(C.INCOMING.POSITION_MULTI_END, version, reqId, time, open, high, low, close, volumn, wap, count);
    };
    Outgoing.prototype._RECEIVE_FA = function (faDataType, xml) {
        var version = 1;
        this._send(C.INCOMING.RECEIVE_FA, version, faDataType, xml);
    };
    //Todo: have exact type for scannerData:object
    Outgoing.prototype._SCANNER_DATA = function (tickerId, numberOfElements, scannerData) {
        var version = 1;
        var args = [
            C.INCOMING.SCANNER_DATA,
            version,
            tickerId,
            numberOfElements
        ];
        if (numberOfElements > 0 && Object.keys(scannerData).length > 0) {
            for (var key in scannerData) {
                args.push(scannerData[key]);
                // args.push(distance);
                // args.push(benchmark);
                // args.push(projection);
                // args.push(legsStr);
            }
        }
        this._send(args);
    };
    Outgoing.prototype._SCANNER_PARAMETERS = function (xml) {
        var version = 1;
        this._send(C.INCOMING.SCANNER_PARAMETERS, version, xml);
    };
    Outgoing.prototype._SECURITY_DEFINITION_OPTION_PARAMETER = function (reqId, exchange, underlyingConId, tradingClass, multiplier, expCount, expData, strikeCount, strikeData) {
        var args = [
            C.INCOMING.SECURITY_DEFINITION_OPTION_PARAMETER,
            reqId,
            exchange,
            underlyingConId,
            tradingClass,
            multiplier,
            expCount
        ];
        if (expCount > 0 && Object.keys(expData).length > 0) {
            for (var key in expData) {
                args.push(expData[key]);
            }
        }
        args.push(strikeCount);
        if (strikeCount > 0 && Object.keys(strikeData).length > 0) {
            for (var key in strikeData) {
                args.push(strikeData[key]);
            }
        }
        this._send(args);
    };
    Outgoing.prototype._SECURITY_DEFINITION_OPTION_PARAMETER_END = function (reqId) {
        this._send(C.INCOMING.SECURITY_DEFINITION_OPTION_PARAMETER_END, reqId);
    };
    Outgoing.prototype._TICK_EFP = function (tickerId, tickType, basisPoints, formattedBasisPoints, impliedFuturesPrice, holdDays, futureExpiry, dividendImpact, dividendsToExpiry) {
        var version = 1;
        this._send(C.INCOMING.TICK_EFP, version, tickerId, tickType, basisPoints, formattedBasisPoints, impliedFuturesPrice, impliedFuturesPrice, holdDays, futureExpiry, dividendImpact, dividendsToExpiry);
    };
    Outgoing.prototype._TICK_GENERIC = function (tickerId, tickType, value) {
        var version = 1;
        this._send(C.INCOMING.TICK_GENERIC, version, tickerId, tickType, value);
    };
    Outgoing.prototype._TICK_OPTION_COMPUTATION = function (tickerId, tickType, delta, optPrice, pvDividend, gamma, vega, theta, undPrice) {
        var version = 1;
        this._send(C.INCOMING.TICK_OPTION_COMPUTATION, version, tickerId, tickType, delta, optPrice, pvDividend, gamma, vega, theta, undPrice);
    };
    Outgoing.prototype._TICK_PRICE = function (tickerId, tickType, price) {
        var version = 1;
        this._send(C.INCOMING.TICK_PRICE, version, tickerId, tickType, price);
    };
    Outgoing.prototype._TICK_SIZE = function (tickerId, tickType, size) {
        var version = 1;
        this._send(C.INCOMING.TICK_SIZE, version, tickerId, tickType, size);
    };
    Outgoing.prototype._TICK_SNAPSHOT_END = function (reqId) {
        var version = 1;
        this._send(C.INCOMING.TICK_SNAPSHOT_END, version, reqId);
    };
    Outgoing.prototype._TICK_STRING = function (tickerId, tickType, value) {
        var version = 1;
        this._send(C.INCOMING.TICK_STRING, version, tickerId, tickType, value);
    };
    Outgoing.prototype._DISPLAY_GROUP_LIST = function (reqId, list) {
        var version = 1;
        this._send(C.INCOMING.DISPLAY_GROUP_LIST, version, reqId, list);
    };
    Outgoing.prototype._DISPLAY_GROUP_UPDATED = function (reqId, contractInfo) {
        var version = 1;
        this._send(C.INCOMING.DISPLAY_GROUP_UPDATED, version, reqId, contractInfo);
    };
    return Outgoing;
}());
exports.default = Outgoing;
