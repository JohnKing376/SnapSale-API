interface InitializePaymentOptions {
  email: string;
  amount: number;
  reference?: string;
  callback_url?: string;
}

export default InitializePaymentOptions;
