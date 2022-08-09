// grab our db client connection to use with our adapters
const client = require('../client');


async function getAllCarts() {
  /* this adapter should fetch a list of users from your db */
}

module.exports = {
  // add your database adapter fns here
  getAllCarts,
};