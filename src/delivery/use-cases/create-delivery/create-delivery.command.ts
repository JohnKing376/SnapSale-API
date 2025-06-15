import { Statuses } from '../../enums/statuses.enum';

export class CreateDeliveryCommand {
  /**
   * The address of the where the delivery should go
   */
  address: string;

  /**
   * The city of the customer's
   */
  city: string;

  /**
   * The region of the customer
   */
  country: string;

  /**
   * The mobile no of the customer
   */
  phoneNumber: string;

  /**
   * The automatically generated tracking identifier of the delivery
   */
  trackingIdentifier: string;

  /**
   * The statuses of the delivery
   */
  status: Statuses;

  /**
   * The date the delivery would arrive at the customer's destination
   */
  deliveryDate?: Date;

  /**
   * The order that owns this delivery
   */
  orderId?: number;

  /**
   * The user that owns the delivery
   */
  userId?: number;
}
