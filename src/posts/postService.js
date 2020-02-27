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
  if (!post.author) throw new Error('missing author');

  return await repo.createPost(post);
}

module.exports.update = async (id, post) => {
  const updatedPost = await repo.updatePost(id, post);
  if (!updatedPost) throw new Error('post not found');

  return updatedPost;
}

module.exports.delete = async id => {
  const deletedPost = await repo.deletePost(id);
  if (!deletedPost) throw new Error('post not found');
  
  return deletedPost;
}

module.exports.deleteUserPosts = async username => {
  return await repo.deleteUserPosts(username);
}