const db = require('../../data/dbConfig');
const bcrypt = require('bcrypt');

const uniqueUsername = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({ message: 'username or password is missing' });
  } else {
    const userMaybe = await db('users')
      .where({ username: req.body.username })
      .select('users.id', 'users.username')
      .first();

    if (userMaybe) {
      res.status(401).json({ message: 'username is taken' });
    } else {
      next();
    }
  }
};

const userExists = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({ message: 'username or password is missing' });
  } else {
    const { username, password } = req.body;
    const userMaybe = await db('users')
      .where({ username })
      .select('username, password')
      .first();

    if (!userMaybe) {
      res.status(401).json({ message: 'username or password is incorrect' });
    } else {
      const hash = userMaybe.password;
      const verified = bcrypt.compareSync(password, hash);

      if (userMaybe && verified) {
        req.user = userMaybe;
        next();
      } else {
        res.status(401).json('username or password is incorrect');
      }
    }
  }
};

module.exports = {
  uniqueUsername,
  userExists,
};
