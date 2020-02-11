const express = require('express');
const router = express.Router();
const roles = require('./roles');
const auth = require('../middleware/auth');

const service = require('../users/userService');

router.post('/login', login);
router.post('/register', register);
router.get('/:id', auth(roles), getByEmail);
router.get('/admin/all/:id', auth(roles.admin), getAll);
router.put('/:id', auth(roles), update);
router.delete('/:id', auth(roles.admin), deleteUser);

module.exports = router;

// TODO: Implement error handling middleware
function login(req, res, next) { 
    service.login(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ message: 'Username or password is incorrect' }));
}

function register(req, res, next) {
    service.register(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
}

function getByEmail(req, res, next) {
    service.getByEmail(req.params.id)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Not found' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    service.getAll(req.params.id)
        .then(users => users ? res.json(users) : res.status(400).json({ message: 'Not found' }))
        .catch(err => next(err));
}

function update(req, res, next) {
    service.update(req.body)
        .then(updated => res.json({updated: updated}))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    service.delete(req.params.id)
        .then(deleted => res.json({deleted : deleted}))
        .catch(err => next(err));
}