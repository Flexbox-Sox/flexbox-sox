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
    const { rows: [cart] } = await client.query(`
      SELECT *
      FROM carts
      WHERE id=$1;
    `, [cartId]);

    return cart;
  } catch (error) {
    console.log("Error getting Cart BY ID");
  }
}

// Here we are creating a single cart
async function createCart({ userId, sessionId }) {
  /* this needs to be in the indidvidual cart item (not sure what this means)*/
  /*this adapter we should be able to access products by ProductName and Productid*/
  /*We need manipulate the cartItems as well*/
  /*Not sure if we need a JOIN here at all*/
  /*Join with productId and CartId*/
  /*Not sure what the right place to join with*/

  /*Or is it a join with CartItems and Carts*/
  try {
    /*if we create the cart we will need to */
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
    const { rows: cartItem } = client.query(`
      INSERT INTO "cartItems" ("productId","priceAtPurchase","cartId")
      VALUES ($1, $2, $3)
      RETURNING *;
    `,[productId, priceAtPurchase, cartId]);
    return cartItem;
  } catch (error) {
    throw error;
  }
}

/*not sure if we are going to use this yet*/
async function attachProducttoCartItems() {
/*select name, ondate from cust join ordr on cust.id = ordr.cust;*/
/* We need to merge(JOIN) CartItems Id with Products Id*/
// try {
//   const { rows: cartItems } = await client.query(`
//   SELECT cartItems.* products.name AS "cartProductName"
//   FROM cartItems
//   JOIN products on cartItems. "cartProductId"= products.id
//   `);
//   return cartItems;
// } catch (error) {
//   throw error;
// }
}

async function attachCartItemtoCarts() {
  /*Here I'm not sure what are the merge here is either*/
  /*There is already a CartItems row so then we just need to JOIN With products*/
  /*We could merge CartItems with Carts userId */
  const carts = [...carts];
  try {
    const attachingItemtoCart = await client.query(`
           
           `);
    return attachingItemtoCart;
  } catch (error) {}
}

async function attachCartsToUsers() {
  try {
  } catch (error) {
    console.log(error);
  }
}

async function updateCart(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    const { rows: [cart] } = await client.query(`
      UPDATE carts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return cart;
  } catch (error) {
    console.log(error);
  }
}

async function deleteCart(id) {
  await client.query(`
    DELETE FROM carts
    WHERE id=$1
    RETURNING *;
  `, [id]);
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
