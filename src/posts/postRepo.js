const Post = require('./Post');

module.exports.getPostById = async id => {
  return await Post.findById(id);
}

module.exports.getByUsername = async username => {
  return await Post.find({ author: username });
}

module.exports.getFavoritesByUsername = async username => {
  return await Post.find({ favoriteOf: username });
}

module.exports.getAllPosts = async (page, limit) => {
  const posts = await Post.find().sort({ createdAt: -1 }).skip(page * limit).limit(limit);
  if (posts.length === 0) return null;
  return posts;
}

module.exports.createPost = async post => {
  const newPost = new Post(post);

  return await newPost.save();
}

module.exports.updatePost = async (id, updatedPostData) => {
  let updatedPost = await Post.findByIdAndUpdate(id, updatedPostData, {new: true, useFindAndModify: false});
  
  return updatedPost;
}

module.exports.deletePost = async id => {
  const post = await Post.findById(id);
  if (!post) return null;
  
  await Post.deleteOne(post);

  return post;
}

module.exports.deleteUserPosts = async username => {
  await Post.deleteMany({ 'author': username });

  return true;
}