import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateCustomerResponse } from './interfaces/create-customer-response.interface';
import { InitializeTransactionResponse } from './interfaces/initialize-transaction-response.interface';
import { VerifyTransactionResponse } from './interfaces/verify-transaction-response.interface';
import { ChargeAuthorizationResponse } from './interfaces/charge-authorization-response.interface';

@Injectable()
export class PaystackService {
  constructor(private readonly httpService: HttpService) {}

  private baseUrl = 'https://api.paystack.co';

  public async createCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
  }): Promise<{
    infrastructureResults: Record<string, any>;
    customerInformation: { customerCode: string };
  } | null> {
    const httpResponse = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/customer`, data, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if ((httpResponse.status as HttpStatus) !== HttpStatus.OK) {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );
      return null;
    }

    const responseData = httpResponse.data as CreateCustomerResponse;

    return {
      infrastructureResults: responseData.data,
      customerInformation: {
        customerCode: responseData.data.customer_code,
      },
    };
  }

  public async initializeTransaction(options: {
    email: string;
    amount: number;
    reference?: string;
    callback_url?: string;
  }): Promise<{
    infrastructureResults: Record<string, any>;
    transactionInformation: {
      authorizationUrl: string;
      access_code: string;
      reference: string;
    };
  } | null> {
    const payload = {
      ...options,
      amount: options.amount * 100, // convert to kobo
    };

    const httpResponse = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/transaction/initialize`, payload, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if (httpResponse.status !== 200) {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );
      return null;
    }

    const responseData = httpResponse.data as InitializeTransactionResponse;

    return {
      infrastructureResults: responseData.data,
      transactionInformation: {
        authorizationUrl: responseData.data.authorization_url,
        access_code: responseData.data.access_code,
        reference: responseData.data.reference,
      },
    };
  }

  public async verifyTransaction(options: { reference: string }): Promise<
    | {
        transactionStatus: 'success';
        infrastructureResults: Record<string, any>;

        transactionInformation: {
          referenceCode: string;

          transactionAmount: number;

          transactionDate: string;
        };
        customerCode: string;
      }
    | {
        transactionStatus: 'pending' | 'failed';
        infrastructureResults: Record<string, any>;

        transactionInformation: {
          referenceCode: string;

          transactionAmount: number;

          transactionDate: string;
        };
        customerCode: string;
      }
    | null
  > {
    const httpResponse = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/verify/${options.reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if ((httpResponse.status as HttpStatus) !== HttpStatus.OK) {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );
      return null;
    }

    const responseData = httpResponse as VerifyTransactionResponse;

    const transactionStatus = responseData.data.status;

    if (transactionStatus === 'abandoned' || transactionStatus === 'pending') {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );

      return {
        transactionStatus: 'pending',
        infrastructureResults: responseData.data,
        transactionInformation: {
          referenceCode: responseData.data.referenceCode,
          transactionAmount: responseData.data.amount / 100,
          transactionDate: responseData.data.paid_at.toISOString(),
        },
        customerCode: responseData.data.customer.customer_code,
      };
    }

    if (transactionStatus === 'failed') {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );

      return {
        transactionStatus: 'failed',
        infrastructureResults: responseData.data,
        transactionInformation: {
          referenceCode: responseData.data.referenceCode,
          transactionAmount: responseData.data.amount / 100,
          transactionDate: responseData.data.paid_at.toISOString(),
        },
        customerCode: responseData.data.customer.customer_code,
      };
    }

    return {
      transactionStatus: 'success',
      infrastructureResults: responseData.data,
      transactionInformation: {
        referenceCode: responseData.data.referenceCode,
        transactionAmount: responseData.data.amount / 100,
        transactionDate: responseData.data.paid_at.toISOString(),
      },
      customerCode: responseData.data.customer.customer_code,
    };
  }

  public async chargeAuthorization(data: {
    amount: number;
    email: string;
    authorization_code: string;
  }): Promise<
    | {
        transactionStatus: 'success';
        infrastructureResults: Record<string, any>;

        transactionInformation: {
          referenceCode: string;

          transactionAmount: number;

          transactionDate: string;
        };
      }
    | {
        transactionStatus: 'pending' | 'failed';
        infrastructureResults: Record<string, any>;

        transactionInformation: {
          referenceCode: string;

          transactionAmount: number;

          transactionDate: string;
        };
      }
    | null
  > {
    const payload = {
      ...data,
      amount: data.amount * 100,
    };

    const httpResponse = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/transaction/charge_authorization`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    if ((httpResponse.status as HttpStatus) !== HttpStatus.OK) {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );
      return null;
    }

    const responseData = httpResponse.data as ChargeAuthorizationResponse;

    const transactionStatus = responseData.data.status;

    if (transactionStatus === 'abandoned' || transactionStatus === 'pending') {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );

      return {
        transactionStatus: 'pending',
        infrastructureResults: responseData.data,
        transactionInformation: {
          referenceCode: responseData.data.referenceCode,
          transactionAmount: responseData.data.amount / 100,
          transactionDate: responseData.data.paid_at.toISOString(),
        },
      };
    }

    if (transactionStatus === 'failed') {
      console.error(
        'Paystack Provider Error',
        new HttpException(
          `${JSON.stringify(httpResponse.data, null, 2)}`,
          HttpStatus.BAD_GATEWAY,
          {
            cause: httpResponse.data,
          },
        ),
      );

      return {
        transactionStatus: 'failed',
        infrastructureResults: responseData.data,
        transactionInformation: {
          referenceCode: responseData.data.referenceCode,
          transactionAmount: responseData.data.amount / 100,
          transactionDate: responseData.data.paid_at.toISOString(),
        },
      };
    }

    return {
      transactionStatus: 'success',
      infrastructureResults: responseData.data,
      transactionInformation: {
        referenceCode: responseData.data.referenceCode,
        transactionAmount: responseData.data.amount / 100,
        transactionDate: responseData.data.paid_at.toISOString(),
      },
    };
  }
}
