const repo = require('./postRepo');

module.exports.getById = async id => {
  return await repo.getPostById(id);
}

module.exports.getByUser = async username => {
  return await repo.getByUsername(username);
}

module.exports.getFavoritesByUser = async username => {
  return await repo.getFavoritesByUsername(username);
}

module.exports.getAll = async (page, limit) => {
  return await repo.getAllPosts(page, limit);
}

module.exports.create = async post => {
  if (!post.author) throw new Error('create operation failed: missing author');

  return await repo.createPost(post);
}

module.exports.update = async (id, post) => {
  return await repo.updatePost(id, post);
}

module.exports.delete = async id => {
  return await repo.deletePost(id);
}

module.exports.deleteUserPosts = async id => {
  return await repo.deleteUserPosts(id);
}