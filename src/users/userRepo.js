const User = require('./User');

module.exports.getUserById = async id => {
  return await User.findById(id);
}

module.exports.getUserByUsername = async (username) => {
  return await User.findOne({username: username});
}

module.exports.getUserByUsernameWithHash = async (username) => { 
  return await User.findOne({username: username}).select('+hash');
}

module.exports.getAllUsers = async id => {
  return await User.find({_id: { $nin: id }});
}

module.exports.createUser = async user => {
  const newUser = new User(user);
  return await newUser.save();
}

module.exports.updateUser = async updatedUserData => {
  const updatedUser = await User.findByIdAndUpdate(
    updatedUserData._id, 
    updatedUserData, 
    {new: true, useFindAndModify: false});

  return updatedUser;
}

module.exports.deleteUser = async id => {
  return await User.deleteOne({_id: id});
}