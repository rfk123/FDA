/*
    This file handles user registration and login.
    Generating JWT tokens upon successful login.
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUser } = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await createUser(req.pool, username, password);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUser(req.pool, username);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
