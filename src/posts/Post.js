const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  author: String,
  public: Boolean,
  emotion: String,
  favoriteOf: [String]
},
{
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;