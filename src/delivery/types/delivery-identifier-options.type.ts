type DeliveryIdentifierOptions =
  | {
      identifierType: 'id' | 'orderId';
      identifier: number;
    }
  | {
      identifierType: 'identifier';
      identifier: string;
    };

export default DeliveryIdentifierOptions;
