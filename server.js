const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sandboxdb = require('./src/db/sandboxdb-handler');
const userSeedHandler = require('./src/users/seed/seedHandler');
const postsSeedHandler = require('./src/posts/seed/seedHandler');

const PORT = process.env.PORT;
const seedDB = false;

sandboxdb.connect();

// seedDB && userSeedHandler.seedUsers();
seedDB && postsSeedHandler.seedPosts();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', require('./src/users/routes'));
app.use('/posts', require('./src/posts/routes'));
app.use('/messages', require('./src/messages/routes'));

const server = app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));