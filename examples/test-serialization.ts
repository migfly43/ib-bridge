import * as LineByLineReader from 'line-by-line';

import {marketdata} from "../data-server/proto-messages";
import * as fs from "fs";
import * as streamBuffers from 'stream-buffers';
import * as zlib from 'zlib';

const labelRead = "read";
console.time(labelRead);

const lr = new LineByLineReader('./data/sample-ES 06-18-20180424.rdata');
let lineCount = 0;

const bufferStream = new streamBuffers.ReadableStreamBuffer({
  initialSize: (100 * 1024),   // start at 100 kilobytes.
  incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
});

const gzip = zlib.createGzip();
const unzipper1 = zlib.createGunzip();

unzipper1.on('data', (d) => {
  console.log('zipper1: Short data flush received ' + d.length + ' bytes');
});


//gzip.pipe(unzipper1);



const file = fs.createWriteStream('./data/out.buff');

gzip.pipe(file);

lr.on('error', function (err) {
  console.error(err);
});

lr.on('line', function (line) {
  lineCount++;
  const json = JSON.parse(line);
  let msg: marketdata.IMarketData;
  if (json.position !== undefined) {
    msg = marketdata.MarketData.create(json);
  } else {
    msg = marketdata.MarketData.create(json);
    msg.Position = -1;
  }

  const buffer = marketdata.MarketData.encode(msg).finish();
  //gzip.write(buffer);
  gzip.write(line);

  // 'line' contains the current line without the trailing newline character.
});

lr.on('end', function () {
  console.timeEnd(labelRead);
  console.log("end", lineCount);
  gzip.flush();
  gzip.end();
  // All lines are read, file is closed now.
});