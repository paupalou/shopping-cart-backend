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

  SUNDAY_SOUP_SALE: {
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
  apply: (cart: Cart, isSunday?: boolean) => Cart;
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
              L.info(
                `Applying ${freeSoups} ${OFFERS.SOUP_AND_BREAD_BOGOF.name} offers`
              );

              return {
                ...item,
                quantity,
                offers: [
                  ...new Set([
                    ...(item.offers ?? []),
                    OFFERS.SOUP_AND_BREAD_BOGOF,
                  ]),
                ],
                baseTotal: quantity * item.basePrice,
                total: priceFormatter.format(quantity * item.basePrice),
                baseTotalWithOffers: item.quantity * item.basePrice,
                totalWithOffers: priceFormatter.format(
                  item.quantity * item.basePrice
                ),
              };
            }

            return item;
          }),
        ],
      };
    },
  },
  {
    id: 2,
    apply: (cart, isSunday): Cart => {
      const SOUP = 1;
      const DISCOUNT = 1 / 10;

      // I comment this line of code to test this offer
      // const isSunday = new Date().getDay() === 0
      if (!isSunday) return cart;

      L.info(`Applying ${OFFERS.SUNDAY_SOUP_SALE.name} 10% discount`);
      return {
        ...cart,
        items: cart.items.map((item) => {
          if (item.id === SOUP) {
            const baseTotal = item.baseTotalWithOffers ?? item.baseTotal;
            const baseTotalWithOffers = baseTotal - baseTotal * DISCOUNT;
            return {
              ...item,
              baseTotalWithOffers,
              totalWithOffers: priceFormatter.format(baseTotalWithOffers),
              offers: [
                ...new Set([...(item.offers ?? []), OFFERS.SUNDAY_SOUP_SALE]),
              ],
            };
          }

          return item;
        }),
      };
    },
  },
];

interface ApplyOffersParams {
  cart: Cart;
  offers?: Offer[];
  isSunday?: boolean;
}

export class OffersService {
  applyOffers({
    cart,
    offers = businessOffers,
    isSunday = false,
  }: ApplyOffersParams): Cart {
    let cartWithOffersApplied = cart;
    offers.forEach(
      (offer) =>
        (cartWithOffersApplied = offer.apply(cartWithOffersApplied, isSunday))
    );

    if (cartWithOffersApplied.items.some((item) => item.offers?.length > 0)) {
      const baseTotal = cartWithOffersApplied.items
        .map((item) => item.baseTotal)
        .reduce((acc, curr) => acc + curr);

      const baseTotalWithOffers = cartWithOffersApplied.items
        .map((item) => item.baseTotalWithOffers ?? item.baseTotal)
        .reduce((acc, curr) => acc + curr);

      return {
        ...cartWithOffersApplied,
        baseTotal,
        total: priceFormatter.format(baseTotal),
        baseTotalWithOffers,
        totalWithOffers: priceFormatter.format(baseTotalWithOffers),
      };
    }

    return cartWithOffersApplied;
  }
}

export default new OffersService();
