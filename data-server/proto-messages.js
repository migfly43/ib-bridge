/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.marketdata = (function() {

    /**
     * Namespace marketdata.
     * @exports marketdata
     * @namespace
     */
    var marketdata = {};

    marketdata.MarketData = (function() {

        /**
         * Properties of a MarketData.
         * @memberof marketdata
         * @interface IMarketData
         * @property {number|null} [Position] MarketData Position
         * @property {number|null} [MarketDataType] MarketData MarketDataType
         * @property {number|null} [Operation] MarketData Operation
         * @property {number|null} [Price] MarketData Price
         * @property {number|null} [Volume] MarketData Volume
         * @property {number|null} [Time] MarketData Time
         */

        /**
         * Constructs a new MarketData.
         * @memberof marketdata
         * @classdesc Represents a MarketData.
         * @implements IMarketData
         * @constructor
         * @param {marketdata.IMarketData=} [properties] Properties to set
         */
        function MarketData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MarketData Position.
         * @member {number} Position
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.Position = 0;

        /**
         * MarketData MarketDataType.
         * @member {number} MarketDataType
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.MarketDataType = 0;

        /**
         * MarketData Operation.
         * @member {number} Operation
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.Operation = 0;

        /**
         * MarketData Price.
         * @member {number} Price
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.Price = 0;

        /**
         * MarketData Volume.
         * @member {number} Volume
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.Volume = 0;

        /**
         * MarketData Time.
         * @member {number} Time
         * @memberof marketdata.MarketData
         * @instance
         */
        MarketData.prototype.Time = 0;

        /**
         * Creates a new MarketData instance using the specified properties.
         * @function create
         * @memberof marketdata.MarketData
         * @static
         * @param {marketdata.IMarketData=} [properties] Properties to set
         * @returns {marketdata.MarketData} MarketData instance
         */
        MarketData.create = function create(properties) {
            return new MarketData(properties);
        };

        /**
         * Encodes the specified MarketData message. Does not implicitly {@link marketdata.MarketData.verify|verify} messages.
         * @function encode
         * @memberof marketdata.MarketData
         * @static
         * @param {marketdata.IMarketData} message MarketData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MarketData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Position != null && message.hasOwnProperty("Position"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Position);
            if (message.MarketDataType != null && message.hasOwnProperty("MarketDataType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.MarketDataType);
            if (message.Operation != null && message.hasOwnProperty("Operation"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.Operation);
            if (message.Price != null && message.hasOwnProperty("Price"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.Price);
            if (message.Volume != null && message.hasOwnProperty("Volume"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.Volume);
            if (message.Time != null && message.hasOwnProperty("Time"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.Time);
            return writer;
        };

        /**
         * Encodes the specified MarketData message, length delimited. Does not implicitly {@link marketdata.MarketData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.MarketData
         * @static
         * @param {marketdata.IMarketData} message MarketData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MarketData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MarketData message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.MarketData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.MarketData} MarketData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MarketData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.MarketData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Position = reader.int32();
                    break;
                case 2:
                    message.MarketDataType = reader.int32();
                    break;
                case 3:
                    message.Operation = reader.int32();
                    break;
                case 4:
                    message.Price = reader.double();
                    break;
                case 5:
                    message.Volume = reader.double();
                    break;
                case 6:
                    message.Time = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MarketData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.MarketData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.MarketData} MarketData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MarketData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MarketData message.
         * @function verify
         * @memberof marketdata.MarketData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MarketData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Position != null && message.hasOwnProperty("Position"))
                if (!$util.isInteger(message.Position))
                    return "Position: integer expected";
            if (message.MarketDataType != null && message.hasOwnProperty("MarketDataType"))
                if (!$util.isInteger(message.MarketDataType))
                    return "MarketDataType: integer expected";
            if (message.Operation != null && message.hasOwnProperty("Operation"))
                if (!$util.isInteger(message.Operation))
                    return "Operation: integer expected";
            if (message.Price != null && message.hasOwnProperty("Price"))
                if (typeof message.Price !== "number")
                    return "Price: number expected";
            if (message.Volume != null && message.hasOwnProperty("Volume"))
                if (typeof message.Volume !== "number")
                    return "Volume: number expected";
            if (message.Time != null && message.hasOwnProperty("Time"))
                if (typeof message.Time !== "number")
                    return "Time: number expected";
            return null;
        };

        /**
         * Creates a MarketData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.MarketData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.MarketData} MarketData
         */
        MarketData.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.MarketData)
                return object;
            var message = new $root.marketdata.MarketData();
            if (object.Position != null)
                message.Position = object.Position | 0;
            if (object.MarketDataType != null)
                message.MarketDataType = object.MarketDataType | 0;
            if (object.Operation != null)
                message.Operation = object.Operation | 0;
            if (object.Price != null)
                message.Price = Number(object.Price);
            if (object.Volume != null)
                message.Volume = Number(object.Volume);
            if (object.Time != null)
                message.Time = Number(object.Time);
            return message;
        };

        /**
         * Creates a plain object from a MarketData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.MarketData
         * @static
         * @param {marketdata.MarketData} message MarketData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MarketData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Position = 0;
                object.MarketDataType = 0;
                object.Operation = 0;
                object.Price = 0;
                object.Volume = 0;
                object.Time = 0;
            }
            if (message.Position != null && message.hasOwnProperty("Position"))
                object.Position = message.Position;
            if (message.MarketDataType != null && message.hasOwnProperty("MarketDataType"))
                object.MarketDataType = message.MarketDataType;
            if (message.Operation != null && message.hasOwnProperty("Operation"))
                object.Operation = message.Operation;
            if (message.Price != null && message.hasOwnProperty("Price"))
                object.Price = options.json && !isFinite(message.Price) ? String(message.Price) : message.Price;
            if (message.Volume != null && message.hasOwnProperty("Volume"))
                object.Volume = options.json && !isFinite(message.Volume) ? String(message.Volume) : message.Volume;
            if (message.Time != null && message.hasOwnProperty("Time"))
                object.Time = options.json && !isFinite(message.Time) ? String(message.Time) : message.Time;
            return object;
        };

        /**
         * Converts this MarketData to JSON.
         * @function toJSON
         * @memberof marketdata.MarketData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MarketData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MarketData;
    })();

    return marketdata;
})();

module.exports = $root;
