const db = require('../config/database');

// GET ALL EVENTS
const getAllEvents = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM events');
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'No events found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching events', error: error.message });
    }
};

// GET EVENT BY ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await db.query('SELECT * FROM events WHERE event_id = ?', [id]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'Event not found' });
        }
        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching event', error: error.message });
    }
};

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const { title, description, location, start_time, end_time, created_by, category_id } = req.body;
        if (!title || !description || !location || !start_time || !end_time || !created_by || !category_id) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO events (title, description, location, start_time, end_time, created_by, created_at, updated_at, category_id) VALUES (?, ?, POINT(?, ?), ?, ?, ?, NOW(), NOW(), ?)',
            [title, description, location.x, location.y, start_time, end_time, created_by, category_id]
        );

        res.status(201).send({ success: true, message: 'Event created', eventId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error creating event', error: error.message });
    }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, start_time, end_time, created_by, category_id } = req.body;
        if (!title || !description || !location || !start_time || !end_time || !created_by || !category_id) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'UPDATE events SET title = ?, description = ?, location = POINT(?, ?), start_time = ?, end_time = ?, created_by = ?, updated_at = NOW(), category_id = ? WHERE event_id = ?',
            [title, description, location.x, location.y, start_time, end_time, created_by, category_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event not found' });
        }

        res.status(200).send({ success: true, message: 'Event updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error updating event', error: error.message });
    }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM events WHERE event_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event not found' });
        }
        res.status(200).send({ success: true, message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error deleting event', error: error.message });
    }
};

// SEARCH EVENT BY LOCATION
const searchEventsByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).send({ success: false, message: 'Missing required parameters (latitude, longitude, radius)' });
        }

        const [data] = await db.query(
            'SELECT event_id, title, ST_Distance_Sphere(location, POINT(?, ?)) / 1000 AS distance_km FROM events WHERE ST_Distance_Sphere(location, POINT(?, ?)) / 1000 <= ?',
            [longitude, latitude, longitude, latitude, radius]
        );

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error searching events by location', error: error.message });
    }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, searchEventsByLocation };