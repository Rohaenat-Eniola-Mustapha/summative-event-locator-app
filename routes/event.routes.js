const express = require('express');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/event.controllers');

const router = express.Router();

router.get('/getall', getAllEvents);
router.get('/get/:id', getEventById);
router.post('/create', createEvent);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);

module.exports = router;