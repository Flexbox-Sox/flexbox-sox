// grab our db client connection to use with our adapters
const client = require("../client");

async function createUser({ username, password, email}){
  try {
    const { rows: [user]} = await client.query(`
      INSERT INTO users(username, password, email)
      VALUES($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password, email])
    return user;
    
  } catch (error) {
    throw error
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, email, username, "isAdmin"
      FROM users;
    `);
  
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, email, username, "isAdmin"
      FROM users
      WHERE id=$1;
    `, [userId]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [ username ]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE email=$1
    `, [ email ]);

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
  const { rows: [user] } = await client.query(`
    DELETE FROM users
    WHERE id=$1
    RETURNING *;
  `,[userId]);

  return user;
}



module.exports = {
  // add your database adapter fns here
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  createUser,
  getUserByEmail
};
