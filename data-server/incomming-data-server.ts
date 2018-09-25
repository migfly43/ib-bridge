import * as net from "net";
import * as _ from 'lodash';
import chalk from "chalk";
import {getFileName} from "./data-server-utils";
import * as fs from "fs";
import {marketdata} from "./proto-messages";
import * as zlib from 'zlib';

const srv = chalk.black.bgBlue;

export const startDataServer = () => {
  const server = net.createServer((socket: net.Socket) => {
    new DataRecorder(socket);
    console.log(srv("Data server received new client connection"));
  });

  const port = 7600;
  server.listen(port, '127.0.0.1');
  console.log(srv(`Data server Listen to port ${port}`));
};

class DataRecorder {
  socket: net.Socket;
  fileName: string;
  dataFragment: string;
  outStream = null;

  constructor(socket: net.Socket) {
    this.socket = socket;
    this.dataFragment = "";

    this.socket.on('data', (data) => {
      this.onData(data);
    });

    this.socket.on('close', ()  => {
      this.end();
      console.log(srv(`DATASRV close`));
    });

    this.socket.on('end', () => {
      this.end();
      console.log(srv(`DATASRV end`));
    });

    this.socket.on('error', (err) => {
      console.log(srv(`DATASRV error`), err);
    });
  }

  end() {
    if (this.outStream) {
      this.outStream.end();
      this.outStream = null;
    }
  }

  onData(data: Buffer) {
    const dataWithFragment = this.dataFragment + data.toString();

    //console.log("OnData", dataWithFragment);

    let tokens = dataWithFragment.split("\n");
    if (tokens[tokens.length - 1] !== '') {
      this.dataFragment = tokens[tokens.length - 1];
    } else {
      this.dataFragment = '';
    }
    tokens = tokens.slice(0, -1);

    if (!this.fileName) {
      const token = tokens[0];
      tokens = tokens.slice(1);

      let json:any = {};
      try {
        json = JSON.parse(token);
      } catch (err) {
        console.log(`Failed to parse json [${token}]`);
        console.error("Failed to parse json", err);
        throw new Error(`Invalid JSON [${token}]`);
      }

      if (!json.instrument) {
        throw new Error(`Invalid instrument JSON, missing instrument field [${token}]`);
      }

      if (!json.date) {
        throw new Error(`Invalid instrument JSON, missing date field [${token}]`);
      }

      this.fileName = getFileName(json.instrument, new Date(json.date));

      //open file for data
      this.outStream = zlib.createGzip();
      const file = fs.createWriteStream(this.fileName, {flags:'a'});
      this.outStream.pipe(file);
      console.log(srv(`Data server started new file recording ${json.instrument} - ${this.fileName}`));
    }
    //save data

    _.forEach(tokens, (token: string) => {
      try {
        const json = JSON.parse(token);


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

        this.outStream.write(buffer);

        //this.file.write(JSON.stringify(json));
        //this.file.write("\n");
      } catch (err) {
        console.error("Invalid incoming data json", token, err)
      }
    });
  }
}