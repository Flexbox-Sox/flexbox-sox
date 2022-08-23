// grab our db client connection to use with our adapters
const client = require("../client");

// GET ALL CARTS (ADMIN ONLY)
async function getAllCarts() {
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

// This is the function that is allowing you to get a single cart by Id, not including items in it
async function getCartById(cartId) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT *
      FROM carts
      WHERE id=$1;
    `, [cartId]);

    return cart;
  } catch (error) {
      throw error;
    }
}

// get a cart by a user id
async function getCartByUser(userId) {
  try {
    const { rows: carts } = await client.query(`
      SELECT *
      FROM carts
      WHERE "userId"=$1;
    `, [userId]);

    return carts;
  } catch (error) {
    throw error;
  }
}

async function getCartBySessionId(sessionId) {
  try {
    const { rows: carts } = await client.query(`
      SELECT *
      FROM carts
      WHERE "sessionId"=$1;
    `, [sessionId]);

    return carts;
  } catch (error) {
    throw error;
  }
}

async function getCartItemByProductId(productId, cartId) {
  try {
    const { rows: [cartItem] } = await client.query(`
      SELECT * 
      FROM "cartItems"
      WHERE "productId"=$1 AND "cartId"=$2
    `, [productId, cartId]) 

    return cartItem;
  } catch (error) {
    throw error;
  }
}


// Here we are creating a single cart
async function createCart({ userId, sessionId }) {
  try {
    const { rows: [cart] } = await client.query(`
      INSERT INTO carts("userId", "sessionId")
      VALUES ($1, $2)
      RETURNING *;
    `,[userId, sessionId]);

    return cart;
  } catch (error) {
    throw error;
  }
}

// CREATE A CART ITEM (AKA ADD ITEM TO CART)
async function createCartItem({ productId, priceAtPurchase, cartId }) {
  try {
    const { rows: [cartItem] } = await client.query(`
      INSERT INTO "cartItems"("productId","priceAtPurchase","cartId")
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [productId, priceAtPurchase, cartId]);
    return cartItem;
  } catch (error) {
    throw error;
  }
}

// JOIN PRODUCTS TO ITEMS
async function attachProducttoCartItem(productId, cartId) {
  try {
    const { rows: [cartItem] } = await client.query(`
      SELECT "cartItems".id AS "cartItemId", "cartItems"."productId",
       "cartItems"."priceAtPurchase", "cartItems".quantity, products.name, products.description, products.photo 
      FROM "cartItems"
      JOIN products ON "cartItems"."productId"=products.id AND "cartItems"."productId"=$1 AND "cartItems"."cartId"=$2
    `, [productId, cartId]);
    return cartItem;
  } catch (error) {
    throw error;
  }
}

// GET A SINGLE CART BY ITS ID INCLUDING ALL OF ITS ITEMS!
async function getAllCartItemsInCart(cartId) {
  const cart = await getCartById(cartId);

  try {
    const { rows: cartItems } = await client.query(`
      SELECT *
      FROM "cartItems"
    `)

    const cartItemsToAdd = cartItems.filter(cartItem => 
      cartId === cartItem.cartId)
          
    cart.items = [];
    for (let i = 0; i < cartItemsToAdd.length; i++) {
      const productInfo = await attachProducttoCartItem(cartItemsToAdd[i].productId, cartId)
      cart.items.push(productInfo)
    }

    return cart;
  } catch (error) {
    throw error;
  }
}

// HAVE NOT USED THIS YET... 
async function attachCartsToUsers() {
  try {
    const { rows: [users] } = client.query(`
      SELECT carts. *
      FROM carts
      JOIN users ON carts."userId"= users.id
    `);

    return users;
  } catch (error) {
    throw error;
  }
}

// UPDATE A CART GIVEN ITS CART ID
async function updateCart(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try { const { rows: [cart] } = await client.query(`
      UPDATE carts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return cart;
  } catch (error) {
    throw error
  }
}

async function updateCartItem(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try { const { rows: [cartItem] } = await client.query(`
      UPDATE "cartItems"
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return cartItem;
  } catch (error) {
    throw error;
  }
}

// DELETE A CART GIVEN ITS ID
async function deleteCart(id) {
  await client.query(`
  DELETE FROM "cartItems"
  WHERE "cartId"=$1
  RETURNING *;
`, [id]);

  await client.query(`
    DELETE FROM carts
    WHERE id=$1
    RETURNING *;
  `, [id]);
}

// DELETE CART ITEMS BY ITS PRODUCT ID 
async function deleteCartItems(productId) {
  await client.query(`
    DELETE FROM "cartItems"
    WHERE "productId"=$1
    RETURNING*;
  `, [productId])
}

async function deleteCartItemInCart(productId, cartId) {
  await client.query(`
    DELETE FROM "cartItems"
    WHERE "productId"=$1 AND "cartId"=$2
    RETURNING *;
  `, [productId, cartId])
}

module.exports = {
  getAllCarts,
  getCartById,
  getCartByUser,
  getCartBySessionId,
  getCartItemByProductId,
  createCart,
  createCartItem,
  getAllCartItemsInCart,
  attachProducttoCartItem,
  attachCartsToUsers,
  updateCart,
  updateCartItem,
  deleteCart,
  deleteCartItems,
  deleteCartItemInCart
};
