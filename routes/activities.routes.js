const express = require('express');
const router = express.Router();

const activitiesController = require('../controllers/activities.controller')

router.get("/activities/all/", activitiesController.allActivities)
router.get("/activities/", activitiesController.filteredActivity)
router.post("/activities", activitiesController.addActivity)
router.post("/activities/comment", activitiesController.addComment)
router.get("/activities/comment", activitiesController.getComment)
router.get("/activities/type", activitiesController.type)

module.exports = router;