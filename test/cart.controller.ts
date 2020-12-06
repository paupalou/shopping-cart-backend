import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Cart', () => {
  it('should get cart with no items and 0 as total', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([])
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('items')
          .to.be.an('array')
          .of.length(0);

        expect(r.body)
          .to.be.an('object')
          .that.has.property('total')
          .equal(0);
      }));

  it('should get cart with 2 items', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 1, quantity: 2 },
        { id: 4, quantity: 10 }
      ])
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('items')
          .to.be.an('array')
          .of.length(2);
      }));

  // { id: 2, name: 'Bread', customerPrice: 87, cost: 21 },
  // { id: 3, name: 'Cheese', customerPrice: 275, cost: 234 },
  it('should get cart with correct sum of total', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 2, quantity: 5 },
        { id: 3, quantity: 3 }
      ])
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('total')
          .equal(5 * 87 + 3 * 275)
      }));
});
