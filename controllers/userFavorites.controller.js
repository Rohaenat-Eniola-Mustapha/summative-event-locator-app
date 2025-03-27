const db = require('../config/database');

// GET ALL USER FAVORITES
const getAllUserFavorites = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM user_favorites');
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'No user favorites found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching user favorites', error: error.message });
    }
};

// GET USER FAVORITES BY USER ID
const getUserFavoritesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const [data] = await db.query('SELECT * FROM user_favorites WHERE user_id = ?', [userId]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'User favorites not found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching user favorites', error: error.message });
    }
};

// ADD EVENT TO USER FAVORITES
const addUserFavorite = async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        if (!userId || !eventId) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        await db.query('INSERT INTO user_favorites (user_id, event_id) VALUES (?, ?)', [userId, eventId]);

        res.status(201).send({ success: true, message: 'Event added to user favorites' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error adding event to user favorites', error: error.message });
    }
};

// REMOVE EVENT FROM USER FAVORITES
const removeUserFavorite = async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        if (!userId || !eventId) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query('DELETE FROM user_favorites WHERE user_id = ? AND event_id = ?', [userId, eventId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event not found in user favorites' });
        }

        res.status(200).send({ success: true, message: 'Event removed from user favorites' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error removing event from user favorites', error: error.message });
    }
};

module.exports = { getAllUserFavorites, getUserFavoritesByUserId, addUserFavorite, removeUserFavorite };