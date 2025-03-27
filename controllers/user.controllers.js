const { create } = require("domain");
const db = require("../config/database");
const bcrypt = require('bcrypt');

// GET ALL USERS LIST
const getUsers = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM user');
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Records Found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'All Users Records',
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Users API',
            error
        });
    }
};

// GET STUDENT BY ID
const getUsersByID = async (req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Or Provide User id'
            });
        }
        const [data] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);

        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Records Found'
            });
        }
        res.status(200).send({
            success: true,
            userDetails: data[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get user by id'
        });
    }
};

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { username, email, password, location, registration_date, last_login, preferred_language, preferred_categories } = req.body;
        if (!username || !email || !password || !location || !registration_date || !last_login ||!preferred_language || !preferred_categories) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all fields'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Extract longitude and latitude from the location object
        const longitude = location.x;
        const latitude = location.y;

        const [data] = await db.query(
            `INSERT INTO user (username, email, password, location, registration_date, last_login, preferred_language, preferred_categories) VALUES (?, ?, ?, POINT(?, ?), ?, ?, ?, ?)`,
            [
                username,
                email,
                hashedPassword,
                longitude, // Correct order: longitude first
                latitude, // then latitude
                registration_date,
                last_login,
                preferred_language,
                preferred_categories
            ]
        );

        if (data.affectedRows === 0) {
            return res.status(500).send({
                success: false,
                message: 'Error in INSERT QUERY'
            });
        }

        res.status(201).send({
            success: true,
            message: 'New User Record Created',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Creating User',
            error
        });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid ID or Provide ID'
            });
        }
        const { username, email, password, location, registration_date, last_login, preferred_language, preferred_categories } = req.body;

        let hashedPassword = password; // Default to the provided password
        if (password) { // Only hash if a new password is provided
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Validation for location
        if (!location || typeof location !== 'object' || !location.hasOwnProperty('x') || !location.hasOwnProperty('y')) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or missing location object'
            });
        }

        const [data] = await db.query(
            `UPDATE user SET username = ?, email = ?, password = ?, location = POINT(?, ?), registration_date = ?, last_login = ?, preferred_language = ?, preferred_categories = ? WHERE user_id = ?`,
            [
                username,
                email,
                hashedPassword,
                location.x,
                location.y,
                registration_date,
                last_login,
                preferred_language,
                preferred_categories,
                user_id
            ]
        );

        if (data.affectedRows === 0) {
            return res.status(500).send({
                success: false,
                message: 'Error in Updating Data'
            });
        }
        res.status(200).send({
            success: true,
            message: 'User Details Updated',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updating User',
            error
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or missing user ID',
            });
        }

        const [result] = await db.query('DELETE FROM user WHERE user_id = ?', [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({
            success: false,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Please provide email and password' });
        }

        const [data] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const user = data[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).send({ success: true, message: 'Login successful', user: { user_id: user.user_id, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error logging in', error: error.message });
    }
};

module.exports = { getUsers, getUsersByID, createUser, updateUser, deleteUser, loginUser };