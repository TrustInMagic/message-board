const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.render('new-post', { title: 'Create New Post' });
});

router.post('/', [
  body('post_title', 'Title cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body('text', 'Post content cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('new-post', {
        post_title: req.body.title,
        text: req.body.text,
        errors: errors.array(),
      });
      return;
    } else {
      const post = new Post({
        title: req.body.post_title,
        timestamp: new Date(),
        text: req.body.text,
        poster: req.user,
      });
      await post.save();
      res.redirect('/');
    }
  }),
]);

module.exports = router;
