const express = require('express');
const router = express.Router();
const roles = require('../users/roles');
const auth = require('../middleware/auth');
const db = require('../db/memorydb-handler');

const service = require('../posts/postService');

router.use(auth(roles));

router.get('/', getAll)
router.get('/:id', getById);
router.get('/user-posts/:username', getByUser);
router.get('/favorite-posts/:username', getFavoritesByUser);
router.post('/create', create);
router.put('/:id', update);
router.delete('/:id', deletePost);

// TODO: validate caller is admin
router.delete('/admin/all/:id', deleteUserPosts);

module.exports = router;

async function getById(req, res, next) {
  try {
    const post = await service.getById(req.params.id);
    res.json(post);
  } catch(err) {
    next(err);
  }
}

async function getByUser(req, res, next) {
  try {
    const posts = await service.getByUser(req.params.username);
    res.json(posts);
  } catch(err) {
    next(err);
  }
}

async function getFavoritesByUser(req, res, next) {
  try {
    const posts = await service.getFavoritesByUser(req.params.username);
    res.json(posts);
  } catch(err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    var page = parseInt(req.query.page) || 0;
    var limit = parseInt(req.query.limit) || 0;
    const posts = await service.getAll(page, limit);
    res.json(posts);
  } catch(err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const post = await service.create(req.body);
    res.json(post);
  } catch(err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updatedPost = await service.update(req.params.id, req.body);
    res.json(updatedPost);
  } catch(err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const deletedPost = await service.delete(req.params.id);
    res.json(deletedPost);
  } catch(err) {
  next(err);
  }
}

async function deleteUserPosts(req, res, next) {
  try {
    const success = await service.deleteUserPosts(req.params.id);
    res.json(success);
  } catch(err) {
  next(err);
  }
}
