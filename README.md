# Cart API

## Task

This API provides very basic access to create products, get all products and get products by their id.

Products have:
- id: simple integer identifier
- name: the display name of the product
- customerPrice: the price the customer sees and pays for the item, in cents
- cost: the price our business pays for this item, in cents

### Base Requirement

Add an endpoint to the API that allows the user to send a range of products and their quantities and receive a response for each item they sent:
- Name
- Quantity
- Individual Price in currency format like $10.99
- Total Price in currency format like $10.99

and a grand total of all items they sent.

#### Notes
- An existing controller and its routes exists in this API that you can use as reference.
- in server/common/api.yml you'll see existing definitions of the routes and responses for that too.


### Secondary Feature (Optional)

The business is creating a range of discounts and offers for customers which they've sent to you. They want the API to factor these into its cart calculations.

Update the endpoint to consider these offers and show:
- Which products have applied offers and what those offers are
- The before and after total price of the products
- The before and after grand total price of the cart

#### Offers
_Soup And Bread BOGOF_

Buy a loaf of bread and a can of soup and get another soup for free.
Maximum 3 free soups per customer.

_Sunday Soup Sale_

Buy any can of soup on a Sunday and get 10% off.

_Dairy Delicious_

Buy a block of cheese and we'll let you buy as much milk as you like, at the price we pay!
Offer not valid when the customer is participating in the Sunday Soup Sale.

## Notes To Developer

Please use the existing approach and structure you find present in this API.

Please ensure tests are present and working for all features.

Please ensure there is valid and complete Swagger definitions for any new endpoints.


## Using this API - Quick Start

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

---

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

or debug them

```shell
npm run test:debug
```

## Try It
* Open you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the `/examples` endpoint 
  ```shell
  curl http://localhost:3000/api/v1/examples
  ```


## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file
