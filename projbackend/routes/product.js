const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getProductById, getProduct, getAllProducts, photo,createProduct, deleteAProduct, updateProduct, getAllUniqueCategories} = require('../controllers/product');

router.param('userId', getUserById);
router.param('productId', getProductById);

// get route
router.get('/product/:productId', getProduct);
router.get("/product/photo/:productId", photo);
router.get('/getProducts', getAllProducts);

// Create route
router.post('/product/create/:userId', createProduct)

// delete route
router.delete('/product/:productId/:userId', isSignin, isAuthenticated, isAdmin ,deleteAProduct);

// Update route
router.put('/product/:productId/:userId', isSignin, isAuthenticated, isAdmin, updateProduct)

router.get('/products/categories', getAllUniqueCategories)



module.exports = router;