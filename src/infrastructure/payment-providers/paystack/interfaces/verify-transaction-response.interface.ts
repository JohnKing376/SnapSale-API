export interface VerifyTransactionResponse {
  data: {
    status: string;
    referenceCode: string;
    amount: number;
    paid_at: Date;
    created_at: Date;
    channel: string;
    currency: string;

    authorization: {
      authorization_code: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };

    customer: {
      customer_code: string;
    };
  };
}
