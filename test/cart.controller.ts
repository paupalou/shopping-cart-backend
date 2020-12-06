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
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('items')
          .to.be.an('array')
          .of.length(0);

        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(0);
      }));

  it('should get cart with 2 items', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 1, quantity: 2 },
        { id: 4, quantity: 10 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
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
        { id: 3, quantity: 3 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(5 * 87 + 3 * 275);
      }));

  // { id: 1, name: 'Soup', customerPrice: 199, cost: 186 },
  // { id: 2, name: 'Bread', customerPrice: 87, cost: 21 },
  it('should get 1 free soup if (1x) soup and (1x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 1, quantity: 1 },
        { id: 2, quantity: 1 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(1 * 199 + 1 * 87);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(2);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(1 * 199);
      }));

  it('should get 2 free soup if (4x) soup and (2x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 1, quantity: 4 },
        { id: 2, quantity: 2 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(4 * 199 + 2 * 87);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(6);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(4 * 199);
      }));

  it('should get 3 (as max) free soup if (10x) soup and (8x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart/')
      .send([
        { id: 1, quantity: 10 },
        { id: 2, quantity: 8 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(10 * 199 + 8 * 87);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(13);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(10 * 199);
      }));
});
