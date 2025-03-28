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
- `POST /api/v1/login/login`: Login a user.
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

## Testing

- Currently testing is not working, and is under development.
