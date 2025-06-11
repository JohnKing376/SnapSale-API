type DeliveryIdentifierOptions =
  | {
      identifierType: 'id' | 'userId';
      identifier: number;
    }
  | {
      identifierType: 'identifier';
      identifier: string;
    };

export default DeliveryIdentifierOptions;
