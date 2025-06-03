import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { CreateCustomerResponse } from './interfaces/create-customer-response.interface';

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

    if (httpResponse.status !== 200) {
      console.log(
        new HttpException('Paystack Provider Error', HttpStatus.BAD_GATEWAY, {
          cause: 'Error interacting with paystack provider',
        }),
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
}
