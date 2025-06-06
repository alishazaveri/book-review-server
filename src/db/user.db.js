const User = require("./model/user.model");

module.exports = {
  getUserByEmailId,
  getUsernameByEmailId,
  createUser,
};

async function getUserByEmailId({ emailId }) {
  const user = await User.findOne({ emailId });

  return user;
}

async function getUsernameByEmailId({ emailId }) {
  const username = await User.findOne({ emailId }, { username: 1, _id: 0 });

  return username;
}

async function createUser({ username, emailId, password }) {
  const user = new User({ username, emailId, password });

  await user.save();

  return user;
}
