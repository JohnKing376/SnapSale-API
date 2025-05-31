import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OrderItem from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import {
  AddItemToOrder,
  AddMultipleItemToOrder,
} from '../interfaces/order-item.interface';
import { ProductsService } from '../../products/providers/products.service';
import { OrderService } from './order.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly productsService: ProductsService,

    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  /**
   * @private
   * @description Method to add an order-item
   * @param data *{ productId, quantity, orderId }
   * @returns A promise of OrderItem
   */
  private async addItem(data: AddItemToOrder): Promise<OrderItem> {
    const { productId, quantity, orderId } = data;

    const product = await this.productsService.findProductById(productId);

    if (!product) throw new NotFoundException('product not found');

    const newProductQuantity = (product.quantity -= quantity);

    await this.productsService.updateProduct(
      {
        quantity: newProductQuantity,
      },
      product.identifier,
    );

    const orderItem = this.orderItemRepository.create({
      orderId: orderId,
      quantity: quantity,
      productId: product.id,
      price: product.price,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  /**
   * @description
   * Method to add multiple items to an order. Using parameters like item Array and orderId
   * @param data
   * @returns A Promise of OrderItem[]
   */
  async addMultipleItems(data: AddMultipleItemToOrder) {
    const { items, orderId } = data;

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const orderItem = await this.addItem({
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
      });

      orderItems.push(orderItem);

      await this.orderService.getOrderTotal(orderId);
    }

    return orderItems;
  }

  /**
   * @description
   * Method to get all order-items linked to an order id
   * @param orderId
   * @returns A Promise of OrderItem[]
   */
  async listOrderItems(orderId: number): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      where: {
        orderId,
      },
    });
  }
}
