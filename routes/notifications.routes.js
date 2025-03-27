const express = require('express');
const { getAllNotifications, getNotificationById, createNotification, updateNotification, deleteNotification } = require('../controllers/notifications.controllers');

const router = express.Router();

router.get('/getall', getAllNotifications);
router.get('/get/:id', getNotificationById);
router.post('/create', createNotification);
router.put('/update/:id', updateNotification);
router.delete('/delete/:id', deleteNotification);

module.exports = router;