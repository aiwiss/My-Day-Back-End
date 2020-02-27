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

async function getByUser(req, res) {
  try {
    const messagesData = await service.getByUser(req.params.username);
    res.json(messagesData);
  } catch(err) {
    res.status(404).json(err);
  }
}

async function create(req, res) {
  try {
    const messagesData = await service.create(req.body);
    res.json(messagesData);
  } catch(err) {
    res.status(400).json(err);
  }
}

async function deleteUserMessages(req, res) {
  try {
    const success = await service.deleteUserMessages(req.params.id);
    res.json(success);
  } catch(err) {
    res.status(500).json(err);
  }
}
