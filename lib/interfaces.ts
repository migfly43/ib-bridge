export interface IComboLeg {
  conId?: number;
  ratio?: number;
  action?: string;
  exchange?: string;
  openClose?: number;
  shortSaleSlot?: number;
  designatedLocation?: string;
  exemptCode?: number;
}

export interface ITagValue {
  tag?: string;
  value?: string;
}

export interface IOrderState {
  status?: string;
  initMargin?: string;
  maintMargin?: string;
  equityWithLoan?: string;
  commission?: number;
  minCommission?: number;
  maxCommission?: number;
  commissionCurrency?: string;
  warningText?: string;
}

export interface IExec {
  orderId?: number;
  execId?: string;
  time?: string;
  acctNumber?: string;
  exchange?: string;
  side?: string;
  shares?: string;
  price?: number;
  permId?: number;
  clientId?: number;
  liquidation?: number;
  cumQty?: number;
  avgPrice?: number;
  orderRef?: string;
  evRule?: string;
  evMultiplier?: number;
}

export interface IOrder {
  whatIf?: boolean;
  orderId?: number;
  action?: string;
  totalQuantity?: number;
  orderType?: string;
  lmtPrice?: number;
  auxPrice?: number;
  tif?: string;
  ocaGroup?: string;
  account?: string;
  openClose?: string;
  origin?: number;
  orderRef?: string;
  clientId?: number;
  permId?: number;
  outsideRth?: boolean;
  hidden?: boolean;
  discretionaryAmt?: number;
  goodAfterTime?: string;
  faGroup?: string;
  faMethod?: string;
  faPercentage?: string;
  faProfile?: string;
  goodTillDate?: string;
  rule80A?: string;
  percentOffset?: number;
  settlingFirm?: string;
  shortSaleSlot?: number;
  designatedLocation?: string;
  exemptCode?: number;
  auctionStrategy?: number;
  startingPrice?: number;
  stockRefPrice?: number;
  delta?: number;
  stockRangeLower?: number;
  stockRangeUpper?: number;
  displaySize?: number;
  blockOrder?: boolean;
  sweepToFill?: boolean;
  allOrNone?: boolean;
  minQty?: number;
  ocaType?: number;
  eTradeOnly?: boolean;
  firmQuoteOnly?: boolean;
  nbboPriceCap?: number;
  parentId?: number;
  triggerMethod?: number;
  volatility?: number;
  volatilityType?: number;
  deltaNeutralOrderType?: string;
  deltaNeutralAuxPrice?: number;
  deltaNeutralConId?: number;
  deltaNeutralSettlingFirm?: string;
  deltaNeutralClearingAccount?: string;
  deltaNeutralClearingIntent?: string;
  deltaNeutralOpenClose?: string;
  deltaNeutralShortSale?: boolean;
  deltaNeutralShortSaleSlot?: number;
  deltaNeutralDesignatedLocation?: string;
  continuousUpdate?: number;
  referencePriceType?: number;
  trailStopPrice?: number;
  trailingPercent?: number;
  basisPoints?: number;
  basisPointsType?: number;
  orderComboLegs?: string[];
  price?: number;
  smartComboRoutingParams?: ITagValue[];
  scaleInitLevelSize?: number;
  scaleSubsLevelSize?: number;
  scalePriceIncrement?: number;
  scalePriceAdjustValue?: number;
  scalePriceAdjustInterval?: number;
  scaleProfitOffset?: number;
  scaleAutoReset?: boolean;
  scaleInitPosition?: number;
  scaleInitFillQty?: number;
  scaleRandomPercent?: boolean;
  hedgeType?: string;
  hedgeParam?: string;
  optOutSmartRouting?: boolean;
  clearingAccount?: string;
  clearingIntent?: string;
  notHeld?: boolean;
  algoStrategy?: string;
  algoParams?: ITagValue[];
}

export interface IUnderComp {
  conId?: number;
  delta?: number;
  price?: number;
}

export interface IContract {
  summary: {
    primaryExch?: string;
    multiplier?: string;
    conId?: number;
    symbol?: string;
    secType?: string;
    expiry?: string;
    strike?: number;
    right?: string;
    exchange?: string;
    currency?: string;
    localSymbol?: string;
    tradingClass?: string;
  };

  conId?: number;
  symbol?: string;
  secType?: string;
  expiry?: string;
  strike?: number;
  right?: string;
  multiplier?: string;
  exchange?: string;
  currency?: string;
  localSymbol?: string;
  tradingClass?: string;
  priceMagnifier?: number;

  minTick?: number;
  orderTypes?: string;
  validExchanges?: string;
  nextOptionDate?: string;
  nextOptionType?: string;
  nextOptionPartial?: boolean;
  notes?: string;
  longName?: string;
  evRule?: string;
  evMultiplier?: number;

  cusip?: string;
  coupon?: number;
  maturity?: string;
  issueDate?: string;
  ratings?: string;
  bondType?: string;
  couponType?: string;
  convertible?: boolean;
  callable?: boolean;
  putable?: boolean;
  descAppend?: string;
  marketName?: string;

  underConId?: number;
  contractMonth?: string;
  industry?: string;
  category?: string;
  subcategory?: string;
  timeZoneId?: string;
  tradingHours?: string;
  liquidHours?: string;

  comboLegsDescrip?: string;
  primaryExch?: string;
  secIdList?: ITagValue[];
  comboLegs?: IComboLeg[];
  scaleSubsLevelSize?: number;
  underComp?: IUnderComp;
}

export interface IOutContract {
  comboLegs?: string;
  conId?: number;
  currency?: string;
  exchange?: string;
  expiry?: string;
  includeExpired?: string;
  localSymbol?: string;
  multiplier?: string;
  primaryExch?: string;
  primaryExchange?: string;
  right?: string;
  secId?: string;
  secIdType?: string;
  secType?: string;
  strike?: string;
  symbol?: string;
  tradingClass?: string;
  lastTradeDateOrContractMonth?: string;
  underComp?: IUnderComp;
}

export interface IFilter {
  clientId: string;
  acctCode: string;
  time: string;
  symbol: string;
  secType: string;
  exchange: string;
  side: string;
}

export interface ISubscription {
  numberOfRows: number;
  instrument: string;
  locationCode: string;
  scanCode: string;
  abovePrice: number;
  belowPrice: number;
  aboveVolume: number;
  marketCapAbove: number;
  marketCapBelow: number;
  moodyRatingAbove: string;
  moodyRatingBelow: string;
  spRatingAbove: string;
  spRatingBelow: string;
  maturityDateAbove: string;
  maturityDateBelow: string;
  couponRateAbove: number;
  couponRateBelow: number;
  excludeConvertible: string;
  averageOptionVolumeAbove: number;
  scannerSettingPairs: string;
  stockTypeFilter: string;
}