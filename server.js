const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const mySqlPool = require('./config/database');

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

app.get('/', (req, res) => {
    res.send('<h1>Welcome to The Event Locator App</h1>');
});

// conditionally listen
mySqlPool.query('SELECT 1')
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