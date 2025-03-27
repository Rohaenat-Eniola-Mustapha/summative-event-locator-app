const express = require('express');
const { getAllEventRatings, getEventRatingById, createEventRating, updateEventRating, deleteEventRating } = require('../controllers/eventRatings.controllers');

const router = express.Router();

router.get('/getall', getAllEventRatings);
router.get('/get/:id', getEventRatingById);
router.post('/create', createEventRating);
router.put('/update/:id', updateEventRating);
router.delete('/delete/:id', deleteEventRating);

module.exports = router;