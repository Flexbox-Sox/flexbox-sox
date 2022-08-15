// grab our db client connection to use with our adapters
const client = require("../client");

async function getAllCarts() {
  /* this adapter should fetch a list of users from your db <this sounds like an admin> */
  try {
    const { rows } = await client.query(`
      SELECT Id,userId,orderStatus,sessionId
      FROM carts; 
    `);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// create cart item function

async function createCart({ Id, userId }) {
  /* this needs to be in the indidvidual cart item*/
  /*this adapter we should be able to access products by ProductName and Productid*/
  /*We need manipulate the cartItems as well*/
  /*Not sure if we need a JOIN here at all*/
  /*Join with productId and CartId*/
  /*Not sure what the right place to join with*/
  /*Is is a join with productItems and Carts*/
  /*Or is it a join with CartItems and Carts*/
  try {
    /*if we create the cart we will need to */
    const {
      rows: [carts],
    } = await client.query(
      `
          INSERT INTO carts(Id, userId)
          VALUES ($1, $2)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;
    `,
      [Id, userId]
    );
    return carts;
  } catch (error) {
    console.log(error);
    /*What type the name of product it should say error "product doesnt exist" */
    throw error;
  }
}

// async function attachCartItemsToProducts() {
// /* We need to merge(JOIN) CartItems Id with Products Id*/
//   = client.query(`
//     SELECT
//     FROM
//     JOIN
//   `)
// }

async function attachCartItemstoCarts() {
  /*Here I'm not sure what are the merge here is either*/
  /*There is already a CartItems row so then we just need to JOIN With products*/
  /*We could merge CartItems with Carts userId */

  const carts = [...carts];
  try {
    const attaching = await client.query(`
           
           `);
  } catch (error) {}
}

async function attachCartsToUsers() {
  try {
  } catch (error) {
    console.log(error);
  }
}

async function updateCart() {
  /* this adapter should fetch a lists of productid from the db */
  /*If the shopper clears everything then whole cart deleted*/

  try {
    const { rows: cartItems } = await client.query(`
`);
    return cartItems;
  } catch (error) {}
}

async function deleteCart() {
  /* this adapter should be able to delete a cart with the productId */
}
module.exports = {
  // add your database adapter fns here
  getAllCarts,
  createCart,
  attachCartItemstoCarts,
  // attachCartItemsToProducts,
  attachCartsToUsers,
  updateCart,
  deleteCart,
};
