"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state = {
    AccountName: "DMACC7437",
    nextOrderId: 1,
    AccountSummary: {
        AccountType: "LLC",
        NetLiquidation: 0,
        TotalCashValue: 0,
        SettledCash: 0,
        AccruedCash: 0,
        BuyingPower: 0,
        EquityWithLoanValue: 0,
        PreviousEquityWithLoanValue: 0,
        GrossPositionValue: 0,
        ReqTEquity: 0,
        ReqTMargin: 0,
        SMA: 0,
        InitMarginReq: 0,
        MaintMarginReq: 0,
        AvailableFunds: 0,
        ExcessLiquidity: 0,
        Cushion: 0,
        FullInitMarginReq: 0,
        FullMaintMarginReq: 0,
        FullAvailableFunds: 0,
        FullExcessLiquidity: 0,
        LookAheadNextChange: 0,
        LookAheadInitMarginReq: 0,
        LookAheadMaintMarginReq: 0,
        LookAheadAvailableFunds: 0,
        LookAheadExcessLiquidity: 0,
        HighestSeverity: 0,
        DayTradesRemaining: 0,
        Leverage: 0,
    }
};
exports.accountState = function () {
    return state;
};
