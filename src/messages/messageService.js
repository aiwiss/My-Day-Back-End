const repo = require('./messageRepo');

module.exports.getByUser = async username => {
  return await repo.getByUsername(username);
}

module.exports.create = async message => {
  return await repo.createMessage(message);
}

module.exports.deleteUserMessages = async username => {
  return await repo.deleteUserMessages(username);
}