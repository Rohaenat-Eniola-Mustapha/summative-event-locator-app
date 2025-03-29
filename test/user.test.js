const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

describe('User Authentication', () => {
    let server;

    beforeAll(async () => {
        await db.query('CREATE TABLE IF NOT EXISTS user (user_id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), location POINT, registration_date DATE, last_login DATE, preferred_language VARCHAR(255), preferred_categories VARCHAR(255))');
        server = app.listen(3001);
    });

    afterAll(async () => {
        await db.query('DROP TABLE IF EXISTS user_favorites');
        await db.query('DROP TABLE IF EXISTS notifications');
        await db.query('DROP TABLE IF EXISTS event_ratings');
        await db.query('DROP TABLE IF EXISTS events');
        await db.query('DROP TABLE IF EXISTS user');
        await db.end();
        server.close();
    });

    it('should register a new user', async () => {
        const uniqueUsername = `testuser-${uuidv4()}`;
        const uniqueEmail = `test-${uuidv4()}@example.com`;

        const response = await request(app)
            .post('/api/v1/user/create')
            .send({
                username: uniqueUsername,
                email: uniqueEmail,
                password: 'password123',
                location: { x: 1, y: 1 },
                registration_date: '2024-01-01',
                last_login: '2024-01-01',
                preferred_language: 'en',
                preferred_categories: 'test',
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('New User Record Created');
        
            await db.query('DELETE FROM user WHERE email = ?', [uniqueEmail]);
    });

    it('should log in a user', async () => {
        const uniqueUsername = `testuser-${uuidv4()}`;
        const uniqueEmail = `test-${uuidv4()}@example.com`;

        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.query('INSERT INTO user (username, email, password, location, registration_date, last_login, preferred_language, preferred_categories) VALUES (?, ?, ?, POINT(1,1), ?, ?, ?, ?)', [
            uniqueUsername,
            uniqueEmail,
            hashedPassword,
            '2024-01-01',
            '2024-01-01',
            'en',
            'test',
        ]);

        const response = await request(app)
            .post('/api/v1/user/login')
            .send({ email: uniqueEmail, password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');

        await db.query('DELETE FROM user WHERE email = ?', [uniqueEmail]);
    });

    it('should fail login with incorrect password', async () => {
        const uniqueUsername = `testuser-${uuidv4()}`;
        const uniqueEmail = `test-${uuidv4()}@example.com`;

        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.query('INSERT INTO user (username, email, password, location, registration_date, last_login, preferred_language, preferred_categories) VALUES (?, ?, ?, POINT(1,1), ?, ?, ?, ?)', [
            uniqueUsername,
            uniqueEmail,
            hashedPassword,
            '2024-01-01',
            '2024-01-01',
            'en',
            'test',
        ]);

        const response = await request(app)
            .post('/api/v1/user/login')
            .send({ email: uniqueEmail, password: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');

        await db.query('DELETE FROM user WHERE email = ?', [uniqueEmail]);
    });
});