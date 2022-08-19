// grab our db client connection to use with our adapters
const client = require("../client");

async function getAllProducts() {
  /* this adapter should fetch a list of users from your db */
  try {
    const { rows: products } = await client.query(`
      SELECT *
      FROM products;
    `);

    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const { rows: [ product ] } = await client.query(
      `SELECT *
      FROM products
      where id=$1;
    `, [productId]);

    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductByName(productName) {
  try {
    const { rows: [ product ] } = await client.query(`
      SELECT *
      FROM products
      where name=$1;
    `, [productName])

    return product;
  } catch (error) {
    throw error;
  }
}

async function createProduct({ name, price, description, photo }) {
  try {
    const { rows: [product] } = await client.query(
      `INSERT INTO products(name, price, description, photo)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,[name, price, description, photo]);

    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, fields={}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    const {rows: [product] } = await client.query(
      `UPDATE products
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return product;
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId) {
  await client.query(`
    DELETE FROM products
    WHERE id=$1
    RETURNING *;
  `,[productId]);
}

module.exports = {
  // add your database adapter fns here
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByName
};
