import ProductsService from '../../services/products.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    ProductsService.all().then((r) => res.json(r));
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    ProductsService.byId(id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req: Request, res: Response): void {
    const { name, customerPrice, cost } = req.body;
    ProductsService.create(name, customerPrice, cost).then((r) =>
      res.status(201).location(`/api/v1/product/${r.id}`).json(r)
    );
  }
}
export default new Controller();
