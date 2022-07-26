const express = require('express');
const router = express.Router();

const activitiesController = require('../controllers/activities.controller')

router.post("/activities", activitiesController.addActivity)
router.get("/activities/type", activitiesController.type)

module.exports = router;