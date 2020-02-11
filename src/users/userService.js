const repo = require('./userRepo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;

module.exports.register = async newUserData => {
  // check if user already exists
  const existingUser = await repo.getUserByUsername(newUserData.username);

  if (existingUser) throw new Error('user already exists');

  // hash password
  if (!newUserData.password) throw new Error('missing password');

  newUserData.hash = _getHash(newUserData.password);

  newUserData.pseudoname = _generatePseudoName()

  // create new user
  const user = await repo.createUser(newUserData);
  const userObj = await user.toObject();

  // login the user
  userObj.token = _getToken(user);

  return userObj;
}

module.exports.login = async userData => {
  const user = await repo.getUserByUsername(userData.username, includeHash=true);
  // if user exists and passwords match return token
  if (!user) throw new Error('user not found');

  if (!_passwordMatch(userData.password, user.hash)) throw new Error('invalid credentials');
  
  const userObj = await user.toObject();

  userObj.token = _getToken(user);

  return userObj;
}

module.exports.update = async updatedUser => {
  if (updatedUser.password) {
    updatedUser.hash = _getHash(updatedUser.password);
  }

  return await repo.updateUser(updatedUser);
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

module.exports.getByEmail = async email => {
  const user = await repo.getUserByEmail(email);

  if (!user) throw new Error('user not found');

  return user;
}

module.exports.getAll = async id => {
  return await repo.getAllUsers(id);
}

function _getToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, secret)
}

function _getPublicUserData(user) {
  const { id, password, hash, ...publicUserData } = user;
  return publicUserData;
}

function _getHash(password) {
  return bcrypt.hashSync(password, 10);
}

function _passwordMatch(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function _generatePseudoName() {
  var unique = '_' + Math.random().toString(36).substr(2, 9);
  return `anonymous${unique}`;
}