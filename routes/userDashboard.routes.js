const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userDashboardController = require('../controllers/userDashboard.controller')


router.get('/userDashboard',userDashboardController.activities)
router.put("/userDashboard/:activityId", userDashboardController.addActivity)

module.exports = router;