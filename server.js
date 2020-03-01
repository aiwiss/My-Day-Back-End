const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const db = require('./src/db/mongodb-handler');
const db = require('./src/db/memorydb-handler');
const userSeedHandler = require('./src/users/seed/seedHandler');
const postsSeedHandler = require('./src/posts/seed/seedHandler');

const PORT = process.env.PORT;
const seedDB = false;

db.connect();

seedDB && postsSeedHandler.seedPosts();
seedDB && userSeedHandler.seedPosts();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', require('./src/users/routes'));
app.use('/posts', require('./src/posts/routes'));
app.use('/messages', require('./src/messages/routes'));

const server = app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));