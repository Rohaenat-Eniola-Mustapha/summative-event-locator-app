const db = require('../config/database');

// GET ALL EVENTS
const getAllEvents = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM event');
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
        const [data] = await db.query('SELECT * FROM event WHERE event_id = ?', [id]);
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
        const { event_name, description, start_time, end_time, location, category_id, organizer_id } = req.body;
        if (!event_name || !description || !start_time || !end_time || !location || !category_id || !organizer_id) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query('INSERT INTO event (event_name, description, start_time, end_time, location, category_id, organizer_id) VALUES (?, ?, ?, ?, POINT(?, ?), ?, ?)', [
            event_name, description, start_time, end_time, location.x, location.y, category_id, organizer_id
        ]);

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
        const { event_name, description, start_time, end_time, location, category_id, organizer_id } = req.body;
        if (!event_name || !description || !start_time || !end_time || !location || !category_id || !organizer_id) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query('UPDATE event SET event_name = ?, description = ?, start_time = ?, end_time = ?, location = POINT(?, ?), category_id = ?, organizer_id = ? WHERE event_id = ?', [
            event_name, description, start_time, end_time, location.x, location.y, category_id, organizer_id, id
        ]);

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
        const [result] = await db.query('DELETE FROM event WHERE event_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Event not found' });
        }
        res.status(200).send({ success: true, message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error deleting event', error: error.message });
    }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };