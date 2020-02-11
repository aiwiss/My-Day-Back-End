const repo = require('./messageRepo');

module.exports.getByUser = async username => {
  return await repo.getByUsername(username);
}

module.exports.create = async post => {
  return await repo.createMessage(post);
}

module.exports.deleteUserMessages = async id => {
  return await repo.deleteUserMessages(id);
}