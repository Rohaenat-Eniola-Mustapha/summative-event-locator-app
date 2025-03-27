const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const db = require('./config/database');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const eventCategoryRoutes = require('./routes/eventCategory.routes');
const notificationRoutes = require('./routes/notifications.routes');
const eventRatingsRoutes = require('./routes/eventRatings.routes');
const userFavoritesRoutes = require('./routes/userFavorites.routes');

// configure dotenv
dotenv.config();

// rest object
const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/user', require('./routes/user.routes'));
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/event_categories', eventCategoryRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/event_ratings', eventRatingsRoutes);
app.use('/api/v1/user_favorites', userFavoritesRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Welcome to The Event Locator App</h1>');
});

// conditionally listen
db.query('SELECT 1')
    .then(() => {
        // My SQL
        console.log('MySQL DB Connected'.bgCyan.white);

        // listen
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`.bgMagenta.white);
        });
    })
    .catch((error) => {
        console.error('MySQL Connection Error:', error);
    });