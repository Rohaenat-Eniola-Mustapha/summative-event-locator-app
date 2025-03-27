// eventRatings.controllers.js

const db = require('../config/database');

// GET ALL EVENT RATINGS
const getAllEventRatings = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM event_ratings');
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'No event ratings found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching event ratings', error: error.message });
    }
};

// GET EVENT RATING BY ID
const getEventRatingById = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await db.query('SELECT * FROM event_ratings WHERE rating_id = ?', [id]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'Event rating not found' });
        }
        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching event rating', error: error.message });
    }
};

// CREATE EVENT RATING
const createEventRating = async (req, res) => {
    try {
        const { user_id, event_id, rating, review_text } = req.body;
        if (!user_id || !event_id || !rating) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO event_ratings (user_id, event_id, rating, review_text, rating_date) VALUES (?, ?, ?, ?, NOW())', // Changed to rating_date
            [user_id, event_id, rating, review_text]
        );

        res.status(201).send({ success: true, message: 'Event rating created', ratingId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error creating event rating', error: error.message });
    }
};

// UPDATE EVENT RATING
const updateEventRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, event_id, rating, review_text } = req.body;
        if (!user_id || !event_id || !rating) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'UPDATE event_ratings SET user_id = ?, event_id = ?, rating = ?, review_text = ? WHERE rating_id = ?', // No rating_date change for update
            [user_id, event_id, rating, review_text, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event rating not found' });
        }

        res.status(200).send({ success: true, message: 'Event rating updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error updating event rating', error: error.message });
    }
};

// DELETE EVENT RATING
const deleteEventRating = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM event_ratings WHERE rating_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event rating not found' });
        }
        res.status(200).send({ success: true, message: 'Event rating deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error deleting event rating', error: error.message });
    }
};

module.exports = { getAllEventRatings, getEventRatingById, createEventRating, updateEventRating, deleteEventRating };