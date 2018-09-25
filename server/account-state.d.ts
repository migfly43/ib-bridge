export interface IAccountState {
    AccountName: string;
    nextOrderId: number;
    AccountSummary: {
        AccountType: string;
        NetLiquidation: number;
        TotalCashValue: number;
        SettledCash: number;
        AccruedCash: number;
        BuyingPower: number;
        EquityWithLoanValue: number;
        PreviousEquityWithLoanValue: number;
        GrossPositionValue: number;
        ReqTEquity: number;
        ReqTMargin: number;
        SMA: number;
        InitMarginReq: number;
        MaintMarginReq: number;
        AvailableFunds: number;
        ExcessLiquidity: number;
        Cushion: number;
        FullInitMarginReq: number;
        FullMaintMarginReq: number;
        FullAvailableFunds: number;
        FullExcessLiquidity: number;
        LookAheadNextChange: number;
        LookAheadInitMarginReq: number;
        LookAheadMaintMarginReq: number;
        LookAheadAvailableFunds: number;
        LookAheadExcessLiquidity: number;
        HighestSeverity: number;
        DayTradesRemaining: number;
        Leverage: number;
    };
}
export declare const accountState: () => IAccountState;
