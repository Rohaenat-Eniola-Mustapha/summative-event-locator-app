const express = require('express');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/eventCategory.controllers');

const router = express.Router();

router.get('/getall', getAllCategories);
router.get('/get/:id', getCategoryById);
router.post('/create', createCategory);
router.put('/update/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;