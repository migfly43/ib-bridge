import * as assert from 'assert';

import _ = require( 'lodash' );

export default function (symbol, exchange, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    secType: 'STK',
    symbol: symbol
  };
};
