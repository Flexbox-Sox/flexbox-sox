// grab our db client connection to use with our adapters
const client = require("../client");

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, email, username, location, isAdmin
      FROM users;
    `);
  
    return rows;
  } catch (error) {
    console.log("Error Getting all Users")
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, email, username
      FROM users
      WHERE id=$1;
    `,
      [userId]
    );

    return user;
  } catch (error) {
    console.log("Error getting User BY ID");
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [ username ]);

    if (!user) {
      throw {
        name: "NoUserByThatName",
        message: "A user with that username does not exist! sorry try again"
      }
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  await client.query(
    `
    DELETE FROM users
    WHERE id=$1
    RETURNING *;
  `,[userId]);
}



module.exports = {
  // add your database adapter fns here
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser
};
