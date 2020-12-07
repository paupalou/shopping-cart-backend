import L from '../../common/logger';
import ProductsService from './products.service';
import OffersService from './offers.service';
import { priceFormatter } from '../../common/helpers';

import type { Product } from './products.service';

export interface ItemAddition {
  id: number;
  quantity: number;
}

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
  baseTotal: number;
  basePrice: number;
  baseTotalWithOffers?: number;
  totalWithOffers?: string;
  offers?: {
    name: string;
    description: string;
  }[];
}

export interface Cart {
  items: Item[];
  baseTotal: number;
  total: string;
  baseTotalWithOffers?: number;
  totalWithOffers?: string;
}

export class CartService {
  create(items: ItemAddition[], isSunday = false): Promise<Cart> {
    L.info(`create cart with ${items.length} products`);
    const cart: Cart = {
      items: [],
      baseTotal: 0,
      total: priceFormatter.format(0),
    };

    const productResponses: Promise<Product>[] = items.map((item) =>
      ProductsService.byId(item.id).then((product) => {
        const itemTotal = item.quantity * product.customerPrice;
        const cartItem: Item = {
          id: item.id,
          name: product.name,
          quantity: item.quantity,
          basePrice: product.customerPrice,
          baseTotal: itemTotal,
          price: priceFormatter.format(product.customerPrice),
          total: priceFormatter.format(itemTotal),
        };

        cart.items.push(cartItem);
        cart.baseTotal += itemTotal;
        cart.total = priceFormatter.format(cart.baseTotal);

        return product;
      })
    );

    return Promise.all(productResponses).then(() =>
      OffersService.applyOffers({ cart, isSunday })
    );
  }
}

export default new CartService();
