const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('registration', { title: 'Registration' });
});

router.post('/', [
  body('first_name', 'First name cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body('last_name', 'Last name cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body('email', 'Email cannot be empty').trim().isLength({ min: 1 }).escape(),

  body('password', 'Password cannot be empty')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  body('confirm_password', 'Passwords have to match').custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('registration', {
        title: 'Registration',
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        errors: errors.array(),
      });
      return;
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            next(err);
          } else {
            const user = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hashedPassword,
              membership: 'regular',
            });
            await user.save();
            res.redirect('/account-created');
          }
        });
      } catch (err) {
        return next(err);
      }
    }
  }),
]);

module.exports = router;
