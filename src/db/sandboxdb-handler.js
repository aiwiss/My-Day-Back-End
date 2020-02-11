const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

module.exports.connect = async () => {
  await mongoose.connect(uri);
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to DB");
});

