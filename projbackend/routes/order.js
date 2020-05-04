const express = require('express');
const router = express.Router();

const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { updateStock } = require('../controllers/product')

const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require('../controllers/order')


// params
router.param('UserId', getUserById);
router.param('orderId', getOrderById)

// Actual routes
// create orders
router.post('/order/create/:userId', isSignin, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);
// Get all orders
router.get('/order/all/:userId', isSignin, isAuthenticated, isAdmin, getAllOrders)

// Get order status

router.get('/order/staus/:userId', isSignin, isAuthenticated, isAdmin, getOrderStatus)

// update order status
router.put('/order/:orderId/status/:userId', isSignin, isAuthenticated, isAdmin, updateStatus)

module.exports = router