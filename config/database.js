const mysql = require('mysql2/promise');

require('dotenv').config();

const mySqlPool = mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'Ennyballz123!!!',
  database: 'event_locator_db'
});

module.exports = mySqlPool;