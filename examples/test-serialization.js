"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LineByLineReader = require("line-by-line");
var proto_messages_1 = require("../data-server/proto-messages");
var fs = require("fs");
var streamBuffers = require("stream-buffers");
var zlib = require("zlib");
var labelRead = "read";
console.time(labelRead);
var lr = new LineByLineReader('./data/sample-ES 06-18-20180424.rdata');
var lineCount = 0;
var bufferStream = new streamBuffers.ReadableStreamBuffer({
    initialSize: (100 * 1024),
    incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
});
var gzip = zlib.createGzip();
var unzipper1 = zlib.createGunzip();
unzipper1.on('data', function (d) {
    console.log('zipper1: Short data flush received ' + d.length + ' bytes');
});
//gzip.pipe(unzipper1);
var file = fs.createWriteStream('./data/out.buff');
gzip.pipe(file);
lr.on('error', function (err) {
    console.error(err);
});
lr.on('line', function (line) {
    lineCount++;
    var json = JSON.parse(line);
    var msg;
    if (json.position !== undefined) {
        msg = proto_messages_1.marketdata.MarketData.create(json);
    }
    else {
        msg = proto_messages_1.marketdata.MarketData.create(json);
        msg.Position = -1;
    }
    var buffer = proto_messages_1.marketdata.MarketData.encode(msg).finish();
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
