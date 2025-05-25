import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CartItem from '../entities/cart-item.entity';
import { Repository } from 'typeorm';
import {
  AddCartItem,
  CartItemBase,
  UpdateCartItem,
} from '../interfaces/cart-item.interface';
import { ProductsService } from '../../../products/providers/products.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    private readonly productService: ProductsService,
  ) {}

  /**
   * @description
   * Adds an item to the cart.
   * @param addItemOptions Options for adding the item to the cart.
   * @returns CartItem.
   */
  public async addItem(addItemOptions: AddCartItem) {
    const { productId, quantity } = addItemOptions;

    const product = await this.productService.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cartItem = this.cartItemRepository.create({
      ...addItemOptions,
      product,
      quantity,
    });

    return await this.cartItemRepository.save(cartItem);
  }

  /**
   * @description
   * Finds an existing cart item based on the provided options.
   * @param itemOptions Options for finding an existing cart item.
   * @returns CartItem | null
   */
  public async findExistingItem(
    itemOptions: CartItemBase,
  ): Promise<CartItem | null> {
    const { cartId, productId } = itemOptions;

    return await this.cartItemRepository.findOne({
      where: {
        cartId,
        productId,
      },
    });
  }

  /**
   * @description
   * Removes all items from the cart.
   * @param cartId
   * @returns Promise<void>
   */
  public async removeAllItems(cartId: number): Promise<void> {
    await this.cartItemRepository.delete({
      cartId,
    });
  }

  /**
   * @description
   * Updates an existing item in the cart.
   * @param cartItemId
   * @param updateCartOptions
   * @returns CartItem
   */
  public async updateItem(
    cartItemId: number,
    updateCartOptions: UpdateCartItem,
  ): Promise<CartItem> {
    const item = await this.cartItemRepository.findOneBy({ id: cartItemId });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const updatedItem = this.cartItemRepository.merge(item, {
      ...updateCartOptions,
    });

    return await this.cartItemRepository.save(updatedItem);
  }

  /**
   * @description
   * Adds a specified quantity of a product to the cart.
   * If the product already exists in the cart, it updates the quantity.
   * If the product does not exist, it creates a new cart item.
   * @param options Object containing cartId, productId, and quantity.
   * @returns CartItem
   */
  public async addOrUpdateItem(options: {
    cartId: number;
    productId: number;
    quantity: number;
  }): Promise<CartItem> {
    const { cartId, productId, quantity } = options;

    const cartItem = await this.findExistingItem({
      cartId,
      productId,
    });

    const product = await this.productService.findProductById(productId);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const totalQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    if (cartItem) {
      if (product.quantity < totalQuantity) {
        throw new BadRequestException('Not enough stock available');
      }
      return await this.updateItem(cartItem.id, { quantity: totalQuantity });
    } else {
      return await this.addItem({
        productId: product.id,
        price: product.price,
        cartId: cartId,
        quantity,
      });
    }
  }

  /**
   * @description
   * Removes an item from the cart.
   * @param options Options for removing an item from the cart.
   * @returns Promise<void>
   */
  public async removeItem(options: {
    cartId: number;
    productId: number;
    quantity: number;
  }): Promise<void> {
    const { cartId, productId, quantity } = options;

    const cartItem = await this.findExistingItem({
      cartId,
      productId,
    });

    const product = await this.productService.findProductById(productId);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    const newQuantity = cartItem.quantity - quantity;

    if (newQuantity > 0) {
      await this.updateItem(cartItem.id, { quantity: newQuantity });
    } else {
      await this.cartItemRepository.delete({ id: cartItem.id });
    }
  }

  /**
   * @description
   * Retrieves all items in the cart.
   * @param cartId
   * @returns Promise<CartItem[]>
   */
  public async getAllItems(cartId: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: {
        cartId,
      },
    });
  }
}
