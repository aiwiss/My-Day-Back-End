const express = require('express');
const router = express.Router();
const roles = require('../users/roles');
const auth = require('../middleware/auth');

const service = require('./messageService');

router.use(auth(roles));

router.get('/:username', getByUser);
router.post('/create', create);

//TODO: validate caller is admin
router.delete('/admin/all/:id', deleteUserMessages);

module.exports = router;

async function getByUser(req, res, next) {
  try {
    const messagesData = await service.getByUser(req.params.username);
    console.log(messagesData);
    res.json(messagesData);
  } catch(err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const messages = await service.create(req.body);
    res.json(messages);
  } catch(err) {
    next(err);
  }
}

async function deleteUserMessages(req, res, next) {
  try {
    const success = await service.deleteUserMessages(req.params.id);
    res.json(success);
  } catch(err) {
  next(err);
  }
}
