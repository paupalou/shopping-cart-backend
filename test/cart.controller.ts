import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

const PRICES = {
  SOUP: 199,
  BREAD: 87,
  CHEESE: 275,
  MILK: 67,
};

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
          .equal(5 * PRICES.BREAD + 3 * PRICES.CHEESE);
      }));

  it('should get 1 free soup if (1x) soup and (1x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=false')
      .send([
        { id: 1, quantity: 1 },
        { id: 2, quantity: 1 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(1 * PRICES.SOUP + 1 * PRICES.BREAD);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(2);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(1 * PRICES.SOUP);
      }));

  it('should get 2 free soup if (4x) soup and (2x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=false')
      .send([
        { id: 1, quantity: 4 },
        { id: 2, quantity: 2 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(4 * PRICES.SOUP + 2 * PRICES.BREAD);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(6);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(4 * PRICES.SOUP);
      }));

  it('should get 3 (as max) free soup if (10x) soup and (8x) bread sent', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=false')
      .send([
        { id: 1, quantity: 10 },
        { id: 2, quantity: 8 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(10 * PRICES.SOUP + 8 * PRICES.BREAD);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(13);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(10 * PRICES.SOUP);
      }));

  it('should not apply discount on soup if is not sunday', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=false')
      .send([{ id: 1, quantity: 5 }])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .that.has.property('baseTotal')
          .equal(5 * PRICES.SOUP);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotal')
          .equal(5 * PRICES.SOUP);
      }));

  it('should apply 10% discount on soup if is sunday', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=true')
      .send([{ id: 1, quantity: 5 }])
      .expect('Content-Type', /json/)
      .then((r) => {
        const expectedBaseTotal = 5 * PRICES.SOUP * (1 - 1 / 10);
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(expectedBaseTotal);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(expectedBaseTotal);
      }));

  it('should apply both offers, 10% discount on soup and (2x) free soups', () =>
    request(Server)
      .post('/api/v1/cart?isSunday=true')
      .send([
        { id: 1, quantity: 5 },
        { id: 2, quantity: 2 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        const discount = 1 / 10;
        const expectedBaseTotalSoup = 5 * PRICES.SOUP * (1 - discount);
        const expectedBaseTotalBread = 2 * PRICES.BREAD;
        const expectedBaseTotal =
          expectedBaseTotalSoup + expectedBaseTotalBread;
        expect(r.body)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(expectedBaseTotal);

        const soup = r.body.items.find((i: { id: number }) => i.id === 1);
        expect(soup).to.be.an('object').that.has.property('quantity').equal(7);
        expect(soup)
          .to.be.an('object')
          .that.has.property('baseTotalWithOffers')
          .equal(expectedBaseTotalSoup);
      }));
});
