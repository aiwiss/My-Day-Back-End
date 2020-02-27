const repo = require('./userRepo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;

module.exports.register = async newUserData => {
  const existingUser = await repo.getUserByUsername(newUserData.username);
  if (existingUser) throw new Error('user already exists');
  
  if (!newUserData.password) throw new Error('missing password');

  newUserData.hash = _getHash(newUserData.password);
  newUserData.pseudoname = _generatePseudoName()

  const userTemp = await repo.createUser(newUserData);
  const user = await userTemp.toObject();

  // login the user
  user.token = _getToken(user);

  return user;
}

module.exports.login = async userData => {
  const userTemp = await repo.getUserByUsernameWithHash(userData.username);
  if (!userTemp) throw new Error('user not found');

  const user = await userTemp.toObject();

  if (!_passwordsMatch(userData.password, user.hash)) throw new Error('invalid credentials');

  user.token = _getToken(user);

  return user;
}

module.exports.update = async updatedUser => {
  if (updatedUser.password) updatedUser.hash = _getHash(updatedUser.password);

  const user = await repo.updateUser(updatedUser);
  if (!user) throw new Error('user not found');

  return user;
}

module.exports.delete = async id => {
  const user = await repo.getUserById(id);
  if (!user) throw new Error('user not found');

  const success = await repo.deleteUser(id);
  if (!success) throw new Error('delete failed');
  
  return user;
}

module.exports.getById = async id => {
  const user = await repo.getUserById(id);
  if (!user) throw new Error('user not found');

  return user;
}

module.exports.getByUsername = async username => {
  const user = await repo.getUserByUsername(username);

  if (!user) throw new Error('user not found');

  return user;
}

module.exports.getAll = async id => {
  return await repo.getAllUsers(id);
}

function _getToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, secret)
}

function _getHash(password) {
  return bcrypt.hashSync(password, 10);
}

function _passwordsMatch(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function _generatePseudoName() {
  var unique = '_' + Math.random().toString(36).substr(2, 9);
  return `anonymous${unique}`;
}