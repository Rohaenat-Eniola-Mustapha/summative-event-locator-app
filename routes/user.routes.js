const express = require('express');
const { getUsers, getUsersByID, createUser, updateUser, deleteUser, loginUser } = require('../controllers/user.controllers');

//router object
const router = express.Router();

// routes

// GET ALL USERS
router.get('/getall', getUsers);

// GET USERS BY ID
router.get('/get/:id', getUsersByID);

// CREATE USER || POST
router.post('/create', createUser);

// UPDATE USER || PUT
router.put('/update/:id', updateUser);

// DELETE USER || DEL
router.delete('/delete/:id', deleteUser);

// LOGIN USER USING BCRYPT
router.post('/login/login', loginUser);

module.exports = router;