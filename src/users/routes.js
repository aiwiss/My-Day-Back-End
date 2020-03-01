const express = require('express');
const router = express.Router();
const roles = require('./roles');
const auth = require('../middleware/auth');

const service = require('../users/userService');

router.post('/login', login);
router.post('/register', register);
router.get('/:username', auth(roles), getByUsername);
router.get('/admin/all/:requestorId', auth(roles.admin), getAll);
router.put('/:id', auth(roles), update);
router.delete('/:id', auth(roles.admin), deleteUser);

module.exports = router;

// TODO: Implement error handling middleware
async function login(req, res) {
  try {
    const user = await service.login(req.body);
    res.json(user);
  } catch (err) {
    res.status(401).json(err);
  }
}

async function register(req, res) {
  try {
    const user = await service.register(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getByUsername(req, res) {
  try {
    const user = await service.getByUsername(req.params.username);
    res.json(user);
  } catch (err) {
    res.status(404).json(err);
  }
}

async function getAll(req, res) {
  try {
    const users = service.getAll(req.params.requestorId);
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function update(req, res) {
  try {
    const updatedUser = service.update(req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deletedUser = service.delete(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json(err);
  }
}