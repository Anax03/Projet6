const express = require('express');
const router = express.Router();
const userControlleur = require('../controlleurs/user');

router.post('/login', userControlleur.login);

router.post('/signup', userControlleur.signup);

module.exports = router;
