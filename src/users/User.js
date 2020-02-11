const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  pseudoname: String,
  hash: { type: String, required: true, select: false },
  role: { type: String, required: true },
  gender: String
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;