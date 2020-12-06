import L from '../../common/logger';
import { priceFormatter } from '../../common/helpers';

import type { Cart } from './cart.service';

const OFFERS = {
  SOUP_AND_BREAD_BOGOF: {
    name: 'Soup And Bread BOGOF',
    description:
      'Buy a loaf of bread and a can of soup and get another soup for free.' +
      'Maximum 3 free soups per customer.',
  },

  SUNDAYU_SOUP_SALE: {
    name: 'Sunday Soup Sale',
    description: 'Buy any can of soup on a Sunday and get 10% off.',
  },

  DAIRY_DELICIOUS: {
    name: 'Dairy Delicious',
    description:
      "Buy a block of cheese and we'll let you buy as much milk as you like," +
      ' at the price we pay! Offer not valid when the customer is' +
      ' participating in the Sunday Soup Sale',
  },
};

interface Offer {
  id: number;
  apply: (cart: Cart) => Cart;
}

const businessOffers: Offer[] = [
  {
    id: 1,
    apply: (cart: Cart): Cart => {
      const SOUP = 1;
      const BREAD = 2;
      const MAX_ITEMS = 3;

      const applyable = [SOUP, BREAD].every((productId) =>
        cart.items.find((item) => item.id === productId)
      );

      if (!applyable) return cart;

      const freeSoups = Math.min(
        cart.items.reduce(
          (acc, curr) =>
            acc > 0 ? Math.min(curr.quantity, acc) : curr.quantity,
          0
        ),
        MAX_ITEMS
      );

      return {
        ...cart,
        items: [
          ...cart.items.map((item) => {
            if (item.id === SOUP) {
              const quantity = item.quantity + freeSoups;
              L.info(`Applying ${freeSoups} Soup And Bread BOGOF offers`);

              return {
                ...item,
                quantity,
                offer: OFFERS.SOUP_AND_BREAD_BOGOF,
                baseTotalBeforeOffers: quantity * item.basePrice,
                totalBeforeOffers: priceFormatter.format(
                  quantity * item.basePrice
                ),
              };
            }

            return item;
          }),
        ],
      };
    },
  },
];

export class OffersService {
  applyOffers(cart: Cart, offers: Offer[] = businessOffers): Cart {
    let cartWithOffersApplied = cart;
    offers.forEach((offer) => (cartWithOffersApplied = offer.apply(cart)));

    if (cartWithOffersApplied.items.some((item) => item.offer)) {
      return {
        ...cartWithOffersApplied,
        totalBeforeOffers: priceFormatter.format(
          cartWithOffersApplied.items
            .map((item) => item.baseTotalBeforeOffers ?? item.baseTotal)
            .reduce((acc, curr) => acc + curr)
        ),
      };
    }

    return cartWithOffersApplied;
  }
}

export default new OffersService();
