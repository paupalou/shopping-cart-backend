import { Application } from 'express';
import productsRouter from './api/controllers/products/router';
export default function routes(app: Application): void {
  app.use('/api/v1/products', productsRouter);
}
