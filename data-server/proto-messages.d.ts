import * as $protobuf from "protobufjs";

/** Namespace marketdata. */
export namespace marketdata {

    /** Properties of a MarketData. */
    interface IMarketData {

        /** MarketData Position */
        Position?: (number|null);

        /** MarketData MarketDataType */
        MarketDataType?: (number|null);

        /** MarketData Operation */
        Operation?: (number|null);

        /** MarketData Price */
        Price?: (number|null);

        /** MarketData Volume */
        Volume?: (number|null);

        /** MarketData Time */
        Time?: (number|null);
    }

    /** Represents a MarketData. */
    class MarketData implements IMarketData {

        /**
         * Constructs a new MarketData.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.IMarketData);

        /** MarketData Position. */
        public Position: number;

        /** MarketData MarketDataType. */
        public MarketDataType: number;

        /** MarketData Operation. */
        public Operation: number;

        /** MarketData Price. */
        public Price: number;

        /** MarketData Volume. */
        public Volume: number;

        /** MarketData Time. */
        public Time: number;

        /**
         * Creates a new MarketData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarketData instance
         */
        public static create(properties?: marketdata.IMarketData): marketdata.MarketData;

        /**
         * Encodes the specified MarketData message. Does not implicitly {@link marketdata.MarketData.verify|verify} messages.
         * @param message MarketData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.IMarketData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarketData message, length delimited. Does not implicitly {@link marketdata.MarketData.verify|verify} messages.
         * @param message MarketData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.IMarketData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarketData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarketData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.MarketData;

        /**
         * Decodes a MarketData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarketData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.MarketData;

        /**
         * Verifies a MarketData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarketData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarketData
         */
        public static fromObject(object: { [k: string]: any }): marketdata.MarketData;

        /**
         * Creates a plain object from a MarketData message. Also converts values to other types if specified.
         * @param message MarketData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.MarketData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarketData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
