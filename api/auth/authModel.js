const db = require('../../data/dbConfig');

const findById = async (id) => {
  const user = await db('users').where({ id }).first();
  return user;
};

const add = async (user) => {
  const [id] = await db('users').insert(user);
  return findById(id);
};

module.exports = {
  findById,
  add,
};
