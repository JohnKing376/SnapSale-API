import { Injectable, NotFoundException } from '@nestjs/common';
import generateRandomString from '../../common/utils/string-manipulation/generate-random-string';
import { Repository } from 'typeorm';
import { Delivery } from '../entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeliveryOptionsInterface } from '../interfaces/create-delivery-options.interface';
import { UpdateDeliveryOptions } from '../types/update-delivery-options.type';
import DeliveryIdentifierOptions from '../types/delivery-identifier-options.type';

@Injectable()
export class DeliveryService {
  constructor(
    /**
     * Inject Delivery Repository
     */
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  /**
   * @public
   * @description Method to create a delivery
   * @param createDeliveryOptions
   * @returns Delivery
   */
  public async createDelivery(
    createDeliveryOptions: CreateDeliveryOptionsInterface,
  ): Promise<Delivery> {
    const newDelivery = this.deliveryRepository.create({
      ...createDeliveryOptions,
      trackingIdentifier: this.generateTrackingIdentifier(),
    });

    return await this.deliveryRepository.save(newDelivery);
  }

  /**
   * @private
   * @description Method to find one delivery by its primary key
   * @param id
   * @returns Promise<Delivery | null>
   */
  private async findOneDeliveryById(id: number): Promise<Delivery | null> {
    return await this.deliveryRepository.findOneBy({ id });
  }

  /**
   * @private
   * @description Method to find one delivery by its identifier
   * @param identifier
   * @returns Promise<Delivery | null>
   */
  private async findOneDeliveryByIdentifier(
    identifier: string,
  ): Promise<Delivery | null> {
    return await this.deliveryRepository.findOneBy({ identifier });
  }

  /**
   * @private
   * @description Method to find one delivery by the user's id
   * @param orderId
   * @returns Promise<Delivery | null>
   */
  private async findOneDeliveryByOrderId(
    orderId: number,
  ): Promise<Delivery | null> {
    return await this.deliveryRepository.findOneBy({ orderId });
  }

  /**
   * @public
   * @description Method to generate a tracking identifier for a delivery
   * @returns string
   */
  public generateTrackingIdentifier(): string {
    const generateTrackingNumber = generateRandomString({
      characterSet: 'numeric',
      characterLength: 4,
      isCapitalized: false,
    });

    const generateTrackingString = generateRandomString({
      characterSet: 'alphabetic',
      characterLength: 4,
      isCapitalized: true,
    });

    return `${generateTrackingString} - ${generateTrackingNumber}`;
  }

  /**
   * @public
   * @description Method to update a delivery by its primary key
   * @param getDeliveryOptions
   * @param updateDeliveryOptions
   * @returns Delivery
   */
  public async updateDelivery(
    getDeliveryOptions: DeliveryIdentifierOptions,
    updateDeliveryOptions: UpdateDeliveryOptions,
  ): Promise<Delivery> {
    const delivery = await this.getDeliveryRecord(getDeliveryOptions);

    if (!delivery) throw new NotFoundException('delivery not found');

    const updatedDelivery = this.deliveryRepository.merge(delivery, {
      ...updateDeliveryOptions,
    });

    return await this.deliveryRepository.save(updatedDelivery);
  }

  /**
   * @public
   * @description Method to get a delivery record
   * @param getDeliveryOptions
   * @returns Promise<Delivery | null>
   */
  public async getDeliveryRecord(
    getDeliveryOptions: DeliveryIdentifierOptions,
  ): Promise<Delivery | null> {
    const { identifierType, identifier } = getDeliveryOptions;

    const GetDelivery: {
      [Key in DeliveryIdentifierOptions['identifierType']]: () => Promise<Delivery | null>;
    } = {
      id: async () => await this.findOneDeliveryById(Number(identifier)),

      identifier: async () =>
        await this.findOneDeliveryByIdentifier(String(identifier)),

      orderId: async () =>
        await this.findOneDeliveryByOrderId(Number(identifier)),
    };

    return await GetDelivery[identifierType]();
  }

  //TODO: DELETE DELIVERY

  // public async deleteDeliveryByIdentifier(identifier: string) {
  //   const delivery = await this.getDeliveryRecord({
  //     identifierType: 'identifier',
  //     identifier: identifier,
  //   });
  //
  //   if (!delivery) {
  //     throw new NotFoundException('delivery not found');
  //   }
  //
  //   await this.deliveryRepository.delete(delivery.id);
  // }
}
