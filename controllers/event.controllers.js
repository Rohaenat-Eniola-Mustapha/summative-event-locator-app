const { Event } = require('../models');

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({ event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... other controller methods ...