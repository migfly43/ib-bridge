"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var _ = require("lodash");
var chalk_1 = require("chalk");
var data_server_utils_1 = require("./data-server-utils");
var fs = require("fs");
var proto_messages_1 = require("./proto-messages");
var zlib = require("zlib");
var srv = chalk_1.default.black.bgBlue;
exports.startDataServer = function () {
    var server = net.createServer(function (socket) {
        new DataRecorder(socket);
        console.log(srv("Data server received new client connection"));
    });
    var port = 7600;
    server.listen(port, '127.0.0.1');
    console.log(srv("Data server Listen to port " + port));
};
var DataRecorder = /** @class */ (function () {
    function DataRecorder(socket) {
        var _this = this;
        this.outStream = null;
        this.socket = socket;
        this.dataFragment = "";
        this.socket.on('data', function (data) {
            _this.onData(data);
        });
        this.socket.on('close', function () {
            _this.end();
            console.log(srv("DATASRV close"));
        });
        this.socket.on('end', function () {
            _this.end();
            console.log(srv("DATASRV end"));
        });
        this.socket.on('error', function (err) {
            console.log(srv("DATASRV error"), err);
        });
    }
    DataRecorder.prototype.end = function () {
        if (this.outStream) {
            this.outStream.end();
            this.outStream = null;
        }
    };
    DataRecorder.prototype.onData = function (data) {
        var _this = this;
        var dataWithFragment = this.dataFragment + data.toString();
        //console.log("OnData", dataWithFragment);
        var tokens = dataWithFragment.split("\n");
        if (tokens[tokens.length - 1] !== '') {
            this.dataFragment = tokens[tokens.length - 1];
        }
        else {
            this.dataFragment = '';
        }
        tokens = tokens.slice(0, -1);
        if (!this.fileName) {
            var token = tokens[0];
            tokens = tokens.slice(1);
            var json = {};
            try {
                json = JSON.parse(token);
            }
            catch (err) {
                console.log("Failed to parse json [" + token + "]");
                console.error("Failed to parse json", err);
                throw new Error("Invalid JSON [" + token + "]");
            }
            if (!json.instrument) {
                throw new Error("Invalid instrument JSON, missing instrument field [" + token + "]");
            }
            if (!json.date) {
                throw new Error("Invalid instrument JSON, missing date field [" + token + "]");
            }
            this.fileName = data_server_utils_1.getFileName(json.instrument, new Date(json.date));
            //open file for data
            this.outStream = zlib.createGzip();
            var file = fs.createWriteStream(this.fileName, { flags: 'a' });
            this.outStream.pipe(file);
            console.log(srv("Data server started new file recording " + json.instrument + " - " + this.fileName));
        }
        //save data
        _.forEach(tokens, function (token) {
            try {
                var json = JSON.parse(token);
                var msg = new proto_messages_1.marketdata.MarketData();
                msg.MarketDataType = json.type;
                msg.Operation = json.op || 0;
                msg.Price = json.price;
                msg.Volume = json.volume;
                msg.Time = json.time;
                if (json.position !== undefined) {
                    msg.Position = json.position;
                }
                else {
                    msg.Position = -1;
                }
                var buffer = proto_messages_1.marketdata.MarketData.encodeDelimited(msg).finish();
                _this.outStream.write(buffer);
                //this.file.write(JSON.stringify(json));
                //this.file.write("\n");
            }
            catch (err) {
                console.error("Invalid incoming data json", token, err);
            }
        });
    };
    return DataRecorder;
}());
