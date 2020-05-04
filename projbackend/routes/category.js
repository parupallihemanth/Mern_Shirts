const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { categoryById, getCategory , getAllCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/category');
const { getUserById } = require('../controllers/user');

const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');

// params
router.param('userId', getUserById);
router.param('categoryId', categoryById);

// Actual routes
router.get('/category/:categoryId', getCategory);
router.get('/getAll',  getAllCategories);
// only authenticated person should create category
router.post('/category/create/:userId', [
    check("name", " category name required ").isLength({ min : 3})
], isSignin, isAuthenticated,  createCategory);

router.put('/category/:categoryId/:userId', isSignin, isAuthenticated, updateCategory);
router.delete('/category/:categoryId/:userId', isSignin, isAuthenticated,  deleteCategory);


module.exports = router;