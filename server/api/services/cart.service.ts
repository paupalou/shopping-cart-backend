import L from '../../common/logger';
import ProductsService from './products.service';

import type { Product } from './products.service';

export interface ItemAddition {
  id: number;
  quantity: number;
}

interface Item {
  name: string;
  quantity: number;
  price: string;
  total: string;
}

interface Cart {
  items: Item[];
  total: number;
}

export class CartService {
  #priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  create(items: ItemAddition[]): Promise<Cart> {
    L.info(`create cart with ${items.length} products`);
    const cart: Cart = { items: [], total: 0 };
    const productResponses: Promise<Product>[] = items.map((item) =>
      ProductsService.byId(item.id).then((product) => {
        const itemTotal = item.quantity * product.customerPrice;
        const cartItem: Item = {
          name: product.name,
          quantity: item.quantity,
          price: this.#priceFormatter.format(product.customerPrice),
          total: this.#priceFormatter.format(itemTotal),
        };

        cart.items.push(cartItem);
        cart.total += itemTotal;

        return product;
      })
    );

    return Promise.all(productResponses).then((_) => cart);
  }
}

export default new CartService();
