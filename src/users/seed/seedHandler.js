const User = require('../User');
const users = require('./seedData');


module.exports.seedUsers = function() {
  users.forEach(async (user, index) => {
    user.email = `testuser${index}@test.com`;
    const dbUser = new User(user);
    await dbUser.save();
  });
};