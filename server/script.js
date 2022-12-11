const { faker } = require('@faker-js/faker');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const SIZE = 20;

const createProduct = async ({
  name,
  availableQty,
  expectedQty,
  lastBuyPrice,
}) => ({
  id: uuid.v4(),
  name,
  availableQty,
  expectedQty,
  lastBuyPrice,
});

async function main() {
  const products = [];

  for (let i = 0; i < SIZE; i++) {
    const product = await createProduct({
      name: faker.commerce.productName(),
      availableQty: faker.datatype.number({ min: 0, max: 100 }),
      expectedQty: faker.datatype.number({ min: 0, max: 100 }),
      lastBuyPrice: faker.datatype.number({ min: 100, max: 1000 }),
    });

    products.push(product);
  }

  // frontend assets
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'assets', 'products'),
    JSON.stringify(products),
    'utf-8'
  );

  // backend schema
  fs.writeFileSync(
    path.join(__dirname, 'schema.json'),
    JSON.stringify(products),
    'utf-8'
  );
}
main();
