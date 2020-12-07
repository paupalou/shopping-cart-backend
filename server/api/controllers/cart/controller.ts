import { Request, Response } from 'express';
import CartService from '../../services/cart.service';

import type { ItemAddition } from '../../services/cart.service';

export class Controller {
  create(req: Request, res: Response): void {
    const items: ItemAddition[] = req.body;
    const { isSunday } = req.query;
    CartService.create(items, Boolean(isSunday)).then((cart) => res.json(cart));
  }
}

export default new Controller();
