import * as path from "path";
import * as ProtobufStream from "node-protobuf-stream";
import * as fs from "fs";

describe('read', () => {
  it("read", (done) => {

    ProtobufStream.initStream(
      path.join(__dirname, '../market-data.proto'),
      function () {
        const r = fs.createReadStream('./data/out.zip');
        const MarketData = ProtobufStream.get('MarketData');

        const serializer = new ProtobufStream.Serializer();
        const parser = new ProtobufStream.Parser();

        serializer.pipe(r);
        r.pipe(parser);

        parser.on('data', function(data) {
          console.log('server received: ' + JSON.stringify(data));
        });

        parser.on('end', function() {
          console.log('End');
          done();
        });
      }
    );
  });
});
