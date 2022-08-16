// grab our db client connection to use with our adapters
const client = require("../client");

async function getAllCarts() {
  /* this adapter should fetch a list of all carts from your db <this sounds like an admin> */
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM carts; 
    `);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// This is the function that is allowing you to get a single cart by Id

async function getCartById(cartId) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
      SELECT *
      FROM carts
      WHERE id=$1;
    `,
      [cartId]
    );

    return cart;
  } catch (error) {
    console.log("Error getting Cart BY ID");
  }
}

// Here we are creating a single cart
async function createCart({ userId, sessionId }) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
          INSERT INTO carts("userId", "sessionId")
          VALUES ($1, $2)
          RETURNING *;
    `,
      [userId, sessionId]
    );
    return cart;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createCartItem({ productId, priceAtPurchase, cartId }) {
  try {
    const {
      rows: [cartItem],
    } = client.query(
      `
      INSERT INTO "cartItems" ("productId","priceAtPurchase","cartId")
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [productId, priceAtPurchase, cartId]
    );
    return cartItem;
  } catch (error) {
    throw error;
  }
}

/*not sure if we are going to use this yet*/
async function attachProducttoCartItems() {
  try {
    const {
      rows: [cartItems],
    } = await client.query(`
  SELECT "cartItems".* 
  FROM "cartItems"
  JOIN products ON "cartItems"."productId"= products.id
  `);
    return cartItems;
  } catch (error) {
    throw error;
  }
}

async function attachCartItemtoCarts() {
  try {
    const {
      rows: [carts],
    } = await client.query(`
           SELECT "cartItems".*, carts.*
            FROM "cartItems"
            JOIN carts ON "cartItems"."cartId" = carts.id
           `);

    return carts;
  } catch (error) {
    throw error;
  }
}

async function attachCartsToUsers() {
  try {
    const {
      rows: [users],
    } = client.query(`
    SELECT carts. *
    FROM carts
    JOIN users ON carts."userId"= users.id
    
    `);
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function updateCart(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [cart],
    } = await client.query(
      `
      UPDATE carts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return cart;
  } catch (error) {
    console.log(error);
  }
}

async function deleteCart(id) {
  await client.query(
    `
    DELETE FROM carts
    WHERE id=$1
    RETURNING *;
  `,
    [id]
  );
}

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  createCartItem,
  attachCartItemtoCarts,
  attachProducttoCartItems,
  attachCartsToUsers,
  updateCart,
  deleteCart,
};
