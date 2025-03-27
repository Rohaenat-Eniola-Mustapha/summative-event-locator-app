const express = require('express');
const { getAllUserFavorites, getUserFavoritesByUserId, addUserFavorite, removeUserFavorite } = require('../controllers/userFavorites.controller');

const router = express.Router();

router.get('/getall', getAllUserFavorites);
router.get('/user/:userId', getUserFavoritesByUserId);
router.post('/add', addUserFavorite);
router.delete('/remove', removeUserFavorite);

module.exports = router;