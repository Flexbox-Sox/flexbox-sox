// grab our db client connection to use with our adapters
const client = require("../client");

async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username,email
      FROM users
      WHERE id=$1;
    `,
      [userId]
    );

    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  // add your database adapter fns here
  getAllUsers,
  getUserById,
};
