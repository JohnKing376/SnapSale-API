import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Cart from '../entities/cart.entity';
import { GetUserData } from '../../common/interfaces/get-user-data.inteface';
import { UsersService } from '../../users/providers/users.service';
import { ProductsService } from '../../products/providers/products.service';
import { CartItemService } from '../cart-item/providers/cart-item.service';
import {
  AddItemToCart,
  RemoveItemFromCart,
} from '../interfaces/cart.interfaces';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { PaginateQuery } from '../../common/pagination/interfaces/paginate-query.interface';
import { OrderService } from '../../order/providers/order.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    private readonly usersService: UsersService,

    private readonly productService: ProductsService,

    private readonly cartItemService: CartItemService,

    private readonly paginateProvider: PaginationProvider,

    private readonly orderService: OrderService,
  ) {}

  private async getCartByUserId(userId: number): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: {
        userId,
      },
    });
  }

  /**
   * @description
   * Retrieves or creates a cart for the authenticated user.
   * If the user does not have an existing cart, a new one is created and saved.
   * @param authUser - The authenticated user's data.
   * @returns A promise that resolves to the user's cart.
   * @throws {NotFoundException} If the user is not found.
   */
  public async getOrCreateCart(authUser: GetUserData): Promise<Cart> {
    const user = await this.usersService.findUserByIdentifier(authUser.sub);

    if (!user) throw new NotFoundException('user not found');

    const cart = await this.getCartByUserId(user.id);

    if (!cart) {
      const newCart = this.cartRepository.create({
        user,
      });

      return await this.cartRepository.save(newCart);
    }

    return cart;
  }

  /**
   * @description
   * Adds an item to the authenticated user's cart.
   * If the item already exists in the cart, its quantity is updated.
   * @param authUser - The authenticated user's data.
   * @param addToCartOptions - Options containing the product ID and quantity to add.
   * @returns A promise that resolves to the updated cart with the total price.
   * @throws {NotFoundException} If the product is not found.
   * @throws {BadRequestException} If the requested quantity exceeds available stock.
   */
  public async addItemToCart(
    authUser: GetUserData,
    addToCartOptions: AddItemToCart,
  ): Promise<Cart | null> {
    const { quantity, productId } = addToCartOptions;

    const cart = await this.getOrCreateCart(authUser);

    const product = await this.productService.findProductById(productId);

    if (!product) throw new NotFoundException('product not found');

    if (product.quantity < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    await this.cartItemService.addOrUpdateItem({
      cartId: cart.id,
      productId: product.id,
      quantity,
    });

    return await this.getCartById(cart.id);
  }

  /**
   * @description
   * Removes a single item from the authenticated user's cart.
   * @param authUser - The authenticated user's data.
   * @param options - An Object that contains productId and quantity of the product to remove from the cart.
   * @returns A promise that resolves when the item is removed.
   */
  public async removeOneCartItem(
    authUser: GetUserData,
    options: RemoveItemFromCart,
  ) {
    const { productId, quantity } = options;

    const cart = await this.getOrCreateCart(authUser);

    await this.cartItemService.removeItem({
      productId,
      cartId: cart.id,
      quantity,
    });

    await this.getTotalPrice(cart.id);
  }

  /**
   * @description
   * Deletes all items from the authenticated user's cart.
   * @param authUser - The authenticated user's data.
   * @returns A promise that resolves when all items are removed from the cart.
   */
  public async deleteItemsFromCart(authUser: GetUserData) {
    const cart = await this.getOrCreateCart(authUser);
    await this.getTotalPrice(cart.id);
    return await this.cartItemService.removeAllItems(cart.id);
  }

  /**
   * @description
   * Calculates the total price of all items in the authenticated user's cart.
   * Updates the cart's total price in the database.
   * @param cartId - The cart id.
   */
  public async getTotalPrice(cartId: number) {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    const items = await this.cartItemService.getAllItems(cart.id);

    let cartPrice = 0;

    for (const item of items) {
      cartPrice += item.price * item.quantity;
    }

    await this.cartRepository.update(cart.id, {
      total: cartPrice,
    });
  }

  /**
   * @description
   * Paginates the cart items in the authenticated user's cart.
   * @param authUser
   * @param paginateQueryOptions
   * @returns A promise of the paginated cart
   */
  public async listCartItems(
    authUser: GetUserData,
    paginateQueryOptions: PaginateQuery,
  ) {
    const user = await this.usersService.findUserByIdentifier(authUser.sub);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.paginateProvider.paginateQuery(
      {
        page: paginateQueryOptions.page,
        limit: paginateQueryOptions.limit,
      },
      this.cartRepository,
      {
        userId: user.id,
      },
      {
        items: true,
        user: true,
      },
    );
  }

  /**
   * @description
   * Method to check out the authenticated user's cart
   * @param activeUser
   * @returns A promise of the user's order
   */
  public async checkout(activeUser: GetUserData) {
    const cart = await this.getOrCreateCart(activeUser);

    const items = await this.cartItemService.getAllItems(cart.id);

    if (!items || items.length === 0) {
      throw new NotFoundException(
        'cart items not found. cannot checkout an empty cart',
      );
    }

    const order = await this.orderService.createOrder(activeUser, { items });

    await this.cartItemService.removeAllItems(cart.id);

    return order;
  }

  /**
   * @description
   * Retrieves a cart by its ID.
   * @param cartId - The ID of the cart to retrieve.
   * @returns A promise that resolves to the cart or null if not found.
   */  
  private async getCartById(cartId: number): Promise<Cart | null> {
    return await this.cartRepository.findOneBy({ id: cartId });
  }
  
}
