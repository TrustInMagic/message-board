const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const allPosts = await Post.find().populate('poster').exec();
  console.log(allPosts);
  res.render('index', { title: 'Express', posts: allPosts });
});

module.exports = router;
