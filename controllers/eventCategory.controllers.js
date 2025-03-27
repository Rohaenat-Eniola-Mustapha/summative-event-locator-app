const db = require('../config/database');

// GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM event_categories');
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'No categories found' });
        }
        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching categories', error: error.message });
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await db.query('SELECT * FROM event_categories WHERE category_id = ?', [id]);
        if (!data || data.length === 0) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching category', error: error.message });
    }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { category_name, description } = req.body;
        if (!category_name) {
            return res.status(400).send({ success: false, message: 'Category name is required' });
        }

        const [result] = await db.query('INSERT INTO event_categories (category_name, description) VALUES (?, ?)', [category_name, description]);

        res.status(201).send({ success: true, message: 'Category created', categoryId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error creating category', error: error.message });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, description } = req.body;
        if (!category_name) {
            return res.status(400).send({ success: false, message: 'Category name is required' });
        }

        const [result] = await db.query('UPDATE event_categories SET category_name = ?, description = ? WHERE category_id = ?', [category_name, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        res.status(200).send({ success: true, message: 'Category updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error updating category', error: error.message });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM event_categories WHERE category_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
        res.status(200).send({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error deleting category', error: error.message });
    }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };