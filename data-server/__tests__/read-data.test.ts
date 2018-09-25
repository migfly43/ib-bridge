import * as LineByLineReader from 'line-by-line';
const protobuf = require("protobufjs/minimal");

import {marketdata} from "../../data-server/proto-messages";
import * as streamBuffers from 'stream-buffers';

import * as fs from "fs";
import * as zlib from 'zlib';
const labelRead = "read";

const useProtbuff = true;
const inputFileName = './data/sample-ES 06-18-20180424.rdata';
//const inputFileName = './data/small.rdata';

jest.setTimeout(180000); // 10 second timeout

describe('Zlib', () => {
  it("zlib create", (done) => {
    const r = fs.createReadStream('./package.json');
    const w = fs.createWriteStream('./data/test-out.zip');

    const zipper = zlib.createGzip();
    r.pipe(zipper).pipe(w);
    r.on("close", done);
  });

  it("zlib unzip", (done) => {
    const r = fs.createReadStream('./data/test-out.zip');
    const w = fs.createWriteStream('./data/test-out.txt');

    const zipper = zlib.createGunzip();
    r.pipe(zipper).pipe(w);
    r.on("close", done);
  });

  it("zip and protobuf data file", (done) => {
    const lr = new LineByLineReader(inputFileName);
    let lineCount = 0;
    let volume = 0;
    const gzip = zlib.createGzip();

    const file = fs.createWriteStream('./data/out.zip');
    gzip.pipe(file);

    lr.on('error', function (err) {
      console.error(err);
    });

    lr.on('line', function (line) {
      lineCount++;

      if (useProtbuff) {
        const json = JSON.parse(line);
        volume += json.price;
        let msg: marketdata.IMarketData = new marketdata.MarketData();
        msg.MarketDataType = json.type;
        msg.Operation = json.op || 0;
        msg.Price = json.price;
        msg.Volume = json.volume;
        msg.Time = json.time;
        if (json.position !== undefined) {
          msg.Position = json.position;
        } else {
          msg.Position = -1;
        }

        const buffer = marketdata.MarketData.encodeDelimited(msg).finish();

        gzip.write(buffer);
      } else {
        gzip.write(line);
      }
    });

    lr.on('end', function () {
      console.log("close", lineCount);
      gzip.end(() => {
        console.log("end", lineCount, volume);
        done();
      });

      // All lines are read, file is closed now.
    });
  });

  it.only("unzip and count", (done) => {
    console.time(labelRead);

    const r = fs.createReadStream('./data/large-out.zip');

    const zipper = zlib.createGunzip();
    const readStream = r.pipe(zipper);
    let count = 0;
    let volume = 0;
    let prevBuffer;

    readStream.on("data", (data: Buffer) => {
      let buffer;
      if (prevBuffer) {
        buffer = Buffer.concat([prevBuffer, data]);
      } else {
        buffer = data;
      }

      const reader = protobuf.Reader.create(buffer);
      let length = reader.uint32();

      // + 1 for the next message length
      while (reader.pos + length + 1 < reader.len) {
        let msg = marketdata.MarketData.decode(reader, length);
        volume += msg.Price;
        count++;

        if (count % 10000 === 0) {
          console.log("msg", count, volume);
          readStream.pause();
          setTimeout(() => {
            console.log('Now data will start flowing again.');
            readStream.resume();
          }, 40);
        }

        length = reader.uint32();
      }

      if (reader.len - reader.pos > 0) {
        // need to also read the already processed packet length
        prevBuffer = Buffer.alloc(reader.len - reader.pos + 1);
        buffer.copy(prevBuffer, 0, reader.pos - 1, reader.len);
      } else {
        prevBuffer = null;
      }
    });

    readStream.on("end", () => {

      // ugly as hell but I am not smart enogh to write more elegant code,
      // need to read the last message in the stream
      if (prevBuffer) {
        const reader = protobuf.Reader.create(prevBuffer);
        let msg = marketdata.MarketData.decodeDelimited(reader);
        volume += msg.Price;
        count++;
      }

      console.timeEnd(labelRead);
      console.log("Count", count, volume);
      done();
    });
  });

  it("unzip and count - alternative code", (done) => {
    console.time(labelRead);

    const r = fs.createReadStream('./data/large-out.zip');

    const zipper = zlib.createGunzip();
    const readStream = r.pipe(zipper);
    let count = 0;
    let volume = 0;

    readStream.on("data", (data: Buffer) => {
      const reader = protobuf.Reader.create(data);

      let length = reader.uint32();

      while (reader.pos + length < reader.len) {
        let msg = marketdata.MarketData.decode(reader, length);
        volume += msg.Price;
        console.log("msg", msg);
        length = reader.uint32();
        count++;
      }
    });

    readStream.on("end", () => {
      console.timeEnd(labelRead);
      console.log("Count", count, volume);
      done();
    });
  });

});


