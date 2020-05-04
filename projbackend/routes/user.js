const express = require('express');
const router = express.Router();
const { getUserById, getUser, getAllUsers, updateUser, userPurchaseList } = require('../controllers/user');
const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');

router.param('userId', getUserById);
router.get('/user/:userId', isSignin, isAuthenticated, getUser);
router.put('/user/:userId', isSignin, isAuthenticated, updateUser);
router.get('/user/:userId', isSignin, isAuthenticated, userPurchaseList);
router.get('/users', getAllUsers)


module.exports = router