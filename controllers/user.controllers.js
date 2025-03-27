const { create } = require("domain");
const db = require("../config/database");
const bcrypt = require('bcrypt');
const i18n = require('../config/i18n')

// GET ALL USERS LIST
const getUsers = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM user');
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: i18n.t('user_not_found') // Use i18n.t()
            });
        }
        res.status(200).send({
            success: true,
            message: i18n.t('all_users_records'), //use i18n.t()
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: i18n.t('error_get_all_users'), //use i18n.t()
            error
        });
    }
};

// GET STUDENT BY ID
const getUsersByID = async (req, res) => {
    try {
        const user_id = req.params.id;
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: i18n.t('invalid_id_or_provide_id') //use i18n.t()
            });
        }
        const [data] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);

        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: i18n.t('user_not_found') //use i18n.t()
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
            message: i18n.t('error_get_user_by_id') //use i18n.t()
        });
    }
};

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { username, email, password, location, registration_date, last_login, preferred_language, preferred_categories } = req.body;
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next
        if (!username || !email || !password || !location || !registration_date || !last_login || !preferred_language || !preferred_categories) {
            return res.status(400).send({
                success: false,
                message: i18n.t('please_provide_all_fields') //use i18n.t()
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
                longitude,
                latitude,
                registration_date,
                last_login,
                preferred_language,
                preferred_categories
            ]
        );

        if (data.affectedRows === 0) {
            return res.status(500).send({
                success: false,
                message: i18n.t('error_insert_query')//use i18n.t()
            });
        }

        res.status(201).send({
            success: true,
            message: i18n.t('new_user_created') //use i18n.t()
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: i18n.t('error_creating_user'), //use i18n.t()
            error
        });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: i18n.t('invalid_id_or_provide_id') //use i18n.t()
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
                message: i18n.t('invalid_or_missing_location') //use i18n.t()
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
                message: i18n.t('error_updating_data') //use i18n.t()
            });
        }
        res.status(200).send({
            success: true,
            message: i18n.t('user_details_updated') //use i18n.t()
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: i18n.t('error_updating_user'), //use i18n.t()
            error
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next

        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: i18n.t('invalid_or_missing_user_id') // Use i18n.t()
            });
        }

        const [result] = await db.query('DELETE FROM user WHERE user_id = ?', [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: i18n.t('user_not_found') // Use i18n.t()
            });
        }

        res.status(200).send({
            success: true,
            message: i18n.t('user_deleted_successfully') // Use i18n.t()
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({
            success: false,
            message: i18n.t('error_deleting_user'), // Use i18n.t()
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const language = req.headers['accept-language'] || 'en'; // Detect language
        i18n.changeLanguage(language); // Set language for i18next

        if (!email || !password) {
            return res.status(400).send({ success: false, message: i18n.t('please_provide_all_fields') }); // Use i18n.t()
        }

        const [data] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: i18n.t('user_not_found') }); // Use i18n.t()
        }

        const user = data[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: i18n.t('invalid_credentials') }); // Use i18n.t()
        }

        res.status(200).send({ success: true, message: i18n.t('login_successful'), user: { user_id: user.user_id, username: user.username, email: user.email } }); // Use i18n.t()
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: i18n.t('error_logging_in'), error: error.message }); // Use i18n.t()
    }
};

module.exports = { getUsers, getUsersByID, createUser, updateUser, deleteUser, loginUser };