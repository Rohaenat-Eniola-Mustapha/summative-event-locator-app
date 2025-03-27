const sequelize = require('../config/database');
const User = require('./user');
const Event = require('./event');
const Category = require('./category');
const Location = require('./notification');
const Subcategory = require('./eventRating');
const EventCategory = require('./eventcategory');

module.exports = {
  sequelize,
  User,
  Event,
  Category,
  Location,
  Subcategory,
  EventCategory,
};