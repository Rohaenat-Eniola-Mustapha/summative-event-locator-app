# Summative Event Locator App

## Description

The Summative Event Locator App is a backend API built with Node.js and Express.js, designed to manage user authentication, event listings, and related functionalities. It leverages a MySQL database for persistent data storage and Redis for real-time notifications. The application also supports internationalization (i18n) to cater to a global audience.

## Features

- **User Authentication:**
  - User registration and login using bcrypt for password hashing.
  - Secure user management.
- **Event Management:**
  - Create, read, update, and delete event listings.
  - Location-based event search.
  - Categorized event listings.
- **Real-time Notifications:**
  - Utilizes Redis for publishing and subscribing to event-related notifications.
- **Internationalization (i18n):**
  - Supports multiple languages for API responses.
  - Language detection via HTTP headers.
- **Database Interactions:**
  - MySQL for data storage.
  - Efficient database queries.
- **API Endpoints:**
  - Well-defined RESTful API endpoints for user and event management.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Redis
- bcrypt
- i18next
- mysql2
- nodemon

## Setup

1. **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd summative-event-locator-app
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

    - Create a `.env` file in the root directory.
    - Add the following environment variables:

        ```.env
        PORT=3000
        DB_HOST=127.0.0.1
        DB_USER=root
        DB_PASSWORD=<your-mysql-password>
        DB_NAME=event_locator_db
        REDIS_HOST=127.0.0.1
        REDIS_PORT=6379
        ```

4. **Database Setup:**

    - Ensure MySQL is installed and running.
    - Create the database specified in `DB_NAME`.
    - Run database migrations or import the necessary schema.

5. **Redis Setup:**

    - Ensure Redis is installed and running.

6. **Start the Server:**

    ```bash
    npm run dev
    ```

    - This will start the server using nodemon for development.

## API Endpoints

### User Routes

- `POST /api/v1/user/create`: Create a new user.
- `POST /api/v1/login`: Login a user.
- `GET /api/v1/user/getall`: Get all users.
- `GET /api/v1/user/get/:id`: Get a user by ID.
- `PUT /api/v1/user/update/:id`: Update a user.
- `DELETE /api/v1/user/delete/:id`: Delete a user.

### Event Routes

- `POST /api/v1/events/create`: Create a new event.
- `GET /api/v1/events/getall`: Get all events.
- `GET /api/v1/events/get/:id`: Get an event by ID.
- `PUT /api/v1/events/update/:id`: Update an event.
- `DELETE /api/v1/events/delete/:id`: Delete an event.
- `GET /api/v1/events/search`: Search events.

## Test Results Summary

All tests for the User Authentication suite passed successfully.

```bash

PASS test/user.test.js
User Authentication
√ should register a new user (134 ms)
√ should log in a user (163 ms)
√ should fail login with incorrect password (157 ms)

```

## Initial Issues and Troubleshooting

During the initial test runs, several issues were identified and addressed:

### 1. Duplicate Entry Errors

- **Problem:** Tests were failing due to duplicate entries for the `user.username` key in the database.
- **Error Message:** `Error: Duplicate entry 'testuser' for key 'user.username'`
- **Solution:** Modified the test setup to generate unique usernames for each test execution using UUIDs.

    ```javascript
    const { v4: uuidv4 } = require('uuid');
    const uniqueUsername = `testuser-${uuidv4()}`;

    ```

### 2. Incorrect Response Messages

- **Problem:** Expected response messages in tests did not match the actual messages returned by the API.
- **Solution:** Updated the expected messages in test assertions to match the API responses.

    ```javascript
    expect(response.body.message).toBe('New User Record Created'); // Example update
    ```

### 3. 404 Errors for Login Routes

- **Problem:** Login routes were returning 404 errors, indicating they were not found.
- **Solution:** Verified route definitions and registration in `user.routes.js` and `server.js`. Ensured the server was restarted after changes. Also verified the app variable in the test file was the same app variable that the routes are registered to.

### 4. Foreign Key Constraint (Events)

- **Problem:** Unable to drop the `user` table due to a foreign key constraint from the `events` table.
- **Solution:** Modified the `afterAll` function in `test/user.test.js` to drop the `events` table before the `user` table.

    ```javascript
    afterAll(async () => {
        await db.query('DROP TABLE IF EXISTS user_favorites');
        await db.query('DROP TABLE IF EXISTS notifications');
        await db.query('DROP TABLE IF EXISTS event_ratings');
        await db.query('DROP TABLE IF EXISTS events');
        await db.query('DROP TABLE IF EXISTS user');
        await db.end();
        server.close();
    });
    ```

### 5. Worker Process Failure Warning

- **Problem:** A warning message "A worker process has failed to exit gracefully..." appeared.
- **Possible Causes:** Potential resource leaks, lingering timers, or unclosed database/redis connections.
- **Troubleshooting Steps:**
  - Run tests with `--detectOpenHandles` to identify open handles.
  - Check for active timers and ensure they are properly cleared or `.unref()` is called.
  - Verify that database and redis connections are properly closed.
- **Note:** Even though the tests passed, this warning should be investigated further to prevent future issues.

    ```bash
    npx jest --detectOpenHandles
    ```

## Redis Connection

- The tests log that redis is connected.

    ```bash
    console.log
    Redis Connected
    at log (config/redis.js:14:13)
    ```

## Recommendations

- Continue to monitor for the "worker process failed to exit gracefully" warning and address any identified resource leaks.
- Ensure consistent response messages between the API and test assertions.
- Implement robust error handling in both the API and tests.
- Maintain thorough documentation for all API endpoints and test cases.
