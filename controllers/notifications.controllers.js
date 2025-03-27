const db = require('../config/database');

// GET ALL NOTIFICATIONS
const getAllNotifications = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM notifications');
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'No notifications found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching notifications', error: error.message });
    }
};

// GET NOTIFICATION BY ID
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await db.query('SELECT * FROM notifications WHERE notification_id = ?', [id]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'Notification not found' });
        }
        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching notification', error: error.message });
    }
};

// CREATE NOTIFICATION
const createNotification = async (req, res) => {
    try {
        const { user_id, event_id, message, status } = req.body;
        if (!user_id || !event_id || !message || !status) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO notifications (user_id, event_id, message, sent_at, status) VALUES (?, ?, ?, NOW(), ?)',
            [user_id, event_id, message, status]
        );

        res.status(201).send({ success: true, message: 'Notification created', notificationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error creating notification', error: error.message });
    }
};

// UPDATE NOTIFICATION
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, event_id, message, status } = req.body;
        if (!user_id || !event_id || !message || !status) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'UPDATE notifications SET user_id = ?, event_id = ?, message = ?, status = ? WHERE notification_id = ?',
            [user_id, event_id, message, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Notification not found' });
        }

        res.status(200).send({ success: true, message: 'Notification updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error updating notification', error: error.message });
    }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM notifications WHERE notification_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Notification not found' });
        }
        res.status(200).send({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error deleting notification', error: error.message });
    }
};

module.exports = { getAllNotifications, getNotificationById, createNotification, updateNotification, deleteNotification };