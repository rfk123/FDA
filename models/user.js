/*
    This file handles database operations related to users. 
    Operations include creating a user, finding a user by username, etc..
*/

const bcrypt = require('bcryptjs');

async function createUser(pool, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
  } finally {
    client.release();
  }
}

async function findUser(pool, username) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = { createUser, findUser };
