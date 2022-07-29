const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userDashboardController = require('../controllers/userDashboard.controller')


router.get('/userDashboard',userDashboardController.usrEnrolledActivities)
router.put("/userDashboard/:activityId", userDashboardController.addActivity)
router.delete("/userDashboard/:delId", userDashboardController.desEnrolActivity)

module.exports = router;