const { create } = require("domain");
const db = require("../config/database");

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
        const { username, email, password_hash, location, registration_date, last_login, preferred_language, preferred_categories } = req.body;
        if (!username || !email || !password_hash || !location || !registration_date || !last_login ||!preferred_language || !preferred_categories) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all fields'
            });
        }

        // Extract longitude and latitude from the location object
        const longitude = location.x;
        const latitude = location.y;

        const [data] = await db.query(
            `INSERT INTO user (username, email, password_hash, location, registration_date, last_login, preferred_language, preferred_categories) VALUES (?, ?, ?, POINT(?, ?), ?, ?, ?, ?)`,
            [
                username,
                email,
                password_hash,
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
        const { username, email, password_hash, location, registration_date, last_login, preferred_language, preferred_categories } = req.body;

        // Validation for location
        if (!location || typeof location !== 'object' || !location.hasOwnProperty('x') || !location.hasOwnProperty('y')) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or missing location object'
            });
        }

        const [data] = await db.query(
            `UPDATE user SET username = ?, email = ?, password_hash = ?, location = POINT(?, ?), registration_date = ?, last_login = ?, preferred_language = ?, preferred_categories = ? WHERE user_id = ?`,
            [
                username,
                email,
                password_hash,
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
const deleteUser = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { getUsers, getUsersByID, createUser, updateUser, deleteUser };