type DeliveryIdentifierOptions =
  | {
      identifierType: 'id' | 'orderId';
      identifier: number;
    }
  | {
      identifierType: 'identifier' | 'trackId';
      identifier: string;
    };

export default DeliveryIdentifierOptions;
