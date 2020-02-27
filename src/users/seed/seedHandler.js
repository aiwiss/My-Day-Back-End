const User = require('../User');
const users = require('./seedData');


module.exports.seedUsers = function() {
  users.forEach(async (user, index) => {
    user.username = `testuser${index}`;
    user.pseudoname = `anonymous${index}`;
    const dbUser = new User(user);
    await dbUser.save();
  });
};