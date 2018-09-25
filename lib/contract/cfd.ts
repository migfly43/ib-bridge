import * as assert from 'assert';

import * as _ from 'lodash';

module.exports = function (symbol, exchange, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    secType: 'CFD',
    symbol: symbol
  };
};
