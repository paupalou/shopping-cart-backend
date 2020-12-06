import { Request, Response } from 'express';
import CartService from '../../services/cart.service';

import type { ItemAddition } from '../../services/cart.service';

export class Controller {
  create(req: Request, res: Response): void {
    const items: ItemAddition[] = req.body;
    CartService.create(items).then((r) => res.json(r));
  }
}

export default new Controller();
