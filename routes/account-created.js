const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('account-created');
});

module.exports = router;
