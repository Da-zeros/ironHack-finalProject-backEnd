const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const authController = require('../controllers/auth.controller')

const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

const { route } = require('.');

const router = express.Router();

router.post('/signup', authController.authSignUp)
router.post('/login', authController.autLogin)
router.get('/verify/:token',authController.verify);
router.get('/verifyPass/:token',authController.verifyPass);
router.post('/forgot', authController.forgot)
router.post('/passwordModify', authController.passwordModify)

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
	res.status(200).json(req.payload);
});

module.exports = router;
