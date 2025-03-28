const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const bcrypt = require('bcrypt');

describe('User Authentication', () => {
    let server;

    beforeAll(async () => {
        await db.query('CREATE TABLE IF NOT EXISTS user (user_id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), location POINT, registration_date DATE, last_login DATE, preferred_language VARCHAR(255), preferred_categories VARCHAR(255))');
        server = app.listen(3000);
    });

    afterAll(async () => {
        await db.query('DROP TABLE IF EXISTS user_favorites');
        await db.query('DROP TABLE IF EXISTS notifications');
        await db.query('DROP TABLE IF EXISTS user');
        await db.end();
        server.close();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/create')
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123', location: {x: 1, y: 1}, registration_date: '2024-01-01', last_login: '2024-01-01', preferred_language: 'en', preferred_categories: 'test' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('new_user_created');

        // ... rest of your registration test ...
    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('login_successful');
    });

    it('should fail login with incorrect password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('invalid_credentials');
    });
});