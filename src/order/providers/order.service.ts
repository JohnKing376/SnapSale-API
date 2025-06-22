import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Order from '../entities/order.entity';
import { GetUserData } from '../../common/interfaces/get-user-data.inteface';
import { CreateOrder } from '../interfaces/create-order.interface';
import { OrderItemService } from './order-item.service';
import { UsersService } from '../../users/providers/users.service';
import OrderItem from '../entities/order-item.entity';
import { Statuses } from '../enums/statuses.enum';

//TODO: Clean Up Order-Services, Utilize Use Cases
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly orderItemService: OrderItemService,

    private readonly usersService: UsersService,
  ) {}

  /**
   * @description
   * Method to create a cart
   * @param activeUser
   * @param createOrderOptions
   * @returns A promise of Order
   */
  public async createOrder(
    activeUser: GetUserData,
    createOrderOptions: CreateOrder,
  ): Promise<Order | null> {
    const user = await this.usersService.findUserByIdentifier(activeUser.sub);

    if (!user) throw new NotFoundException('user not found');

    const { items } = createOrderOptions;

    if (!Array.isArray(items) || items.length === 0) {
      throw new NotFoundException('order items not found');
    }

    const order = this.orderRepository.create({
      user,
    });

    await this.orderRepository.save(order);

    await this.orderItemService.addMultipleItems({
      orderId: order.id,
      items,
    });

    return await this.getOrderById(order.id);
  }

  /**
   * @description
   * Method to list pending order items for the authenticated user
   * @param activeUser
   * @returns A promise of OrderItem[]
   */
  public async listPendingOrderItems(
    activeUser: GetUserData,
  ): Promise<OrderItem[]> {
    const user = await this.usersService.findUserByIdentifier(activeUser.sub);
    if (!user) throw new NotFoundException('user not found');

    const order = await this.orderRepository.findOne({
      where: {
        userId: user.id,
        status: Statuses.PENDING,
      },
    });

    if (!order) throw new NotFoundException('order not found');

    return await this.orderItemService.listOrderItems(order.id);
  }

  /**
   * @description
   * Method to list all orders for the authenticated user
   * @param activeUser
   * @returns A promise of Order[]
   */
  public async listOrders(activeUser: GetUserData): Promise<Order[]> {
    const user = await this.usersService.findUserByIdentifier(activeUser.sub);

    if (!user) throw new NotFoundException('user not found');

    return await this.orderRepository.findBy({ userId: user.id });
  }

  /**
   * @description
   * Method to list a pending order for the authenticated user
   * @param userIdentifier
   * @returns A promise of Order | null
   */
  public async listPendingOrder(userIdentifier: string): Promise<Order | null> {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) throw new NotFoundException('user not found');

    return await this.orderRepository.findOne({
      where: {
        userId: user.id,
        status: Statuses.PENDING,
      },
      relations: {
        items: true,
      },
    });
  }

  /**
   * @description
   * Method to get an order by its ID
   * @param orderId
   * @returns A promise of Order | null
   */
  private async getOrderById(orderId: number): Promise<Order | null> {
    return await this.orderRepository.findOneBy({ id: orderId });
  }

  /**
   * @description
   * Method to get the total of orders by its ID
   * @param orderId
   * @returns A promise of void
   */
  public async getOrderTotal(orderId: number) {
    const order = await this.getOrderById(orderId);

    if (!order) throw new NotFoundException('order not found');

    const items = await this.orderItemService.listOrderItems(order.id);

    let total = 0;

    for (const item of items) {
      total += item.price * item.quantity;
    }

    await this.orderRepository.update(
      { id: order.id },
      {
        total,
      },
    );
  }

  public async getOrderByIdentifier(identifier: string) {
    return await this.orderRepository.findOneBy({ identifier });
  }

  public async updateOrderStatus(identifier: string, status: Statuses) {
    const order = await this.getOrderByIdentifier(identifier);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    const updateOrder = this.orderRepository.merge(order, {
      status,
    });

    await this.orderRepository.save(updateOrder);

    return await this.getOrderById(updateOrder.id);
  }
}
