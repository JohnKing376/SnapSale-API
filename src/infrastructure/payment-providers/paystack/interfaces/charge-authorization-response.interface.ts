export interface ChargeAuthorizationResponse {
  data: {
    status: string;
    referenceCode: string;
    amount: number;
    paid_at: Date;
    created_at: Date;
  };
}
