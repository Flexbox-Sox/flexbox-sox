const {
  client,
  createProduct
} = require('./');

async function buildTables() {
  try {
    client.connect();
    console.log('Dropping tables...')
    await client.query(`
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
    `)
    console.log('Tables dropped!')
    console.log('Creating tables...');
    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            "isAdmin" BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            price NUMERIC NOT NULL,
            "inStock" BOOLEAN DEFAULT TRUE,
            description VARCHAR(255) NOT NULL,
            photo VARCHAR(255) NOT NULL,
            reviews VARCHAR(255)
        );

        CREATE TABLE carts(
            "userId" INTEGER REFERENCES users(id),
            "productId" INTEGER REFERENCES products(id),
            quanitity INTEGER DEFAULT 1,
            "isPurchased" BOOLEAN DEFAULT FALSE
        );
    `)
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
