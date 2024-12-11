/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();


router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.send('Username is taken');
  }
  if (password !== confirmPassword) {
    return res.send("Passwords don't match!");
  }


  const hashPassword = auth.encryptPassword(password);
  const payload = { username, password: hashPassword };

  const newUser = await User.create(payload);
  req.session.user = {
    username: newUser.username,
    _id: newUser._id,
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username });
  if (!user) {
    return res.send('Login failed, please try again');
  }

  const validPassword = auth.comparePassword(password, user.password);
  if (!validPassword) {
    return res.send('Login failed, please try again');
  }
  req.session.user = {
    username: user.username,
    _id: user._id,
  };
  req.session.save(() => {
    res.redirect('/');
  });
});


router.get('/sign-out', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;